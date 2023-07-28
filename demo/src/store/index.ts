import {defineStore} from "pinia";
import {get} from '@/utils/api.ts'

const total: number = 0
export const useCounter = defineStore('counter', {
    state: () => ({
        count: 66,
        echData: '',
        ComClassData: '',
        total
    }),
    getters: {},
    actions: {
        // 首页echarts报表数据
        echFun() {
            get('/order/totaldata', {}).then((res: any) => {
                this.echData = res
                // console.log(this.echData)
            })
        }
    }
})