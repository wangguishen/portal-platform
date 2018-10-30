<template>
	<div @click="pageClick" class="s-wrap">
		<!-- <el-select v-model="compCode" placeholder="请选择企业" filterable class="ipt_wid" @change="compChange(compCode)">
          <el-option
            v-for="item in cliques"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
  
    <!-- todo -->
    <div>
      <el-cascader
      expand-trigger="hover"
      :options="compOptions"
      v-model="selectedOptions2"
      @change="compOptionsChange"
      change-on-select
      filterable
      clearable
      :props="props"
      style="width: 35%"
      placeholder="请选择企业">
      </el-cascader>
    </div>

	  <div class="box" @click.stop="show()">
	    <el-input
		  	placeholder="请选择用户"
		  	:icon="icons"
		  	v-model="value"
		  	:on-icon-click="handleIconClick"
		  	@focus="handleFocus"
		  	@blur="handleBlur"
		  	class="user_box">
			</el-input>
			<div class="option_box" v-show="optionBoxShow">
				<ul class="option_ul" v-scroll="onScroll">
					<li class="row_all" @click="userChange(item)" v-for="item in userList">{{item.name || item.userName}}</li>
					<div class="preloader" v-show="preloaderShow">
						<i class="el-icon-loading"></i>
					</div>
				</ul>
			</div>
  	</div>

    <div style="margin-top:50px">
      <div><span style="color: #1f2d3d;">用户类型</span></div>
      <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
      </el-checkbox> -->
      <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedCities">
          <el-checkbox style="margin-left:0;margin-right:15px;margin-bottom:15px" v-for="city in cities" :label="city.typeCode" :key="city.typeCode" :value="city.typeCode" @change="handleCheckedCitiesChange">{{city.typeName}}
          </el-checkbox>
        </el-checkbox-group>
    </div>
  	<el-button type="primary" class="sq-btn" @click="updateUserType()">用户类型变更</el-button>

	</div>
</template>

