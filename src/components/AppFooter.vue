<template>
    <v-footer fixed dark>
        <v-row class="mb-6" no-gutters>
            <v-col>
                <span>{{ title }} </span>
            </v-col>
            <v-col class="version_block align-end">
                <span class="version">Version {{ version }}</span>
                <span class="separator mx-1">/</span>
                <span class="published">{{ published }}</span>
            </v-col>
        </v-row>
        <!--        <div>-->
        <!--        </div>-->
        <!--        <div>-->
        <!--            <div class="version_block">-->
        <!--            </div>-->
        <!--            <span v-if="devmode" class="devmode">DevMode</span>-->
        <!--            <span v-if="!devmode" class="production">Production</span>-->
        <!--        </div>-->
    </v-footer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CounterModule from '../store/modules/CounterModule';

@Component
export default class AppFooter extends Vue {

    private get title(): string {
        return process.env.VUE_APP_TITLE ?? '<process.env.VUE_APP_TITLE = undefined>';
    }

    public get published(): string {
        return process.env.VUE_APP_PUBLISHED ?? '<process.env.VUE_APP_PUBLISHED = undefined>';
    }

    public get version(): string {
        return process.env.VUE_APP_VERSION ?? '<process.env.VUE_APP_VERSION = undefined>';
    }

    public get devmode(): boolean {
        const devMode =
            process.env.VUE_APP_DEV_MODE ?? '<process.env.VUE_APP_DEV_MODE = undefined>';

        return devMode === 'true';
    }
}
</script>

<style scoped lang="scss">
.v-footer--absolute,
.v-footer--fixed {
    z-index: 4;

    .row {
        margin: 0 !important;
        padding: 0;
    }

    .col {
        background-color: inherit;
    }

    .version_block {
        text-align: right;
        font-size: 90%;
    }
}
</style>
