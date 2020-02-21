import '@/assets/styles/main.scss';
import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader
import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.config.performance = process.env.NODE_ENV === 'development';

// Vue.use(Vuetify);

// create the app instance.
// here we inject the router, store and ssr context to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new Vue({
    router,
    store,
    vuetify,

    // tslint:disable-next-line:typedef
    render: (h) => h(App),
}).$mount('#app');



