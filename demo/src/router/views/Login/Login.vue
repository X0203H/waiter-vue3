<script setup lang="ts">
import {reactive} from 'vue';
import {post} from "@/utils/api.ts";
import {message} from "ant-design-vue";
import router from "@/router";

interface FormState {
  username: string;
  password: string;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
});
const ToIndex = () => {
  if (formState.username === '' && formState.password === '') return message.warning('请输入账号与密码')
  post('/users/checkLogin', {
    account: formState.username,
    password: formState.password,
  }).then((res: any) => {
    console.log(res)
    if (res.code === 0) {
      localStorage.setItem('token', res.token)
      message.success(res.msg)
      setTimeout(() => {
        router.push('/index/home')
      }, 1500)
      let UserMsg: any = {
        account: formState.username,
        password: formState.password
      }
      localStorage.setItem('DXEUser', JSON.stringify(UserMsg))
    } else if (res.code === 1) {
      message.error(res.msg)
    }
  })
}
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<template>
  <transition name="login" appear>
    <div id="Login">
      <div class="content">
        <h2>系统登录</h2>
        <a-form
            :model="formState"
            name="basic"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
        >
          <a-form-item
              label=""
              name="username"
              :rules="[{ required: true, message: 'Please input your username!' }]"
          >
            <a-input v-model:value.trim="formState.username"/>
          </a-form-item>
          <a-form-item
              label=""
              name="password"
              :rules="[{ required: true, message: 'Please input your password!' }]"
          >
            <a-input-password v-model:value.trim="formState.password"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" html-type="submit" @click="ToIndex">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@keyframes loginShow {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.login-enter-active {
  animation: loginShow 1s;
}

.login-leave-active {
  animation: loginShow 1s reverse;
}

::v-deep(.ant-input),
::v-deep(.ant-input-password) {
  width: 400px;
}

::v-deep(.ant-btn) {
  width: 400px;
}

::v-deep(.ant-col) {
  margin: 0;
}

#Login {
  position: relative;
  width: 100%;
  height: 100vh;
  //background-color: red;
  background: url("/image/bg.png") 100% center;

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 300px;
    transform: translate(-50%, -50%);

    h2 {
      text-align: center;
      color: #fff;
    }
  }
}
</style>