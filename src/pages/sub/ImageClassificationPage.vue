<template>
    <div class="image-classification-page">
        <h2>ImageClassification</h2>
        <div class="ui my-2">
            <v-sheet class="pa-2 ml-3 mr-3 mb-3 elevation-2" height="240" width="240">
                <img
                    id="image"
                    crossOrigin="anonymous"
                    height="224"
                    width="224"
                    src="https://upload.wikimedia.org/wikipedia/commons/6/60/Doggy.jpg"
                    @load="onImageLoaded"
                />
            </v-sheet>
            <v-btn small color="primary" @click="onLoadNewImage">Load new image...</v-btn>
            <v-btn small :disabled="loading" @click="onClassify">Classify!</v-btn>
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
            name="Packt"
            link="https://subscription.packtpub.com/video/big_data_and_business_intelligence/9781838824587"
            github="https://github.com/PacktPublishing/TensorFlow.js-in-3-Hours"
        ></m-sample-link>
    </div>
</template>

<script lang="ts">
    import MSampleLink from '@/components/MSampleLink.vue';
    import { IMAGENET_CLASSES } from '@/model/imagenet_classes';
    import { Classification } from '@/model/interfaces/Classification';
    import { LoggerFactory, LogLevel } from '@mmit/logging';

    import * as tf from '@tensorflow/tfjs';
    import { Component, Vue } from 'vue-property-decorator';

    const MOBILENET_MODEL_PATH =
        'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';

    const IMAGE_SIZE = 224;

    /**
     * This code is based on an original example from
     *      https://github.com/tensorflow/tfjs-examples/tree/master/mobilenet
     *
     * and is based on the Video course from Packt:
     *      TensorFlow.js in 3 Hours
     *
     * GH: https://github.com/PacktPublishing/TensorFlow.js-in-3-Hours
     *
     */
    @Component({ name: 'ImageClassificationPage', components: { MSampleLink } })
    export default class ImageClassificationPage extends Vue {
        private readonly logger = LoggerFactory.getLogger('ml.udemy.ImageClassificationPage');

        // @Prop({ default: false })
        // private myProp: boolean = false;

        private mobilenet?: tf.LayersModel;

        private classifications: Classification[] = [];

        private loading: boolean = true;

        private get image(): HTMLImageElement {
            const element = this.$el.querySelector<HTMLImageElement>('#image');
            if (!element) {
                throw new Error('Could not find #image element');
            }
            return element;
        }

        private async onLoadNewImage(): Promise<void> {
            // const response: { message: string; status: string } = (
            //     await axios.get('https://dog.ceo/api/breeds/image/random')
            // ).data;

            this.loading = true;
            this.image.src = 'https://loremflickr.com/224/224/dog?random=' + Date.now();
            // console.info(response);

            // const image = (await axios.get(response.message)).data;

            // this.image.src = image;
        }

        private onImageLoaded(): void {
            this.loading = false;
            this.logger.debug('Image loaded!');
        }

        private async onClassify(): Promise<void> {
            const prediction = await this.predict(this.image);
            if (!prediction) {
                throw new Error('Unable to predict what this image shows!');
            }

            this.classifications = await this.getTopKClasses(prediction);
        }

        // prettier-ignore
        private async predict(image: HTMLImageElement): Promise<tf.Tensor /* | tf.Tensor[]*/ | undefined> {
            this.logger.debug('Predicting...');

            const logits = tf.tidy(() => {
                // tf.browser.fromPixels() returns a Tensor from an image element.
                const img = tf.browser.fromPixels(image).toFloat();

                const offset = tf.scalar(127.5);

                // Normalize the image from [0, 255] to [-1, 1].
                const normalized = img.sub(offset).div(offset);

                // Reshape to a single-element batch so we can pass it to predict.
                const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);

                // Make a prediction through mobilenet.
                return this.mobilenet?.predict(batched);
            });

            // We won't get an array because with reshape... we told TF to give us just
            // one element.
            // This line is here to trick TS
            return Array.isArray(logits) ? logits[0] : logits;
        }

        /**
         * Computes the probabilities of the topK classes given logits by computing
         * softmax to get probabilities and then sorting the probabilities.
         *
         * @param logits Tensor representing the logits from MobileNet.
         * @param numberOfPredictions The number of top predictions to show.
         */
        // prettier-ignore
        private async getTopKClasses( logits: tf.Tensor, numberOfPredictions = 10 ): Promise<Classification[]> {
            const values = await logits.data();
            const valuesAndIndices = [];

            for (let i = 0; i < values.length; i++) {
                valuesAndIndices.push({ value: values[i], index: i });
            }
            valuesAndIndices.sort((a, b) => {
                return b.value - a.value;
            });

            const topkValues = new Float32Array(numberOfPredictions);
            const topkIndices = new Int32Array(numberOfPredictions);

            for (let i = 0; i < numberOfPredictions; i++) {
                topkValues[i] = valuesAndIndices[i].value;
                topkIndices[i] = valuesAndIndices[i].index;
            }

            const topClassesAndProbs = [];
            const classes = Object.values(IMAGENET_CLASSES);
            for (let i = 0; i < topkIndices.length; i++) {
                topClassesAndProbs.push({
                    className: classes[topkIndices[i]],
                    probability: topkValues[i],
                });
            }
            return topClassesAndProbs;
        }

        // - LiveCycle-Hooks -----------------------------------------------------------------------

        // noinspection JSUnusedLocalSymbols
        private async mounted(): Promise<void> {
            this.logger.debug('Loading model...');
            this.mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH);

            // this.image.addEventListener('load', this.onImageLoaded);
        }

        private async beforeDestroy(): Promise<void> {
            // this.image.removeEventListener('load', this.onImageLoaded);
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    // @import "./imgclassification";
    .image-classification-page {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: auto auto;

        h2 {
            grid-column: 1 / -1;
        }

        .ui {
            display: grid;
            grid-gap: 10px;

            grid-template-areas:
                'image image'
                'load classify';

            .v-sheet {
                grid-area: image;

                #image {
                    border-radius: 4px;
                }
            }
        }

        .classification {
        }
    }
</style>
