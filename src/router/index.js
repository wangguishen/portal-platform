import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const routes = [
    {
        path: '/',
        component: resolve => require(['../components/page/Login.vue'], resolve),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/login',
        component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
        path: '*',
        component: resolve => require(['../components/common/404.vue'], resolve)
    },
    {
        path: '/empty',
        component: resolve => require(['../components/common/empty.vue'], resolve)
    },
    //消息推送查询页面,给框架调用
    {
        path: '/show', //消息推送查询页面
        component: resolve => require(['../components/page/news-push/show.vue'], resolve),
    },
    {
        path: '/show-suneee', //消息推送查询页面
        component: resolve => require(['../components/page/news-push/show-suneee.vue'], resolve),
    },
    {
        path: '/show-suneee-new', //新版本
        component: resolve => require(['../components/page/news-push/show-suneee-new.vue'], resolve),
    },
    {
        path: '/readme',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        children:[
            //账号信息
            {
                path: '/accountInfos', //账号信息
                component: resolve => require(['../components/page/accountInfos.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/resetPwd', //修改密码
                component: resolve => require(['../components/page/resetPwd.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/navbar', //权限管理导航
                component: resolve => require(['../components/common/Navbar.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/',  //自述
                component: resolve => require(['../components/page/Readme.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            //开放服务栏(open-service)
            {
                path: '/Produce',//生成页面
                component: resolve => require(['../components/page/open-service/Produce.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/Parameters',//参数管理
                component: resolve => require(['../components/page/open-service/Parameters.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/serverdetail', //开放服务配置
                component: resolve => require(['../components/page/open-service/serverDetail.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/messageConfig', //开放服务消息配置
                component: resolve => require(['../components/page/open-service/messageConfig.vue'], resolve)
            },
            //权限管理栏(rights-manage)
            {
                path: '/empower', //开放服务配置
                component: resolve => require(['../components/page/rights-manage/Empower.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/operategover',//操作管理
                component: resolve => require(['../components/page/rights-manage/Operategover.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/orgchagover',//组织架构管理
                component: resolve => require(['../components/page/rights-manage/Orgchagover.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/resource', //资源管理
                component: resolve => require(['../components/page/rights-manage/Resource.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/rolegover',//角色管理
                component: resolve => require(['../components/page/rights-manage/Rolegover.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/userrole', //用户角色管理
                component: resolve => require(['../components/page/rights-manage/Userrole.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/sysgover',//系统管理
                component: resolve => require(['../components/page/rights-manage/Sysgover.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            //配置管理栏(config-manage)
            {
                path: '/flatcompany', //平台企业管理
                component: resolve => require(['../components/page/config-manage/flatcompany.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/Link', //页面访问控制
                component: resolve => require(['../components/page/config-manage/Link.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/userTypeChange', //用户类型变更
                component: resolve => require(['../components/page/config-manage/UserTypeChange.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/enterpriseUserImport', //企业用户导入
                component: resolve => require(['../components/page/config-manage/EnterpriseUserImport.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/newadmin', //新增管理员
                component: resolve => require(['../components/page/config-manage/newadmin.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/addadmin', //添加管理员
                component: resolve => require(['../components/page/config-manage/addadmin.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/accountBind', //账户绑定
                component: resolve => require(['../components/page/config-manage/accountBind.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/accountBindFacility', //账户绑定
                component: resolve => require(['../components/page/config-manage/accountBindFacility.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/userLoginRecord', //用户登录记录
                component: resolve => require(['../components/page/config-manage/userLoginRecord.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/Portconfig',//接口配置
                component: resolve => require(['../components/page/config-manage/Portconfig.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/Serviceconfig',//服务配置
                component: resolve => require(['../components/page/config-manage/Serviceconfig.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/TopicPushConfig',//消息推送配置
                component: resolve => require(['../components/page/config-manage/TopicPushConfig.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/LogsShow',//日志展示
                component: resolve => require(['../components/page/open-service/LogsShow.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/serviceControl', //服务器监控
                component: resolve => require(['../components/page/config-manage/serviceControl.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            }, 
            {
                path: '/urlLink', //url链接配置
                component: resolve => require(['../components/page/config-manage/UrlLink.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/spaceSetting',
                component: resolve => require(['../components/page/config-manage/SpaceSetting.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/monEnConfig', //监控企业配置
                component: resolve => require(['../components/page/config-manage/MonEnConfig.vue'], resolve)
            },
            {
                path: '/monSysConfig', //监控系统配置
                component: resolve => require(['../components/page/config-manage/MonSysConfig.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            }, {
                path: '/monUrlConfig', //监控链接配置
                component: resolve => require(['../components/page/config-manage/MonUrlConfig.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/monLabConfig', //监控实验室配置
                component: resolve => require(['../components/page/config-manage/MonLabConfig.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/parameterdetail', //监控链接参数配置
                component: resolve => require(['../components/page/config-manage/ParameterDetail.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: '/userLevelConfig', //用户级别配置
                component: resolve => require(['../components/page/config-manage/UserLevelConfig.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            //运维服务栏(mainten-service)
            {
                path: '/ServerMonitoring', //服务器监控
                component: resolve => require(['../components/page/mainten-service/ServerMonitoring.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
            //企业logo注册 以及新增
            {
                path: '/addcompanylogo', //企业logo页面
                component: resolve => require(['../components/page/config-manage/AddCompanyLogo.vue'], resolve),
                meta: {
                    requireAuth: true
                }
            },
        ],
    }
]

const router = new Router({
    /*mode: 'history',*/
    routes
});

var localStorage = window.localStorage

// router.beforeEach((to, from, next) => {
//     var storage = JSON.parse(localStorage.getItem('dataJson'))
//     if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
//         if (storage) {  // 通过storage判断是否登录
//             next();
//         }
//         else {
//             // next({
//             //     path: '/login',
//             //     query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
//             // })
//         }
//     }
//     else {
//         next();
//     }
// })

export default router;
