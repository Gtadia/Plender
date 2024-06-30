import { batch, Observable, observable, observe } from '@legendapp/state';
import { tasks } from '../types';
import { useSharedValue } from 'react-native-reanimated';

interface tasksState {
    upcoming: {title: string, data: tasks[]},
    current: {title: string, data: tasks[]},
    today: {title: string, data: tasks[]},
    completed: {title: string, data: tasks[]},
    overdue: {title: string, data: tasks[]},
}

interface radialProgressState {
    current: Observable<{title: string, data: tasks[]}>,
    todo: number,
    daily: number,
    now: number,
    sumTasks: any
}


export const tasksState$ = observable<tasksState>({
    upcoming: {title: 'Upcoming', data: []},
    current: {title: 'Current', data: []}, // only exists in MMKV and google sheets
    today: {
        title: "Today",
        data:[
            {label: 'test', created_at: new Date(), due: new Date(), time_goal: 2 * 3600, time_remaining: 1800, description: 'nothing', num_breaks: 5, is_daily: true},
            {label: 'test2', created_at: new Date(), due: new Date(), time_goal: 2 * 3600, time_remaining: 1800, description: 'nothing2', num_breaks: 5, is_daily: true},
            {label: 'test3', created_at: new Date(), due: new Date(), time_goal: 2 * 3600, time_remaining: 1800, description: 'nothing3', num_breaks: 5, is_daily: false},
        ]
    },
    completed: {title: "Completed", data: []},
    overdue: {title: "Overdue", data: []},
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
                // if(radialProgressState$.current.get()) {
                //     if(radialProgressState$.current.get()?.is_daily) {
                //         radialProgressState$.daily.set((prev) => prev + radialProgressState$.current.get().time_remaining)
                //     } else {
                //         radialProgressState$.todo.set((prev) => prev + radialProgressState$.current.get().time_remaining)
                //     }
                // }

                for(const task of tasksState$.today.get().data) {
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

export const fontState$ = observable<any>({
})

export const settingsState$ = observable<any>({
    // orderList: [tasksState$.current.get(), tasksState$.today.get(), tasksState$.upcoming.get(), tasksState$.overdue.get()],
    orderList: [tasksState$.current, tasksState$.today, tasksState$.upcoming, tasksState$.overdue],
    // orderList: [{title: 'today', data: tasksState$.today.get()}],
})