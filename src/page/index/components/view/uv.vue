<template>
    <div id="day">
        <h2>UV 数据</h2>
        <p>本页面数据来源是登录页。显示数据包括：</p>
        <p>UV：相同用户单日登录大于等于 1 次，则计为 1</p>
        <p>UserAgent：按 userAgent 分类，显示每类有多少用户登录。特殊说明：一个用户登录 2 次用不同 userAgent，则这 2 次都会被列入不同的分类里计算</p>
        <p>登录状态：根据用户登录状态不同，包括登录成功、失败、服务器错误等。分别显示每种状态有多少人次（一个用户登录成功 2 次，则成功会被记为 2 次）</p>
        <div class="row-standard">
            浏览类型：
            <el-select v-model="searchType" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
            </el-select>
        </div>
        <UvByDay v-if="searchType==='day'"/>
    </div>
</template>

<script>
    import UvByDay from './uv_by_day';

    export default {
        name: 'PV',
        data () {
            return {
                options: [
                    {
                        label: '单月查看',
                        value: 'month'
                    },
                    {
                        label: '单周查看',
                        value: 'week'
                    },
                    {
                        label: '单日查看',
                        value: 'day'
                    },
                ],
                searchType: 'day'
            };
        },
        components: {
            UvByDay
        }
    };
</script>

<style scoped lang="less">
@import '~common/less/config.less';

#day {
    position: relative;
    width: 100%;
    height: 100%;
    //overflow-x: hidden;
    //overflow-y: auto;
}
</style>
