<template>
    <div class="sample perceptron mt-3">
        <div class="graph-container pa-3 elevation-3">
            <div class="graph "></div>
        </div>
        <div class="control pa-3">
            <div class="button-bar mb-3">
                <v-btn v-if="playerState !=='pause'"
                       class="ma-2"
                       outlined
                       x-small
                       fab
                       color="white"
                       @click="onPlayer('pause')"
                       :disabled="true">
                    <v-icon>mdi-pause</v-icon>
                </v-btn>
                <v-btn v-if="playerState ==='pause'"
                       class="ma-2"
                       outlined
                       x-small
                       fab
                       color="white"
                       @click="onPlayer('play')">
                    <v-icon>mdi-play</v-icon>
                </v-btn>
            </div>
            <div class="iterations">
                <v-slider
                        v-model="iterations"
                        min="10"
                        max="100"
                        label="Iterations"
                ></v-slider>
                ({{iterations}})
            </div>
            <div class="bias">
                <v-slider
                        v-model="bias"
                        min="-1"
                        max="1"
                        step="0.1"
                        label="Bias"
                ></v-slider>
                ({{bias}})
            </div>
            <v-switch class="mt-0" v-model="useORDataset"
                      :label="`Use OR Dataset (${useORDataset ? 'OR' : 'AND'})`"></v-switch>
            <div class="data">
                <ul>
                    <li>Weights:
                        <span class="as-html" v-html="json[0]"></span>
                    </li>
                    <li>Iterations:
                        <span class="as-html" v-html="json[1]"></span>
                    </li>
                    <li>Prediction:
                        <span class="as-html" v-html="json[2]"></span>
                    </li>
                    <li>Boundary:
                        <span class="as-html" v-html="boundaryAsJson"></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { sleep } from "@/pages/utils/sleep";
    import { stringify } from "@/pages/utils/stringify";
    import {
        Done,
        Iteration,
        Messages,
        Observer, onTrainingDone,
        onUpdateIteration,
        onUpdateWeight
    } from "@/samples/interfaces";
    import { getANDDataset, getORDataset } from "@/samples/udemy/kapitel4-nn/dataset";
    import { Perceptron } from "@/samples/udemy/kapitel4-nn/Perceptron";
    import { LoggerFactory } from "@mmit/logging";
    import * as plt from 'plotly.js';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    type PlayerState = 'play' | 'pause' | 'next' | 'stop';

    const dataTypeWeights = 0;
    const dataTypeIteration = 1;
    const dataTypePrediction = 2;

    @Component({ components: {} })
    export default class PerceptronPage extends Vue {
        private readonly logger = LoggerFactory.getLogger('ml.PerceptronPage');

        private playerState: PlayerState = 'pause';
        private iterations: number = 50;
        private bias: number = 0.5;

        private graph: Plotly.PlotlyHTMLElement | undefined;

        private useORDataset = true;

        private traceOR: Partial<Plotly.PlotData> = {
            x: [0, 1, 0, 1],
            y: [0, 0, 1, 1],
            name: "OR-Dataset",
            mode: 'markers',
            marker: {
                size: 10,
                color: ['red', 'green', 'green', 'green'],
            },
            type: 'scatter'
        };

        private traceAND: Partial<Plotly.PlotData> = {
            x: [0, 1, 0, 1],
            y: [0, 0, 1, 1],
            name: "AND-Dataset",
            mode: 'markers',
            marker: {
                size: 10,
                color: ['red', 'red', 'red', 'green'],
            },
            type: 'scatter'
        };

        private data = [this.useORDataset ? this.traceOR : this.traceAND];

        private perceptron: Perceptron | {} = {};

        private json: string[] = [];

        private boundary = {
            x0: 0, y0: 0,
            x1: 1, y1: 1,
        };

        private get boundaryAsJson(): string {
            return stringify(this.boundary);
        }

        private get observer(): Observer {
            return {
                update: async <T extends keyof Messages>(type: T, payload: Messages[T]): Promise<void> => {
                    onUpdateWeight(type, payload, (weights) => {
                        this.logger.info(`Weights:`, weights);

                        // weights.weights[0] = 0.6183462954285528;
                        // weights.weights[1] = 0.9697887902961182;
                        // weights.weights[2] = 0.5;

                        const bias = weights.bias;
                        const slope = -(bias / weights.weights[1]) / (bias / weights.weights[0]);
                        const xintercept = bias / weights.weights[1];
                        const yintercept = bias / weights.weights[0];

                        this.boundary.x0 = 0;
                        this.boundary.x1 = 1;

                        this.boundary.y0 = -xintercept / slope;
                        this.boundary.y1 = (-xintercept + 1) / slope;

                        // this.boundary.y0 = (weights.weights[0]*0+bias)/weights.weights[1];
                        // this.boundary.y1 = -(weights.weights[0]*1+bias)/weights.weights[1];

                        Vue.set(this.json, dataTypeWeights, stringify(weights));
                        this.plot();
                    });

                    await onUpdateIteration(type, payload, async (iteration: Iteration) => {
                        Vue.set(this.json, dataTypeIteration, stringify({
                            iterations: iteration.iteration + 1
                        }));

                        await sleep(200);
                    });

                    onTrainingDone(type, payload, (data: Done) => {
                        this.logger.info(`Training is ${data.done ? 'done' : 'not done'}!`);
                        this.playerState = 'pause';

                        // debugger;
                        if (this.perceptron instanceof Perceptron) {
                            const percent = this.perceptron.test(
                                this.useORDataset ? getORDataset() : getANDDataset());

                            this.logger.info(`Result ${percent}%!`);
                            Vue.set(this.json, dataTypePrediction, stringify({ percent }));
                        }

                    });
                }
            };
        }

        private onPlayer(action: PlayerState): void {
            this.playerState = action;
            switch (this.playerState) {
                case "play":
                    this.perceptron = new Perceptron(this.iterations);
                    this.json = this.json.map((value) => '');
                    if (this.perceptron instanceof Perceptron) {
                        this.perceptron.subscribe(this.observer);
                        this.perceptron.train(
                            this.useORDataset ? getORDataset() : getANDDataset(),
                            0.2,
                            this.bias);
                    }
                    break;

                case "pause":
                    break;

                case "next":
                    break;
            }
        }

        @Watch('useORDataset')
        private async onUseORDatasetChanged(): Promise<void> {
            this.data = [this.useORDataset ? this.traceOR : this.traceAND];
            this.logger.info("UseOrDataset", this.data);

            // await plt.redraw(this.element);
            this.plot();
        }

        private get element(): HTMLElement {
            const el = document.querySelector<HTMLElement>('.graph');
            if (!el) {
                throw Error("Could not find '.graph'!");
            }
            return el;
        }

        private async plot(drawLine: boolean = true): Promise<void> {
            const layout: Partial<plt.Layout> = {
                title: 'Perceptron',
                showlegend: true,
                autosize: true,
                width: 600,
                height: 450,
                // xaxis: {range: [0, 1.5]},
                // yaxis: {range: [0, 1.5]},
                shapes: [
                    {
                        // Line Diagonal
                        type: 'line',
                        x0: 0, y0: 0,
                        x1: 1, y1: 1,
                        line: {
                            color: 'rgb(128, 0, 128)',
                            width: 1,
                        }
                    },
                ],
            };

            layout.shapes![0].x0 = this.boundary.x0;
            layout.shapes![0].y0 = this.boundary.y0;
            layout.shapes![0].x1 = this.boundary.x1;
            layout.shapes![0].y1 = this.boundary.y1;

            if(!drawLine) {
                layout.shapes = [];
            }
            
            // https://plot.ly/javascript/configuration-options/#never-display-the-modebar
            // redraw anstatt newPlot... ist auch möglich
            this.graph = await plt.newPlot(this.element, this.data,
                layout, { displayModeBar: false, responsive: false });

        }

        // - LiveCycle-Hooks -----------------------------------------------------------------------

        private async mounted(): Promise<void> {
            this.plot(false);

            // setInterval(async () => {
            //     // Vue.set(this.trace1.x as [],0, Math.round(Math.random()));
            //
            //     if (this.playerState === 'play') {
            //         // layout.shapes![0].x0 = Math.random();
            //         // await plt.redraw(this.element);
            //         this.plot();
            //     }
            //
            //     // await Plotly.react(this.element, [this.trace1, this.trace2],
            //     //      layout, {displayModeBar: false});
            //
            //     // this.logger.info(`Graph updated! (${this.trace1.x![0]})`);
            // }, 500);
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .sample {
        width: 100vw;
        height: calc(100vh - 200px);

        display: grid;
        grid-gap: 10px;

        grid-template-columns: auto 250px;
        grid-template-rows: auto;

        // justify-items: start; // ⇾ start | end | center | stretch;
        // align-items: start; // ↓ start | end | center | stretch;

        > * {
            border-radius: 5px;
        }

        .graph-container {
            // border: 1px solid green;

            .graph {
                // border: 1px solid red;

                max-width: 650px;
                margin-left: auto !important;
                margin-right: auto !important;


                padding-right: 20px;
                padding-bottom: 50px;

                .modebar {
                    display: none !important;
                }

                > * {
                    border: 1px solid blue;
                }

            }

        }

        .control {
            color: white;
            background-color: #6b6b6b;

            .button-bar {
                background-color: #393939;
                border-radius: 3px;

                display: grid;
                grid-gap: 10px;
                // grid-template-columns:  auto;
                // grid-template-rows: auto;

                justify-items: center; // ⇾ start | end | center | stretch;
                // align-items: start; // ↓ start | end | center | stretch;
            }

            .iterations, .bias {
                display: grid;
                grid-gap: 10px;

                grid-template-columns: 1fr auto;
                align-items: baseline; // ↓ start | end | center | stretch;

                grid-template-rows: 30px;
            }
        }

    }

    .perceptron {
    }

</style>
