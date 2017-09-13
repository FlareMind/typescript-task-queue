export interface ITaskQueue {
    enqueue(task : (Function | Function[])) : void;
    start() : void;
    stop() : void;
}