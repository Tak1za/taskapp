package db

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/mattn/go-sqlite3" //go-sqlite3 integration
	uuid "github.com/nu7hatch/gouuid"
	"github.com/wailsapp/wails"
)

// Conn holds the database connection
type Conn struct {
	DB *sql.DB
}

// AllResults hold all results from database
type AllResults struct {
	Data []Result `json:"data"`
}

// Result holds one result from database
type Result struct {
	ID   string     `json:"id"`
	Task string     `json:"task"`
	Date *time.Time `json:"date"`
}

// WailsInit creates the required tables if they don't already exist on startup of application
func (c *Conn) WailsInit(_ *wails.Runtime) error {
	database, err := sql.Open("sqlite3", "./taskapp.db")
	if err != nil {
		log.Printf("error creating db: %s", err.Error())
		return err
	}

	statement, _ := database.Prepare("CREATE TABLE IF NOT EXISTS todo (id STRING PRIMARY KEY, task TEXT, time DATETIME)")
	if _, err = statement.Exec(); err != nil {
		log.Printf("error creating todo table: %s", err.Error())
		return err
	}

	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS doing (id STRING PRIMARY KEY, task TEXT, time DATETIME)")
	if _, err = statement.Exec(); err != nil {
		log.Printf("error creating doing table: %s", err.Error())
		return err
	}

	statement, _ = database.Prepare("CREATE TABLE IF NOT EXISTS done (id STRING PRIMARY KEY, task TEXT, time DATETIME)")
	if _, err = statement.Exec(); err != nil {
		log.Printf("error creating done table: %s", err.Error())
		return err
	}

	c.DB = database
	return nil
}

// GetAllResults gets all results from the table specified
func (c *Conn) GetAllResults(tableName string) (*AllResults, error) {
	query := fmt.Sprintf("SELECT * from %s", tableName)
	rows, err := c.DB.Query(query)
	if err != nil {
		log.Printf("error getting data from table: %s. error: %s", tableName, err.Error())
		return nil, err
	}
	defer rows.Close()
	var results []Result

	for rows.Next() {
		var (
			task string
			date *time.Time
			id   string
		)
		var res Result
		if err := rows.Scan(&id, &task, &date); err != nil {
			log.Fatalln(err)
		}
		res.Task = task
		res.Date = date
		res.ID = id
		log.Println(res.Task)
		log.Println(res.Date)
		log.Println(res.ID)

		results = append(results, res)
	}
	if err := rows.Err(); err != nil {
		log.Println(err)
		return nil, err
	}

	return &AllResults{
		Data: results,
	}, nil
}

// AddToDB adds a 'task' to a 'tableName'
func (c *Conn) AddToDB(tableName string, task string) (*Result, error) {
	uid, _ := uuid.NewV4()
	addTime := time.Now()
	addDataQuery := fmt.Sprintf("INSERT into %s (id, task, time) VALUES (?, ?, ?)", tableName)
	statement, _ := c.DB.Prepare(addDataQuery)
	if _, err := statement.Exec(uid.String(), task, addTime); err != nil {
		log.Printf("error inserting data to table: %s", err.Error())
		return nil, err
	}
	return &Result{
		ID:   uid.String(),
		Task: task,
		Date: &addTime,
	}, nil
}

// MoveToDB moves task from 'fromTable' to 'toTable' given a 'taskId'
func (c *Conn) MoveToDB(fromTable string, toTable string, taskID string) error {
	var task string
	getQuery := fmt.Sprintf(`SELECT task from %s WHERE id = "%s"`, fromTable, taskID)
	data, err := c.DB.Query(getQuery)
	if err != nil {
		log.Printf("error getting data for: %s, from table: %s. error: %s", taskID, fromTable, err)
		return err
	}
	for data.Next() {
		if err := data.Scan(&task); err != nil {
			log.Println(err)
			return err
		}
	}

	if err := c.RemoveFromDB(fromTable, taskID); err != nil {
		log.Printf("error removing: %s, from table: %s. error: %s", taskID, fromTable, err)
		return err
	}

	if _, err := c.AddToDBWithID(toTable, taskID, task); err != nil {
		log.Printf("error adding data: %s, to table: %s. error: %s", task, toTable, err)
		return err
	}

	return nil
}

// AddToDBWithID adds a 'task' to 'tableName' with a 'taskId'
func (c *Conn) AddToDBWithID(tableName string, taskID string, task string) (*Result, error) {
	addTime := time.Now()
	addDataQuery := fmt.Sprintf(`INSERT into %s (id, task, time) VALUES (?, ?, ?)`, tableName)
	statement, _ := c.DB.Prepare(addDataQuery)
	if _, err := statement.Exec(taskID, task, addTime); err != nil {
		log.Printf("error inserting data to table: %s", err.Error())
		return nil, err
	}
	return &Result{
		ID:   taskID,
		Task: task,
		Date: &addTime,
	}, nil
}

// RemoveFromDB removes a task corresponding to 'taskId' from 'tableName'
func (c *Conn) RemoveFromDB(tableName string, taskID string) error {
	removeQuery := fmt.Sprintf(`DELETE FROM %s WHERE id = "%s"`, tableName, taskID)
	statement, _ := c.DB.Prepare(removeQuery)
	if _, err := statement.Exec(); err != nil {
		log.Printf("error removing data: %s, from table: %s. error: %s", taskID, tableName, err.Error())
		return err
	}
	return nil
}
