import "core-js/es6/promise"
import "core-js/es6/object"

import {ITaskQueue} from "./interfaces/task-queue";
import {ITaskQueueConfig} from "./interfaces/task-queue-config";
import {Observable} from "typescript-observable";
import {StartEvent, StopEvent} from "./Events";

export class TaskQueue extends Observable implements ITaskQueue {
    private tasks : Function[] = [];
    private isRunning : boolean = false;
    private isStopped : boolean = false;
    private config : ITaskQueueConfig;

    /**
     *
     * @param {ITaskQueueConfig} config
     */
    constructor(config? : ITaskQueueConfig) {
        super();

        this.config = Object.assign({}, {
            autoRun: false,
            stoppable: true
        }, config);
    }

    /**
     * Add a new task to the end of the queue. A single element or a list can be added. If config.autoRun then this
     * function will start a the execution of the tasks.
     * @param {Function | Function[]} task is the task that will be added to the queue
     */
    enqueue(task: Function | Function[]): void {

        // Check if the task is an array of tasks
        if (Array.isArray(task)) {
            this.tasks.push.apply(this.tasks, task);
        }

        // If it is not an array
        else {
            this.tasks.push(task);
        }

        // Check if autoRun is true
        if (this.config.autorun) {
            this.start();
        }
    }

    /**
     * Start the execution of the tasks
     */
    start(): void {
        this.isStopped = false;
        if (!this.isRunning) {
            this.notify(StartEvent, {});
            this.execute();
        }
    }

    /**
     * Stop the execution of the tasks
     */
    stop(): void {
        if (this.config.stoppable) {
            this.isStopped = true;
        }
    }

    private execute() : void {

        // If there is more than one task in the queue and this is not stopped.
        if (!this.isStopped && this.tasks.length > 0) {

            // Set status to running
            this.isRunning = true;

            // Get the first task
            let task : Function = this.tasks.shift() || (() => {});

            // Run the task decoupled and start the next
            Promise.resolve().then(() => {
                task();
                this.execute();
            });

        }

        // If there is no more tasks or if this is no longer running
        else {

            // Set status to not running
            this.isRunning = false;
            this.notify(StopEvent, {
                wasStopped: this.isStopped
            });
        }
    }
}