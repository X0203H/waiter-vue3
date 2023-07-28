<script setup lang="ts">
import {reactive, ref, toRaw} from 'vue';
import type {UnwrapRef} from 'vue';
import type {Rule} from 'ant-design-vue/es/form';
//@ts-ignore
import {get, post} from "@/utils/api.ts";
import {message} from "ant-design-vue";
//@ts-ignore
import router from "@/router";

interface FormState {
  name: string;
  pwd: string,
  verifyPwd: string
}

const formRef = ref();
const labelCol = {span: 5};
const wrapperCol = {span: 13};
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  pwd: '',
  verifyPwd: ''
});
const rules: Record<string, Rule[]> = {
  name: [
    {required: true, message: 'Please input Activity name', trigger: 'change'},
    {min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur'},
  ],
  pwd: [
    {required: true, message: 'Please input Activity password', trigger: 'change'},
    {min: 6, max: 18, message: 'Length should be 6 to 18', trigger: 'blur'},
  ],
  verifyPwd: [
    {required: true, message: 'Please confirm the password', trigger: 'change'},
    {min: 6, max: 18, message: 'Length should be 6 to 18', trigger: 'blur'},
  ],
};
const onSubmit = () => {
  formRef.value
      .validate()
      .then(() => {
        console.log('values', formState, toRaw(formState));
        post('/users/editpwd', {
          newPwd: formState.verifyPwd
        }).then((res: any) => {
          console.log(res)
          let CurrentUser = JSON.parse(localStorage.getItem('DXEUser'))
          if (res.code === 0) {
            if (formState.name === CurrentUser.account) {
              message.warning('为当前账号，需要退出重新登录')
              router.push('/login')
              localStorage.removeItem('token')
              localStorage.removeItem('DXEUser')
            } else {
              message.success('修改成功！')
            }
          } else {
            message.error(res.msg)
          }
        })
      })
      .catch((error: any) => {
        console.log('error', error);
      });
};
const resetForm = () => {
  formRef.value.resetFields();
};
// 判断旧密码是否正确
const IfPwd = () => {
  get('/users/checkoldpwd', {
    oldPwd: formState.pwd
  }).then((res: any) => {
    // console.log(res)
    if (res.code === '00') {
      message.success(res.msg)
    } else {
      message.error(res.msg)
    }
  })
}
</script>

<template>
  <div id="ChangePwd">
    <div class="addClass">
      <p class="title">修改密码</p>
    </div>
    <a-form
        style="margin-top: 20px"
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
    >
      <a-form-item ref="name" label="账号" name="name">
        <a-input v-model:value="formState.name"/>
      </a-form-item>
      <a-form-item ref="pwd" label="密码" name="pwd">
        <a-input-password @blur="IfPwd" v-model:value="formState.pwd" placeholder="请输入旧密码"/>
      </a-form-item>
      <a-form-item ref="verifyPwd" label="新密码" name="verifyPwd">
        <a-input-password v-model:value="formState.verifyPwd" placeholder="请确认新密码"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">修改</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="scss">
#ChangePwd {
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
    line-height: 40px;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;

    .title {
      margin: 20px 0 20px 20px;
    }
  }
}
</style>