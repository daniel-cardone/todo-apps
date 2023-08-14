export interface ITasks {
    [key: string]: {
        taskName: string;
        taskStatus: "in progress" | "complete";
        date: string;
    }
}
