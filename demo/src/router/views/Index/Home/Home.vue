<script setup lang="ts">
import {useCounter} from '@/store/index.ts'
import {storeToRefs} from "pinia";
import Broken from "@/components/Echarts/Broken.vue";

const store = useCounter()
const {echData} = storeToRefs(store)
store.echFun()
</script>

<template>
  <transition name="backstage" appear>
    <div id="BackstAge">
      <ul class="list">
        <li>
          <img src="/image/icon01.png" alt="图片加载错误">
          <p>总订单<span>{{ echData.todayOrder }}</span></p>
        </li>
        <li>
          <img src="/image/icon02.png" alt="图片加载错误">
          <p>总销售额<span>{{ echData.totalAmount }}</span></p>
        </li>
        <li>
          <img src="/image/icon03.png" alt="图片加载错误">
          <p>今日订单数<span>{{ echData.totalOrder }}</span></p>
        </li>
        <li>
          <img src="/image/icon02.png" alt="图片加载错误">
          <p>今日销售额<span>{{ echData.totayAmount }}</span></p>
        </li>
      </ul>
      <div id="echarts">
        <Broken></Broken>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
@keyframes backstage {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.backstage-enter-active {
  animation: backstage 1s
}

.backstage-leave-active {
  animation: backstage .5s reverse;
}

#BackstAge {
  width: 98%;
  margin: 1%;
  height: 88vh;

  .list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    li {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      width: 350px;
      height: 100px;
      background-color: #fff;

      img {
        width: 60px;
        height: 65px;
      }

      p {
        display: flex;
        flex-direction: column;
        width: 100px;
        height: 55px;
        color: #ccc;
        text-align: center;
        font-weight: bold;
        font-size: 20px;

        span {
          color: black;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }

  #echarts {
    margin: 1% 0;
    background-color: #fff;
  }
}
</style>