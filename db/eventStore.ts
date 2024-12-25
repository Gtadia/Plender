import { observable } from "@legendapp/state";
import { Task } from "./interface";
import * as SQLite from 'expo-sqlite'
import { SQLiteDatabase } from 'expo-sqlite'

const loadDatabase = async () => {
  console.log("init DB");

  try {
    const db = await SQLite.openDatabaseAsync("events");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        progress INTEGER,   -- Percentage (0-100)
        status TEXT         -- Current status (e.g., 'started', 'paused', etc.)
      )
    `);
    return db;
  } catch (e) {
    console.error("error!: ", e);
  }

  return null;
};

const checkIfTableExists = async ( db:SQLiteDatabase ) => {
  console.log("checking existance");

  const tableInfo = await db.getAllAsync(
    "SELECT name FROM sqlite_master WHERE type='table"
  )
}
