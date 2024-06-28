export interface tasks {
    label: string,
    created_at: Date,
    due: Date,  // just the date, not the time (for now)
    time_goal: number, // in seconds
    time_remaining: number, // in seconds
    description: string,
    num_breaks: number,
    is_daily: boolean // checking if task is repeated
    // TODO — set days to repeat
}