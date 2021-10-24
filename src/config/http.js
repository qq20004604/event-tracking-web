/**
 * Created by 王冬 on 2019/5/23.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import axios from 'axios';
import {Message} from 'element-ui';
import Router from '../page/index/router';
// 是否启用使用form表单形式提交数据，默认不启用
const USE_FORM = false;

// api请求基路径
let baseURL;

if (process.env.NODE_ENV === 'development') { // 开发环境
    baseURL = '/api';
} else { // 生产环境
    baseURL = '/api';
}

axios.defaults.baseURL = baseURL;
// 使用form-data形式提交数据
if (USE_FORM) {
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.headers.post['Accept'] = 'application/x-www-form-urlencoded';
    axios.defaults.headers.get['Accept'] = 'application/x-www-form-urlencoded';

    axios.defaults.transformRequest = [
        function (data) {
            let ret = '';
            for (const it in data) {
                ret += encodeURIComponent(it) + '=' +
                    encodeURIComponent(data[it]) + '&';
            }
            ret = ret.slice(0, -1);
            return ret;
        } ];
}

// http request 拦截器
axios.interceptors.request.use(
    config => {
        let token = sessionStorage.getItem('wti-manager-token');
        token = token ? '' + token : '';
        config.headers.Authorization = token;
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

window.r = Router;

// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.code === 401) {
            const elementMessage = Message;
            elementMessage({
                message: '登陆认证已过期,请重新登陆！',
                type: 'warning',
            });
            Router.push({name: 'Login'});
        }
        return response.data;
    },
    error => {
        // 对响应错误做点什么

        window.top.postMessage(
            {
                message: '您的网络连接失败，请稍后再试',
                type: 'warning',
                wti_type: 'message'
            },
            '*'
        );
        return Promise.reject(error.response.data);
    }
);

const post = (url, data) => {
    return axios({
        method: 'post',
        url,
        data
    });
};

const get = (url, params) => {
    return axios({
        method: 'get',
        url,
        params
    });
};

export {post, get, baseURL};
