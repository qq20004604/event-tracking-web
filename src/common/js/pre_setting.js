/**
 * Created by 王冬 on 2021/1/13.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import Vue from 'vue';
import forDevelopment from 'plugin/for_development';
import Element from 'element-ui';
import http from '@/api/ajax.js';
import URL from 'plugin/URL';
import DateFormat from 'plugin/date_format';
import 'element-ui/lib/theme-chalk/index.css';

const isProd = process.env.NODE_ENV !== 'development';

const CommonUtils = {
    init () {
        Vue.use(Element);
        Vue.use(http);
        Vue.use(URL);
        Vue.use(DateFormat);
        Vue.config.productionTip = !isProd;
        // todo 以后以下这些也归属到开发模式下用
        Vue.use(forDevelopment);

        if (!document.getElementById('app')) {
            const DOM = document.createElement('div');
            DOM.id = 'app';
            document.body.append(DOM);
            const title = document.createElement('title');
            document.head.append(title);
        }
    },
    setTitle (title) {
        const titleDOM = document.getElementsByTagName('title');
        if (titleDOM.length > 0) {
            titleDOM[0].innerText = title;
        }
    }
};

export default CommonUtils;
