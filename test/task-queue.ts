import "mocha"
import {expect} from "chai"

import {TaskQueue} from "../src/task-queue";
import {ITask} from "../src/interfaces/task";

const NUM_TEST_ELEMENTS = 100;

describe('TaskQueue', () => {
    let i : number,
        taskQueue : TaskQueue,
        tasks : ITask[];

    describe('Run tasks', () => {

        beforeEach(() => {
            i = 0;

            taskQueue = new TaskQueue({
                autoRun: false
            });

            tasks = Array.apply(null, new Array(NUM_TEST_ELEMENTS)).map(() => ({
                run: () => {
                    i++;
                }
            }));
        });

        it('should execute all tasks', done => {
            taskQueue.on('stop', data => {

                // Check if all tasks are run and that the task queue was not stopped
                if (!data.wasStopped && i == NUM_TEST_ELEMENTS) {
                    done();
                }
            });

            taskQueue.append(tasks);
            taskQueue.start();
        });

        it('should not block other code', () => {
            let stop : number = Date.now() + 25;

            taskQueue.append(tasks);
            taskQueue.start();
            while (Date.now() < stop) {}
            expect(i).to.equal(0);
        });
    });

    describe('Autorun', () => {

        beforeEach(() => {
            i = 0;

            taskQueue = new TaskQueue({
                autoRun: true
            });

            tasks = Array.apply(null, new Array(NUM_TEST_ELEMENTS)).map(() => ({
                run: () => {
                    i++;
                }
            }));
        });

        it('should start automatically', done => {
            taskQueue.on('stop', data => {

                // Check if all tasks are run and that the task queue was not stopped
                if (!data.wasStopped && i == NUM_TEST_ELEMENTS) {
                    done();
                }
            });

            taskQueue.append(tasks);
        });

        it('should not block other code', () => {
            let stop : number = Date.now() + 25;

            taskQueue.append(tasks);
            while (Date.now() < stop) {}
            expect(i).to.equal(0);
        });
    });

    describe('Stop', () => {
        beforeEach(() => {
            i = 0;

            tasks = Array.apply(null, new Array(NUM_TEST_ELEMENTS)).map(() => ({
                run: () => {
                    i++;
                }
            }));
        });

        it('should be possible to stop the execution', done => {

            taskQueue = new TaskQueue({
                autoRun: false
            });

            taskQueue.on('stop', data => {
                if (data.wasStopped) {
                    done();
                }
            });
            taskQueue.append(tasks);
            taskQueue.start();
            taskQueue.stop();
        });

        it('should not be possible to stop execution when stoppable is false', done => {
            taskQueue = new TaskQueue({
                autoRun: false,
                stoppable: false
            });

            taskQueue.on('stop', data => {
                if (!data.wasStopped) {
                    done();
                }
            });
            taskQueue.append(tasks);
            taskQueue.start();
            taskQueue.stop();
        });
    });
});