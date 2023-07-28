<script setup lang="ts">
import {computed, ref, unref, reactive} from 'vue';
import {message, Table} from 'ant-design-vue';
//@ts-ignore
import {get, post} from '@/utils/api.ts'
import * as dayjs from "dayjs";
//@ts-ignore
import type {UnwrapRef} from 'vue';
import {cloneDeep} from "lodash-es";

interface DataType {
  key: string | number;
  id: string | number,
  account: string;
  ctime: number;
  userGroup: string;
  imgUrl: string
}

const columns = [
  {
    title: '账号',
    dataIndex: 'account',
  },
  {
    title: '用户组',
    dataIndex: 'userGroup',
  },
  {
    title: '创建时间',
    dataIndex: 'ctime',
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
];

let data: DataType[] = [];
let dataSource = ref(data);
let total: number = 0
let idArr: any = []
const editableData: UnwrapRef<Record<string, DataType>> = reactive({});
const request = () => {
  if (total === 0) {
    total = 100
  }
  get('/users/list', {
    currentPage: 1,
    pageSize: total
  }).then((res: any) => {
    total = res.total
    data = res.data
    data.forEach((item: any) => {
      item.key = item.id
      item.ctime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    })
    dataSource.value = data
    console.log(dataSource)
  })
}
request()

const selectedRowKeys = ref<DataType['key'][]>([]); // Check here to configure the default column

const onSelectChange = (changableRowKeys: string[]) => {
  console.log('selectedRowKeys changed: ', changableRowKeys);
  idArr = JSON.stringify(changableRowKeys)
  selectedRowKeys.value = changableRowKeys;
};

const rowSelection = computed(() => {
  return {
    selectedRowKeys: unref(selectedRowKeys),
    onChange: onSelectChange,
    hideDefaultSelections: true,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys: any) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key: any, index: any) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: changableRowKeys => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_key: any, index: any) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          selectedRowKeys.value = newSelectedRowKeys;
        },
      },
    ],
  };
});
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
      post('/users/edit', {
        id,
        account: item.account,
        userGroup: item.userGroup
      }).then((res: any) => {
        if (res.code === 0) {
          message.success(res.msg)
        } else {
          message.error(res.msg)
        }
      })
    }
  })
};
const cancel = (id: string) => {
  delete editableData[id];
};
// 删除账号
const DelAccount = (id: any) => {
  dataSource.value.forEach((item: any) => {
    if (item.id === id) {
      let User = JSON.parse(localStorage.getItem('DXEUser'))
      if (item.account === User.account) {
        return message.warning('当前登录的账号不可删除!')
      } else {
        get('/users/del', {
          id,
        }).then((res: any) => {
          if (res.code === 0) {
            message.success(res.msg)
            request()
          } else {
            message.error(res.msg)
          }
        })
      }
    }
  })
}
// 批量删除
const BatchDel = () => {
  get('/users/batchdel', {
    ids: idArr
  }).then((res: any) => {
    if (res.code === 0) {
      message.success(res.msg)
      request()
    } else {
      message.error(res.msg)
    }
  })
}
</script>

<template>
  <a-table :row-selection="rowSelection" :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column, text, record }">
      <template
          v-if="['account','userGroup'].includes(column.dataIndex)">
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
             <a-button type="primary" @click="save(record.id)">完成</a-button>
            <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.id)">
             <a-button type="primary">取消</a-button>
            </a-popconfirm>
          </span>
          <span v-else>
             <a-button type="primary" @click="edit(record.id)">编辑</a-button>
          </span>
          <span>
             <a-button type="primary" @click="DelAccount(record.id)" danger>删除</a-button>
          </span>
        </div>
      </template>
    </template>
  </a-table>
  <a-button type="primary" danger style="margin: 20px 0 0 20px" @click="BatchDel">批量删除</a-button>
</template>

<style scoped lang="scss">
.ant-btn {
  margin-right: 5px;
}
</style>