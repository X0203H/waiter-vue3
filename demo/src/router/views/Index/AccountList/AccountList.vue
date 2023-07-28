<script setup lang="ts">
import AccountListTable from "@/components/AccountListTable/AccountListTable.vue";
</script>

<template>
  <div id="AccountList">
    <div class="addClass">
      <p class="title">账号列表</p>
    </div>
    <AccountListTable></AccountListTable>
  </div>
</template>

<style scoped lang="scss">
#AccountList {
  width: 98%;
  margin: 1%;
  height: 88vh;
  overflow-y: scroll;
  background-color: #fff;

  .addClass {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;

    .title {
      margin: 20px 0 20px 20px;
    }
  }
}
</style>