<template>
    <div class="about">
        <h1>About (me)</h1>
        <p>You can find all the necessary information on my website:
            <a href="https://www.mikemitterer.at/impressum/" target="_blank">www.MikeMitterer.at</a>
        </p>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import counter from '../store/modules/CounterModule';

@Component({ components: {} })
export default class AboutPage extends Vue {
    public get counter(): number {
        return counter.count;
    }

    public get published(): string {
        return process.env.VUE_APP_PUBLISHED || '<process.env.VUE_APP_PUBLISHED = undefined>';
    }
}
</script>
<style lang="scss"></style>
