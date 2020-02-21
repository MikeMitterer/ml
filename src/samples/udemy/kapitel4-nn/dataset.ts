import { TrainingData } from "./Perceptron";

export const getORDataset = (): TrainingData[] => {
    return [
        { input: [0, 0], output: false },
        { input: [1, 0], output: true },
        { input: [0, 1], output: true },
        { input: [1, 1], output: true },
    ];
};

export const getANDDataset = (): TrainingData[] => {
    return [
        { input: [0, 0], output: false },
        { input: [1, 0], output: false },
        { input: [0, 1], output: false },
        { input: [1, 1], output: true },
    ];
};
