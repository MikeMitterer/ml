import 'jest-extended';
import {
    isUpdateAge,
    isUpdateName,
    isUpdateWeight,
    Messages,
} from "@/samples/interfaces";
import { getANDDataset, getORDataset } from "@/samples/udemy/kapitel4-nn/dataset";
import { LoggerFactory } from "@mmit/logging";
import { Perceptron } from "@/samples/udemy/kapitel4-nn/Perceptron";

const logger = LoggerFactory.getLogger('test.unit.Perceptron');

describe("Perceptron", () => {

    // beforeEach(() => {
    // });
    //
    // afterEach(() => {
    // });

    test("Test OR", async () => {
        const perceptron = new Perceptron();
        await perceptron.train(getORDataset());

        const percent = perceptron.test(getORDataset());
        expect(percent).toBe(100);
    });

    test("Test AND", async () => {
        const perceptron = new Perceptron();
        await perceptron.train(getANDDataset());

        const percent = perceptron.test(getANDDataset());
        expect(percent).toBe(100);
    });

    test("withObserver", async () => {
        const perceptron = new Perceptron();
        let gotNotification = false;

        perceptron.subscribe({
            update: async <T extends keyof Messages>(type: T, payload: Messages[T]): Promise<void> => {
                if(isUpdateWeight(type, payload)) {
                    logger.info(`Type: ${type}, weights: ${JSON.stringify(payload.weights)}`);
                } else

                if(isUpdateName(type, payload)) {
                    logger.info(`Type: ${type}, name: ${payload.name}`);
                } else

                if(isUpdateAge(type, payload)) {
                    logger.info(`Type: ${type}, age: ${payload().age}`);

                }
                gotNotification = true;
                // done();
            }
        });
        await perceptron.train(getORDataset());

        const percent = perceptron.test(getORDataset());

        expect(percent).toBe(100);
        expect(gotNotification).toBeTrue();

        // expect( ).toBe( );
    });

});

