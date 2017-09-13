# typescript-task-queue
A small class used to run multiple async tasks after each other.

### Installation

With npm

```
npm install --save typescript-task-queue
```

### Simple usage

```typescript
import {TaskQueue} from 'typescript-task-queue'

let taskQueue = new TaskQueue();

// Add a function to the queue
taskQueue.enqueue(() => {
    // Some async code will run here
    // ...
});

// Start the queue
taskQueue.start();

// Stop the queue
taskQueue.stop();

// Callback on start
taskQueue.on('start', () => {
    // ...
});

// Callback on stop
taskQueue.on('stop', () => {
    // ...
});
```

## Docs

Below follows complete information about the classes.

### TaskQueue

Class that stores tasks and executes them.

* `TaskQueue(config? : ITaskQueueConfig)`
Constructor for `TaskQueue`.
* `enqueue(task : Function | Function[]) : void`
Adds `task` in the end of the queue.
* `start() : void`
Starts the execution of the tasks in the queue.
* `stop() : void`
Stops the execution.
* `on(eventType : ('start' | 'stop'), callback : Function) : {cancel : Function}`
Adds an listener to the event specified in `eventType`. When the event occurs `callback` will be called. The listener is removed if the returned `cancel` function is called.

### ITaskQueueConfig

Config object for the `TaskQueue`.

* `autorun? : boolean`
Tasks are run automatically if set to `true` (no need to run `start()`). Default is `false`.
* `stoppable? : boolean`
The `TaskQueue` can be stopped if set to `true`. Default is `true`.

## Contribute
Make sure to run the tests

```
npm test
```
