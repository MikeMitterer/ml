<template>
    <div class="dashboard">
        <h2>Samples</h2>
        <div class="home">
            <div class="menu-item pa-3 mr-2" v-for="link in links" :key="link.text">
                <router-link :to="link.route">
                    <v-icon>mdi-{{ link.icon }}</v-icon>
                    {{ link.text }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import HelloWorld from '@/components/HelloWorld.vue';
    import { Link } from '@/model/interfaces/Link'; // @ is an alias to /src
    import { Component, Vue } from 'vue-property-decorator';
    import counter from '../store/modules/CounterModule';

    @Component({
        components: {
            HelloWorld,
        },
    })
    export default class HomePage extends Vue {
        /**
         * Mehr:
         *      https://materialdesignicons.com/
         */
        private links: Link[] = [
            { icon: 'video-input-component', text: 'Perceptron', route: '/perceptron' },
            { icon: 'folder-image', text: 'Image Classification', route: '/imgclassification' },
            {
                icon: 'folder-image',
                text: 'IMG Classification WebCam',
                route: '/imgclassificationwebcam',
            },
        ];
    }
</script>
<style scoped lang="scss">
    .home {
        width: 100vw;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start; // ↓
        align-content: space-between; // =
        align-items: flex-start; // ⇾

        /*display: grid;*/
        /*grid-gap: 10px;*/

        /*grid-template-columns: 1fr 1fr 1fr 1fr;*/
        /*grid-template-rows: 80px;*/

        > .menu-item {
            width: 250px;
            background-color: orange;
            color: white;

            > a {
                color: white;
            }

            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            align-content: space-evenly; // ||

            line-height: 30px;
            border-radius: 4px;

            a {
                text-decoration: none;
            }
        }
    }
</style>
