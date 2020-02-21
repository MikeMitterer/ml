import { LoggerFactory } from "@mmit/logging";
import * as nts from "./NumTS";

export class Perceptron {
    private readonly logger = LoggerFactory.getLogger('ml.test.lardalex.Perceptron');

    public synWeights: number[][] = [];

    constructor() {
        this.synWeights = [[0], [0], [0], [0]];
        for (let i = 0; i < 4; i++) {
            this.synWeights[i][0] = Number((Math.random()).toFixed(4));
        }
    }

    public train(inputs: number[][], realOutputs: number[][], its: number, lr: number): void {

        // declare array with preset with 7 zeros.
        // Not using .fill here to keep things simple.
        const deltaWeights: number[][] = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];

        this.logger.debug("initial weights: " + this.synWeights);

        for (let epoch = 0; epoch < its; epoch++) {
            // forward pass
            const z = nts.multiplier(inputs, this.synWeights);

            const activation = nts.sigmoid(z, 7, 0);

            // back pass
            for (let i = 0; i < 7; i++) {
                const cost = Math.pow((activation[i][0] - realOutputs[i][0]), 2);
                const constPrime = 2 * (activation[i][0] - realOutputs[i][0]);


                for (let n = 0; n < 4; n++) {
                    deltaWeights[n][i] = constPrime * inputs[i][n] * nts.sigmoid_deriv(z[i]);
                }

            }
            let test = nts.matrixAvg(deltaWeights);
            test = nts.multiplyLearningRate(test, lr = 10);
            this.synWeights = nts.updateWeights(this.synWeights, test);
            this.logger.debug("epoch: " + epoch + " weights: " + this.synWeights);
        }
    }

    public test(testingData: number[][]): number[] {
        const column = testingData.length;
        const resultsPrediction: number[] = [];

        testingData.forEach((run: number[]) => {
            const trial = this.results(run);

            // if(Array.isArray(trial)) {
            //     throw new Error("Expected array but got a number!");
            // }
            const roundedNumber = Math.round(trial);

            this.logger.debug("testing data: " + run + "  ====> prediction: " + roundedNumber);
            resultsPrediction.push(roundedNumber);
        });

        return resultsPrediction;
    }

    // tslint:disable-next-line:no-any
    public results(inputs: number[]): any {

        const result = nts.arrMultiplier(inputs, this.synWeights);

        const test = nts.sigmoid([[result]], 1, 0);

        return test;
    }


}
