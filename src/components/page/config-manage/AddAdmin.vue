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

    <div style="display:inline-block;width:100%;">
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
      <el-select v-model="userValue" placeholder="请选择系统" style="margin-left:20px" @change="userChange(userValue)">
        <el-option
           v-for="item in userOptions"
           :key="item.value"
           :label="item.label"
           :value="item.value">
        </el-option>
      </el-select>
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
          <li class="row_all" @click="userChange(item)" v-for="item in userList">{{item.real_name || item.username}}</li>
          <div class="preloader" v-show="preloaderShow">
            <i class="el-icon-loading"></i>
          </div>
        </ul>
      </div>
    </div>
    </div>
    <div class="box2">
      
    </div>
	  <!-- <div class="box" @click.stop="show()">
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
					<li class="row_all" @click="userChange(item)" v-for="item in userList">{{item.real_name || item.username}}</li>
					<div class="preloader" v-show="preloaderShow">
						<i class="el-icon-loading"></i>
					</div>
				</ul>
			</div>
  	</div> -->
  	<el-button type="primary" class="sq-btn" @click="addAdmin()">添加管理员</el-button>
	</div>
</template>

<script>
  export default {
  	data() {
  		return {
  			cliques: [],
        dataJson:{},
        uams:'',
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

        selectedOptions2: [],
        props: {
          label: 'comp_name',
          value: 'comp_code',
          children: 'enterprises'
        },
        compOptions: [],
        userValue:'',
        userOptions:[],
  		}
  	},
  	mounted() {
  	  let self = this
      self.accountCompCode = localStorage.getItem('compCode')
      self.dataJson = JSON.parse(localStorage.getItem('dataJson'));
      let uams = localStorage.getItem('uams')
      self.uams = uams
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

      self.singleQuery(self.compCode)
  	},
  	watch: {
  		'value': {  
        handler:function(val,oldval) {
          let self = this;
          self.preloaderShow = true;

          if(!self.compCode) {
          	self.userList = []
          	self.preloaderShow = false
  	  		  self.userList.push({real_name: "暂无用户"})
  	  		  return
  	  	  }

          if(val != oldval) {
          	self.userList = []
          	self.currentPage = 1
          	setTimeout(() => {
          	  self.queryUser()
          	}, 1000)
          }
        },  
        deep:true//对象内部的属性监听，也叫深度监听  
    },
  	},
  	methods: {
      compSys(){
        let self = this;
        self.userOptions = []
        self.$axios({
          url: "/UAMS/Authenticate/do_system_query",
          method: 'post',
          responseType: 'json',
          data: {
            'compCode':self.selectedOptions2[self.selectedOptions2.length-1],
            'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
          }
        })
        .then(function(res) {
          console.log("加载系统",res)
          if(res.data.success){
            let list = res.data.data.list;
            if(list.length == 0){
              // self.moduleRelevanceVisible = false;
            }else{
              let list = res.data.data.list;
              list.forEach(function(item,index){
                self.$set(item, 'label' , item.system_name)
                self.$set(item, 'value' , item.id)
                self.userOptions.push(item)
              })
              // self.userOptions = list;
            }
          }else{
            console.log("后台返回错误")
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      userChange(userValue) { /*改变用户*/
          let self = this
          console.log(self.selectedOptions2)
          // self.checkedCities = []
          // self.initCities = []
          // self.queryUrlByComp(self.compValue, self.userValue)
      },
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
      queryCompByCompCode() { //根据企业编码查询
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
    		let self = this
    		self.icons = "caret-bottom";
			  self.optionBoxShow = !self.optionBoxShow;
			  self.currentPage = 1
			  self.value = item.real_name || item.username
    		self.userInfo = item
    	},
    	compChange(compCode) {
    		let self = this
    		self.compCode = compCode
    		self.queryUser()
    	},
  	  queryUser() { //获取企业下用户
        let self = this
        self.$axios({
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
        })
      },
      show() {
      },
      infiniteload() {//无限加载
    		let self = this;
      	self.preloaderShow = true;
      	let data = {
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
      	})
    	},
    	addAdmin() {
    		let self = this
    		if(self.compCode === '') {
    			self.$message({
    				message: '请选择企业',
    				type: 'warning'
    			})
    			return
    		}
    		if(self.userInfo === '') {
    			self.$message({
    				message: '请选择用户',
    				type: 'warning'
    			})
    			return
    		}

        let proInfo = ''
        if(!self.userInfo.account) {
          proInfo = 'account不能为空'
        } else if(!self.userInfo.password) {
          proInfo = '密码不能为空'
        } else if(!self.compCode) {
          proInfo = '企业编码不能为空'
        }else if(self.userInfo.real_name == '' && self.userInfo.username == '') {
          proInfo = '用户名不能为空'
        }
        console.log()
        let date = {
            account: self.userInfo.account,
            password: self.userInfo.password,
            compCode: self.compCode,
            name: self.userInfo.real_name || self.userInfo.username,
            systemId: self.userValue,
            'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
          }
          console.log(date)
    		self.$axios({
    			url: '/UAMS/Authenticate/addAdminManager',
    			method: 'post',
    			responseType: 'json',
    			data: date
    		})
    		.then(function(res) {
          console.log("ressss",res)
    			if(res.data.success) {
    				self.$message({
    					message: '添加成功',
    					type: 'success'
    				})
    				self.$router.push("/newadmin")
    			} else {
    				self.$message({
    					message: '添加失败,' + proInfo,
    					type: 'warning'
    				})
    			}
    		})
    		.catch(function(res) {
    			console.log("res", res)
    		})
    	},
      compOptionsChange() {
        let self = this
        console.log(self.selectedOptions2)
        if(self.selectedOptions2.length > 0) {
          self.compChange(self.selectedOptions2[self.selectedOptions2.length - 1])
          self.userValue = ''
          self.compSys()
        }
      },
      singleQuery(compCode) {
        let self = this
        self.$axios({
          url: '/UAMS/company/do_comp_single_query_bycompanycode',
          method: 'post',
          responseType: 'json',
          data: {
            compCode: compCode,
            type: "1"
          }
        })
        .then(function(res) {
          console.log("success", res)
          if(res.data.success) {
            let list = res.data.data
            self.recursionDelete(list)
            self.compOptions = list
            console.log("result, list = ", list)
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
      },
    	pageClick() {
    		let self = this
        console.log("self.icons", self.icons)
        if(self.icons == "caret-top"){
  			  self.icons = "caret-bottom"
  			  self.optionBoxShow = false
  		  }
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
		margin-top: 60px;
	}
	.box{
		position: relative;
		max-width: 200px;
		/*margin-top: -38px;*/
		/*margin-left: 45%;*/
    display: inline-block;
    margin-left: 20px;
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