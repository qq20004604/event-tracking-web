<template>
    <div class="pv-children">
        <div class="row-standard">
            待开发
        </div>
        <!--        <div class="pv-day-box" ref="fromBox"></div>-->
        <div class="pv-day-box" ref="toBox"></div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';

    export default {
        name: 'PvByMonth',
        data () {
            return {
                date: '',
            };
        },

        mounted () {
            this.date = this.$day().format('YYYY-MM-DD');
        },
        methods: {
            submit () {
                this.$ajax.visitPvDay({date: this.date}).then(res => {
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
                // 先根据 data 计算出 from 和 to 有哪些，分别数值是多少
                const fromData = {};
                const toData = {};
                data.forEach(item => {
                    const {from, page} = item;
                    if (fromData[from]) {
                        fromData[from] += item.count;
                    } else {
                        fromData[from] = item.count;
                    }
                    if (toData[page]) {
                        toData[page] += item.count;
                    } else {
                        toData[page] = item.count;
                    }
                });

                console.log(fromData);
                // const fromKeys = Object.keys(fromData);
                // const fromDom = this.$refs.fromBox;
                // const fromChart = echarts.init(fromDom);
                // const fromOption = this.getOptions(fromKeys, fromData, 'PV 来源页');
                // fromChart.setOption(fromOption);

                const toKeys = Object.keys(toData);
                const toDom = this.$refs.toBox;
                const toChart = echarts.init(toDom);
                const toOption = this.getOptions(toKeys, toData, 'PV 去向页');
                toChart.setOption(toOption);

            },
            getOptions (keys, data, title) {
                const totalVisit = keys.map(key => data[key]).reduce((a, b) => a + b);
                const o = {
                    title: {
                        text: `${title}（总访问量：${totalVisit}）`
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

.pv-day-box {
    position: relative;
    width: 100%;
    height: 400px;
    margin-top: 20px;
}
</style>
