<template>
    <div id="day">
        <h2>PV 数据</h2>
        <p>本页面根据工作台的跳转数据，显示这些页面来源于哪些页面，以及这些页面跳转去的页面，他们分别访问量是多少。</p>
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
        <PvByDay v-if="searchType==='day'"/>
    </div>
</template>

<script>
    import PvByDay from './pv_by_day';

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
            PvByDay
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
