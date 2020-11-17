package main

import (
  "github.com/leaanthony/mewn"
  "github.com/wailsapp/wails"
  "tasker/pkg/db"
)

func main() {

  js := mewn.String("./frontend/build/static/js/main.js")
  css := mewn.String("./frontend/build/static/css/main.css")

  dbConn := &db.Conn{}

  app := wails.CreateApp(&wails.AppConfig{
    Width:  1024,
    Height: 768,
    Title:  "taskapp",
    JS:     js,
    CSS:    css,
    Colour: "#131313",
    Resizable: true,
  })
  app.Bind(dbConn)
  app.Run()
}
