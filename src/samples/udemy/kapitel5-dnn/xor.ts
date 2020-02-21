import * as tf from "@tensorflow/tfjs";

const x = [[0,0], [0,1], [1,0], [1,1]];
const y = [0,1,1,0];
// const pred = [0,0,0,0];

// const trace1 = {
//     x,
//     y,
//     type: "scatter"
// };
//
// const trace2 = {
//     x,
//     y: pred,
//     type: "scatter"
// };
//
// const data = [trace1, trace2];
//
// const layout1 = {
//     yaxis: {
//         rangemode: "tozero",
//         showline: true,
//         zeroline: true
//     }
// };


async function learnLinear(): Promise<void> {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, inputShape: [2] }));
    model.add(tf.layers.dense({
        units: 100,
        inputShape: [10],
        activation: 'relu',
        useBias: true }));
    model.add(tf.layers.dense({ units: 1, inputShape: [100]}));
    model.compile({
        loss: "meanSquaredError",
        optimizer: "adam"
    });

    const xs = tf.tensor2d(x, [x.length, 2]);
    const ys = tf.tensor2d(y, [y.length, 1]);

    await model.fit(xs, ys, {
        epochs: 10000,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {

                const res = model.predict(tf.tensor2d(x, [x.length, 2]));
                if(Array.isArray(res)) {
                    throw new Error("Expected 'Tensor' but got 'Tensor[]'!");
                }
                const values = res.dataSync();
                const pred = Array.from(values);

                const data = [];
                for (let i = 0; i < x.length; i++){
                    const v = x[i];
                    const color = y[i];
                    const trace = {
                        x: [v[0]],
                        y: [v[1]],
                        mode: 'markers',
                        marker: {
                            size: 40,
                            color: [color]
                        }
                    };
                    data.push(trace);
                }

                for (let i = 0; i < x.length; i++){
                    const v = x[i];
                    let color = 'red';
                    if (Math.round(pred[i]) === y[i]) {
                        color = 'green';
                    }
                    const trace = {
                        x: [v[0]],
                        y: [v[1]],
                        mode: 'markers',
                        marker: {
                            size: 20,
                            color: [Math.round(pred[i])],
                            line: {
                                color,
                                width: 2
                            }
                        }
                    };
                    data.push(trace);
                }

                // document.getElementById("output_field").innerText = 'Epoch:' + epoch + '\n';
                // document.getElementById("output_field").innerText +=res;
            }
        }
    });
}
learnLinear();
