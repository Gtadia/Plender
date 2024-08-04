import { observable, Observable } from "@legendapp/state";

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

// TODO - Just link the task from today/upcoming/overdue here
export const currentTask = observable<tasks>()

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
    },     {
      title: "Test",
      tags: null,
      category: null,
      due: new Date(),
      created: new Date(),
      time_goal: 23,
      time_spent: 1,
      repeated: null
    },     {
      title: "Test",
      tags: null,
      category: null,
      due: new Date(),
      created: new Date(),
      time_goal: 23,
      time_spent: 1,
      repeated: null
    },     {
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

export const taskTags$ = observable<taskTags>()

export const category$ = observable<category>({
  title: "Test",
  color: '#33ee33'
})