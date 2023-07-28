<script setup lang="ts">
import {ref, reactive} from 'vue'
import {message} from "ant-design-vue";
// @ts-ignore
import {get, post} from '@/utils/api.ts'
import {PlusOutlined} from '@ant-design/icons-vue';

interface DataItem {
  key: string,
  name: string,
  category: string,
  price: number,
  imgUrl: string,
  ctime: string,
  rating: string,
  sellCount: string,
  goodsDesc: string
}

const open = ref<boolean>(false);
const showModal = (id: string) => {
  open.value = true;
  formState.id = id
};
const handleOk = (e: MouseEvent) => {
  console.log(e);
  open.value = false;
};
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};
const formState = reactive<Record<string, any>>({
  id: '',
  name: '',
  fl: '',
  num: '',
  imgUrl: '',
  desc: ''
});
const onFinish = (values: any) => {
  console.log('Success:', values);
  post('/goods/edit', {
    id: formState.id,
    name: formState.name,
    category: formState.fl,
    price: formState.num,
    imgUrl: formState.imgUrl,
    goodsDesc: formState.desc
  }).then((res: any) => {
    if (res.code === 0) {
      message.success(res.msg)
      request()
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
// table部分
const columns = [
  {title: 'name', dataIndex: 'name', key: 'name'},
  {title: 'category', dataIndex: 'category', key: 'category'},
  {title: 'price', dataIndex: 'price', key: 'price'},
  {title: 'imgUrl', dataIndex: 'imgUrl', key: 'imgUrl', slots: {customRender: 'imgUrl'}},
  {title: 'goodsDesc', dataIndex: 'goodsDesc', key: 'goodsDesc'},
  {
    title: '操作',
    dataIndex: 'operation',
    width: '10%'
  },
];

let data: DataItem[] = [];
let dataSource = ref(data);
const request = () => {
  get('/goods/list', {
    currentPage: 1,
    pageSize: 35,
    name: '',
    category: ''
  }).then((res: any) => {
    data = res.data
    data.forEach((item: any) => {
      item.key = item.id
    })
    dataSource.value = data
    // console.log(dataSource)
  })
}
request()
// 删除
const Del = (id: string) => {
  get('/goods/del', {
    id,
  }).then((res: any) => {
    console.log(res)
    message.success('删除成功!')
    request()
  })
}
</script>

<template>
  <a-table :columns="columns" :data-source="dataSource" :expand-column-width="100">
    <template #bodyCell="{ column,record }">
      <template v-if="column.dataIndex === 'operation'">
        <div class="editable-row-operations">
          <a @click="showModal(record.id)">编辑</a>
          <span>
          </span>
          <span style="margin-left: 10px">
            <a @click="Del(record.id)">删除</a>
          </span>
        </div>
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      <a-descriptions title="">
        <a-descriptions-item label="商品ID">{{ record.id }}</a-descriptions-item>
        <a-descriptions-item label="商品名称">{{ record.name }}</a-descriptions-item>
        <a-descriptions-item label="所属分类">{{ record.category }}</a-descriptions-item>
        <a-descriptions-item label="商品价格">{{ record.price }}</a-descriptions-item>
        <a-descriptions-item label="商品图片"><img :src="record.imgUrl" alt="图片加载失败！"></a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ record.ctime }}</a-descriptions-item>
        <a-descriptions-item label="商品评价">{{ record.rating }}</a-descriptions-item>
        <a-descriptions-item label="商品销量">{{ record.sellCount }}</a-descriptions-item>
        <a-descriptions-item label="商品描述">{{ record.goodsDesc }}</a-descriptions-item>
      </a-descriptions>
    </template>
  </a-table>
  <!--  编辑对话框-->
  <a-modal v-model:open="open" title="编辑商品" @ok="handleOk">
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
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped lang="scss">
::v-deep(.ant-descriptions-view) {
  margin-left: 100px;
}

.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

img {
  width: 100px;
  height: 100px;
}
</style>