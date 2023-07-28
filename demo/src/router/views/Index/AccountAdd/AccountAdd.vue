<script setup lang="ts">
import AccountAddForm from "@/components/AccountAddForm/AccountAddForm.vue";
</script>

<template>
  <div id="AccountAdd">
    <div class="addClass">
      <p class="title">添加账号</p>
    </div>
    <AccountAddForm></AccountAddForm>
  </div>
</template>

<style scoped lang="scss">
#AccountAdd {
  width: 98%;
  margin: 1%;
  height: 88vh;
  background-color: #fff;

  .addClass {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
    padding: 10px 0;
    line-height: 40px;
    border-bottom: 1px solid #ccc;

    .title {
      margin: 20px 0 20px 20px;
    }
  }
}
</style>