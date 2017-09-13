import {ITask} from "./task";

export interface ITaskQueue {
    append(task : (ITask | ITask[])) : void;
    start() : void;
    stop() : void;
}