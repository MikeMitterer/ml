import { LoggerFactory } from "@mmit/logging";
import * as tf from "@tensorflow/tfjs-node";
import axios from 'axios';
import * as fs from 'fs';
import path from "path";

describe("basics", () => {
    const logger = LoggerFactory.getLogger('ml.ytkurs.basics');

    const csvEval = path.join(__dirname, '..', '_resources', "titanic", 'eval.csv');

    // beforeEach(() => {
    // });
    //
    // afterEach(() => {
    // });

    test("Create simple tensor", /* async */ () => {
        const test = tf.variable( tf.tensor("Hallo TEST"));
        test.print(true);

        expect(tf.version.tfjs).toBe("1.5.2");
    });

    test("Shape generate", () => {
        const tensor = tf.zeros([5, 3]);
        tensor.print();
        logger.info(tensor.rank.toPrecision(3));
        // expect( ).toBe( );
    });

    /**
     * Folgt dem Colab-Notebook: http://bit.ly/3at3eEI
     *
     * Titanic dataset: https://www.tensorflow.org/datasets/catalog/titanic
     */
    test("Load Titanic data", () => {
        // tf.
        // expect( ).toBe( );
    });
});
