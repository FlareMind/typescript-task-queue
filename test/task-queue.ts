import "mocha"
import {expect} from "chai"

import {TaskQueue} from "../src/index";

const NUM_TEST_ELEMENTS = 100;

describe('TaskQueue', () => {
    let i : number,
        taskQueue : TaskQueue,
        tasks : Function[];

    describe('Run tasks', () => {

        beforeEach(() => {
            i = 0;

            taskQueue = new TaskQueue();

            tasks = Array.apply(null, new Array(NUM_TEST_ELEMENTS)).map(() => (() => {
                i++;
            }));
        });

        it('should execute all tasks', done => {
            taskQueue.on('stop', data => {

                // Check if all tasks are run and that the task queue was not stopped
                if (!data.wasStopped && i == NUM_TEST_ELEMENTS) {
                    done();
                }
            });

            taskQueue.enqueue(tasks);
            taskQueue.start();
        });

        it('should not block other code', () => {
            let stop : number = Date.now() + 25;

            taskQueue.enqueue(tasks);
            taskQueue.start();
            while (Date.now() < stop) {}
            expect(i).to.equal(0);
        });
    });

    describe('Autorun', () => {

        beforeEach(() => {
            i = 0;

            taskQueue = new TaskQueue({
                autorun: true
            });

            tasks = Array.apply(null, new Array(NUM_TEST_ELEMENTS)).map(() => (() => {
                i++;
            }));
        });

        it('should start automatically', done => {
            taskQueue.on('stop', data => {

                // Check if all tasks are run and that the task queue was not stopped
                if (!data.wasStopped && i == NUM_TEST_ELEMENTS) {
                    done();
                }
            });

            taskQueue.enqueue(tasks);
        });

        it('should not block other code', () => {
            let stop : number = Date.now() + 25;

            taskQueue.enqueue(tasks);
            while (Date.now() < stop) {}
            expect(i).to.equal(0);
        });
    });

    describe('Stop', () => {
        beforeEach(() => {
            i = 0;

            tasks = Array.apply(null, new Array(NUM_TEST_ELEMENTS)).map(() => (() => {
                i++;
            }));
        });

        it('should be possible to stop the execution', done => {

            taskQueue = new TaskQueue();

            taskQueue.on('stop', data => {
                if (data.wasStopped) {
                    done();
                }
            });
            taskQueue.enqueue(tasks);
            taskQueue.start();
            taskQueue.stop();
        });

        it('should not be possible to stop execution when stoppable is false', done => {
            taskQueue = new TaskQueue({
                stoppable: false
            });

            taskQueue.on('stop', data => {
                if (!data.wasStopped) {
                    done();
                }
            });
            taskQueue.enqueue(tasks);
            taskQueue.start();
            taskQueue.stop();
        });
    });
});