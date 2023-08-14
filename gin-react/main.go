package main

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "userdata.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	router.RedirectTrailingSlash = true

	router.Use(static.Serve("/", static.LocalFile("./build", true)))

	router.GET("/tasks/:username", func(c *gin.Context) {
		getAllUserTasks(c, db)
	})

	router.POST("/create", func(c *gin.Context) {
		createTask(c, db)
	})

	router.POST("/status", func(c *gin.Context) {
		updateTaskStatus(c, db)
	})

	router.POST("/rename", func(c *gin.Context) {
		renameTask(c, db)
	})

	router.POST("/delete", func(c *gin.Context) {
		deleteTask(c, db)
	})

	router.Run(":5000")
}

func getAllUserTasks(c *gin.Context, db *sql.DB) {
	username := c.Param("username")
	rows, err := db.Query("SELECT * FROM Tasks WHERE Username = ?", username)
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	allTasks := make(map[string]gin.H)

	for rows.Next() {
		var username, uuid, taskName, taskStatus, date string
		var dateInt int
		if err := rows.Scan(&username, &uuid, &taskName, &taskStatus, &dateInt); err != nil {
			c.Status(http.StatusInternalServerError)
			return
		}

		date = strconv.Itoa(dateInt)

		allTasks[uuid] = gin.H{
			"taskName":   taskName,
			"taskStatus": taskStatus,
			"date":       date,
		}
	}

	c.JSON(http.StatusOK, allTasks)
}

type CreateTaskBody struct {
	Username string `json:"username" binding:"required"`
	TaskName string `json:"taskName" binding:"required"`
}

func createTask(c *gin.Context, db *sql.DB) {
	var body CreateTaskBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	uuid := uuid.New().String()

	_, err := db.Exec(
		"INSERT INTO tasks (username, uuid, taskname, taskstatus, date)"+
			"VALUES (?, ?, ?, ?, ?)",
		body.Username, uuid, body.TaskName, "in progress", time.Now().UnixMilli())
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.Params = append(c.Params, gin.Param{
		Key:   "username",
		Value: body.Username,
	})
	getAllUserTasks(c, db)
}

type UpdateTaskStatusBody struct {
	Action   string `json:"action" binding:"required"`
	Username string `json:"username" binding:"required"`
	Uuid     string `json:"uuid" binding:"required"`
}

func updateTaskStatus(c *gin.Context, db *sql.DB) {
	var body UpdateTaskStatusBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	newStatus := "complete"
	if body.Action == "reset" {
		newStatus = "in progress"
	}

	_, err := db.Exec(
		"UPDATE tasks SET taskstatus = ? WHERE username = ? AND uuid = ?",
		newStatus, body.Username, body.Uuid)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.Params = append(c.Params, gin.Param{
		Key:   "username",
		Value: body.Username,
	})
	getAllUserTasks(c, db)
}

type RenameTaskBody struct {
	Username string `json:"username" binding:"required"`
	Uuid     string `json:"uuid" binding:"required"`
	TaskName string `json:"taskName" binding:"required"`
}

func renameTask(c *gin.Context, db *sql.DB) {
	var body RenameTaskBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	_, err := db.Exec(
		"UPDATE Tasks SET TaskName = ? WHERE Username = ? AND Uuid = ?",
		body.TaskName, body.Username, body.Uuid)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.Params = append(c.Params, gin.Param{
		Key:   "username",
		Value: body.Username,
	})
	getAllUserTasks(c, db)
}

type DeleteTaskBody struct {
	Username string `json:"username" binding:"required"`
	Uuid     string `json:"uuid" binding:"required"`
}

func deleteTask(c *gin.Context, db *sql.DB) {
	var body DeleteTaskBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	_, err := db.Exec(
		"DELETE FROM tasks WHERE username = ? AND uuid = ?",
		body.Username, body.Uuid)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.Params = append(c.Params, gin.Param{
		Key:   "username",
		Value: body.Username,
	})
	getAllUserTasks(c, db)
}
