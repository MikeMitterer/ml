import Vue from 'vue';
import Router from 'vue-router';
import Dashboad from './pages/Dashboard.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Dashboad,
        },
        {
            path: '/perceptron',
            name: 'perceptron',
            component: (): Promise<typeof import('*.vue')> =>
                import(/* webpackChunkName: "about" */ './pages/sub/PerceptronPage.vue'),
        },
        {
            path: '/imgclassification',
            name: 'imgclassification',
            component: (): Promise<typeof import('*.vue')> =>
                import(/* webpackChunkName: "about" */ './pages/sub/ImageClassificationPage.vue'),
        },
        {
            path: '/imgclassificationwebcam',
            name: 'imgclassificationwebcam',
            component: (): Promise<typeof import('*.vue')> =>
                import(/* webpackChunkName: "about" */ './pages/sub/ImageClassificationWebCam.vue'),
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
