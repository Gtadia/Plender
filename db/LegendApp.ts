import { batch, Observable, observable, observe } from '@legendapp/state';
import { tasks } from '../types';

interface tasksState {
    upcoming: tasks[],
    current: tasks | null,
    today: tasks[],
    completed: tasks[],
    overdue: tasks[]
}

interface radialProgressState {
    current: Observable<tasks | null>,
    todo: number,
    daily: number,
    now: number,
    sumTasks: any
}


export const tasksState$ = observable<tasksState>({
    upcoming: [],
    current: null, // only exists in MMKV and google sheets
    today: [
        {label: 'test', created_at: new Date(), due: new Date(), time_goal: 2 * 3600, time_remaining: 1800, description: 'nothing', num_breaks: 5, is_daily: true},
        {label: 'test2', created_at: new Date(), due: new Date(), time_goal: 2 * 3600, time_remaining: 1800, description: 'nothing2', num_breaks: 5, is_daily: true},
        {label: 'test3', created_at: new Date(), due: new Date(), time_goal: 2 * 3600, time_remaining: 1800, description: 'nothing3', num_breaks: 5, is_daily: false},
    ],
    completed: [],
    overdue: [],
    // additional: {},  // Maybe later in an update
})

export const radialProgressState$ = observable<radialProgressState>({
    current: tasksState$.current,
    now: 0,
    todo: 0,
    daily: 0,

    radialDaily: () => radialProgressState$.now.get() + radialProgressState$.daily.get(),
    radialTodo: () => radialProgressState$.radialDaily.get() + radialProgressState$.todo.get(),

    // TODO — try moving sumTasks to tasksState$
    sumTasks: () => {
        observe(() => {
            batch(() => {
                console.log('running')
                // if(radialProgressState$.current.get()) {
                //     if(radialProgressState$.current.get()?.is_daily) {
                //         radialProgressState$.daily.set((prev) => prev + radialProgressState$.current.get().time_remaining)
                //     } else {
                //         radialProgressState$.todo.set((prev) => prev + radialProgressState$.current.get().time_remaining)
                //     }
                // }

                console.log(tasksState$.today.get().lengthc)
                for(const task of tasksState$.today.get()) {
                    console.log("Calculating: ", task);
                    if(task.is_daily) {
                        radialProgressState$.daily.set((prev) => prev + task.time_remaining)
                    } else {
                        radialProgressState$.todo.set((prev) => prev + task.time_remaining)
                    }
                }
            })
        })
    }
})