import { LoggerFactory } from "@mmit/logging";
import { ILearningData } from "@/samples/udemy/kapitel4-nn/_gh/mattmazzola/perceptron";
import * as perceptron from '@/samples/udemy/kapitel4-nn/_gh/mattmazzola/perceptron';

const logger = LoggerFactory.getLogger('ml.test.mattmazzola.perceptron');

describe('perceptron', () => {
    describe('AND', () => {
        const trainingData: perceptron.ITrainingData[] = [
            {
                vector: [0, 0],
                output: false
            },
            {
                vector: [1, 0],
                output: false
            },
            {
                vector: [0, 1],
                output: false
            },
            {
                vector: [1, 1],
                output: true
            }
        ];
        let and: perceptron.Perceptron;
        let learningData: perceptron.ILearningData[];

        beforeAll(() => {
            and = new perceptron.Perceptron();
            learningData = and.train(trainingData, 0.2);

            learningData.forEach(logLearningData);
        });

        test('should verify training data was learned', () => {
            trainingData
                .every(x => {
                    expect(and.perceive(x.vector)).toEqual(x.output);
                    return true;
                });
        });
    });

    describe('OR', () => {
        const trainingData: perceptron.ITrainingData[] = [
            {
                vector: [0, 0],
                output: false
            },
            {
                vector: [1, 0],
                output: true
            },
            {
                vector: [0, 1],
                output: true
            },
            {
                vector: [1, 1],
                output: true
            }
        ];
        let or: perceptron.Perceptron;
        let learningData: ILearningData[];

        beforeAll(() => {
            or = new perceptron.Perceptron();
            learningData = or.train(trainingData, 0.2);

            learningData.forEach(logLearningData);
        });

        test('should verify training data was learned', () => {
            trainingData
                .every(x => {
                    expect(or.perceive(x.vector)).toEqual(x.output);
                    return true;
                });
        });
    });

    describe('Box 1', () => {
        const trainingData: perceptron.ITrainingData[] = [
            {
                vector: [0.2, 0.1],
                output: true
            },
            {
                vector: [0.1, 0.2],
                output: true
            },
            {
                vector: [0.2, 0.3],
                output: false
            },
            {
                vector: [0.3, 0.2],
                output: false
            }
        ];
        let p1: perceptron.Perceptron;
        let learningData: ILearningData[];

        beforeAll(() => {
            p1 = new perceptron.Perceptron();
            learningData = p1.train(trainingData, 0.1);

            learningData.forEach(logLearningData);
        });

        test('should verify training data was learned', () => {
            trainingData
                .every(x => {
                    expect(p1.perceive(x.vector)).toEqual(x.output);
                    return true;
                });
        });
    });

    describe('Random', () => {
        const maxNumPoints = 50;


        const trainingDatas: perceptron.ITrainingData[] = [];

        // Generate random line within space
        const domain = [-1, 1];
        const range = [-1, 1];
        const start = generatePoint(domain, range);
        const end = generatePoint(domain, range);
        let percpetronRandom: perceptron.Perceptron;

        beforeAll(() => {
            let trainingCounts: { true: number, false: number };

            do {
                const point = generatePoint(domain, range);
                const output = (crossProduct(start, end, point) > 0);

                trainingDatas.push({
                    vector: [point.x, point.y],
                    output
                });

                trainingCounts = counts(trainingDatas);
            } while (trainingCounts.true < 3 || trainingCounts.false < 3);

            percpetronRandom = new perceptron.Perceptron();
            const learningData = percpetronRandom.train(trainingDatas, 0.2);

            learningData.forEach(logLearningData);
        });

        test('trainingData should be confirmed by trained perceptron', () => {
            trainingDatas
                .every(trainingData => {
                    expect(percpetronRandom.perceive(trainingData.vector)).toEqual(trainingData.output);
                    return true;
                });
        });
    });
});

interface IPoint {
    x: number;
    y: number;
}

function counts(trainingDatas: perceptron.ITrainingData[]): { true: number, false: number } {
    return trainingDatas
        .map(trainingData => trainingData.output)
        .reduce((a, b) => {
            if (b) {
                a.true += 1;
            } else {
                a.false += 1;
            }

            return a;
        }, {
            true: 0,
            false: 0
        })
        ;
}

function crossProduct(a: IPoint, b: IPoint, p: IPoint): number {
    return ((b.x - a.x) * (p.y - a.y)) - ((b.y - a.y) * (p.x - a.x));
}

function generatePoint(domain: number[], range: number[]): IPoint {
    const domainExtent = domain[1] - domain[0];
    const rangeExtend = domain[1] - domain[0];

    const x = Math.random() * domainExtent - domainExtent / 2;
    const y = Math.random() * rangeExtend - rangeExtend / 2;

    return {
        x,
        y
    };
}

function signed(x: number, digits: number): string {
  if (1 / x === -Infinity) {
    return `-${x.toFixed(digits)}`;
  } else if (x >= 0) {
    return `+${x.toFixed(digits)}`;
  }

  return `${x.toFixed(digits)}`;
}

function logLearningData(data: ILearningData): void {
  const { weights, threshold, vector, output, weightChanges, weightsChanged, dotProduct, result } = data;
  let slope = 0;
  let offset = 0;

  if (weights[1] !== 0) {
    slope = -weights[0] / weights[1];
    offset = threshold / weights[1];
  }

  logger.debug(`
        Vector: [${vector}], 
        Weights: [${weights.map((x: number) => signed(x, 1))}], 
        Slope: ${signed(slope, 1)}, 
        Offset: ${signed(offset, 1)}, 
        DotProduct: ${signed(dotProduct, 1)}, 
        Output: ${result ? 1 : 0}, 
        Expected: ${output ? 1 : 0}, 
        Weights Changed: ${weightsChanged}: [${weightChanges.map((x: number) => signed(x, 1))}]`
  );
}
