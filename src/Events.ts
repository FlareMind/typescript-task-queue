import {IObservableEvent} from "typescript-observable";

let StartEvent : IObservableEvent = {
        parent: null,
        name: 'start'
    },

    StopEvent : IObservableEvent = {
        parent: null,
        name: 'stop'
    };


export {StartEvent, StopEvent};