<script>
  /*var cityOptions = [{
    name: 'B用户',
    value: '1'
  }, {
    name: 'C用户',
    value: '2'
  }, {
    name: '服务商',
    value: '3'
  }, {
    name: '供应商',
    value: '4'
  }, {
    name: '分销商',
    value: '5'
  }]*/
  var cityOptions = []

  export default {
  	data() {
  		return {
  			cliques: [],
  			compCode:'',
  			userInfo: '',
  			// select
      	optionBoxShow:false,
      	preloaderShow:false,//加载符显示
      	state:0,
      	icons:"caret-bottom",//尾部图标
      	oneClick: true,
      	checkUser: '',
      	userList: [],
      	value: '',
      	pageSize: 10,
      	currentPage: 1,
        accountCompCode: '', //登录帐号的企业编码
        /*用户类型*/
        checkAll: false,
        checkedCities: [],
        initCities: [],
        cities: cityOptions,
        isIndeterminate: false,
        adminSessionId: '',   //用户中心admin帐号的sessionId
        parentEnterpriseCode: '', //父集团编码

        /*cascader*/
        selectedOptions2: [],
        props: {
          label: 'comp_name',
          value: 'comp_code',
          children: 'enterprises'
        },
        compOptions: [],
      }  
  	},
  	mounted() {
  	  let self = this
      self.accountCompCode = localStorage.getItem('compCode')
      let uams = localStorage.getItem('uams')
      let storage = JSON.parse(localStorage.getItem('dataJson'))
      self.adminSessionId = localStorage.getItem('adminSessionId')

      if(self.accountCompCode) {
        self.accountCompCode = self.accountCompCode.replace("\"","").replace("\"","")
      }

      //平台管理员登录
      if(uams === self.PLAT_ADMIN) {
        /*self.referCode()*/
        self.compCode = ''
      } else {
        self.compCode = JSON.parse(localStorage.getItem('compCode'))
      }
      
      self.queryAllType()
      self.queryUser()
      self.singleQuery(self.compCode)
  	},
  	watch: {
  		'value': {  
        handler:function(val,oldval) {
          let self = this;
          self.preloaderShow = true;

          /*if(!self.compCode) {
          	self.userList = []
          	self.preloaderShow = false
  	  		  self.userList.push({name: "暂无用户"})
  	  		  return
  	  	  }*/

          if(val != oldval) {
          	self.userList = []
          	self.currentPage = 1
          	setTimeout(() => {
          	  self.queryUser()
              /*self.findByEnterpriseCode()*/
          	}, 1000)
          }
        },  
        deep:true//对象内部的属性监听，也叫深度监听  
      },
      'checkedCities': {
        handler: function(val, old){
          let self = this;
        },
        deep:true
      }
  	},
  	methods: {
  		referCode() { //查询所有的企业
        let self = this;
        self.$axios({
          url: '/UAMS/company/do_comp_query?pageSize=100000',
          method: 'post',
          responseType: 'json',
          data: {
            "compName":""
          }
        })
        .then(function(res) {
          let list = res.data.data.list;
          console.log("list", list)
          list.forEach(function(item, index){
            item.label = item.comp_name;
            item.value = item.comp_code;
          })
          self.cliques = list;
        })
        .catch(function(res) {
          console.log("error", res);
        })
      },
      queryCompByCompCode(compCode) { //根据企业编码查询
        let self = this
        self.$axios({
            url: '/UAMS/Auth/queryCompany',
            method: 'post',
            data: {
              "compCode": self.accountCompCode ? self.accountCompCode : ''
            }   
        })
        .then(function(res) {
            if(res.status === 200) {

                function DefaultCompStory(label, value) {
                      this.label = label
                      this.value = value
                }

                let resData = res.data.data
                console.log("resData" , resData)
                /*if(resData.company) {
                  self.cliques.push(new DefaultCompStory(resData.company.comp_name, resData.company.comp_code))
                }*/
                if(resData.companyChildren.length !== 0) {
                  for(let index in resData.companyChildren) {

                    self.cliques.push(new DefaultCompStory(resData.companyChildren[index].comp_name, resData.companyChildren[index].comp_code))
                  }
                }
            }
        })
        .catch(function(res) {
              console.log("queryComp error", res)
        }) 
      },
  	  onScroll(e, position){
    		let self = this;
    		let ulBox = document.getElementsByClassName('option_ul');
    		let ofH = ulBox[0].offsetHeight;
    		let scH = ulBox[0].scrollHeight;
    		if(position.scrollTop == (scH-ofH)){
    			if(self.statEach == 0){
    				self.statEach++;
    				self.currentPage++;
    				self.infiniteload();
    			}
    		}else{
    			self.statEach = 0;
    		}
	  	},
	  	handleFocus(){
    		let self = this;
			  self.icons = "caret-top";
			  self.optionBoxShow = true;
    	},
    	handleBlur(e){
			  let self = this;
    	},
    	handleIconClick(e){
    		let self = this;
    		if(self.icons == "caret-bottom"){
    			self.icons = "caret-top";
    			self.optionBoxShow = true;
    		}else{
    			self.icons = "caret-bottom";
    			self.optionBoxShow = false;
    		}
    	},
    	handleSelect(item) {
    	},
    	userChange(item) {
        console.log("item", item)
    		let self = this
    		self.icons = "caret-bottom";
			  self.optionBoxShow = !self.optionBoxShow;
			  self.currentPage = 1 
			  self.value = item.name || item.userName
    		self.userInfo = item

        self.findByEnterpriseCode()
    	},
    	/*compChange(compCode) {
    		let self = this
    		self.compCode = compCode
        self.queryAllType()
        
        self.$axios({
          url: '/UAMS/Auth/queryCompany',
          method: 'post',
          data: {
            "compCode": compCode
          }
        })
        .then(function(res) {
          if(res.data.success) {
            let resData = res.data.data
            console.log("res", resData)
            if(resData.company) {
              self.parentEnterpriseCode = []
              console.log("1", resData.company.cluster_code)
              self.parentEnterpriseCode.push(resData.company.cluster_code)
              console.log("2", self.parentEnterpriseCode)
            }
          } 
        })
        .catch(function(res) {
          console.log("error", res)
        })

    		self.queryUser()
    	},*/
  	  queryUser() { //获取企业下用户
        let self = this
        /*self.$axios({
          url: "/UAMS/user/list?pageSize=10&currentPage=" + self.currentPage,
          method: 'post',
          responseType: 'json',
          data: {
            compCode: self.compCode,
            username: self.value
          }
        })
        .then(function(res) {
          if(res.data.success) {
            let list = res.data.data.data
            if(list.length != 0) {
            	self.userList = []
              list.forEach(function(item, index){
                self.userList.push(item)
              })
            } else {
              self.userList = []
              self.userList.push({real_name: "暂无用户"});
            }

    				self.preloaderShow = false;
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })*/
        
        //到用户中心获取用户
        self.$axios({
          url: '/account_auth_admin/user-api.findUser',
          method: 'post',
          responseType: 'json',
          data: {
            pageSize: self.pageSize,
            pageNumber: self.currentPage,
            key: self.value,
            sessionId: self.adminSessionId,
            sort: ''
          }
        })
        .then(function(res) {
          console.log("success", res)
          if(res.data.status !== 1) return
          let list = res.data.data.items
          if(list.length === 0) {
            self.userList = []
            self.userList.push({name: "暂无用户"})
            self.preloaderShow = false
            return
          }

          self.userList = []
          list.forEach(function(item, index) {
            self.userList.push(item)
          })

          self.preloaderShow = false
          console.log("self.userList", self.userList)
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      show() {
      },
      infiniteload() {//无限加载
    		let self = this;
      	self.preloaderShow = true;
      	/*let data = {
      		'username':self.value,
	      	'compCode':self.compCode,
	      	'pageSize':self.pageSize,
	      	'currentPage':self.currentPage
      	}
      	self.$axios({
          url: "/UAMS/user/list?pageSize="+self.pageSize+"&currentPage="+self.currentPage,
		    	method: 'post',
		    	responseType: 'json',
		    	data: data
      	})
      	.then(function(res) {
	      	if(res.status == 200){
	      		if(res.data.success){
	      			let list = res.data.data.data
	      			if(list.length != 0){
						    list.forEach(function(item, index){
				      		self.userList.push(item)
				      	})
				      	self.preloaderShow = false;
	      			} else {
	      				self.preloaderShow = false;
	      			}
	      		}
	      	}		      	
      	})
      	.catch(function(res) {
      		console.log("error", res)
      	})*/

        let datas = {
          pageSize: self.pageSize,
          pageNumber: self.currentPage,
          key: self.value,
          sessionId: self.adminSessionId,
          sort: ''
        }

        self.$axios({
          url: '/account_auth_admin/user-api.findUser',
          method: 'post',
          responseType: 'json',
          data: datas
        })
        .then(function(res) {
          console.log("success", res)
          if(res.data.status !== 1) return
          let list = res.data.data.items
          self.preloaderShow = false
          if(list.length === 0) {
            console.log("无数据") 
            return
          }

          list.forEach(function(item, index) {
            self.userList.push(item)
          })

          console.log("self.userList", self.userList)
        })
        .catch(function(res) {
          console.log("error", res)
        })
    	},
    	pageClick() {
    		let self = this
        console.log("self.icons", self.icons)
        if(self.icons == "caret-top"){
  			  self.icons = "caret-bottom"
  			  self.optionBoxShow = false
  		  }
  		},
      // handleCheckAllChange(event) {
      //   let self = this
      //   if(event.target.checked) {
      //     for(let index in cityOptions) {
      //       self.checkedCities.push(cityOptions[index].typeCode)
      //     }
      //   } else {
      //     self.checkedCities = []
      //   }
      //   self.isIndeterminate = false;
      // },
      handleCheckedCitiesChange(item) {
        let self = this;
        console.log('item',item)
        let value = item.target.value;
        console.log('当前value',value)
        console.log(self.checkedCities[0])
        if(value == "CUSER" ){
          if (item.target.checked) {
            for(let x=0;x<self.checkedCities.length;x++){
              if (self.checkedCities[x] == "BUSER") {
                self.checkedCities.splice(x,1)
              }
            }
          }
        }else if(value == "BUSER" ){
          if (item.target.checked) {
            for(let y=0;y<self.checkedCities.length;y++){
              if (self.checkedCities[y] == "CUSER") {
                self.checkedCities.splice(y,1)
              }
            }
          }
        }
        // let checkedCount = value.length;
        // this.checkAll = checkedCount === this.cities.length;
        // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
          
        
      },
      queryAllType() {  //查询出所有的用户类型
        let self = this
        self.$axios({
          url: '/account_auth_admin/user-api.findAllType',
          method: 'post',
          responseType: 'json',
          data: {
            sessionId: self.adminSessionId
          }
        })
        .then(function(res) {
          console.log('queryAllType',res);
          let list = res.data.data
          cityOptions = list
          self.cities = cityOptions
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      updateUserType() { //变更用户类型
        let self = this
        console.log("self.compCode", self.compCode, "self.userInfo", self.userInfo, "self.checkedCities", self.checkedCities)

        if(!self.compCode) {
          self.$message({
            type: 'warning',
            message: '请选择企业'
          })
          return
        }

        if(!self.value) {
          self.$message({
            type: 'warning',
            message: '请选择用户'
          })
          return
        }

        let str = ''
        for(let index in self.checkedCities) {
          str += self.checkedCities[index] + ','
        }

        str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;

        /*self.parentEnterpriseCode = self.parentEnterpriseCode[0] ? self.parentEnterpriseCode[0] : self.compCode*/

        let userTypeData = {
          inenterpriseCode: self.compCode,
          parentEnterpriseCode: self.parentEnterpriseCode,
          userType: str
        }

        let datas = {
          "sessionId": self.adminSessionId,
          "userId": self.userInfo.userId,
          "enterpriseCodeUserType": JSON.stringify(userTypeData)
        }

        console.log("datas", datas)

        if(self.checkedCities.length === 0) {
          //调用解除用户与企业关系方法
          let delEnterpriseCode = self.compCode + ',' + self.parentEnterpriseCode
          console.log("=========str", delEnterpriseCode)
          self.deleteEnterprisUser(delEnterpriseCode)
          return
        }

        self.$axios({
          url: '/account_auth_admin/user-api.updateUserType',
          method: 'post',
          responseType: 'json',
          data: datas
        })
        .then(function(res) {
          console.log("success", res)
          if(res.data.status === 1) {
            self.$message("变更用户类型成功")
            self.queryUser()
          } else {
            self.$message({
              type: 'warning',
              message: '变更用户类型失败'
            })
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      findByEnterpriseCode () { //查询出企业下用户的用户类型
        let self = this
        console.log("self.compCode", self.compCode, "self.userInfo", self.userInfo, self.value)
        self.$axios({
          url: '/account_auth_admin/user-api.findByEnterpriseCode',
          method: 'post',
          responseType: 'json',
          data: {
            sessionId: self.adminSessionId,
            enterpriseCode: self.compCode,
            userId: self.userInfo.userId
          }
        })
        .then(function(res) {
          console.log('findByEnterpriseCode',res);
          if(res.data.status === 1) {
            let list = res.data.data
            self.checkedCities = []
            list.forEach((item, index) => {
              self.checkedCities.push(item.type)
            })

            // self.handleCheckedCitiesChange(self.checkedCities)
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      deleteEnterprisUser(delEnterpriseCode) {  //解除用户与企业关系
        let self = this
        self.$axios({
          url: '/account_auth_admin/user-api.deleteEnterprisUser',
          method: 'post',
          responseType: 'json',
          data: {
            appCode: "ACCOUNT",
            clientIp: "127.0.0.1",
            encryptCode: "123456",
            account: "admin",
            password: "e10adc3949ba59abbe56e057f20f883e",
            mobile: self.userInfo.mobile,
            enterpriseCode: delEnterpriseCode
          }
        })
        .then(function(res) {
          console.log("successs", res)
          if(res.data.status === 1) {
            self.$message("解除用户与企业关系成功")
          } else {
            self.$message({
              type: 'warning',
              message: '解除用户与企业关系失败'
            })
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      compOptionsChange(value) {
        let self = this
        self.parentEnterpriseCode = value[0]
        if(self.selectedOptions2.length > 0) {
          self.compCode = self.selectedOptions2[self.selectedOptions2.length - 1]
        }
        /*self.queryAllType()*/
        self.findByEnterpriseCode()
      },
      singleQuery(compCode) {
        let self = this
        self.$axios({
          url: '/UAMS/company/do_comp_single_query_bycompanycode',
          method: 'post',
          responseType: 'json',
          data: {
            compCode: compCode,
            type: "0"
          }
        })
        .then(function(res) {
          console.log("success", res)
          if(res.data.success) {
            let list = res.data.data
            self.recursionDelete(list)
            self.compOptions = list
          }
        })  
        .catch(function(res) {
          console.log("error", res)
        })
      },
      recursionDelete(list) { //递归删除enterprises为空的属性
        let self = this
        list.forEach(function(item, index) {
          if(item.enterprises.length === 0) {
            delete item.enterprises
          } else {
            self.recursionDelete(item.enterprises)
          }
        })
      }
  	}
  }
</script>

<style scoped>
  .s-wrap {
    height: 100%;
  }
	ul,li{
		list-style:none;  
	}
	.ipt_wid{
		width: 16%;
	}
	.area_wid{
		width: 60%;
	}
	
	.role-left {
		margin-top: 10px;
		min-height: 600px;
	}
	.sq-btn {
		width: 180px;
		margin-top: 40px;
	}
	.box{
		position: relative;
		max-width: 200px;
		margin-top: -38px;
		margin-left: 45%;
	}
	.option_box{
		position: absolute;
		top: 37px;
		left: 0;
		z-index: 10;
		width: 100%;
		height: 250px;
		background-color: #fff;
		border: 1px solid #eee;
		overflow: hidden;
		box-sizing: border-box;
	}
	.option_ul{
		width: 120%;
		max-height: 250px;
		overflow-y:scroll;
		overflow-x:hidden;
		white-space:nowrap;
	}
	.row_all,.preloader{
		width: 100%;
		height: 35px;
		line-height: 35px;
		padding-left: 10px;
		color: #666;
		cursor: pointer;
	}
	.preloader{
		/* color: ; */
		width: 200px;
		padding: 0;
		text-align: center;
		cursor: default;
	}
	.row_all:hover{
		color: #333;
		background: #eee;
	}
</style>