<template>
    <div class="image-classification-webcam-page">
        <h2>image-classification-webcam-page</h2>
        <div class="ui my-2">
            <!-- Add an image that we will use to test -->
            <video id="webcam" autoplay playsinline muted width="224" height="224"></video>
            <v-btn class="classa" small @click="addExample(0)">class A</v-btn>
            <v-btn class="classb" small @click="addExample(1)">class B</v-btn>
            <v-btn class="classc" small @click="addExample(2)">class C</v-btn>
            <ul>
                <li v-for="example in examples" :key="example">{{ example }}</li>
            </ul>
        </div>
        <div class="classification mt-2">
            <ul>
                <li v-for="classification in classifications" :key="classification.className">
                    {{ classification.className }}:
                    <span>{{ (classification.probability * 100).toFixed(0) }}%</span>
                </li>
            </ul>
        </div>
        <m-sample-link
            name="Google - Tensorflow"
            :link="[
                'https://js.tensorflow.org/api/latest/',
                'https://codelabs.developers.google.com/codelabs/tensorflowjs-teachablemachine-codelab/index.html?index=..%2F..index#0',
                'https://www.smashingmagazine.com/2019/09/machine-learning-front-end-developers-tensorflowjs/',
                'https://github.com/tensorflow/tfjs-models',
                'https://www.tensorflow.org/lite/examples',
                'https://www.smashingmagazine.com/2019/09/machine-learning-front-end-developers-tensorflowjs/',
                'https://observablehq.com/@makerslabemlyon/how-can-we-use-mobilenet-to-train-a-knn',
                'https://heartbeat.fritz.ai/exploring-the-mobilenet-models-in-tensorflow-d9d21774cdab',
                'https://html5.tutorials24x7.com/blog/how-to-capture-image-from-camera',
                'https://makitweb.com/how-to-capture-picture-from-webcam-with-webcam-js/#basic',
            ]"
        ></m-sample-link>
    </div>
</template>

<!--suppress ES6MissingAwait -->
<script lang="ts">
    import MSampleLink from '@/components/MSampleLink.vue';
    import { Classification } from '@/model/interfaces/Classification';
    import { LoggerFactory } from '@mmit/logging';
    import { MobileNet } from '@tensorflow-models/mobilenet';
    import * as tf from '@tensorflow/tfjs';
    import { WebcamIterator } from '@tensorflow/tfjs-data/dist/iterators/webcam_iterator';
    import * as mobilenet from '@tensorflow-models/mobilenet';
    import * as knnClassifier from '@tensorflow-models/knn-classifier';

    import { Component, Vue } from 'vue-property-decorator';

    @Component({ name: 'ImageClassificationWebCam', components: { MSampleLink } })
    export default class ImageClassificationWebCam extends Vue {
        private readonly logger = LoggerFactory.getLogger('ml.udemy.ImageClassificationWebCam');

        // @Prop({ default: false })
        // private myProp: boolean = false;

        private net!: MobileNet;
        private webcam!: WebcamIterator;
        private classifier!: knnClassifier.KNNClassifier;

        private classifications: (Classification | void)[] = [];
        private examples: number[] = [];

        private get image(): HTMLImageElement | never {
            const element = this.$el.querySelector<HTMLImageElement>('#img');
            if (!element) {
                throw new Error('Could not find image');
            }
            return element;
        }

        private get video(): HTMLVideoElement | never {
            const element = this.$el.querySelector<HTMLVideoElement>('#webcam');
            if (!element) {
                throw new Error('Could not find webcam');
            }
            return element;
        }

        private async addExample(classID: number): Promise<void> {
            // Capture an image from the web camera.
            const img = await this.webcam.capture();

            // Get the intermediate activation of MobileNet 'conv_preds' and pass that
            // to the KNN classifier.
            // @ts-ignore
            const activation = this.net.infer(img, 'conv_preds');

            // Pass the intermediate activation to the classifier.
            this.classifier.addExample(activation, classID);

            const exampleCount = this.classifier.getClassExampleCount();
            this.examples = Object.keys(exampleCount).map((key) => exampleCount[key]);
            // Dispose the tensor to release the memory.
            img.dispose();
        }

        private async classify(): Promise<void> {
            if (this.classifier.getNumClasses() > 0) {
                const start = Date.now();

                // this.logger.info(`Start to classify...`);
                const img = await this.webcam.capture();

                // const result = await this.net?.classify(img);

                // Get the activation from mobilenet from the webcam.
                // @ts-ignore
                const activation = this.net.infer(img, 'conv_preds');
                // Get the most likely class and confidence from the classifier module.
                const result = await this.classifier.predictClass(activation);

                this.logger.info('Result', result);

                // this.classifications = result?.map((value) => {
                //     return {
                //         className: value.className,
                //         probability: value.probability,
                //     };
                // });

                // this.logger.info(`Classified! (${Date.now() - start}ms)`);

                // Dispose the tensor to release the memory.
                img.dispose();
                activation.dispose();
            }
        }

        // - LiveCycle-Hooks -----------------------------------------------------------------------

        // noinspection JSUnusedLocalSymbols
        private async mounted(): Promise<void> {
            this.logger.debug('Loading model...');

            const start = Date.now();

            this.net = await mobilenet.load();
            this.classifier = knnClassifier.create();

            this.logger.info(`Model loaded! (${Date.now() - start}ms)`);

            this.webcam = await tf.data.webcam(this.video);

            setInterval(() => {
                this.classify();
            }, 1000);

            // this.image.addEventListener('load', this.onImageLoaded);
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    // @import "./imageclassificationwebcam";
    .image-classification-webcam-page {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 224px auto;
        // grid-template-rows: 50px 100px;

        grid-template-areas:
            'headline headline'
            'ui classification';

        h2 {
            grid-area: headline;
            grid-column: 1 / -1;
        }

        .ui {
            grid-area: ui;

            display: grid;
            grid-gap: 10px;
            grid-template-columns: auto;

            grid-template-areas:
                'image'
                'classa'
                'classb'
                'classc';

            #webcam {
                grid-area: image;
                transform: rotateY(180deg);
            }

            .classa,
            .classb,
            .classc {
                width: 224px;
            }

            .classa {
                grid-area: classa;
            }

            .classb {
                grid-area: classb;
            }

            .classc {
                grid-area: classc;
            }
        }

        .classification {
            // grid-area: classification;

            min-height: 50px;
        }
    }
</style>
