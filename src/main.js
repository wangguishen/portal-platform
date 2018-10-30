import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import vuescroll from 'vue-scroll'
// import VueQr from 'vue-qr'
import './assets/iconfont.css'
import 'element-ui/lib/theme-default/index.css';    // 默认主题
//import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";

// import VueQArt from 'qrcode'

Vue.prototype.BP_HOST = '/basic-platform'  //走代理
//Vue.prototype.BP_HOST = 'http://172.19.5.200:3555/basic-platform'; //测试地址
//Vue.prototype.BP_HOST = 'http://openplatform.weilian.cn/basic-platform'; //正式地址
Vue.prototype.PIC_HOST = '/file-service/file-api.download?useOld=false&domain=user&type=photo&fileName=';  //图片上传地址
//Vue.prototype.OA_URL= 'http://test.oa.suneee.weilian.cn/bpmx/login.jsp' //OA测试环境地址
Vue.prototype.OA_URL = 'http://uoa.wn.sunmath.cn/bpmx/platform/console/main.ht' //OA正式环境地址

//Excel模板下载地址(测试环境)
//Vue.prototype.EXCEL_TEMPLATE_URL = 'http://vr12.weilian.cn/account_auth_admin_page/images/user.import.template.xls'
//正式环境
Vue.prototype.EXCEL_TEMPLATE_URL = 'http://uc.weilian.cn/account_auth_admin_page/images/user.import.template.xls'

//修改企业logo(测试环境+正式环境)
Vue.prototype.LOGO_UPDATE_URL = 'http://xpomg.weilian.cn/vr-content/file/upload'

//用户中心接口
Vue.prototype.USER_URL = '/account_auth_admin' //用户中心测试环境

Vue.prototype.PLAT_ADMIN = 'plat_admin' //平台管理员
Vue.prototype.ENTERPRISE_ADMIN = 'enterprise_admin' //企业管理员
Vue.prototype.PLAT_COMPCODE = 'SYSTEM' //企业管理员

Vue.use(ElementUI);
Vue.use(vuescroll)
// Vue.use(VueQr)
Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');