import 'jest-extended';
import { AbstractObservable } from "@/samples/AbstractObservable";
import { Messages, onUpdateName, onUpdateWeight } from "@/samples/interfaces";

class ConcreteObserver extends AbstractObservable {
    public pushUpdateName(name: string): void {
        this.notify('update.name', { name });
    }

    public pushWeights(weights: number[], bias: number): void {
        this.notify('update.weight', { weights, bias });
    }
}

describe("Observer", () => {
    // const logger = LoggerFactory.getLogger('test.Observer');    

    test("update Name", /* async */ (done) => {
        const observer = new ConcreteObserver();
        let receivedName: string;

        observer.subscribe({
            update: async <T extends keyof Messages>(type: T, payload: Messages[T]): Promise<void> => {
                onUpdateName(type, payload, (name) => {
                    receivedName = name.name;
                    done();
                });
            }
        });
        observer.pushUpdateName("Mike");

        // @ts-ignore
        expect(receivedName).toBe("Mike");
    });

    test("update Weight", /* async */ (done) => {
        const observer = new ConcreteObserver();
        let receivedWeight: number[];
        let bias = -1;

        observer.subscribe({
            update: async <T extends keyof Messages>(type: T, payload: Messages[T]): Promise<void> => {
                onUpdateWeight(type, payload, (weights) => {
                    receivedWeight = [...weights.weights];
                    bias = weights.bias;

                    done();
                });
            }
        });
        observer.pushWeights([1,99], 0.5);

        // @ts-ignore
        expect(receivedWeight[1]).toBe(99);
        expect(bias).toBe(0.5);
    });
});
