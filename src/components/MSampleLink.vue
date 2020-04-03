<template>
    <div class="m-sample-link body-2 blue-grey--text lighten-4">
        <label for="name">Code/Sample-Base:</label>
        <span id="name" class="font-weight-bold">{{ name }}</span>
        <label for="link">Link(s):</label>
        <div id="link">
            <a
                v-for="link in links"
                :key="link"
                class="link blue-grey--text lighten-4"
                :href="link"
                target="_blank"
            >
                {{ link }}
            </a>
        </div>

        <label v-if="github !== ''" for="github">GitHub:</label>
        <a
            v-if="github !== ''"
            id="github"
            class="blue-grey--text lighten-4"
            :href="link"
            target="_blank"
        >
            {{ github }}
        </a>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({ name: 'MSampleLink', components: {} })
    export default class MSampleLink extends Vue {
        // private readonly logger = LoggerFactory.getLogger('<package>.SampleLink');

        @Prop({ default: '' })
        private name!: string;

        @Prop({ default: '' })
        private link!: string | string[];

        @Prop({ default: '' })
        private github!: string;

        private get links(): string[] {
            if (Array.isArray(this.link)) {
                return this.link;
            } else {
                return [this.link];
            }
        }
        // - LiveCycle-Hooks -----------------------------------------------------------------------

        // private async mounted(): Promise<void> {
        // }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    // @import "./samplelink";

    .m-sample-link {
        position: absolute;
        right: 20px;
        bottom: 0;

        display: grid;
        grid-column-gap: 5px;
        grid-template-columns: auto 300px;

        font-size: 70% !important;
        line-height: 140%;

        label {
            text-align: right;
        }

        a {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-decoration: none;
        }
    }
</style>
