import { SQLiteDatabase } from "expo-sqlite";
import { Category, dateRange, dateRangeString, Event, Event_Tag, FilterEvent, Tag, UpdateEvent, UpdateTag } from "./interface";
import { Dayjs } from "dayjs";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let result = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version');
  let currentDbVersion = result?.user_version??0;
  currentDbVersion = 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    console.log("current DB version: " + currentDbVersion);
    // const result = await db.execAsync(`
    //   PRAGMA journal_mode = 'wal';https://www.youtube.com/watch?v=bY7Tkh9Vz8I

    //   DROP TABLE IF EXISTS event;
    //   DROP TABLE IF EXISTS tag;
    //   DROP TABLE IF EXISTS category;
    //   DROP TABLE IF EXISTS tagevent;
    //   DROP TABLE IF EXISTS event_tag;
    // `);
    return;
  }
  if (currentDbVersion === 0) {
    const result = await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      DROP TABLE IF EXISTS event;
      DROP TABLE IF EXISTS tag;
      DROP TABLE IF EXISTS category;
      DROP TABLE IF EXISTS tagevent;
      DROP TABLE IF EXISTS event_tag;

      CREATE TABLE event (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        description TEXT NULL,
        created_date DATE NOT NULL DEFAULT CURRENT_DATE,
        due_date DATE,
        goal_time INTEGER NOT NULL,   -- seconds
        progress_time INTEGER NOT NULL,   -- seconds
        categoryID INTEGER
      );

      CREATE TABLE tag (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        color TEXT       -- (#hexRGB code)
      );

      CREATE TABLE category (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        color TEXT       -- (#hexRGB code)
      );

      CREATE TABLE event_tag (
        eventID INTEGER NOT NULL,
        tagID INTEGER NOT NULL,
        PRIMARY KEY (eventID, tagID),
        FOREIGN KEY (eventID) REFERENCES employees(eventID)
          ON DELETE CASCADE,
        FOREIGN KEY (tagID) REFERENCES tasks(tagID)
          ON DELETE CASCADE
      );
    `);
    console.log("created tables:", result);

    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION }`);
}

/**
 * Formatting ISO date string to a format that SQLite can understand
 * @param date
 * @returns 
 */
const formatDateForSQLite = (date?: Dayjs) => {
  if (date) {
    return date.format('MM-DD-YYYY h:mm:ss');
  }
  return null;
};

/**
 * Formatting dateRange object to be one that can be searched in SQLite
 * @param dates
 * @returns 
 */
const formatDateForSQLiteSearching = (dates: dateRangeString) => {
  const result = {start: dates.start, end: dates.end || ''};

  if (!dates.end) {
    result.end = dates.start;
  }

  if (result.start.split(' ').length !== 2) {
    result.start += ' 00:00:00';
  }
  if (result.end.split(' ').length !== 2) {
    result.end += ' 23:59:59';
  }

  return result;
}


export const addEvent = async (db: SQLiteDatabase, event:Event) => {
  const { label, description, due_date, goal_time, tagIDs, categoryID } = event;
  try {
    const result = await db.runAsync(`
      INSERT INTO event (label, description, due_date, goal_time, progress_time, categoryID)
        VALUES (?, ?, ?, ?, ?, ?);
      `,
      [
        label,
        description || '',
        // created_date ==> automatically inserted
        formatDateForSQLite(due_date) || null,
        // repeated_date ? JSON.stringify(repeated_date) : null,
        goal_time,
        0,  // progress_time ==> set to 0
        categoryID || null
      ]
    );

    // Get the last inserted row ID
    const eventIDResult = await db.runAsync(`SELECT last_insert_rowid() as id`);
    const eventID = eventIDResult[0]?.id;

    // Add tags to the event
    if (eventID && tagIDs && tagIDs.length > 0) {
      await addTagToEvent(db, eventID, tagIDs);
    }
  } catch (error) {
    console.error("error with addEvent:", error);
  }
};

export const deleteEvent = async (db: SQLiteDatabase, eventID: number) => {
  try {
    await db.runAsync(`DELETE FROM event WHERE id = ?`, eventID);
  } catch (error) {
    console.error("error with deleteEvent", error)
  }

  // todo — NOT NECESSARY but you can come back to this later
  // if (result.rowsAffected === 0) {
  //   console.log(`No event found with ID ${eventID}`);
  // }
};

export const updateEvent = async (db: SQLiteDatabase, eventID: number, updates: Partial<UpdateEvent>) => {
  const {
    label,
    description,
    due_date,
    goal_time,
    progress_time,
    tagIDs,
    categoryID,
  } = updates;

  const result = await db.runAsync(
    `
      UPDATE event
      SET
        label = COALESCE(?, label),
        description = COALESCE(?, description),
        due_date = COALESCE(?, due_date),
        goal_time = COALESCE(?, goal_time),
        progress_time = COALESCE(?, progress_time),
        categoryID = COALESCE(?, categoryID)
      WHERE id = ?
    `,
    [
      label || null,
      description || null,
      formatDateForSQLite(due_date),
      // repeated_date ? JSON.stringify(repeated_date) : null,
      goal_time || null,
      progress_time || null,
      categoryID || null,
      eventID,
    ]
  )

  addTagToEvent(db, eventID, tagIDs);
}

export const startEvent = async (db: SQLiteDatabase, eventID: number) => {
  // todo — implement this later
}

export const getEvent = async (db: SQLiteDatabase, filter: Partial<FilterEvent> = {}) => {
  const {
    event_id,
    label,
    due_or_repeated_dates,
    created_dates,
    tagIDs,
    categoryIDs
  } = filter;
  let query = `SELECT * FROM event`;
  const params: any[] = [];
  const conditions: string[] = [];

  if (event_id) {
    conditions.push('id = ?');
    params.push(event_id)
  }
  if (label) {
    conditions.push('label LIKE ?');
    params.push(`%${label}%`);  // Use wildcards for partial matches
  }
  if (due_or_repeated_dates) {
    const {
      start,
      end
    } = formatDateForSQLiteSearching(due_or_repeated_dates);

    conditions.push('due_date BETWEEN ? AND ?');
    params.push(start, end);
    // todo — implement case for repeated dates (repeats)
    // do a separate search that finds tasks that...
    // 1. has a repeated !== null
    // 2. created before start date
    // 3. just look it up honestly
  }
  if (created_dates) {
    conditions.push('created_date BETWEEN ? AND ?');
    params.push(created_dates.start, created_dates.end);
  }
  if (categoryIDs) {
    const placeholders = categoryIDs.map(() => '?').join(', ');
    conditions.push(`categoryID IN (${placeholders})`);
    params.push(...categoryIDs);
  }
  if (tagIDs && tagIDs.length > 0) {
    const placeholders = tagIDs.map(() => '?').join(', ');
    conditions.push(`et.tagID IN (${placeholders})`);
    params.push(...tagIDs);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  console.warn(query, params);
  try {
    return (await db.getAllAsync<Event>(query, params));
  } catch (error) {
    console.error("error with getEvent:", error);
  }
}

export const getEventWithPagination = async (db: SQLiteDatabase, filter: FilterEvent) => {
  // todo — for search feature IN FUTURE UPDATE
}

const addTagToEvent = async (db: SQLiteDatabase, eventID: number, tagIDs?: number[]) => {
  if (tagIDs == null || tagIDs.length == 0) {
    console.log("no tags exists");
    return;
  }

  for (const tagID of tagIDs) {
    try {
      await db.runAsync(`INSERT OR IGNORE INTO event_tag (eventID, tagID) VALUES (?, ?)`, [eventID, tagID]);
    } catch (error) {
      console.log("error with junction table:", error);
      throw error;
    }
  }

  console.log(`Tags [${tagIDs}] added to event with ID ${eventID}.`);
};

/**
 * Adds a new tag to the `tag` table
 * @param db
 * @param tag 
 */
export const addTag = async (db: SQLiteDatabase, tag: Tag) => {
  const { label, color } = tag;

  // Check for duplicates
  const existing = await db.getAllAsync<Event>(`SELECT * FROM tag WHERE label = ?`, label);
  if (existing.length > 0) {
    console.log(`DATABASE: Tag with label "${label}" already exists.`);
    // todo — implement other functionality
    return -1;    // return -1 to indicate error
  }

  try {
    // Insert the tag into the database
    await db.runAsync(`
      INSERT INTO tag (label, color)
        VALUES (?, ?);
      `,
      [
        label,
        color
      ]
    );

    // Retrieve the ID of the inserted tag
    const result: Tag[] = await db.getAllAsync(`SELECT last_insert_rowid() as id`);
    const tagID = result[0]?.id;

    console.log(`DATABASE: Tag added with ID: ${tagID}`);
    return tagID; // Return the ID for further use
  } catch (error) {
    console.error("DATABASE: error with addTag:", error);
  }
}
export const deleteTag = async (db: SQLiteDatabase, tagID: number) => {
  try {
    await db.runAsync(`DELETE FROM tag WHERE id = ?`, tagID);
  } catch (error) {
    console.error("DATABASE: error with deleteTag:", error)
  }
}
export const updateTag = async (db: SQLiteDatabase, tagID: number, updates: UpdateTag) => {
  const {
    label,
    color
  } = updates;

  try {
    await db.runAsync(
      `
        UPDATE tag
        SET
          label = COALESCE(?, label),
          color = COALESCE(?, color)
        WHERE id = ?
      `,
      [
        label || null,
        color || null,
        tagID
      ]
    )
  } catch (error) {
    console.error("error with updateTag:", error)
  }
}
export const getTag = async (db: SQLiteDatabase, filter: Partial<{tagID: number, label: string}> = {}) => {
  const {
    tagID,
    label
  } = filter;
  let query = `SELECT * FROM tag`;
  const params: any[] = [];
  const conditions: string[] = [];

  if (tagID) {
    conditions.push('id = ?')
    params.push(tagID)
  }
  if (label) {
    conditions.push('label LIKE ?')
    params.push(`%${label}%`);  // Use wildcards for partial matches
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  try {
    return (await db.getAllAsync<Tag>(query, params));
  } catch (error) {
    console.error("error with getTags:", error);
  }
}

export const addCategory = async (db: SQLiteDatabase, category: Category) => {
  const { label, color } = category;

  // Check for duplicates
  const existing = await db.getAllAsync<Event>(`SELECT * FROM category WHERE label = ?`, label);
  if (existing.length > 0) {
    console.log(`DATABASE: Category with label "${label}" already exists.`);
    // todo — implement other functionality
    return -1;    // return -1 to indicate error
  }

  try {
    // Insert the cateogry into the database
    await db.runAsync(`
      INSERT INTO category (label, color)
        VALUES (?, ?);
      `,
      [
        label,
        color
      ]
    );

    // Retrieve the ID of the inserted category
    const result: Tag[] = await db.getAllAsync(`SELECT last_insert_rowid() as id`);
    const id = result[0]?.id;

    console.log(`DATABASE: Category added with ID: ${id}`);
    return id;
  } catch (error) {
    console.error("DATABASE: error with addCategory:", error);
  }
}
export const deleteCategory = async (db: SQLiteDatabase, categoryID: number) => {
  try {
    await db.runAsync(`DELETE FROM category WHERE id = ?`, categoryID);
  } catch (error) {
    console.error("error with deleteCategory:", error)
  }
}
export const updateCategory = async (db: SQLiteDatabase, categoryID: number, updates: UpdateTag) => {
  const {
    label,
    color
  } = updates;

  try {
    await db.runAsync(
      `
        UPDATE category
        SET
          label = COALESCE(?, label),
          color = COALESCE(?, color)
        WHERE id = ?
      `,
      [
        label || null,
        color || null,
        categoryID
      ]
    )
  } catch (error) {
    console.error("error with updateCategory:", error);
  }
}
export const getCategory = async (db: SQLiteDatabase, filter: {categoryID?: number, label?: string} = {}) => {
  const {
    categoryID,
    label
  } = filter;
  let query = `SELECT * FROM category`;
  const params: any[] = [];
  const conditions: string[] = [];

  if (categoryID) {
    conditions.push('id = ?')
    params.push(categoryID)
  }
  if (label) {
    conditions.push('label LIKE ?')
    params.push(`%${label}%`);  // Use wildcards for partial matches
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  try {
    return (await db.getAllAsync<Tag>(query, params));
  } catch (error) {
    console.error("error with getCategory:", error);
  }
}

export const getEventTag = async (db: SQLiteDatabase, filter: Partial<Event_Tag>) => {
  const {
    tagID,
    eventID
  } = filter;
  let query = `SELECT * FROM category`;
  const params: any[] = [];
  const conditions: string[] = [];

  if (tagID) {
    conditions.push('id = ?')
    params.push(tagID)
  }
  if (eventID) {
    conditions.push('id = ?')
    params.push(eventID)
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  try {
    return (await db.getAllAsync<Tag>(query, params));
  } catch (error) {
    console.error("error with getCategory:", error);
  }
}