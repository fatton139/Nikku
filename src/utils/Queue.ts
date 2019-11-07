/**
 * Makeshift queue, mainly used to type guard against empty queues.
 */
export interface Queue<T> extends Array<T> {
    shift: () => T;
}

export namespace Queue {
    export const isEmpty = <T>(queue: T[]): queue is Queue<T> => {
        return queue.length > 0;
    };
}
