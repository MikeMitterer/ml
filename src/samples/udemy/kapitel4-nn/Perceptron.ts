import { AbstractObservable } from "@/samples/AbstractObservable";
import { zip } from "./tsnp";
import * as tsnp from "./tsnp";

export interface TrainingData {
    /** X - Input */
    input: number[];

    /** Y - Output */
    output: boolean;
}


/**
 * Weiter Infos:
 *      https://towardsdatascience.com/perceptron-learning-algorithm-d5db0deab975
 *      https://towardsdatascience.com/perceptron-the-artificial-neuron-4d8c70d5cc8d
 *      http://hagan.okstate.edu/4_Perceptron.pdf
 *
 *      https://hackernoon.com/neural-networks-from-scratch-for-javascript-linguists-part1-the-perceptron-632a4d1fbad2
 *
 * Draw Line:
 *      https://stats.stackexchange.com/questions/71335/decision-boundary-plot-for-a-perceptron
 *      https://stackoverflow.com/questions/31292393/how-do-you-draw-a-line-using-the-weight-vector-in-a-linear-perceptron?rq=1
 *      
 * Calc Line:
 *      [Calculate the Decision Boundary of a Single Perceptron](http://bit.ly/2SB0i35)
 *      [Google-Docs - Sample](http://bit.ly/38F5sAr)
 */
export class Perceptron extends AbstractObservable {
    private readonly epochs: number;
    private weights: number[] = [];
    private bias: number = 0.5;
    private threshold = 0.5;

    constructor(epochs: number = 50) {
        super();
        this.epochs = epochs;
    }

    public async train(data: TrainingData[], learningRate: number = 0.2, bias: number = this.bias): Promise<void> {
        const numberOfSamples = data.length;
        const dimensions = data[0].input.length;

        // Create new weights vector matching length of training
        // data and set values to random numbers between 0 and 1
        // Verteilung der Zufallswerte ist eigentlich egal
        this.weights = [...new Array(dimensions)].map(() => tsnp.random.uniform(0,1));
        this.bias = bias;

        await this.notify('update.weight', { weights: [...this.weights], bias });

        let errorCount = 0;
        for (let epoch = 0; epoch < this.epochs; epoch++) {
            errorCount = epoch % 5 === 0 ? 0 : errorCount;
            
            for (let sample = 0; sample < numberOfSamples; sample++) {
                const input = data[sample].input;
                const output = data[sample].output;
                const predicted = this.predict(input);

                if (predicted !== output) {
                    errorCount++;
                    this.weights = this.updateWeights(input, predicted, learningRate);
                    await this.notify('update.weight', { weights: [...this.weights], bias });
                }
            }

            await this.notify('update.iteration', { iteration: epoch });
            if(errorCount === 0) {
                break;
            }
        }
        await this.notify('update.weight', { weights: [...this.weights], bias });
        await this.notify('training.done', { done: true });
    }

    public test(testData: TrainingData[]): number {
        if(this.weights.length === 0) {
            throw new Error("Please train your model before testing it!");
        }

        const predictions = testData.map((data) => this.predict(data.input));

        let sum = 0;
        zip(predictions, testData.map((data) => data.output)).forEach((compare) => {
            sum += compare[0] === compare[1] ? 1 : 0;
        });
        return sum * 100 / predictions.length;
    }

    private activation(product: number): boolean {
        if(product > 0.5) {
            return true;
        } else {
            return false;
        }
    }

    private predict(input: readonly number[]): boolean {
        const product = tsnp.dot(input, this.weights);
        return this.activation(product);
    }

    private updateWeights(
        inputs: readonly number[], predicted: boolean, learningRate: number): number[] {

        const newWeights: number[] = [];

        inputs.forEach((input, index) => {
            let delta: number;
            if (predicted) {
                delta = -input;
            } else {
                delta = input;
            }

            newWeights.push(this.weights[index] + learningRate * delta);
        });

        return newWeights;
    }
}
