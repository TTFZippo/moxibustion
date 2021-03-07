import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () => import ('../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import('../components/Home.vue')
// import Index from '../components/subpage/Index.vue'
const Index = () => import ('../components/subpage/Index.vue') 
// import GoodsManagement from '../components/subpage/GoodsManagement.vue'
const GoodsManagement = () => import ('../components/subpage/GoodsManagement.vue')
// import OrderManagement from '../components/subpage/OrderManagement.vue'
const OrderManagement = () => import ('../components/subpage/OrderManagement.vue') 
// import SourceManagement from '../components/subpage/SourceManagement.vue'
const SourceManagement = () => import ('../components/subpage/SourceManagement.vue')
// import Setting from '../components/subpage/Setting.vue'
const Setting = () => import ('../components/subpage/Setting.vue')
// import AddGoods from '../components/subpage/AddGoods.vue'
const AddGoods = () => import ('../components/subpage/AddGoods.vue')
// import AddAdmin from '../components/subpage/AddAdmin.vue'
const AddAdmin = () => import ('../components/subpage/AddAdmin.vue')
// import schemeManagement from '../components/subpage/schemeManagement.vue'
const schemeManagement = () => import ('../components/subpage/schemeManagement.vue')
// import Addscheme from '../components/subpage/Addscheme.vue'
const Addscheme = () => import ('../components/subpage/Addscheme.vue')
// import VideoManagement from '../components/subpage/VideoManagement.vue'
const VideoManagement = () => import ('../components/subpage/VideoManagement.vue')
// import ArticalManagement from '../components/subpage/ArticalManagement.vue'
const ArticalManagement = () => import ('../components/subpage/ArticalManagement.vue')
// import CourseTreatment from '../components/subpage/CourseTreatment.vue'
const CourseTreatment = () => import ('../components/subpage/CourseTreatment.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/Index',
    children: [
      {
        path: '/Index',
        component: Index
      },
      {
        path: '/GoodsManagement',
        component: GoodsManagement,
      },
      {
        path: '/OrderManagement',
        component: OrderManagement
      },
      {
        path: '/SourceManagement',
        component: SourceManagement
      },
      {
        path: '/Setting',
        component: Setting
      },
      {
        path: '/AddGoods',
        component: AddGoods
      },
      {
        path: '/AddAdmin',
        component: AddAdmin
      },
      {
        path: '/schemeManagement',
        component: schemeManagement
      },
      {
        path: '/addscheme',
        component: Addscheme
      },
      {
        path: '/VideoManagement',
        component: VideoManagement
      },
      {
        path: '/ArticalManagement',
        component: ArticalManagement
      },
      {
        path: '/CourseTreatment',
        component: CourseTreatment
      }
    ],

  }
]

const router = new VueRouter({
  routes
})

// 页面访问权限
router.beforeEach((to, from, next) => {
  // 若访问登录页，直接放行
  if (to.path === '/login') return next()

  // 若访问非登录页，验证token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
