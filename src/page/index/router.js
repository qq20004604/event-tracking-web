import Vue from 'vue';
import Router from 'vue-router';
import Install from './components/common/install';
import PV from './components/view/pv';
import UV from './components/view/uv';

Vue.use(Router);

const router = new Router({
    // history 模式下， 后端配置参考 https://juejin.cn/post/6844903856359342087
    mode: 'history',
    routes: [
        {
            path: '/install',
            component: Install
        },
        {
            path: '/view/pv',
            component: PV
        },
        {
            path: '/view/uv',
            component: UV
        },
        {
            path: '*',
            redirect: '/install'
        },
    ]
});
export default router;

