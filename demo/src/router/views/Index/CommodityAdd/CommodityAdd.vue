<script setup lang="ts">
import {ref, reactive} from 'vue'
import {message} from "ant-design-vue";
// @ts-ignore
import {get, post} from '@/utils/api.ts'
import {PlusOutlined} from '@ant-design/icons-vue';

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};
const formState = reactive<Record<string, any>>({
  name: '',
  fl: '',
  num: '',
  imgUrl: '',
  desc: ''
});
const onFinish = (values: any) => {
  console.log('Success:', values);
  post('/goods/add', {
    name: formState.name,
    category: formState.fl,
    price: formState.num,
    imgUrl: formState.imgUrl,
    goodsDesc: formState.desc
  }).then((res: any) => {
    if (res.code === 0) {
      message.success(res.msg)
    } else {
      message.error(res.msg)
    }
  })
};
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};


// 上传
const imageUrl = ref<string>('');
/**
 * 图片转base64
 */
const getBase64 = (img: any, callback: (base64Url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

/**
 * 上传文件之前的钩子 （可以恒返回false 从而手动上传）
 * @param file 上传的文件
 * @returns 布尔值或者Promise对象 若返回 false 则停止上传
 */
let fileList: any = ref(null);
const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传图片文件!');
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('头像图片不能超过 2MB!');
  }

  // 用于选择图片文件后本地实时预览
  getBase64(file, (base64Url: string) => {
    imageUrl.value = base64Url;
  });

  fileList.value = [file];
  formState.imgUrl = fileList.value[0].name
  return true;
  // return isJpgOrPng && isLt2M;
};
</script>

<template>
  <div id="ComAdd">
    <p class="title">商品添加</p>
    <div class="content">
      <a-form
          :model="formState"
          name="validate_other"
          v-bind="formItemLayout"
          @finishFailed="onFinishFailed"
          @finish="onFinish"
      >
        <!--      has-feedback 对钩叉叉的属性-->
        <a-form-item has-feedback label="商品名称" name="name">
          <a-input v-model:value="formState.name" autocomplete="off"/>
        </a-form-item>
        <a-form-item
            name="fl"
            label="商品分类"
        >
          <a-select v-model:value="formState.fl" placeholder="请选择商品的分类">
            <a-select-option value="炒饭系列">炒饭系列</a-select-option>
            <a-select-option value="冒菜系列">冒菜系列</a-select-option>
            <a-select-option value="新品专享">新品专享</a-select-option>
            <a-select-option value="热销榜">热销榜</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="商品价格">
          <a-form-item name="input-number" no-style>
            <a-input-number v-model:value="formState.num" :min="10" :max="100"/>
          </a-form-item>
        </a-form-item>

        <a-form-item name="switch" label="商品图片">
          <a-upload
              v-model:file-list="fileList"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :maxCount="1"
              :show-upload-list="false"
              :before-upload="beforeUpload">
            <img
                v-if="imageUrl"
                :src="imageUrl"
                alt="avatar"/>
            <div v-else>
              <plus-outlined></plus-outlined>
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="商品描述" name="desc">
          <a-textarea v-model:value="formState.desc"/>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
          <a-button type="primary" html-type="submit">添加</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
#ComAdd {
  width: 98%;
  margin: 1%;
  height: 88vh;
  background-color: #fff;

  .title {
    padding: 20px 0 20px 20px;
    border-bottom: 1px solid #ccc;
  }

  .content {
    img {
      width: 100px;
      height: 100px;
    }
  }
}
</style>