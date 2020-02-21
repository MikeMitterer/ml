<template>
    <div class="home">
        <div>
            <router-link to="/perceptron">
                Perceptron
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { Component, Vue } from 'vue-property-decorator';
import counter from '../store/modules/CounterModule';

@Component({
    components: {
        HelloWorld,
    },
})
export default class HomePage extends Vue {


}
</script>
<style scoped lang="scss">
    .home {
        width: 100vw;
        display: grid;
        grid-gap: 10px;

        grid-template-columns: 250px;
        grid-template-rows: 150px;

        > * {
            background-color: orange;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            align-content: space-evenly; // ||

            line-height: 30px;

            a {
                text-decoration: none;
            }
        }

    }
</style>
