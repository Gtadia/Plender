// console.log("does this run too?")

import React, { Component, ReactNode } from 'react'
import { radialProgressState$ } from '../db/LegendApp';
import { View } from 'react-native';

interface TimerProps {
    // props
}
type TimerState = {
    timer: ReturnType<typeof setInterval>,
}

export default class Timer extends Component<TimerProps, TimerState> {

    // TODO — props: any (for now...)
    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
        this.getCurrentTime();
    }

    getCurrentTime = () => {
        const now = new Date();
        // const now = new Date(1719514598);
        const todayTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        radialProgressState$.now.set(todayTime);
        // radialProgressState$.todayDate.set(now.toLocaleDateString())    // Getting just the date to prevent continually updating the date...
        radialProgressState$.todayDate.set(new Date(now.getFullYear(), now.getMonth(), now.getDate()))    // Getting just the date to prevent continually updating the date...

        const currentTask = radialProgressState$.current.data
        if (currentTask.get().length > 0) {
            currentTask[0].time_remaining.set((prev) => prev - 1)
        }
        // console.log(radialProgressState$.now.get())
    }

    componentDidMount(): void {
        this.timer = setInterval(() => {
            this.getCurrentTime();
        }, 1000);
    }

    componentWillUnmount(): void {
        clearInterval(this.timer)
    }

    render(): ReactNode {
        null
    }
}
