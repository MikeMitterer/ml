// export type UpdateFunction = (type: Notification, payload?: unknown) => void ;
export type UpdateFunction = <T extends keyof Messages>(type: T, payload: Messages[T]) => Promise<void>;

export interface Observer {
    update: UpdateFunction;
}

export interface Observable {
    notify: UpdateFunction;
    subscribe(observer: Observer): void;
    unsubscribe(observer: Observer): void;
}

export type Weights = { weights: number[], bias: number };
export type Name = { name: string; };
export type Iteration = { iteration: number };
export type Done = { done: boolean };

/**
 * All the messages we can send.
 *
 * Usage:
 *      this.notify('update.weight', { index, weight });
 * Reminder:
 *      // Shorthand to return an object
 *      // () => ({ age: 99 })
 *      this.notify('update.age', () => ({ age: 99 }));
 */
export type Messages = {
    'update.weight': Weights;
    'update.iteration': Iteration
    'update.name':  Name;
    'update.age': () => { age: number };
    'training.done': Done;
};

export function isUpdateName<T extends keyof Messages>(type: T, obj: unknown): obj is Messages['update.name'] {
    return obj && type === 'update.name';
}

export function isUpdateWeight<T extends keyof Messages>(type: T, obj: unknown): obj is Messages['update.weight'] {
    return obj && type === 'update.weight';
}

export function isUpdateAge<T extends keyof Messages>(type: T, obj: unknown): obj is Messages['update.age'] {
    return obj && type === 'update.age';
}

export function onUpdateWeight<T extends keyof Messages>(type: T, obj: unknown, callback: (weight: Weights) => void): void {
    if(isUpdateWeight(type, obj)) {
        callback(obj);
    }
}

export function onUpdateName<T extends keyof Messages>(type: T, obj: unknown, callback: (name: Name) => void): void {
    if(isUpdateName(type, obj)) {
        callback(obj);
    }
}

export async function onUpdateIteration<T extends keyof Messages>(type: T, obj: unknown, callback: (iteration: Iteration) => void): Promise<void> {
    if(type === 'update.iteration') {
        await callback(obj as Iteration);
    }
}

export function onTrainingDone<T extends keyof Messages>(type: T, obj: unknown, callback: (payload: Done) => void): void {
    if(type === 'training.done') {
        callback(obj as Done);
    }
}
