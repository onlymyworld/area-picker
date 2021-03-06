// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import vueBeauty from 'vue-beauty';
import App from './App';

import 'vue-beauty/package/style/vue-beauty.min.css';

Vue.config.productionTip = false;

Vue.use(vueBeauty);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
});
