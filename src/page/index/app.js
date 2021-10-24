/**
 * Created by 王冬 on 2019-09-05.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 * 工作台首页
 */
import Vue from 'vue';
import App from './App.vue';
import CommonUtils from '@/common/js/pre_setting.js';
import router from './router';
import store from './store';

CommonUtils.init();
CommonUtils.setTitle('我的工作台');
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
});
