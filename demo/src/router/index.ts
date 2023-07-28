import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
//@ts-ignore
import NProgress from 'nprogress'
import "nprogress/nprogress.css";

const routes: Array<RouteRecordRaw> = [
    {path: '/', redirect: '/login'},
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录页'
        },
        component: () => import('../router/views/Login/Login.vue')
    },
    {
        path: '/index',
        name: 'Index',
        meta: {
            title: '主页'
        },
        component: () => import('../router/views/Index/Index.vue'),
        children: [
            {path: '/', redirect: '/index/home'},
            {
                path: 'home',
                name: 'Home',
                meta: {
                    title: '后台首页'
                },
                component: () => import('../router/views/Index/Home/Home.vue')
            },
            {
                path: 'order',
                name: 'OrdeR',
                meta: {
                    title: '订单管理'
                },
                component: () => import('../router/views/Index/OrdeR/OedeR.vue')
            },
            {
                path: 'commodityList',
                name: 'CommodityList',
                meta: {
                    title: '商品列表'
                },
                component: () => import('../router/views/Index/CommodityList/CommodityList.vue')
            },
            {
                path: 'commodityAdd',
                name: 'CommodityAdd',
                meta: {
                    title: '商品添加'
                },
                component: () => import('../router/views/Index/CommodityAdd/CommodityAdd.vue')
            },
            {
                path: 'commodityClassification',
                name: 'CommodityClassification',
                meta: {
                    title: '商品分类'
                },
                component: () => import('../router/views/Index/CommodityClassification/CommodityClassification.vue')
            },
            {
                path: 'storemanagement',
                name: 'StoreManagement',
                meta: {
                    title: '店铺管理'
                },
                component: () => import('../router/views/Index/StoreManagement/StoreManagement.vue')
            },
            {
                path: 'accountList',
                name: 'AccountList',
                meta: {
                    title: '账号列表'
                },
                component: () => import('../router/views/Index/AccountList/AccountList.vue')
            },
            {
                path: 'accountAdd',
                name: 'AccountAdd',
                meta: {
                    title: '添加账号'
                },
                component: () => import('../router/views/Index/AccountAdd/AccountAdd.vue')
            },
            {
                path: 'changePassword',
                name: 'ChangePassword',
                meta: {
                    title: '修改密码'
                },
                component: () => import('../router/views/Index/ChangePassword/ChangePassword.vue')
            },
            {
                path: 'commodityStatistics',
                name: 'commodityStatistics',
                meta: {
                    title: '商品统计'
                },
                component: () => import('../router/views/Index/CommodityStatistics/CommodityStatistics.vue')
            },
            {
                path: 'orderStatistics',
                name: 'OrderStatistics',
                meta: {
                    title: '订单统计'
                },
                component: () => import('../router/views/Index/OrderStatistics/OrderStatistics.vue')
            },
            {
                path: 'individualCenter',
                name: 'IndividualCenter',
                meta: {
                    title: '个人中心'
                },
                component: () => import('../router/views/Index/IndividualCenter/IndividualCenter.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        let username = localStorage.getItem('token');
        //用户访问认证后页面时 必须校验用户信息是否存在，不存在去登陆页
        if (username === null || username === '') {
            alert('token值莫名消失，请重新登录')
            next('/')
        } else {
            next()
        }
    }
    NProgress.start(); //每次切换页面时，调用进度条
})
// 后置导航守卫
router.afterEach(() => {
    NProgress.done(); // 在即将进入新的页面组件前，关闭掉进度条
});

export default router