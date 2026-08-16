package main

import (
	"context"
	"fmt"
	"log"
	"ozikcarbon-backend/prisma/db"
)

func main() {
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		log.Fatalf("Prisma DB Connection failed: %v", err)
	}
	defer client.Prisma.Disconnect()

	users, err := client.User.FindMany().Exec(context.Background())
	if err != nil {
		fmt.Printf("ERROR: %v\n", err)
	} else {
		fmt.Printf("SUCCESS: fetched %d users\n", len(users))
	}
}
