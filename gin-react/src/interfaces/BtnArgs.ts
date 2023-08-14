export interface IBasicBtnArgs {
    uuid: string;
}

export interface IStatusUpdateBtnArgs extends IBasicBtnArgs {
    action: "complete" | "reset";
    taskStatus: "in progress" | "complete";
}

export interface IEditBtnArgs extends IBasicBtnArgs {
    editing: Set<string>
}

export interface ITaskEditFieldArgs extends IBasicBtnArgs, IEditBtnArgs {
    originalTaskName: string;
}
