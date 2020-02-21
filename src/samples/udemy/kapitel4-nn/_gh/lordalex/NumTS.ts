import { LoggerFactory } from "@mmit/logging";

const logger = LoggerFactory.getLogger('mmit.ml.udemy.NumTS');

export function multiplier2d_1d(m1: number[][], m2: number[]): number[][] {
    const r1: number = m1.length;
    const c1: number = m1[0].length;
    const r2: number = m2.length;
    const m3: number[][] = [];

    // Matrix multiplication logic
    for (let i: number = 0; i < r1; i++) {
        for (let j: number = 0; j < c1; j++) {
            m3[i][j] += m1[i][j] * m2[j];
        }
    }
    return m3;
}

// A function that multiplies 2 matrices
export function multiplier(m1: number[][], m2: number[][]): number[][] {
    const r1: number = m1.length;
    const c1: number = m1[0].length;
    const r2: number = m2.length;
    const c2: number = m2[0].length;
    const m3: number[][] = [];

    // Matrix multiplication logic
    for (let i: number = 0; i < r1; i++) {
        const tempArr: number[] = [];
        for (let j: number = 0; j < c2; j++) {
            let tempVal: number = 0;
            for (let k: number = 0; k < c1; k++) {
                tempVal += m1[i][k] * m2[k][j];
            }
            tempArr.splice(tempArr.length, 0, tempVal);
        }
        m3.splice(m3.length, 0, tempArr);
    }
    return m3;
}

// change name for this after 1D to 2D
export function arrMultiplier(m1: number[], m2: number[][]): number {
    const r1: number = m1.length;
    const c1: number = m1.length;

    // Matrix multiplication logic
    let val: number = 0;
    for (let i: number = 0; i < r1; i++) {
        val = val + m1[i] * m2[i][0];
    }
    return val;
}


export function myAverage(matrix: number[][], length: number): number[] {
    const result = [0, 0, 0, 0];

    for (let i: number = 0; i < 7; i++) {
        for (let z: number = 0; z < 4; z++) {
            result[z] += matrix[i][z];
        }
    }
    // this.showArr(result, "result: ");
    return result;
}

export function matrixAvg(x: number[][]): number[] {
    const row = x.length;
    const column = x[0].length;
    const tab = [0, 0, 0, 0];
    for (let i: number = 0; i < row; i++) {

        for (let indexC: number = 0; indexC < column; indexC++) {
            tab[i] = tab[i] + x[i][indexC];
        }
        tab[i] = tab[i] / x[0].length;
    }
    return tab;
}

export function multiplyLearningRate(tab: number[], lr: number): number[] {
    const column: number = tab.length;

    for (let indexC: number = 0; indexC < column; indexC++) {
        tab[indexC] = tab[indexC] * lr;
    }

    return tab;
}

export function updateWeights(tab: number[][], tab2: number[]): number[][] {
    const column: number = 4; // tab.length;

    for (let indexC: number = 0; indexC < column; indexC++) {
        let temp: number = 0;
        temp = tab[indexC][0] - tab2[indexC];
        tab[indexC][0] = Number(temp.toFixed(4));
    }
    return tab;
}

export function sigmoid(x: number[][], col: number, row: number): number[][] {
    const calc = (value: number): number => {
        return (1 / (1 + Math.exp(-value)));
    };

    for (let i = 0; i < col; i++) {
        x[i][row] = calc(x[i][row]);
    }

    return x;
}

export function sigmoid_deriv(x: number[]): number {
    return Math.exp(-x) / Math.pow(((1 + Math.exp(-x))), 2);
}


