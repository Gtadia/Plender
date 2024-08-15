import { observable, Observable, observe } from "@legendapp/state";
import { syncObservable, configureObservableSync } from '@legendapp/state/sync'
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv'
import { useSharedValue } from "react-native-reanimated";

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

export const subsections$ = observable({
  category: [{
    title: "Test",
    color: '#33ee33'
  }],
  tag: [{
    title: "TagTest",
    color: '#123456'
  }]
})

// TODO - Just link the task from today/upcoming/overdue here
export const currentTask$ = observable({
  title: "Test",
  tags: null,
  category: null,
  due: new Date(),
  created: new Date(),
  time_goal: {hour: 2, minute: 0, second: 0, total: 7200},
  time_spent: {hour: 1, minute: 23, second: 45, total: 5025},
  repeated: null,


})
// TODO — when editing a task, make sure that when the time changes, re-calculate the time object

observe(() => {
  if (currentTask$.time_spent.second.get() == 0) {
    currentTask$.time_spent.minute.set((prev) => (prev - 1))
  } else if (currentTask$.time_spent.second.get() < 0) {
    currentTask$.time_spent.second.set(59)
  }

  if (currentTask$.time_spent.minute.get() == 0) {
    currentTask$.time_spent.hour.set((prev) => (prev - 1))
  } else if (currentTask$.time_spent.minute.get() < 0) {
    currentTask$.time_spent.minute.set(59)
  }

  if (currentTask$.time_spent.hour.get() < 0) {
    currentTask$.time_spent.hour.set(0)
    // TODO — Either (1) stop timer here, or (2) stop timer with total seconds
  }
})

export const todayTasks$ = observable({
  title: 'Today',
  data: [
    {
      title: "Test",
      tags: null,
      category: null,
      due: new Date(),
      created: new Date(),
      time_goal: 23,
      time_spent: 1,
      repeated: null
    },
    {
      title: "Test",
      tags: null,
      category: null,
      due: new Date(),
      created: new Date(),
      time_goal: 23,
      time_spent: 1,
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
      category: null,
      due: new Date(),
      created: new Date(),
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
      category: null,
      due: new Date(),
      created: new Date(),
      time_goal: 23,
      time_spent: 1,
      repeated: null
    }
  ]
})

// For the create page
export const openAddMenu$ = observable(false)


// Tags
export const taskTags$ = observable({
  list:[
    { label: 'Item 1', value: 1, color: 'red' },
    { label: 'Item 2', value: 2 },
    { label: 'Item 3', value: 3 },
    { label: 'Item 4', value: 4 },
    { label: 'Item 5', value: 5 },
    { label: 'Item 6', value: 6 },
    { label: 'Item 7', value: 7 },
    { label: 'Item 8', value: 8 },
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
    { label: 'Item 2', value: 2 },
    { label: 'Item 3', value: 3 },
    { label: 'Item 4', value: 4 },
    { label: 'Item 5', value: 5 },
    { label: 'Item 6', value: 6 },
    { label: 'Item 7', value: 7 },
    { label: 'Item 8', value: 8 },
  ],
  list_keyExtractor: (item: any) => item.idObject._id,
  addToList: (categoryItem: { label: string, value: number, color: string }) => {
    taskCategory$.list.push(categoryItem)
  }
})

