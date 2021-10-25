<template>
    <div class="pv-children">
        <div class="row-standard">
            选择日期：
            <el-date-picker
                v-model="date"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"/>

            <el-button @click="submit" type="primary">查看</el-button>
        </div>
        <div class="row-standard" v-show="uv!==''">
            本日 UV：{{ uv }}
        </div>
        <div class="ref-box" ref="agent"></div>
        <div class="ref-box" ref="env"></div>
        <div class="ref-box" ref="status"></div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';

    export default {
        name: 'UvByDay',
        data () {
            return {
                date: '',

                uv: ''
            };
        },

        mounted () {
            this.date = this.$day().format('YYYY-MM-DD');
        },
        methods: {
            submit () {
                this.$ajax.visitUVDay({date: this.date}).then(res => {
                    console.log(res);
                    if (res.code === 200) {
                        this.init(res.data);
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(e => {
                    console.error(e);
                    this.$message.error('服务器错误');
                });
            },
            // 图标生成
            // 生成 2 个图表，一个是页面来源，一个是页面去向
            init (data) {
                // 赋值 uv
                this.uv = data.uv;
                const agentKeyList = Object.keys(data.agent);
                const agentData = data.agent;
                const agentDom = this.$refs.agent;
                const agentChart = echarts.init(agentDom);
                const agentOption = this.getOptions(agentKeyList, agentData, '用户浏览器');
                agentChart.setOption(agentOption);

                const envKeyList = Object.keys(data.env);
                const envData = data.env;
                const envDom = this.$refs.env;
                const envChart = echarts.init(envDom);
                const envOption = this.getOptions(envKeyList, envData, '数据环境');
                envChart.setOption(envOption);

                const statusKeyList = Object.keys(data.status);
                const statusData = data.status;
                const statusDom = this.$refs.status;
                const statusChart = echarts.init(statusDom);
                const statusOption = this.getOptions(statusKeyList, statusData, '访问状态');
                statusChart.setOption(statusOption);

            },
            getOptions (keys, data, title) {
                const o = {
                    title: {
                        text: `${title}`
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: keys
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: {
                        data: keys.map(key => data[key]),
                        type: 'bar',
                        barMaxWidth: '40',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        }
                    }
                };

                if (keys.length > 20) {
                    o.dataZoom = [
                        {
                            type: 'slider',
                            realtime: true,
                            start: 0,
                            end: 100,
                            // bottom: '-20px',
                            xAxisIndex: [ 0 ]
                        },
                    ];
                }
                return o;
            }
        }
    };
</script>

<style scoped lang="less">
@import '~common/less/config.less';

.ref-box {
    position: relative;
    width: 100%;
    height: 400px;
    margin-top: 20px;
}
</style>
