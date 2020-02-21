<template>
    <v-container fluid d-flex class="pr-0">
        <!--<router-link to="/">Home</router-link>-->
        <!--<router-link to="/about">About</router-link>-->
<!--        <v-toolbar-items>-->
<!--            <v-btn text to="/" :ripple="false">Link 1</v-btn>-->
<!--            <v-btn text :ripple="false">Link 3</v-btn>-->
<!--        </v-toolbar-items>-->

        <div class="flex-grow-1"></div>

        <v-toolbar-items>
            <v-btn text to="/about" :ripple="false">About</v-btn>
       </v-toolbar-items>

        <v-menu left bottom class="ml-3">
            <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </template>

            <v-list>
                <v-list-item v-for="n in 5" :key="n" @click="() => {}">
                    <v-list-item-title>Option {{ n }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import lambi from '../assets/images/lambi.png';
import counter from '../store/modules/CounterModule';

@Component
export default class AppHeader extends Vue {
    @Prop() private msg!: string;

    get img(): string {
        return lambi;
    }

    public get counter(): number {
        return Math.min(500, Math.max(110, counter.count));
    }
    
}
</script>

<style scoped lang="scss">
.v-btn--active.v-btn {
    color: red;
}

.v-btn:before {
    background-color: transparent;
}
</style>
