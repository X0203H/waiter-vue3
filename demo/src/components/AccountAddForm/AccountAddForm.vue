<script setup lang="ts">
import {reactive, ref, toRaw} from 'vue';
import type {UnwrapRef} from 'vue';
import type {Rule} from 'ant-design-vue/es/form';
//@ts-ignore
import {post} from "@/utils/api.ts";
import {message} from "ant-design-vue";

interface FormState {
  name: string;
  pwd: string,
  UserGroup: string | undefined
}

const formRef = ref();
const labelCol = {span: 5};
const wrapperCol = {span: 13};
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  pwd: '',
  UserGroup: ''
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
  UserGroup: [{required: true, message: 'Please select Activity zone', trigger: 'change'}],
};
const onSubmit = () => {
  formRef.value
      .validate()
      .then(() => {
        console.log('values', formState, toRaw(formState));
        post('/users/add', {
          account: formState.name,
          password: formState.pwd,
          userGroup: formState.UserGroup
        }).then((res: any) => {
          if (res.code === 0) {
            message.success(res.msg)
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
</script>

<template>
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
      <a-input-password v-model:value="formState.pwd" placeholder="请输入密码"/>
    </a-form-item>
    <a-form-item label="用户组" name="UserGroup">
      <a-select v-model:value="formState.UserGroup" placeholder="please select your zone">
        <a-select-option value="超级管理员">超级管理员</a-select-option>
        <a-select-option value="普通管理员">普通管理员</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">添加</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped lang="scss">

</style>