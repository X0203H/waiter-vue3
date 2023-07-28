<script setup lang="ts">
import ComListTable from "@/components/ComListTable/ComListTable.vue";
</script>

<template>
  <div id="CommodityList">
    <p>商品列表</p>
    <ComListTable></ComListTable>
  </div>
</template>

<style scoped lang="scss">
#CommodityList {
  width: 98%;
  margin: 1%;
  height: 88vh;
  overflow-y: scroll;
  background-color: #fff;

  p {
    padding: 10px;
  }
}
</style>