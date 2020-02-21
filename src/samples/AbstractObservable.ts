/**
 * Klassisches Observer-Pattern...
 */
import { Messages, Observable, Observer } from "@/samples/interfaces";
import { LoggerFactory } from "@mmit/logging";

export abstract class AbstractObservable implements Observable {
    private readonly aLogger = LoggerFactory.getLogger('ml.ui.AbstractObserver');

    private observers: Readonly<Observer>[] = [];

    public subscribe(observer: Observer): void {
        this.observers.push(observer);
    }

    public unsubscribe(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if(index > 0) {
            this.observers.splice(index, 1);
        } else {
            this.aLogger.error("Could not find observer!");
        }
    }

    public async notify<T extends keyof Messages>(type: T, payload: Messages[T]): Promise<void> {
        const asyncFunctions: Promise<void>[] = [];
        this.observers.forEach((observer) => {
            asyncFunctions.push(observer.update(type, payload));
        });
        
        await Promise.all(asyncFunctions);
    }
}
