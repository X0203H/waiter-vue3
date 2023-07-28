<template>
  <div id="Nav">
    <div class="title">
      <img src="/image/logo.png" alt="logo"/>
      <span>外卖商家中心</span>
    </div>
    <a-menu
        v-model:selectedKeys="state.selectedKeys"
        style="width: 256px"
        mode="inline"
        :open-keys="state.openKeys"
        :items="items"
        @openChange="onOpenChange"
        @click="ToPath"
    ></a-menu>
  </div>
</template>

<script setup lang="ts">
import {VueElement, h, reactive} from 'vue';
import {MailOutlined, AppstoreOutlined, SettingOutlined} from '@ant-design/icons-vue';
import {ItemType} from 'ant-design-vue';
import {useRoute} from "vue-router";
import router from "@/router";

const route = useRoute()
// console.log(route)
const current = [`${route.path}`]

// console.log(current)

function getItem(
    label: VueElement | string,
    key: string,
    icon?: any,
    children?: ItemType[],
    type?: 'group',
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}

const ToPath = (item: any) => {
  console.log(item)
  router.push(item.key)
}

const items: ItemType[] = reactive([
  getItem('后台首页', '/index/home', () => h(MailOutlined)),
  getItem('订单管理', '/index/order', () => h(AppstoreOutlined)),
  getItem('商品管理', 'sub4', () => h(SettingOutlined), [
    getItem('商品列表', '/index/commodityList'),
    getItem('商品添加', '/index/commodityAdd'),
    getItem('商品分类', '/index/commodityClassification')
  ]),
  getItem('店铺管理', '/index/storemanagement', () => h(AppstoreOutlined)),
  getItem('账号管理', 'sub5', () => h(SettingOutlined), [
    getItem('账号列表', '/index/accountList'),
    getItem('添加账号', '/index/accountAdd'),
    getItem('修改密码', '/index/changePassword')
  ]),
  getItem('销售统计', 'sub6', () => h(SettingOutlined), [
    getItem('商品统计', '/index/commodityStatistics'),
    getItem('订单统计', '/index/orderStatistics')
  ]),
]);
const state = reactive({
  rootSubmenuKeys: ['/index/home', '/index/order', 'sub4'],
  openKeys: [`${current}`],
  selectedKeys: [`${current}`],
});
const onOpenChange = (openKeys: string[]) => {
  const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1);
  if (state.rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
    state.openKeys = openKeys;
  } else {
    state.openKeys = latestOpenKey ? [latestOpenKey] : [];
  }
};
</script>

<style lang="scss" scoped>
::v-deep(.ant-menu) {
  width: 240px !important;
  background-color: #304156;
  color: #fff;
}

::v-deep(.ant-menu-submenu-active),
::v-deep(.ant-menu-submenu-selected),
::v-deep(.ant-menu-item-selected),
::v-deep(.ant-menu-light .ant-menu-submenu-selected > .ant-menu-submenu-title) {
  color: gold !important;
}

::v-deep(.ant-menu-item-selected) {
  //background: none;
  color: black !important;
}

::v-deep(.ant-menu-item-active) {
  color: gold !important;
}

#Nav {
  width: 240px;
  height: 100vh;
  background-color: #304156;
  // 标题
  .title {
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;

    img {
      width: 40px;
      height: 40px;
      margin-left: 10px;
    }

    span {
      font-size: 20px;
      color: #fff;
      margin-left: 10px;
    }
  }
}
</style>
