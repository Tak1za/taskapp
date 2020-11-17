package db

import (
	"database/sql"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	uuid "github.com/nu7hatch/gouuid"
	"github.com/wailsapp/wails"
	"log"
	"time"
)

type Conn struct {
	DB *sql.DB
}

type AllResults struct {
	Data []result `json:"data"`
}

type result struct {
	ID   string     `json:"id"`
	Task string     `json:"task"`
	Date *time.Time `json:"date"`
}

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

	task := "Fill timesheet"
	uid, _ := uuid.NewV4()
	addDataQuery := fmt.Sprintf(`INSERT into todo (id, task, time) VALUES ("%s", "%s", datetime('now'))`, uid.String(), task)
	statement, _ = database.Prepare(addDataQuery)
	if _, err = statement.Exec(); err != nil {
		log.Printf("error inserting data to table: %s", err.Error())
		return err
	}

	task = "Fill timesheet 2"
	uid, _ = uuid.NewV4()
	addDataQuery = fmt.Sprintf(`INSERT into todo (id, task, time) VALUES ("%s", "%s", datetime('now'))`, uid.String(), task)
	statement, _ = database.Prepare(addDataQuery)
	if _, err = statement.Exec(); err != nil {
		log.Printf("error inserting data to table: %s", err.Error())
		return err
	}

	c.DB = database
	return nil
}

func (c *Conn) GetAllResults(tableName string) (*AllResults, error) {
	query := fmt.Sprintf("SELECT * from %s", tableName)
	rows, err := c.DB.Query(query)
	if err != nil {
		log.Printf("error getting data from table: %s. error: %s", tableName, err.Error())
		return nil, err
	}
	defer rows.Close()
	var results []result

	for rows.Next() {
		var (
			task string
			date *time.Time
			id   string
		)
		var res result
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

func (c *Conn) AddToDB(tableName string, task string) error {
	uid, _ := uuid.NewV4()
	addDataQuery := fmt.Sprintf(`INSERT into %s (id, task, time) VALUES ("%s", "%s", datetime('now'))`, tableName, uid.String(), task)
	statement, _ := c.DB.Prepare(addDataQuery)
	if _, err := statement.Exec(); err != nil {
		log.Printf("error inserting data to table: %s", err.Error())
		return err
	}
	return nil
}

func (c *Conn) MoveToDB(fromTable string, toTable string, taskId string) error {
	var task string
	getQuery := fmt.Sprintf(`SELECT task from %s WHERE id = "%s"`, fromTable, taskId)
	data, err := c.DB.Query(getQuery)
	if err != nil {
		log.Printf("error getting data for: %s, from table: %s. error: %s", taskId, fromTable, err)
		return err
	}
	for data.Next() {
		if err := data.Scan(&task); err != nil {
			log.Println(err)
			return err
		}
	}

	if err := c.RemoveFromDB(fromTable, taskId); err != nil {
		log.Printf("error removing: %s, from table: %s. error: %s", taskId, fromTable, err)
		return err
	}

	if err := c.AddToDBWithId(toTable, taskId, task); err != nil {
		log.Printf("error adding data: %s, to table: %s. error: %s", task, toTable, err)
		return err
	}

	return nil
}

func (c *Conn) AddToDBWithId(tableName string, taskId string, task string) error {
	addDataQuery := fmt.Sprintf(`INSERT into %s (id, task, time) VALUES ("%s", "%s", datetime('now'))`, tableName, taskId, task)
	statement, _ := c.DB.Prepare(addDataQuery)
	if _, err := statement.Exec(); err != nil {
		log.Printf("error inserting data to table: %s", err.Error())
		return err
	}
	return nil
}

func (c *Conn) RemoveFromDB(tableName string, taskId string) error {
	removeQuery := fmt.Sprintf(`DELETE FROM %s WHERE id = "%s"`, tableName, taskId)
	statement, _ := c.DB.Prepare(removeQuery)
	if _, err := statement.Exec(); err != nil {
		log.Printf("error removing data: %s, from table: %s. error: %s", taskId, tableName, err.Error())
		return err
	}
	return nil
}
