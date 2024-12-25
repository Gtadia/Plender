import { SQLiteDatabase } from "expo-sqlite";
import { Category, dateRange, Event, FilterEvent, Tag, UpdateEvent, UpdateTag } from "./interface";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let result = await db.getFirstAsync<{user_version: number}>('PRAGMA user_version');
  let currentDbVersion = result?.user_version??0;
  currentDbVersion = 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    console.log("current DB version: " + currentDbVersion);
    // const result = await db.execAsync(`
    //   PRAGMA journal_mode = 'wal';

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
        repeated_date TEXT NULL,
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
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

/**
 * Formatting ISO date string to a format that SQLite can understand
 * @param date
 * @returns 
 */
const formatDateForSQLite = (date?: Date) => {
  if (date) {
    return date.toISOString().replace('T', ' ').split('.')[0];
  }
  return;
};

/**
 * Formatting dateRange object to be one that can be searched in SQLite
 * @param dates
 * @returns 
 */
const formatDateForSQLiteSearching = (dates: dateRange) => {
  const result = {start: dates.start, end: ''};

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
  const { label, description, due_date, repeated_date, goal_time, tag_ids, category_id } = event;
  try {
    const result = await db.runAsync(`
      INSERT INTO event (label, description, due_date, repeated_date, goal_time, progress_time, categoryID)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [
        label,
        description || '',
        // created_date ==> automatically inserted
        formatDateForSQLite(due_date) || null,
        repeated_date ? JSON.stringify(repeated_date) : null,
        goal_time,
        0,  // progress_time ==> set to 0
        category_id || null
      ]
    );
    console.log("finished:", result.rows);
  } catch (error) {
    console.error("errorL", error);
  }

};

export const deleteEvent = async (db: SQLiteDatabase, eventID: number) => {
  const result = await db.runAsync(`DELETE FROM event WHERE id = ?`, eventID);

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
    repeated_date,
    goal_time,
    progress_time,
    tag_ids,
    category_id,
  } = updates;

  const result = await db.runAsync(
    `
      UPDATE event
      SET
        label = COALESCE(?, label),
        description = COALESCE(?, description),
        due_date = COALESCE(?, due_date),
        repeated_date = COALESCE(?, repeated_date),
        goal_time = COALESCE(?, goal_time),
        progress_time = COALESCE(?, progress_time),
        categoryID = COALESCE(?, categoryID)
      WHERE id = ?
    `,
    [
      label || null,
      description || null,
      due_date ? due_date.toISOString() : null,
      repeated_date ? JSON.stringify(repeated_date) : null,
      goal_time || null,
      progress_time || null,
      category_id || null,
      eventID,
    ]
  )

  addTagToEvent(db, eventID, tag_ids);
  console.log("Delete completed: " + result);
}

export const startEvent = async (db: SQLiteDatabase, eventID: number) => {
  // todo — implement this later
}

export const getEvent = async (db: SQLiteDatabase, filter: Partial<FilterEvent>) => {
  const {
    event_id,
    label,
    due_or_repeated_dates,
    created_dates,
    tag_ids,
    category_ids
  } = filter;

  let query = `SELECT * FROM event`;
  const params: any[] = [];

  console.warn(filter);

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


    // todo — implement case for repeated dates
  }
  if (created_dates) {
    conditions.push('created_date BETWEEN ? AND ?');
    params.push(created_dates.start, created_dates.end);
  }
  if (category_ids) {
    const placeholders = category_ids.map(() => '?').join(', ');
    conditions.push(`categoryID IN (${placeholders})`);
    params.push(...category_ids);
  }
  if (tag_ids && tag_ids.length > 0) {
    const placeholders = tag_ids.map(() => '?').join(', ');
    conditions.push(`et.tag_id IN (${placeholders})`);
    params.push(...tag_ids);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

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

export const addTag = async (db: SQLiteDatabase, tag: Tag) => {}
export const deleteTag = async (db: SQLiteDatabase, tagID: number) => {}
export const updateTag = async (db: SQLiteDatabase, tagID: number, updates: UpdateTag) => {}
export const getTag = async (db: SQLiteDatabase, filter: {tagID?: number, label?: string}) => {}
export const getTagWithID = async (db: SQLiteDatabase, tagID: number) => {
  // This is how we ourselves (internally in the code) we're going to find tags
}
export const getTagWithLabel = async (db: SQLiteDatabase, label: string) => {
  // This is how the user is mainly going to find tags
}

export const addCategory = async (db: SQLiteDatabase, category: Category) => {}
export const deleteCategory = async (db: SQLiteDatabase, categoryID: number) => {}
export const updateCategory = async (db: SQLiteDatabase, categoryID: number, updates: UpdateTag) => {}
export const getCategory = async (db: SQLiteDatabase, filter: {categoryID?: number, label?: string}) => {}
export const getCategoryWithID = async (db: SQLiteDatabase, categoryID: number) => {}
export const getCategoryWithLabel = async (db: SQLiteDatabase, label: string) => {}