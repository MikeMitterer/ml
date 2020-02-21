import Vue from 'vue';
import Router from 'vue-router';
import HomePage from './pages/HomePage.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },
        {
            path: '/perceptron',
            name: 'perceptron',
            component: (): Promise<typeof import('*.vue')> =>
                import(/* webpackChunkName: "about" */ './pages/PerceptronPage.vue'),
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: (): Promise<typeof import('*.vue')> =>
                import(/* webpackChunkName: "about" */ './pages/AboutPage.vue'),
        },
    ],
});
