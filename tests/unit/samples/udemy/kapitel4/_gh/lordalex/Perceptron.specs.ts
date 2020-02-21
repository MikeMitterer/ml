import 'jest-extended';
import { Perceptron } from '@/samples/udemy/kapitel4-nn/_gh/lordalex/Perceptron';
import { accuracy } from '@/samples/udemy/kapitel4-nn/_gh/lordalex/utils';


describe("Perceptron", () => {
    // const logger = LoggerFactory.getLogger('test.Perceptron');    

    // Learning Rate
    const learningRate = 10;

    // Steps can be 100000
    const epoch = 10;

    // This is the input to train the model
    const trainingData: number[][] = ([
        [0,0,1,0],
        [1,1,1,0],
        [1,0,1,1],
        [0,1,1,1],
        [0,1,0,1],
        [1,1,1,1],
        [0,0,0,0]
    ]);


    // First Value of Input = output
    // Annotation for data
    const groundTruth: number[][] = [
        [0],
        [1],
        [1],
        [0],
        [0],
        [1],
        [0]
    ];


    const testingData: number[][] = [
        [0,1,1,0],
        [0,0,0,1],
        [0,1,0,0],
        [1,0,0,1],
        [1,0,0,0],
        [1,1,0,0],
        [1,0,1,0]
    ];

    // beforeEach(() => {
    // });
    //
    // afterEach(() => {
    // });

    test("Create Perceptron", /* async */ () => {
        const perceptron = new Perceptron();

        perceptron.train(trainingData, groundTruth, epoch, learningRate);

        const result = perceptron.test(testingData);

        expect(accuracy(testingData, result)).toBe(100);
    });


});
