<template>
    <div class="formitem-box">
        <h2>安装</h2>
        <p>分为前端部分和后端部分。</p>
        <p>前端提供 github 地址直接打包使用</p>
        <p>后端提供 docker 安装方法</p>

        <p>具体安装方法：待补充</p>
    </div>
</template>

<script>
    export default {
        name: 'Install',
        data () {
            return {
                demoCode: ''
            };
        },
        methods: {},
    };
</script>

<style scoped lang="less">
@import '~common/less/config.less';

.formitem-box {
    position: relative;
    width: 100%;

    .submit-line {
        margin: 10px 0;

        .tips {
            margin-left: 24px;
            font-size: 10px;
        }
    }


    .collapse {
        position: relative;
        width: 600px;
    }

    .code {
        white-space: pre;
        background: #fafafa;
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 10px;
    }

    .demo-code {
        width: 100%;
        padding: 10px;
        width: 100%;
        display: inline-block;
        line-height: 22px;
    }
}
</style>
