import { observable } from "@legendapp/state";
import dayjs from "dayjs";

export const toggle$ = observable({
  closeSheet: false,
  tagModal: false,
  categoryModal: false,
  dateModal: false,
  timeModal: false,
})

export const newEvent$ = observable({
  label: "",
  description: "",
  tags: [], // {label: string, color: string, id: number} // todo — or can I do number[]
  category: 1,
  due_date: dayjs(),
  goal_time: 0,
});

