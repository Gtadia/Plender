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

export const taskTags$ = observable<taskTags>()

// For the create page
export const openAddMenu$ = observable(false)