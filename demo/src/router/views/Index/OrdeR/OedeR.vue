<template>
  <div id="OedeR">
    <div class="title">
      <a-form
          id="form"
          ref="formRef"
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
      >
        <a-form-item ref="OrderNum" label="订单号" name="OrderNum">
          <a-input v-model:value="formState.OrderNum"/>
        </a-form-item>
        <a-form-item ref="consignee" label="收货人" name="consignee">
          <a-input v-model:value="formState.consignee"/>
        </a-form-item>
        <a-form-item ref="phone" label="手机号" name="phone">
          <a-input v-model:value="formState.phone"/>
        </a-form-item>
        <a-form-item label="订单状态" name="region">
          <a-select v-model:value="formState.region" placeholder="请选择订单的状态">
            <a-select-option value="派送中">派送中</a-select-option>
            <a-select-option value="已受理">已受理</a-select-option>
            <a-select-option value="无">无</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择时间" name="date1">
          <a-range-picker v-model:value="formState.date1"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table :columns="columns" :data-source="dataSource" bordered>
      <template #bodyCell="{ column, text, record }">
        <template
            v-if="['orderNo','orderTime','phone', 'consignee', 'deliverAddress','remarks','orderAmount','deliveryTime','orderState'].includes(column.dataIndex)">
          <div>
            <a-input
                v-if="editableData[record.id]"
                v-model:value="editableData[record.id][column.dataIndex]"
                style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
          <span v-if="editableData[record.id]">
            <a-typography-link @click="save(record.id)">完成</a-typography-link>
            <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.id)">
              <a>取消</a>
            </a-popconfirm>
          </span>
            <span v-else>
            <a @click="edit(record.id)">编辑</a>
          </span>
            <span>
              <a @click="view(record.id)">查看</a>
            </span>
          </div>
        </template>
      </template>
    </a-table>
    <!--抽屉-->
    <a-drawer
        v-model:open="open"
        class="custom-class"
        root-class-name="root-class-name"
        :root-style="{ color: 'blue' }"
        style="color: black"
        title="订单详情"
        placement="right"
        @after-open-change="afterOpenChange"
    >
      <p>订单id:<span>{{ openForm.id }}</span></p>
      <p>订单号:<span>{{ openForm.orderNo }}</span></p>
      <p>下单时间:<span>{{ openForm.orderTime }}</span></p>
      <p>联系电话:<span>{{ openForm.phone }}</span></p>
      <p>收货人:<span>{{ openForm.consignee }}</span></p>
      <p>送货地址:<span>{{ openForm.deliverAddress }}</span></p>
      <p>送达时间:<span>{{ openForm.deliveryTime }}</span></p>
      <p>备注:<span>{{ openForm.remarks }}</span></p>
      <p>订单金额:<span>{{ openForm.orderAmount }}</span></p>
      <p>订单状态:<span>{{ openForm.orderState }}</span></p>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import {Dayjs} from "dayjs";
import {reactive, ref, toRaw} from 'vue';
import type {UnwrapRef} from 'vue';
// import type {Rule} from 'ant-design-vue/es/form';
import {get, post} from '@/utils/api.ts'
import * as dayjs from "dayjs";
//@ts-ignore
import {cloneDeep} from 'lodash-es';
import {message} from "ant-design-vue";

interface DataItem {
  id: string,
  orderNo: string;
  orderTime: string;
  phone: number;
  consignee: string;
  deliverAddress: string,
  deliveryTime: string,
  remarks: string,
  orderAmount: number,
  orderState: string
}

const open = ref<boolean>(false);
let openForm = ref({
  id: '',
  orderNo: '',
  orderTime: '',
  phone: '',
  consignee: '',
  deliverAddress: '',
  deliveryTime: '',
  remarks: '',
  orderAmount: '',
  orderState: ''
})
const afterOpenChange = (bool: boolean) => {
  console.log('open', bool);
};
// table部分
const columns = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    width: '10%',
  },
  {
    title: '下单时间',
    dataIndex: 'orderTime',
    width: '10%',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: '10%',
  },
  {
    title: '收货人',
    dataIndex: 'consignee',
    width: '10%',
  },
  {
    title: '配送地址',
    dataIndex: 'deliverAddress',
    width: '10%',
  },
  {
    title: '送达时间',
    dataIndex: 'deliveryTime',
    width: '10%',
  },
  {
    title: '用户备注',
    dataIndex: 'remarks',
    width: '10%',
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
    width: '10%',
  },
  {
    title: '订单状态',
    dataIndex: 'orderState',
    width: '10%',
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
];

