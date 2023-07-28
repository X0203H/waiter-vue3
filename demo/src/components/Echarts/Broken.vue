<template>
  <div id="Broken" style="width: 100%;height: 50vh;margin: 0 1%;padding: 1% 0"></div>
</template>

<script setup lang="ts">
import {getCurrentInstance, onMounted} from "vue";
// @ts-ignore
import {useCounter} from "@/store";
// import {storeToRefs} from "pinia";

const store = useCounter()
// const {echData} = storeToRefs(store)

let internalInstance = getCurrentInstance();
let echarts = internalInstance.appContext.config.globalProperties.$echarts;

const broken = () => {
  const dom = document.getElementById('Broken')
  const myChart = echarts.init(dom)
  const option = {
    title: {
      text: '数据统计',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['订单', '销售额', '注册人数', '管理员人数'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: store.echData.xData,
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
      },
    },
    series: [
      {
        name: '订单',
        type: 'line',
        stack: 'Total',
        data: store.echData.amountData,
        color: '#c53e3a',
      },
      {
        name: '注册人数',
        type: 'line',
        stack: 'Total',
        data: store.echData.orderData,
        color: '#6aa6ad',
      },
      {
        name: '管理员人数',
        type: 'line',
        stack: 'Total',
        data: store.echData.amountData,
        color: '#d48265',
      },
      {
        name: '销售额',
        type: 'line',
        stack: 'Total',
        data: store.echData.orderData,
        color: '#394e5c',
      },
    ],
  };
  myChart.setOption(option);
  // 响应宽度
  window.addEventListener("resize", function () {
    //图表尺寸自适应
    myChart.resize();
  });
}
onMounted(() => {
  broken()
})
</script>
