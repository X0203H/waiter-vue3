<script setup lang="ts">
import {reactive, ref} from 'vue';
import type {UnwrapRef} from 'vue';
import {PlusOutlined, LoadingOutlined} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';
import type {UploadChangeParam, UploadProps} from 'ant-design-vue';
//@ts-ignore
import {get} from '@/utils/api.ts'

// form部分
interface FormState {
  id: string | number,
  name: string;
  announcement: string,
  imgUrl: string,
  Delivery: number | string,
  DeliveryDate: string | number,
  Description: string,
  mark: number | string,
  SalesVolume: number | string,
  Events: string,
  BusinessHours: any
}

const formRef = ref();
const labelCol = {span: 5};
const wrapperCol = {span: 13};
const formState: UnwrapRef<FormState> = reactive({
  id: '',
  name: '',
  announcement: '',
  imgUrl: '',
  Delivery: '',
  DeliveryDate: '',
  Description: '',
  mark: '',
  SalesVolume: '',
  Events: '',
  BusinessHours: []
});
let fileList2 = ref<UploadProps['fileList']>([
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-3',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-4',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
]);
// 请求数据
get('/shop/info', {}).then((res: any) => {
  formState.id = res.data.id
  formState.name = res.data.name
  formState.announcement = res.data.bulletin
  formState.imgUrl = res.data.avatar
  formState.Delivery = res.data.deliveryPrice
  formState.DeliveryDate = res.data.deliveryTime
  formState.Description = res.data.description
  formState.mark = res.data.score
  formState.SalesVolume = res.data.sellCount
  formState.Events = res.data.supports
  formState.BusinessHours = res.data.date
  console.log(res.data)
  res.data.pics.forEach((item: any) => {
    // console.log(item, index)
    fileList2.value.forEach((i: any) => {
      i.url = item
    })
  })
})

// 上传图片功能
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
    imageUrl.value = file.name;
    formState.imgUrl = base64Url
    // console.log(formState.imgUrl)
  });

  fileList.value = [file];
  formState.imgUrl = fileList.value[0].name
  return true;
  // return isJpgOrPng && isLt2M;
};

// 照片墙部分
function getBase64List(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64List(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
</script>

<template>
  <div id="ShopAdmin">
    <div class="addClass">
      <p class="title">店铺管理</p>
      <a-button type="primary" style="margin-right: 10px">保存</a-button>
    </div>
    <div id="ShopAdminFrom">
      <a-form
          ref="formRef"
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
      >
        <a-form-item ref="name" label="店铺名称" name="name">
          <a-input v-model:value="formState.name"/>
        </a-form-item>
        <a-form-item label="店铺公告" name="announcement">
          <a-textarea v-model:value="formState.announcement"/>
        </a-form-item>
        <a-form-item label="店铺头像" name="imgUrl">
          <a-upload
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
        </a-form-item>
        <a-form-item label="店铺图片" name="picList">
          <div class="clearfix">
            <a-upload
                v-model:file-list="fileList2"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                list-type="picture-card"
                @preview="handlePreview"
            >
              <div v-if="fileList2.length < 8">
                <plus-outlined/>
                <div style="margin-top: 8px">Upload</div>
              </div>
            </a-upload>
            <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage"/>
            </a-modal>
          </div>
        </a-form-item>
        <a-form-item label="配送费" name="Delivery">
          <a-input v-model:value="formState.Delivery" placeholder="Basic usage"/>
        </a-form-item>
        <a-form-item label="配送时间" required name="DeliveryDate">
          <a-input v-model:value="formState.DeliveryDate" placeholder="Basic usage"/>
        </a-form-item>
        <a-form-item label="配送描述" name="Description">
          <a-input v-model:value="formState.Description" placeholder="Basic usage"/>
        </a-form-item>
        <a-form-item label="店铺评分" name="mark">
          <a-input v-model:value="formState.mark" placeholder="Basic usage"/>
        </a-form-item>
        <a-form-item label="销量" name="SalesVolume">
          <a-input v-model:value="formState.SalesVolume" placeholder="Basic usage"/>
        </a-form-item>
        <a-form-item label="活动" name="Events">
          <a-checkbox-group v-model:value="formState.Events">
            <a-checkbox value="在线支付满28减5" name="type">在线支付满28减5</a-checkbox>
            <a-checkbox value="VC无限橙果汁全场8折" name="type">VC无限橙果汁全场8折</a-checkbox>
            <a-checkbox value="单人精彩套餐" name="type">单人精彩套餐</a-checkbox>
            <a-checkbox value="特价饮品8折抢购" name="type">特价饮品8折抢购</a-checkbox>
            <a-checkbox value="单人特色套餐" name="type">单人特色套餐</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="营业时间" name="BusinessHours">
          <a-time-range-picker/>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
#ShopAdmin {
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

  #ShopAdminFrom {
    //height: 60vh;
    margin-top: 20px;
  }
}

img {
  width: 100px;
  height: 100px;
}
</style>