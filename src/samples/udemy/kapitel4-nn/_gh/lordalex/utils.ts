import { LoggerFactory } from "@mmit/logging";

const logger = LoggerFactory.getLogger('mmit.ml.udemy.utils');

export function accuracy(testingData: number[][], prediction: number[]): number {
    let x = 0;
    for (let i: number = 0; i < testingData.length; i++) {
        if (testingData[i][0] === prediction[i]) {
            x++;
        }
    }
    const acc = (x / testingData.length) * 100;
    return acc;
}

// A function that shows the content of matrix
export function show(m: number[][]): void {
    const row: number = m.length;
    const column: number = m[0].length;

    for (let indexR: number = 0; indexR < row; indexR++) {
        let s: string = "";
        for (let indexC = 0; indexC < column; indexC++) {
            s += m[indexR][indexC] + "\t";
        }
        logger.info(s + "\n");
    }
}

// A function that shows the content of matrix
export function showArr(m: number[], msg: string): void {
    const row: number = m.length;
    let s: string = "";
    for (let indexR: number = 0; indexR < row; indexR++) {

        s += m[indexR] + "\t";
    }
    logger.info(msg + s);
}
