<script setup lang="ts">
import {reactive, ref, toRaw} from 'vue';
import type {UnwrapRef} from 'vue';
import type {Rule} from 'ant-design-vue/es/form';
//@ts-ignore
import {get, post} from '@/utils/api.ts'
import {cloneDeep} from 'lodash-es';
import {message} from "ant-design-vue";

let total: number = 0
let data: DataItem[] = [];
let dataSource = ref(data);
if (total === 0) {
  total = 100
}

function request() {
  get('/goods/catelist', {
    currentPage: 1,
    pageSize: total
  }).then((res: any) => {
    total = res.total
    data = res.data
    dataSource.value = data
    // console.log(dataSource)
  })
}

request()

interface FormState {
  id: '',
  name: string
  delivery: number | boolean;
}

const formRef = ref();
const labelCol = {span: 5};
const wrapperCol = {span: 13};
const formState: UnwrapRef<FormState> = reactive({
  id: '',
  name: '',
  delivery: 1,
});
const rules: Record<string, Rule[]> = {
  name: [
    {required: true, message: 'Please input Activity name', trigger: 'change'},
    {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'},
  ],
};
const onSubmit = () => {
  formRef.value
      .validate()
      .then(() => {
        console.log('values', formState, toRaw(formState));
        post('/goods/addcate', {
          cateName: formState.name,
          state: formState.delivery === 1
        }).then((res: any) => {
          message.success(res.msg)
        })
      })
      .catch((error: any) => {
        console.log('error', error);
      });
};
const resetForm = () => {
  formRef.value.resetFields();
};

const open = ref<boolean>(false);
const showModal = () => {
  open.value = true;
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  // request()
  get('/goods/catelist', {
    currentPage: 1,
    pageSize: total
  }).then((res: any) => {
    total = res.total
    data = res.data
    dataSource.value = data
  })
  open.value = false;
};

// table部分
const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    width: '25%',
  },
  {
    title: '分类名称',
    dataIndex: 'cateName',
    width: '15%',
  },
  {
    title: '是否应用',
    dataIndex: 'state',
    width: '40%',
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
];

interface DataItem {
  cateName: string;
  id: string;
  state: number;
}

const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const edit = (id: string) => {
  editableData[id] = cloneDeep(dataSource.value.filter(item => id === item.id)[0]);
};
const save = (id: string) => {
  Object.assign(dataSource.value.filter(item => id === item.id)[0], editableData[id]);
  delete editableData[id];
  console.log(editableData)
  post('/goods/editcate', {
    id,
    cateName: formState.name,
    state: formState.delivery === 1
  }).then((res: any) => {
    message.success(res.msg)
    // request()
    get('/goods/catelist', {
      currentPage: 1,
      pageSize: total
    }).then((res: any) => {
      total = res.total
      data = res.data
      dataSource.value = data
    })
  })
};
const cancel = (id: string) => {
  delete editableData[id];
};
const DelClass = (id: number) => {
  get('/goods/delcate', {
    id,
  }).then((res: any) => {
    message.success(res.msg)
    // request()
    get('/goods/catelist', {
      currentPage: 1,
      pageSize: 100
    }).then((res: any) => {
      total = res.total
      data = res.data
      dataSource.value = data
    })
  })
}
// 开关的赋值
const changeSwitch = (val: number) => {
  console.log(val)
  formState.delivery = val
}
</script>

<template>
  <div id="ComClassify">
    <div class="addClass">
      <p class="title" style="padding-top: 40px">商品分类</p>
      <a-button style="margin-right: 10px" type="primary" @click="showModal">添加分类</a-button>
      <a-modal v-model:open="open" title="添加分类" @ok="handleOk">
        <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
        >
          <a-form-item ref="name" label="分类名称" name="name">
            <a-input v-model:value="formState.name"/>
          </a-form-item>
          <a-form-item label="是否应用" name="delivery">
            <a-switch v-model:checked="formState.delivery" :checkedValue="1" :unCheckedValue="0"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onSubmit">Create</a-button>
            <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <a-table style="margin-top: 10px" :columns="columns" :data-source="dataSource" bordered>
      <template #bodyCell="{ column, text, record }">
        <template v-if="['cateName'].includes(column.dataIndex)">
          <div>
            <a-input
                v-if="editableData[record.id]"
                v-model:value="formState.name"
                style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'state'">
          <a-switch v-model:checked="record.state" :checkedValue="1" :unCheckedValue="0"
                    @change="changeSwitch(record.state)"/>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
          <span v-if="editableData[record.id]">
            <a-button type="primary" @click="save(record.id)" style="margin-right: 10px">完成</a-button>
            <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.id)">
              <a-button type="primary">取消</a-button>
            </a-popconfirm>
          </span>
            <span v-else>
            <a-button type="primary" @click="edit(record.id)">编辑</a-button>
          </span>
            <span style="margin-left: 10px">
             <a-button type="primary" danger @click="DelClass(record.id)">删除</a-button>
          </span>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped lang="scss">
.editable-row-operations a {
  margin-right: 8px;
}

#ComClassify {
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
    padding: 30px 0;
    border-bottom: 1px solid #ccc;
    line-height: 40px;

    .title {
      padding: 20px 0 20px 20px;
    }
  }
}
</style>