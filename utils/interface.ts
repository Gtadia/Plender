export interface Event {
  label: string,
  description: string,   // optional
  // created_date ==> use today's date
  due_date?: Date,
  repeated_date?: Repeated_Date,
  goal_time: number,
  // progress_time ==> Always set to 0
  tag_ids?: number[],       // link to tag object        `null` ==> no tag
  category_id?: number,  // link to category object       `null` ==> no category
}

interface Repeated_Date {
  mode: string,
  start: Date,
  stop?: Date,
  weekdays?: number[],
  custom_days?: Date[],
}

export interface UpdateEvent {  //todo — if the entire thing is null, just return immediately when `save` is pressed
  label: string,
  description: string,
  created_date: number,
  due_date: Date,
  repeated_date: Repeated_Date,
  goal_time: number,
  progress_time: number,
  tag_ids: number[],
  category_id: number,
}

export interface FilterEvent {
  event_id: number,
  label: string,
  due_date: {start: Date, end: Date},
  created_date: {start: Date, end: Date},
  tag_ids: number[],
  category_ids: number[]
}

export interface Tag {
  label: string,
  color: string,    // EX: "#F23A6B"
}

export interface UpdateTag {
  label?: string,
  color?: string,   // EX: "#F23A6B"
}

export interface Category {
  label: string,
  color: string,    // EX: "#F23A6B"
}

export interface UpdateCategory {
  label?: string,
  color?: string,   // EX: "#F23A6B"
}