<template>
  <div ref="bar" class="slidebar">
    <!-- <div>
      <span class="iconfont" style="color:#fff;float:right;cursor: pointer;" @click="fold">&#xe67d;</span>
    </div> -->
    <div class="g-logo" ref="logo">
      <img src="/static/images/LOGO.png" style="width:59px;" v-show="showFold">
      <span v-show="showFold">企业管理平台</span>
    </div>
  	<div class="sidebar_box" :style = "{height:listViewH + 300 + 'px'}">
      <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" :unique-opened="showOnlyOne" router theme="dark" :style = "{maxHeight:listViewH + 'px'}" @open="handleOpen" @close="handleClose">
          <template v-for="item in slideItems">
            <template v-if="item.subs">
              <el-submenu :index="item.index">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span v-show="showFold">{{item.title}}</span>
                </template>
                <!-- 二级 2 开放服务 -->
                <template v-if="item.index === '2'"> 
                  <template v-for="item in serviceConfigItems">
                    <el-submenu :index="item.id | intToString" class="erji">
                      <span slot="title" :title="item.serviceName"><i></i>{{item.serviceName}}</span>
                      <template v-for="temp in serviceChildItems">
                        <template v-for="temp1 in temp">
                          <template v-if="item.id == temp1.mId">
                            <template v-if="temp1.mId=='53'">
                              <el-menu-item :index="'ServerMonitoring?mac='+temp1.url" class="sanji">
                                <span :title="temp1.interName">{{temp1.interName}}</span>
                              </el-menu-item>
                            </template>
                            <template v-else-if="temp1.interName === '消息推送'">
                              <el-menu-item :index="'messageConfig?id='+temp1.mId+'-'+temp1.id">
                                <span :title="temp1.interName">{{temp1.interName}}</span>
                              </el-menu-item>
                            </template>
                            <template v-else>
                              <el-menu-item :index="'serverDetail?id='+temp1.mId+'-'+temp1.id">
                                <span :title="temp1.interName">{{temp1.interName}}</span>
                              </el-menu-item>
                            </template>
                          </template>
                        </template>
                      </template>
                    </el-submenu>
                  </template>  
                </template>

                <!-- 二级 3 权限管理 -->
                <template v-if="item.index === '3'">
                  <template v-for="scItem in authDefultItems">
                    <template v-if="scItem.children">
                      <el-submenu :index="scItem.index" class="erji">
                        <span slot="title" :title="scItem.title">{{scItem.title}}</span>
                        <template v-if="scItem.title === '用户类型控制'">
                          <template v-for="sanItem in scItem.children">
                            <el-menu-item :index="sanItem.index">{{sanItem.title}}</el-menu-item>
                          </template>
                        </template>
                        <template v-else-if="scItem.title === '角色类型控制'"> 
                         <template v-for="groupItem in groupItems">
                           <el-submenu :index="groupItem.comp_code" class="sanji">
                             <span slot="title" :title="groupItem.comp_name">
                               {{groupItem.comp_name}}</span>
                             <template v-for="companyItem in companyItems">
                               <template v-if="groupItem.id==companyItem.comp_parent_code">
                                 <template v-if="uamss==PLAT_ADMIN">
                                   <el-menu-item :index="'sysgover?comp_code='+companyItem.comp_code">
                                     <span :title="companyItem.comp_short_name">{{companyItem.comp_name}}</span>
                                   </el-menu-item>
                                 </template>
                                 <template v-else>
                                   <el-menu-item :index="'resource?comp_code='+companyItem.comp_code">
                                     <span :title="companyItem.comp_short_name">{{companyItem.comp_name}}</span>
                                   </el-menu-item>
                                 </template>
                               </template>
                             </template>
                           </el-submenu>
                         </template>
                        </template>
                      </el-submenu>
                    </template>
                    <template v-else>
                      <el-menu-item :index="scItem.index">
                        <span :title="scItem.title">{{scItem.title}}</span>
                      </el-menu-item>
                    </template>
                  </template>
                </template>
                
                <!-- 二级 4 配置管理 -->
                <template v-if="item.index === '4'">
                  <template v-for="pfItem in pfManagementItems">
                    <template v-if="pfItem.children">
                      <el-submenu :index="pfItem.index" class="erji">
                        <span slot="title" :title="pfItem.title"><i></i>{{pfItem.title}}</span>
                        <template v-for="setItem in pfItem.children">
                          <el-menu-item :index="setItem.index">{{setItem.title}}</el-menu-item>
                        </template>
                      </el-submenu>
                    </template>
                    <template v-else>
                      <el-menu-item :index="pfItem.index"><i></i>{{pfItem.title}}</el-menu-item>
                    </template>
                  </template>
                </template>
                
                <!-- 二级 5 服务器监控 -->
                <template v-if="item.index === '5'">
                  <template v-for="scItem in serviceControlItems">
                    <template v-if="scItem.children">
                      <el-submenu :index="scItem.index" class="erji">
                        <span slot="title" :title="scItem.title">{{scItem.title}}</span>
                        <!--todo -->
                        <template v-if="scItem.title === '硬件信息监控'">
                          <template v-for="fwItem in scItem.children">
                            <el-menu-item :index="'ServerMonitoring?mac='+fwItem.serviceNumber">
                              <span :title="fwItem.serviceName">{{fwItem.serviceName}}</span>
                            </el-menu-item>
                          </template>
                        </template>
                        <template v-else-if="scItem.title === 'url链接监控'"> 
                          <template v-for="monGroupItem in monGroupItems">
                            <el-submenu :index="monGroupItem.id | intToString" class="erji" style="margin-left: 20px">
                              <span slot="title" :title="monGroupItem.compName">
                                {{monGroupItem.compName}}</span>
                              <template v-for="monCompanyItem in monCompanyItems">
                                <template v-if="monGroupItem.id==monCompanyItem.parentId">
                                  <el-menu-item :index="'urlLink?id='+monCompanyItem.id">
                                    <span :title="monCompanyItem.compName">{{monCompanyItem.compName}}</span>
                                  </el-menu-item>
                                </template>
                              </template>
                            </el-submenu>
                          </template>
                        </template>
                      </el-submenu>
                    </template>
                    <template v-else>
                      <el-menu-item :index="'ServerMonitoring?mac='+scItem.serviceNumber">
                        <span :title="scItem.serviceName">{{scItem.serviceName}}</span>
                      </el-menu-item>
                    </template>
                  </template>
                </template>
              </el-submenu>
            </template>
            <template v-else>
              <template v-if="item.title==='OA系统'">
                <el-menu-item :index="item.index">
                  <a :href="oaUrl" class="a-st" target="_self"><i :class="item.icon"></i>OA系统</a>
                </el-menu-item>
              </template>
              <template v-else>
                <el-menu-item :index="item.index">
                  <i :class="item.icon"></i><span :title="item.title">{{item.title}}</span>
                </el-menu-item>
              </template>
            </template>
          </template>
          
          <!-- 底部,帐号信息 -->
          <template>
              <div class="left_footer" v-show="showFold">
                  <img src="/static/images/admin.png" class="admin"/>
                  <el-popover
                    ref="popover1"
                    placement="top-start"
                    :disabled="disabled"
                    width="150"
                    trigger="hover">
                    <div class="infos">
                      <span @click="accountInfo" class="accountMsg">账号信息</span>
                      <!-- <span @click="resetPwd" class="password">修改密码</span> -->
                    </div>
                  </el-popover>
                  <el-button class="content_name" v-popover:popover1 type="text" round>{{dataJson.account}}</el-button>
                  <img src="/static/images/close.png" class="close" @click="toLogin()"/>
              </div>
          </template>
      </el-menu>
		</div>
  </div>
