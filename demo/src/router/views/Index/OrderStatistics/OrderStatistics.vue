<script setup lang="ts">
import {getCurrentInstance, onMounted} from "vue";
import {ref} from 'vue';
import type {Dayjs} from 'dayjs';

type RangeValue = [Dayjs, Dayjs];
const value1 = ref<RangeValue>();
let internalInstance = getCurrentInstance();
let echarts = internalInstance.appContext.config.globalProperties.$echarts;
onMounted(() => {
  const dom = document.getElementById('OrderEcharts')
  const myChart = echarts.init(dom)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    legend: {
      data: ['蒸发量', '降水量', '平均温度'],
    },
    xAxis: [
      {
        type: 'category',
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '水量',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} ml',
        },
      },
      {
        type: 'value',
        name: '温度',
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: '{value} °C',
        },
      },
    ],
    series: [
      {
        name: '蒸发量',
        type: 'bar',
        tooltip: {
          valueFormatter(value) {
            return `${value} ml`;
          },
        },
        data: [
          2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
        ],
        color: '#c23531',
      },
      {
        name: '降水量',
        type: 'bar',
        tooltip: {
          valueFormatter(value) {
            return `${value} ml`;
          },
        },
        data: [
          2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3,
        ],
        color: '#2f4554',
      },
      {
        name: '平均温度',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter(value) {
            return `${value} °C`;
          },
        },
        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
        color: '#61a0a8',
      },
    ],
  };

  myChart.setOption(option);
  window.addEventListener("resize", function () {
    //图表尺寸自适应
    myChart.resize();
  });
})
</script>

<template>
  <div id="OrderStatistics">
    <div class="addClass">
      <div class="seclectTime">
        <span>时间范围</span>
        <a-range-picker style="margin: 0 10px" v-model:value="value1"/>
        <a-button type="primary">查询</a-button>
      </div>
    </div>
    <div id="OrderEcharts" style="width: 100%;height: 60vh"></div>
  </div>
</template>

<style scoped lang="scss">
#OrderStatistics {
  width: 98%;
  margin: 1%;
  //height: 88vh;
  .addClass {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
    padding: 10px 0;
    //border-bottom: 1px solid #ccc;
    .title {
      padding: 20px 0 20px 20px;
    }
  }

  #OrderEcharts {
    background-color: #fff;
    margin-top: 20px;
    padding: 10px;
  }
}
</style>