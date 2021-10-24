<template>
    <div id="app">
        <el-menu id="nav"
                 :default-active="defaultHash"
                 :collapse-transition="false"
                 class="el-menu-vertical-demo"
                 @select="selectMenu">
            <el-menu-item-group>
                <template slot="title">埋点系统 v1.0.0</template>
                <el-menu-item index="/install">安装</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
                <template slot="title">数据导览</template>
                <el-menu-item index="/view/pv">PV 数据</el-menu-item>
                <el-menu-item index="/view/uv">UV 数据</el-menu-item>
                <!--                <el-menu-item index="/demo/Status">表单的三态</el-menu-item>-->
                <!--                <el-menu-item index="/demo/Often">常见配置</el-menu-item>-->
                <!--                <el-menu-item index="/demo/FastCreate">快捷创建表单 FastCreate</el-menu-item>-->
            </el-menu-item-group>
        </el-menu>
        <div id="main">
            <router-view/>
        </div>
    </div>
</template>
<script>
    export default {
        created () {
            this.defaultHash = window.location.pathname;
        },
        name: 'Main',
        data () {
            return {
                defaultHash: ''
            };
        },
        methods: {
            selectMenu (i) {
                this.$router.push(i);
            }
        }
    };
</script>
<style lang="less">
@import '~common/css/reset.css';
@import '~common/less/common.less';

html, body {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
    margin: 0;
    padding: 0;
}

h2 {
    font-weight: 400;
    color: #1f2f3d;
    font-size: 28px;
    height: 40px;
    line-height: 40px;
}

h3 {
    margin: 55px 0 20px;
    font-weight: 400;
    color: #1f2f3d;
    font-size: 22px;
    height: 30px;
    line-height: 30px;
}

p {
    font-size: 14px;
    color: #5e6d82;
    line-height: 20px;
    margin: 14px 0;
}

code {
    background-color: #fafafa;
    border: 1px solid #ebebeb;
    padding: 0 5px;
    border-radius: 3px;
}

.pro-code {
    display: inline-block;
    width: 100%;
    padding: 10px;
    color: #333;
    font-family: Menlo;
}


#app {
    position: relative;
    width: 100%;
    height: 100%;

    #nav {
        position: absolute;
        top: 0;
        left: 0;
        width: 300px;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #main {
        position: absolute;
        top: 0;
        left: 300px;
        right: 0;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 40px 20px;
    }
}
</style>
