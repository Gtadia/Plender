import { observable, Observable, observe } from "@legendapp/state";
import { syncObservable, configureObservableSync } from '@legendapp/state/sync'
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv'
import { useSharedValue } from "react-native-reanimated";
import dayjs from "dayjs";

interface taskTags {
  title: string,
  color: string,
}
interface category {
  title: string,
  color: string,
}
interface tasks {
  title: string,
  tags: Observable<taskTags> | null,  // taskTags$
  category: Observable<category> | null,  // TODO — Get rid of null here
  due: Date,
  created: Date,
  time_goal: number,
  time_spent: number,
  repeated: [number] | null    // list of weekdays repeated
}

export const dateToday$ = observable(dayjs());

// For the create page
export const openAddMenu$ = observable(false)


// Tags
export const taskTags$ = observable({
  list:[
    { label: 'Item 1', value: 1, color: 'red' },
    { label: 'Item 2', value: 2, color: 'orange' },
    { label: 'Item 3', value: 3, color: 'yellow'  },
    { label: 'Item 4', value: 4, color: 'green'  },
    { label: 'Item 5', value: 5, color: 'blue'  },
    { label: 'Item 6', value: 6, color: 'purple'  },
    { label: 'Item 7', value: 7, color: 'pink'  },
    { label: 'Item 8', value: 8, color: 'violet'  },
  ],
  list_keyExtractor: (item: any) => item.idObject._id,

  addToList: (tagItem: { label: string, value: number, color: string }) => {
    taskTags$.list.push(tagItem)
  }
})

// Category
export const taskCategory$ = observable({
  list: [
    { label: 'No Category', value: 1, color: 'gray' },
    { label: 'Item 2', value: 2, color: 'red' },
    { label: 'Item 3', value: 3, color: 'orange' },
    { label: 'Item 4', value: 4, color: 'yellow' },
    { label: 'Item 5', value: 5, color: 'green' },
    { label: 'Item 6', value: 6, color: 'blue' },
    { label: 'Item 7', value: 7, color: 'pink' },
    { label: 'Item 8', value: 8, color: 'purple' },
  ],
  list_keyExtractor: (item: any) => item.idObject._id,
  addToList: (categoryItem: { label: string, value: number, color: string }) => {
    taskCategory$.list.push(categoryItem)
  }
})

export const todayTasks$ = observable({
  title: 'Today',
  data: [
    {
      title: "Test",
      tags: null,
      category: taskCategory$.list[0].get(),
      due: dayjs(),
      created: dayjs(),
      time_goal: { hours: 0, minutes: 0, total: 0 },
      time_spent: { hours: 10, minutes: 2, seconds: 40, total: 0 },
      repeated: null
    },
    {
      title: "The Chosen One",
      tags: null,
      category: taskCategory$.list[0].get(),
      due: dayjs(),
      created: dayjs(),
      time_goal: { hours: 10, minutes: 0, seconds: 0, total: 0 },
      time_spent: { hours: 6, minutes: 2, seconds: 0, total: 0 },
      repeated: null
    }
  ]
})

export const upcomingTasks$ = observable({
  title: 'Upcoming',
  data: [
    {
      title: "Test",
      tags: null,
      category: taskCategory$.list[0].get(),
      due: dayjs().add(2, 'day'),
      created: dayjs(),
      time_goal: 23,
      time_spent: 1,
      repeated: null
    },
  ]
})

// configureObservableSync({
//   persist: {
//       plugin: ObservablePersistMMKV
//   }
// })

// // Persist the observable to the named key of the global persist plugin
// syncObservable(upcomingTasks$, {
//   persist: {
//       name: 'upcomingPersist',
//   }
// })

export const completedTasks$ = observable()

export const overdueTasks$ = observable({
  title: 'Overdue',
  data: [
    {
      title: "Test",
      tags: null,
      category: taskCategory$.list[0].get(),
      due: dayjs().subtract(3, 'day'),
      created: dayjs(),
      time_goal: 23,
      time_spent: 1,
      repeated: null
    },
    {
      title: "Winner Winner Chicken Dinner Bois",
      tags: null,
      category: taskCategory$.list[0].get(),
      due: dayjs().subtract(5, 'day'),
      created: dayjs(),
      time_goal: 23,
      time_spent: 1,
      repeated: null
    }
  ]
})

// TODO - Just link the task from today/upcoming/overdue here
export const currentTask$ = observable({
  task: todayTasks$.data[1].get()
})
// TODO — when editing a task, make sure that when the time changes, re-calculate the time object

observe(() => {
  // if (currentTask$.task.time_spent.second.get() == 0) {
  //   currentTask$.task.time_spent.minute.set((prev) => (prev - 1))
  // } else if (currentTask$.task.time_spent.second.get() < 0) {
  //   currentTask$.task.time_spent.second.set(59)
  // }

  // if (currentTask$.task.time_spent.minute.get() == 0) {
  //   currentTask$.time_spent.hour.set((prev) => (prev - 1))
  // } else if (currentTask$.time_spent.minute.get() < 0) {
  //   currentTask$.time_spent.minute.set(59)
  // }

  // if (currentTask$.time_spent.hour.get() < 0) {
  //   currentTask$.time_spent.hour.set(0)
  //   // TODO — Either (1) stop timer here, or (2) stop timer with total seconds
  // }
})

export const swipeableCalendar$ = observable({
  // todo — does everything in here update when one of them changes?
  weeks: null,
  activeDay: null,
  pages: [ '-1', '0', '1' ],
  key: 0,
  showingMonths: '',
  showingYears: '',
})