</template>

<script>
  var Base64 = require('js-base64').Base64;
  var localStorage = window.localStorage
  export default {
    data() {
      return {
        oaUrl: '',
        compCode: '',
        dataJson: {},
        listViewH: 600, //块的最大高度
        isCollapse: false,
        disabled:false,
        showFold: true,
        showOnlyOne:true,
        pfManagemenShow: false,
        formLabelWidth: '120px',
        userMessageShow: false,//个人信息框
        uamss: '', //是什么登录
        /*左侧栏*/
        slideItems: [
          {
            icon: 'el-icon-star-on',
            index: 'readme',
            title: '平台简介'
          }/*,{
            icon: 'el-icon-menu',
            index: 'readme',
            title: 'OA系统'
          }*/, {
          	icon: 'el-icon-menu',
          	index: '2',
          	title: '开放服务',
          	subs: []
          }, {
            icon: 'el-icon-menu',
            index: '3',
            title: '权限管理',
            subs: []
          }, {
            icon: 'el-icon-menu',
            index: '4',
            title: '配置管理',
            subs: []
          }, {
            icon: 'el-icon-menu',
            index: '5',
            title: '运维服务',
            subs: []
          }
        ],
        /*开放服务栏*/
        serviceConfigItems: [],
        serviceChildItems: [], 

        /*权限管理栏*/
        authDefultItems: [
          {
            index: 'newadmin',
            title: '新增管理员'
          },
          {
            index: 'accountBindFacility',
            title: '账户设备绑定'
          },
          {
            index: 'userLoginRecord',
            title: '用户登录记录'
          },
          {
            index: 'addcompanylogo',
            title: '更换企业logo'
          },
          {
            icon: 'el-icon-share',
            index: '3-1',
            title: '用户类型控制',
            children: [
              {
                index: 'link',
                title: '页面访问控制'
              }, {
                index: 'spaceSetting',
                title: '空间资源配置'
              }, {
                index: 'userTypeChange',
                title: '用户类型变更'
              }/*, {
                index: 'enterpriseUserImport',
                title: '企业用户导入'
              }*/
            ]
          }, {
            icon: 'el-icon-share',
            index: '3-2',
            title: '角色类型控制',
            children: []
          }
        ],

        authorityItems: [],
        groupItems: [], /*集团*/
        companyItems: [], /*企业*/

        /*配置管理栏*/
        pfManagementItems: [
          {
            index: 'flatcompany',
            title: '平台企业管理'
          }, {
            index: 'ServiceControl',
            title: '配置服务器监控'  
          }, {
            icon: 'el-icon-share',
            index: '4-4',
            title: '开放服务配置',
            children: [{
              index: 'Serviceconfig',
              title: '服务配置'
            }, {
              index: 'Portconfig',
              title: '接口配置'
            }, {
              index: 'TopicPushConfig',
              title: '消息推送配置'
            }]
          }, {
            icon: 'el-icon-share',
            index: '4-5',
            title: 'url链接配置',
            children: [{
              index: 'MonEnConfig',
              title: '监控企业配置'
            }, {
              index: 'MonLabConfig',
              title: '监控实验室配置'
            }, {
              index: 'MonSysConfig',
              title: '监控项目配置',
            }, {
              index: 'MonUrlConfig',
              title: '监控链接配置'
            }, {
              index: 'UserLevelConfig',
              title: '用户级别配置'
            }]
          } 
        ],


        /*服务器监控栏*/
        serviceControlItems:[
          {
            icon: 'el-icon-share',
            index: '5-1',
            title: '硬件信息监控',
            children:[]
          }, {
            icon: 'el-icon-share',
            index: '5-2',
            title: 'url链接监控',
            children: []
          }
        ],

        monEmpItems: [], /*监控企业*/
        monGroupItems: [], /*监控集团*/
        monCompanyItems: [], /*监控企业*/

        //消息推送服务固定栏
        inforItems: {
          mId: 177,
          id: 888,
          interName:'消息推送'
        },
      }
    },
    watch: {
      '$route': {
        handler: function(val, oldval) {
          let self = this
          let compCode = Base64.decode(self.$route.query.comp_code)
          let storage = JSON.parse(localStorage.getItem('dataJson')),
              uams = localStorage.getItem('uams')
          self.uamss = uams
          if(compCode) {
            storage.comp_code = compCode
            localStorage.setItem("dataJson", JSON.stringify(storage))
          }
          self.listViewH = self.$refs.bar.offsetHeight - 155 - 54
          /*刷新左侧栏*/
          if(val.path === '/serviceconfig' || val.path === '/Portconfig') {
            self.serviceConfigItems = []
            self.serviceChildItems = []
            self.serviceConfig()
          } else if(val.path === '/flatcompany') {
            self.authorityItems = []
            self.groupItems = []
            self.companyItems = []
            if(uams === self.PLAT_ADMIN) {
              /*平台管理员*/
              self.adminCompQuery() 
            } else if(uams === self.ENTERPRISE_ADMIN){
              /*企业管理员*/
              // self.sessionLoseEfficacy()
              self.compQuery(self.compCode)
            }
          } else if(val.path === '/ServiceControl') {
            /*self.serviceControlItems = []*/
            self.serConQuery()
          } else if(val.path === '/monEnConfig') { /*监控企业配置*/
            self.monEmpItems = []
            self.monGroupItems = []
            self.monCompanyItems = []
            self.monEnpQuery()
          }
          
        }
      }   
    },
    mounted() {
      let self = this
      let storage = JSON.parse(localStorage.getItem('dataJson')),
          username = localStorage.getItem('username'),
          password = localStorage.getItem('password'),
          uams = localStorage.getItem('uams')
      self.uamss = uams  
      if (storage.sessionId == '' || storage.sessionId == undefined) {
        self.disabled = true;
      }else {
        self.disabled = false;
      }  
      if(uams === self.PLAT_ADMIN) {
        self.oaUrl = self.OA_URL
      } else {
        self.oaUrl = self.OA_URL + "?sessionId=" + storage.sessionId
      }

      if(localStorage.getItem('compCode') !== null) {
        self.compCode = localStorage.getItem('compCode').replace("\"","").replace("\"","")
      }
      self.dataJson = storage
      /*企业管理员登录*/
      if(uams === self.ENTERPRISE_ADMIN) {

        self.slideItems = [
          {
            icon: 'el-icon-star-on',
            index: 'readme',
            title: '平台简介'
          }, {
            icon: 'el-icon-menu',
            index: 'readme',
            title: 'OA系统'
          }, {
            icon: 'el-icon-menu',
            index: '2',
            title: '开放服务',
            subs: []
          }, {
            icon: 'el-icon-menu',
            index: '3',
            title: '权限管理',
            subs: []
          }/*, {
            icon: 'el-icon-menu',
            index: '5',
            title: '服务器监控',
            subs: []
          }*/
        ]
      } 
      if (storage.hasOwnProperty("pattern")) {
        self.slideItems = [
          {
            icon: 'el-icon-star-on',
            index: 'readme',
            title: '平台简介'
          }, {
            icon: 'el-icon-menu',
            index: '2',
            title: '开放服务',
            subs: []
          }
        ]
      }
      self.listViewH = self.$refs.bar.offsetHeight - 155 - 54
      self.serviceConfig() /*加载开放服务侧单栏*/

      if(uams === self.PLAT_ADMIN) {
        // 验证sessionId是否失效
        // self.sessionLoseEfficacy()
        /*超级管理员登录admin登录*/
        self.adminCompQuery() 
      } else if(uams === self.ENTERPRISE_ADMIN) {
        /*企业管理员登录*/
        self.compQuery(self.compCode)
      } //否则是游客登录

      /*加载服务器监控*/
      self.serConQuery()

      /*加载监控企业*/
      self.monEnpQuery()
    },
    methods: {
      sessionLoseEfficacy(){//验证sessionId是否失效
        let self = this;
        let dataJson = JSON.parse(localStorage.getItem('dataJson'))
        self.$axios({
          url: self.USER_URL + '/administrator-api.getAdministrator',
          method: 'post',
          responseType: 'json',
          data: {
            'sessionId': dataJson.sessionId
          }
        })
        .then(function(res) {
          console.log("验证sessionId是否失效",res)
          if(res.data.status != 1) {
            self.$message({
              message: 'sessionId已失效，从重新登录',
              type: 'error',
              duration:1500
            });
            self.$router.push('/login');
          }
        })
      },
      accountInfo(){//账号信息
        let self = this;
        self.$router.push('/accountInfos');
      },
      resetPwd(){//修改密码
        let self = this;
        self.$router.push('/resetPwd');
      },
      fold() {
      	let self = this
      	self.isCollapse = self.isCollapse === false ? true : false
      	self.showFold = self.showFold === false ? true : false
      },
      serviceConfig() {  /*开放服务一级查询*/
        let self = this
        self.$axios({
          url: self.BP_HOST + '/module/sel',
          method: 'get',
          responseType: 'json',
          data: {
            'serviceName': ""
          }
        })
        .then(function(res) {
          if(res.status === 200) {
            self.serviceConfigItems = res.data.data
            // console.log('serviceConfigItems',self.serviceConfigItems)
            self.$nextTick(() => {
              for(let i = 0; i < self.serviceConfigItems.length; i++) {
                self.selByMid(self.serviceConfigItems[i].id,self.serviceConfigItems[i].serviceName)
              }
            })
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      selByMid(mId,sName) {   /*开放服务二级查询,根据mid查询出子菜单*/
        let self = this
        self.$axios({
          url: self.BP_HOST + '/inter/sel?pageSize=10&currentPage=1&mId=' + mId + '&interName=',
          method: 'get',
          responseType: 'json'
        })
        .then(function(res) {
          if(res.status === 200) {
            let list = res.data.data;
            if(sName == '消息推送服务'){
              list.unshift(self.inforItems)
            }
            self.serviceChildItems.push(list)
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      adminCompQuery() { /*admin登录权限管理,查询所有企业*/
        let self = this
        self.$axios({
          url: '/UAMS/company/do_comp_query?pageSize=10000&currentPage=1',
          method: 'post',
          responseType: 'json',
          data: {
            compName: ""
          }
        })
        .then(function(res) {
          if(res.status === 200) {
            self.authorityItems = res.data.data.list
            for(let index in self.authorityItems) {
              if(self.authorityItems[index].isGroup === 'Y') {
                self.groupItems.push(self.authorityItems[index])
              } else {
                self.companyItems.push(self.authorityItems[index])
              }
            }

            self.groupItems.forEach(function(item, index) {
              item.comp_code = Base64.encode(item.comp_code)
            })
            self.companyItems.forEach(function(item, index) {
              item.comp_code = Base64.encode(item.comp_code)
            })
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      compQuery(compCode) { /*非admin登录*/
        let self = this
        self.$axios({
          url: '/UAMS/Auth/queryCompany',
          method: 'post',
          responseType: 'json',
          data: {
            compCode: compCode
          }
        })
        .then(function(res) {
          if(res.status === 200) {
            self.groupItems.push(res.data.data.company)
            self.companyItems = res.data.data.companyChildren

            self.groupItems.forEach(function(item, index) {
              item.comp_code = Base64.encode(item.comp_code)
            })
            self.companyItems.forEach(function(item, index) {
              item.comp_code = Base64.encode(item.comp_code)
            })
          }

        })
        .catch(function(res) {
          console.log("compQuery error", res)
        })
      },
      serConQuery() {  /*加载服务器监控*/
        let self = this
        self.$axios({
          url: '/basic-platform/server/sel?pageSize=100',
          method: 'get',
          responseType: 'json'  
        })
        .then(function(res) {
          if(res.status === 200) {
            self.serviceControlItems[0].children = res.data.data
          }
        })
        .catch(function(res) {
          console.log("queryData error", res) 
        })
      },
      handleOpen(key, keyPath) {
        let self = this
        if(keyPath[0] === "3" && keyPath.length === 3) {
          if(self.uamss === self.PLAT_ADMIN) {
            /*平台管理员*/
            self.$router.push("sysgover?comp_code=" + key)
          } else if(self.uamss === self.ENTERPRISE_ADMIN){
            /*企业管理员*/
            self.$router.push("resource?comp_code=" + key)
          }
        } else if(keyPath[0] === "5" && keyPath.length === 3) {
          self.$router.push("urlLink?id=" + key)
        }
      },
      handleClose(key, keyPath) {
        let self = this
        if(keyPath[0] === "3" && keyPath.length === 3) {
          if(self.uamss === self.PLAT_ADMIN) {
            /*平台管理员*/
            self.$router.push("sysgover?comp_code=" + key)
          } else if(self.uamss === self.ENTERPRISE_ADMIN){
            /*企业管理员*/
            self.$router.push("resource?comp_code=" + key)
          }
        } else if(keyPath[0] === "5" && keyPath.length === 3) {
          self.$router.push("urlLink?id=" + key)
        }
      },
      toLogin(){
        let self = this;
        localStorage.clear()
        self.$router.push('/login');
      },
      monEnpQuery() {
        let self = this
        self.$axios({
          url: '/basic-platform/enterprise/sel',
          method: 'get',
          responseType: 'json',
        })
        .then(function(res) {
          if(res.status == 200) {
            self.monEmpItems = res.data.data
            for(let index in self.monEmpItems) {
              if(self.monEmpItems[index].isGroup === 'Y') {
                self.monGroupItems.push(self.monEmpItems[index])
              } else {
                self.monCompanyItems.push(self.monEmpItems[index])
              }
            }
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      }
    },
    filters: {
      intToString(value) { 
        if(!value) return ''
        return value.toString()
      }
    }
  }
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    position: relative;
    overflow-y: scroll;
    /* width: 250px; */
    /* width: 110%; */
    width: 267px;
    min-height: 400px;
  }

	.slidebar {
    width: 250px;
		height: 100%;
		float: left;
		display: block;
		background: #324157;
	}
 /*  .slidebar-width {
   width: 250px;
 } */

  .g-logo {
    height: 100px;
    margin-top: 55px;
  }
  .g-logo img {
    display: block;
    float: left;
    margin-left: 20px;
  }

  .g-logo span {
    float: left;
    display: inline-block;
    height: 60px;
    line-height: 60px;
    margin-left: 15px;
    font-size: 17px;
    color: #fff;
  }
  .left_footer{
    position: fixed;
    width:250px;
    height:54px;
    background:#131519;
    bottom: 0;
  }
  .infos {
    position: relative;
  }
  .infos .accountMsg {
    /* margin-left: 8px; */
    margin-left: 50px;
  }
  .infos .password {
    position: absolute;
    right: 8px;
  }
  .left_footer .infos span {
    display: inline-block;
    /*text-align: justify;*/
    /*text-align-last:justify;*/
    /*float: left;*/
    /*font-weight: bold;*/
    /*display:-webkit-box;
    display:box;
    -webkit-box-pack:justify;
    box-pack:justify;*/
    /*text-align: justify-all;*/
    text-align: center;
    font-size: 24px;
  }
  .infos span:hover {
    color: #66b1ff;
    cursor: pointer;
  }
  .admin,.content_name{
    float:left;
    margin-top:20px;
    margin-left: 10px;
  }
  .close{
    float:right;
    margin-top:20px;
    margin-right: 10px;
    cursor: pointer;
  }
  .content_name{
     margin-top:10px;
    width: 160px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
    font-size: 20px;
    color:#fff;
    cursor: default;
  }
  .sidebar_box {
    overflow-x: hidden;
  }
  .activeClass {
    color: red;
  }
  .a-st {
    color: #bfcbd9;
  }
</style>

<style>
  .el-menu-item {
    white-space:nowrap;
    text-overflow: ellipsis;
    overflow:hidden;
    width: 100%;
  }
</style>