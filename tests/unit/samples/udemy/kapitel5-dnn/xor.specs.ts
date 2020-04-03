import 'jest-extended';
import { learnLinear } from "@/samples/udemy/kapitel5-dnn/xor";
import { LoggerFactory } from "@mmit/logging";
import * as tf from "@tensorflow/tfjs-node";

const x = [[0,0], [0,1], [1,0], [1,1]];
const y = [0,1,1,0];

describe("xor", () => {
    const logger = LoggerFactory.getLogger('test.xor');

    // beforeEach(() => {
    // });
    //
    // afterEach(() => {
    // });

    test("predict", async () => {

        const model = learnLinear();

        const xs = tf.tensor2d(x, [x.length, 2]);
        const ys = tf.tensor2d(y, [y.length, 1]);

        await model.fit(xs, ys, { epochs: 500, batchSize: 1 });

        const prediction = model.predict(tf.tensor2d(x, [x.length, 2]));

        //             const pred = Array.from(values)
        logger.info("Prediction:", prediction);
        // expect(true).toBe(true);
    }, 100000);

    /**
     * Kommt auch von da:
     *      https://himco.jp/2018/09/01/4_1-tensorflow-js%E3%81%A7%E5%AE%9F%E8%A3%85%E3%81%97%E3%81%9F%E8%AB%96%E7%90%86%E3%82%B2%E3%83%BC%E3%83%88/
     */
    test("Sample from web", async () => {
        const model = tf.sequential();

        const learningRate = 0.01;
        const optimizer = tf.train.rmsprop(learningRate);
        
        model.add(tf.layers.dense({ units: 8, inputShape: [2], activation: 'elu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
        model.compile({ optimizer, loss: 'meanSquaredError' });

        // Creating dataset
        const input = tf.tensor2d([[0, 0], [0, 1], [1, 0], [1, 1]]);
        input.print();

        const output = tf.tensor2d([[0], [1], [1], [0]]);
        output.print();

        // Train the model
        await model.fit(input, output, {
            batchSize: 1,
            epochs: 500
        });

        const prediction = model.predict(input);
        if(Array.isArray(prediction)) {
            throw new Error("Expected 'Tensor' but got 'Tensor[]'!");
        }

        logger.info("Prediction:", (prediction.dataSync()));

    }, 100000);
});
