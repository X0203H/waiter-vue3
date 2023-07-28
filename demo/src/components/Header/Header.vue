<template>
  <div id="Header">
    <a-breadcrumb style="margin-left: 10px">
      <a-breadcrumb-item v-for="(item,index) in breadList" :key="index">
        <router-link :to="item.path">{{ item.meta.title }}</router-link>
      </a-breadcrumb-item>
    </a-breadcrumb>
    <div class="userBox">
      <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent>
          欢迎您，{{ User.account }}
          <DownOutlined/>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="javascript:" @click="LogOut">退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <router-link to="/index/individualcenter"><img src="/image/user.png" alt="图片加载错误"></router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useRoute} from "vue-router";
import {DownOutlined} from '@ant-design/icons-vue';
import router from "@/router";
import {message} from "ant-design-vue";

const route = useRoute();
const breadList = computed(() => {
  return route.matched;
});
let User = JSON.parse(localStorage.getItem('DXEUser'))
const LogOut = () => {
  message.success('已退出')
  localStorage.removeItem('token')
  localStorage.removeItem('DXEUser')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
#Header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: #fff;

  #BreadCrumbs {
    margin-left: 20px;
  }

  //用户信息
  .userBox {
    display: flex;
    align-items: center;
    height: 60px;
    margin-right: 20px;

    span {
      font-size: 16px;
      margin-right: 10px;
    }

    img {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
