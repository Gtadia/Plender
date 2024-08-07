import { observable, Observable } from "@legendapp/state";
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
export const currentTask$ = observable<tasks>({
  title: "Test",
  tags: null,
  category: subsections$.category[0],
  due: new Date(),
  created: new Date(),
  time_goal: 23,
  time_spent: 1,
  repeated: null
})


export const todayTasks$ = observable({
  title: 'Today',
  data: [
    {
      title: "Test",
      tags: null,
      category: subsections$.category[0],
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
      category: subsections$.category[0],
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
  selected: [],

  clear: () => {
    taskTags$.selected.set([])
  },
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
  selected: () => taskCategory$.list[0].get(),
  clear: () => {
    taskCategory$.selected.set(taskCategory$.list[0].get())
  },
  addToList: (categoryItem: { label: string, value: number, color: string }) => {
    taskCategory$.list.push(categoryItem)
  }
})