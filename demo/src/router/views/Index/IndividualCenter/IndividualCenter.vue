<script setup lang="ts">
import {ref, reactive} from 'vue';
import type {UnwrapRef} from 'vue';
import {PlusOutlined} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';
//@ts-ignore
import {get} from '@/utils/api.ts'

interface FormState {
  id: string | number,
  account: string,
  ctime: string,
  userGroup: string,
  imgUrl: string,
}

let formState: UnwrapRef<FormState> = reactive({
  id: '',
  account: '',
  ctime: '',
  userGroup: '',
  imgUrl: '',
});
// 请求数据
get('/users/info', {}).then((res: any) => {
  console.log(res)
  formState.id = res.id
  formState.account = res.account
  formState.ctime = res.ctime
  formState.userGroup = res.userGroup
  formState.imgUrl = res.imgUrl
})
// 上传图片功能
const imageUrl = ref<string>('');

/**
 * 图片转base64
 */
// 图片转base64格式的
const getBase64 = (img: any, callback: (base64Url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

// 图片转二进制流的
function convertImageToBlob(imageUrl: any) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', imageUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error(`Error fetching image: ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => {
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

/**
 * 上传文件之前的钩子 （可以恒返回false 从而手动上传）
 * @param file 上传的文件
 * @returns 布尔值或者Promise对象 若返回 false 则停止上传
 */
let fileList: any = ref(null);
const beforeUpload = (file: any) => {

  convertImageToBlob(formState.imgUrl).then((blob) => {
    // 使用 blob 对象进行后续操作
    console.log(blob);
  }).catch((error) => {
    // 错误处理
    console.error(error);
  });
  // console.log(file.name)
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
    imageUrl.value = file.name;
    formState.imgUrl = base64Url
    // console.log(formState.imgUrl)
  });

  fileList.value = [file];
  formState.imgUrl = fileList.value[0].name
  return true;
  // return isJpgOrPng && isLt2M;
};
</script>

<template>
  <div id="IndividualCenter">
    <div class="addClass">
      <div class="seclectTime">
        <p class="title">管理员信息</p>
      </div>
    </div>
    <div class="content">
      <p><span>管理员ID:</span>{{ formState.id }}</p>
      <a-divider/>
      <p><span>账号:</span>{{ formState.account }}</p>
      <a-divider/>
      <p><span>用户组:</span>{{ formState.userGroup }}</p>
      <a-divider/>
      <p><span>创建时间:</span>{{ formState.ctime }}</p>
      <a-divider/>
      <p>
        <span style="width: 100px">管理员头像:</span>
        <a-upload
            style="margin-left: 20px"
            v-model:file-list="fileList"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :maxCount="1"
            :show-upload-list="false"
            :before-upload="beforeUpload">
          <img
              v-if="formState.imgUrl"
              :src="formState.imgUrl"
              alt="图片加载错误！"/>
          <div v-else>
            <plus-outlined></plus-outlined>
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
img {
  width: 100px;
  height: 100px;
}

#IndividualCenter {
  width: 98%;
  margin: 1%;
  //height: 50vh;
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

  .content {
    p {
      display: block;
      height: 60px;
      line-height: 60px;
      margin-left: 20px;

      span {
        margin-right: 10px;
      }

      &:last-of-type {
        display: flex;
        align-items: center;
        height: 100px;
        padding: 10px 0;
      }
    }
  }
}
</style>