let data: DataItem[] = [];
let tableData: any[] = []

let dataSource = ref(data);
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

// 请求数据
get('/order/list', {
  currentPage: 1,
  pageSize: 21,
  orderNo: '',
  consignee: '',
  phone: '',
  orderState: '',
  date: ''
}).then((res: any) => {
  data = res.data
  data.forEach((item: any) => {
    item.orderTime = dayjs(item.orderTime).format('YYYY-MM-DD HH:mm:ss')
    item.deliveryTime = dayjs(item.deliveryTime).format('YYYY-MM-DD HH:mm:ss')
  })
  tableData = data
  dataSource.value = data
  // console.log(dataSource)
})
const edit = (id: string) => {
  editableData[id] = cloneDeep(dataSource.value.filter(item => id === item.id)[0]);
};
const save = (id: string) => {
  Object.assign(dataSource.value.filter(item => id === item.id)[0], editableData[id]);
  delete editableData[id];
  // console.log(id)
  dataSource.value.forEach((item: any) => {
    if (item.id === id) {
      console.log(item)
      post('/order/edit', {
        id,
        orderNo: item.orderNo,
        orderTime: item.orderTime,
        phone: item.phone,
        consignee: item.consignee,
        deliverAddress: item.deliverAddress,
        deliveryTime: item.deliveryTime,
        remarks: item.remarks,
        orderAmount: item.orderAmount,
        orderState: item.orderState
      }).then((res: any) => {
        // console.log(res)
        message.success(res.msg)
      })
    }
  })
};
const cancel = (id: string) => {
  delete editableData[id];
};
// 查看
const view = (id: string) => {
  open.value = true
  get('/order/detail', {
    id: id
  }).then((res: any) => {
    // console.log(res, openForm)
    openForm.value = res.data
  })
}

// form部分
interface FormState {
  OrderNum: string;
  consignee: string,
  phone: string,
  region: string | undefined;
  date1: Dayjs | undefined;
}

const formRef = ref();
const labelCol = {span: 5};
const wrapperCol = {span: 13};
const formState: UnwrapRef<FormState> = reactive({
  OrderNum: '',
  consignee: '',
  phone: '',
  region: undefined,
  date1: undefined,
});
const onSubmit = () => {
  formRef.value
      .validate()
      .then(() => {
        if (formState.OrderNum === '' && formState.consignee === '' && formState.phone === '' && formState.region === '无' && formState.date1 === undefined) {
          console.log("dsfads")
          dataSource.value = tableData
        } else {
          console.log('values', formState, toRaw(formState));
          get('/order/search', {
            currentPage: 1,
            pageSize: 21,
            orderNo: formState.OrderNum,
            consignee: formState.consignee,
            phone: formState.phone,
            orderState: formState.region,
            date: formState.date1
          }).then((res: any) => {
            // console.log(res.data)
            data = res.data
            data.forEach((item: any) => {
              item.orderTime = dayjs(item.orderTime).format('YYYY-MM-DD HH:mm:ss')
              item.deliveryTime = dayjs(item.deliveryTime).format('YYYY-MM-DD HH:mm:ss')
            })
            dataSource.value = data
          })
        }
      })
      .catch((error: any) => {
        console.log('error', error);
        dataSource.value = tableData
      });
}
</script>

<style lang="scss" scoped>
#OedeR {
  width: 98%;
  margin: 1%;
  height: 88vh;
  overflow-y: scroll;
  background-color: #fff;

  .title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 98%;
    margin: 0 1%;
    padding: 1% 0;
  }
}

#form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

::v-deep(.ant-form-item),
::v-deep(.ant-form-item-label) {
  margin-right: 5px;
}

::v-deep(.ant-form-item-label) {
  width: 200px;
}

.editable-row-operations a {
  margin-right: 8px;
}

p {
  margin: 5px 0;
  font-size: 16px;

  span {
    font-size: 14px;
    margin-left: 10px;
    font-weight: bold;
  }
}
</style>
