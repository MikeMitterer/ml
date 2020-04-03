<template>
    <div class="image-classification-webcam-page">
        <h2>image-classification-webcam-page</h2>
        <div class="ui my-2">
            <!-- Add an image that we will use to test -->
            <img
                id="img"
                crossOrigin="anonymous"
                crossorigin
                src="https://i.imgur.com/JlUvsxa.jpg"
                width="227"
                height="227"
                @load="onImageLoaded"
            />
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
            link="https://codelabs.developers.google.com/codelabs/tensorflowjs-teachablemachine-codelab/index.html?index=..%2F..index#0"
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
    import * as mobilenet from '@tensorflow-models/mobilenet';

    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({ name: 'ImageClassificationWebCam', components: { MSampleLink } })
    export default class ImageClassificationWebCam extends Vue {
        private readonly logger = LoggerFactory.getLogger('ml.udemy.ImageClassificationWebCam');

        // @Prop({ default: false })
        // private myProp: boolean = false;

        private net!: MobileNet;

        private classifications: (Classification | void)[] = [];

        private get image(): HTMLImageElement | never {
            const element = this.$el.querySelector<HTMLImageElement>('#img');
            if (!element) {
                throw new Error('Could not find image');
            }
            return element;
        }

        private onImageLoaded(): void {
            this.logger.info('Image loaded!');
            this.classify();
        }

        private async classify(): Promise<void> {
            const start = Date.now();
            this.logger.info(`Start to classify...`);
            const result = await this.net?.classify(this.image);
            this.classifications = result?.map((value) => {
                return {
                    className: value.className,
                    probability: value.probability,
                };
            });
            this.logger.info(`Classified! (${Date.now() - start}ms)`);

            // this.logger.info('Classificatin', result);
        }

        // - LiveCycle-Hooks -----------------------------------------------------------------------
        private async mounted(): Promise<void> {
            this.logger.debug('Loading model...');
            this.net = await mobilenet.load();

            this.classify();

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
