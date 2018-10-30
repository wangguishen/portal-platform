<template>
  	<div>
  		<div class="sys_header">
			<el-input placeholder="请输入项目名称" v-model="sysInput" class="select_box leftFloatBox" @keyup.enter.native="askUrl()">
		    	<template slot="prepend">项目名称</template>
		  	</el-input>
		  	<el-button type="primary" icon="search" @click="askSys()">搜索</el-button>
		  	<el-button type="info" @click="registerSys()">注册项目</el-button>
		</div>
		<div class="sys_main">
			<el-table
			    :data="sysData"
			    border
			    empty-text="暂无监控项目，请注册项目"
			    style="width: 100%">
			    <el-table-column
			      	prop="subIndex"
			      	label="序列"
			      	width="100">
    			</el-table-column>
			    <el-table-column
			      	prop="systemName"
			      	label="项目名称"
			      	width="250">
    			</el-table-column>
			    <el-table-column
			      	prop="comp_name"
			      	label="企业名称"
			      	width="250">
			    </el-table-column>
			    <el-table-column
			      	prop="dept_name"
			      	label="实验室名称"
			      	width="250">
			    </el-table-column>
			    <el-table-column
			      	label="操作">
				    <template slot-scope="scope">
			        	<el-button @click="handleClick(scope.$index, sysData)" type="text" size="small">编辑</el-button>
			        	<el-button type="text" size="small" @click="delectClick(scope.$index, sysData)">删除</el-button>
			        	<el-button type="text" size="small" @click="addUserRel(scope.$index, sysData)">关联用户</el-button>
			      	</template>
    			</el-table-column>
  			</el-table>
		</div>
		<el-dialog :title="objTab.title" @close="registerCancel('formSys')" :visible.sync="registerFormVisible">
  			<el-form :model="formSys" :rules="formSysRules" ref="formSys">
			    <el-form-item label="项目名称：" :label-width="formLabelWidth" prop="systemName">
			      	<el-input v-model="formSys.systemName" placeholder="请输入项目名称" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="企业名称：" :label-width="formLabelWidth" prop="enterpriseId">
		      		<el-select v-model="formSys.enterpriseId" placeholder="请选择企业名称" class="ipt_wid" @change="asklabList" no-data-text="暂无企业">
			        	<el-option v-for="type in firmList" :label="type.compName" :value="type.oldId" :key="type.oldId"></el-option>
			      	</el-select>
			    </el-form-item>
			    <el-form-item label="实验室名称：" :label-width="formLabelWidth" prop="labId">
		      		<el-select v-model="formSys.labId" placeholder="请选择实验室名称" class="ipt_wid" no-data-text="此企业下暂无实验室">
			        	<el-option v-for="type in labList" :label="type.deptName" :value="type.oldId" :key="type.oldId"></el-option>
			      	</el-select>
			    </el-form-item>
  			</el-form>
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="cancel('formSys')">取 消</el-button>
			    <el-button type="primary" @click="sureRegister('formSys')">确 定</el-button>
		  	</div>
		</el-dialog>
	
		<!-- 关联用户 -->
		<el-dialog title="关联用户" @close="userRelCancel()" :visible.sync="userRelVisible">
		    <el-form :model="form" ref="form" class="demo-ruleForm">
		        <el-form-item label="系统名称：" :label-width="formLabelWidth">
		      	    <el-input v-model="form.systemName"  class="ipt_wid" readonly></el-input>
		        </el-form-item>
		        <el-form-item label="用户:" :label-width="formLabelWidth">
		        	<div>
		        	  <el-input placeholder="请输入用户名称" class="ipt_wid" style="margin-bottom: 15px;margin-right: 15px" v-model="userInput"></el-input>
		        	  <el-button type="primary" icon="search" @click="queryUser(userInput, 1)">查询</el-button>
		        	</div>
		          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		            <div style="margin: 15px 0;"></div>
		            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
		                <el-checkbox style="margin-left:0;margin-right:15px;margin-bottom:15px"
		                     v-for="city in cities" :label="city.id" :key="city.id" :value="city.id">{{city.userName}}({{city.level}})
		                </el-checkbox>
		            </el-checkbox-group>
		        </el-form-item>
		        <el-form-item :label-width="formLabelWidth">
				    <el-button type="primary" @click="submitForm('form')">
				        <i class="el-icon-circle-check"></i>&nbsp;确定
				    </el-button>
				    <el-button @click="userRelCancel()">
				        <i class="el-icon-circle-cross"></i>&nbsp;取消
				    </el-button>
			  	</el-form-item>
		    </el-form>
		</el-dialog>

		<el-dialog title="删除项目" :visible.sync="delectVisible" size="tiny">
		  	<span>确定要删除此项目吗？</span>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button @click="delectVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="delectSure()" :autofocus="autofocusShow" @keyup.enter.native="delectSure()">确 定</el-button>
		  	</span>
		</el-dialog>

		<div class="g-footer">
          	<div style="margin-top: 20px" v-show="totalCount">
            	<el-pagination
	              	:page-size="pageSize"
	              	@current-change="changeCur"
	              	layout="total, prev, pager, next"
	              	:total="totalCount"
	              	ref="paginations">
            	</el-pagination>
          	</div>
        </div>
  	</div>
</template>
<script>
//	qy 	-- 请求企业
//	lab -- 请求实验室
//	cx 	-- 查询系统
//	sc 	-- 删除系统
//	xz 	-- 新增系统
//	bj 	-- 编辑系统
var cityOptions = []
export default{
	data(){
		return{
			dataJson:{},//登录数据
			sysData:[],//监控系统数据
			sysInput:'',//输入框的值
			userInput: '',
			registerFormVisible: false,//注册模态框显示隐藏
			userRelVisible: false,
			formLabelWidth: '120px',
			systemId: '',
			formSys:{//上传对象
				systemName:'',
				enterpriseId:'',
				labId:'',
			},
			formSysRules:{
				systemName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
				enterpriseId: [{ required: true, message: '请选择企业名称', trigger: 'change'}],
				labId: [{ required: true, message: '请选择实验室名称', trigger: 'change'}]
			},
			firmList:[],//企业集合
			labList:[],//实验室名称
			objTab:{},
			//分页
			totalCount:0,
			pageSize:10,
			currentPage:1,
			//删除
			delectVisible:false,
			selectIndex:0,//选中代码
      		selectList:{},//选中状态
	      	autofocusShow:true,
	      	objTab:{},
	      	form: {
	          	userName: []
	      	},
	      	checkAll: false,
	     	checkedCities: [],
	      	initCities: [],
	      	cities: cityOptions,
	      	isIndeterminate: false
		}
	},
	mounted(){
		let self = this;
		let storage = JSON.parse(localStorage.getItem('dataJson'));
	  	self.dataJson = storage;
	  	self.initCities = self.checkedCities
	  	self.askSys();
	  	self.askFirm();
	  	self.queryUser();
	},
	methods:{
		askFirm(){//请求企业
			let self = this;
			let url = '/basic-platform/enterprise/sel';
			let data = {
				'compName': ''
			};
			let method = 'get';
			self.askControl(url, data, method, 'qy')
		},
		asklabList(id){//切换企业
			let self = this;
			if(id != ''){
				self.asklab(id)
			}
		},
		asklab(id){//请求实验室
			let self = this;
			let url = "/basic-platform/dept/sel?enterpriseId="+parseInt(id)
			let data = {};
			let method = 'get';
			self.askControl(url, data, method, 'lab')
		},
		askSys(){//请求系统
			let self = this;
			let  url = "/basic-platform/system/sel?systemName="+self.sysInput+'&pageSize='+self.pageSize+'&currentPage='+self.currentPage;
			let data = {
				'systemName': self.sysInput,
				'pageSize': self.pageSize,
				'currentPage': self.currentPage
			};
			let method = 'get';
			console.log(url)
			self.askControl(url, data, method, 'cx')
		},
		changeCur(val){//分页查询
			let self = this;
			self.currentPage = val;
			self.sysData = [];
			self.askSys();
		},
		delectClick(index, tab){//删除按钮
			let self = this;
			self.delectVisible = true;
			self.selectList = tab[index];
    		self.selectIndex = index;
		},
		delectSure(){//确定删除
			let self = this;
			let url = "/basic-platform/system/del";
			let data = {
				'id': self.selectList.id,
			};
			let method = 'delete';
			self.askControl(url, data, method, 'sc')
		},
		handleClick(index, tab){//编辑按钮
			let self = this;
			let enterpriseId = tab[index].enterpriseId.toString();
			let deptId = tab[index].deptId.toString();
			self.asklab(enterpriseId)
			self.$nextTick(()=>{
				self.objTab = {
					'title': '编辑项目',
					'state': 1
				}
				self.formSys = {//上传对象
					'systemName': tab[index].systemName,
					'enterpriseId': enterpriseId,
					'labId':  deptId
				}
				self.registerFormVisible = true;
				self.selectList = tab[index];
	    		self.selectIndex = index;
			})
		},
		registerSys(){//注册系统
			let self = this;
			self.objTab = {
				'title': '注册项目',
				'state': 0
			}
			self.registerFormVisible = true;
		},
		sureRegister(formSys){//注册完成
			let self = this;
			self.$refs[formSys].validate((valid) => {
          		if (valid) {
            		let url = '',method = '',data = {},type='';
        			if(self.objTab.state == 0){
						url = '/basic-platform/system/add';
						method = 'post';
						type = 'xz';
						data = {
							'systemName': self.formSys.systemName,//系统名称
							// 'enterpriseId': self.formSys.enterpriseId,//企业id
							'deptId': self.formSys.labId
						};
					}else if(self.objTab.state == 1){
						url = '/basic-platform/system/up';
						method = 'put';
						type = 'bj';
						data = {
							'id': self.selectList.id,
							'systemName': self.formSys.systemName,//系统名称
							'deptId': parseInt(self.formSys.labId),//企业id
						};
					}
					console.log(data)
					self.askControl(url, data, method, type, formSys)
          		} else {
            		console.log('error submit!!');
            		return false;
          		}
        	});
		},
		askControl(url, data, method, type, formName){//公共请求
			let self = this;
			self.$axios({
	    		url: url,
	    		method: method,
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(res) {
	    		console.log(type,res)
	    		if(res.data.status == 200){
	    			let list = res.data.data;
	    			if(type == 'cx'){
	    				self.sysData = [];
	    				self.totalCount = res.data.page.totalRows;
		    			list.forEach(function(item, index){
		    				self.$set(item,'subIndex',(index+1))
		    				self.sysData.push(item)
		    			})
	    			}else if(type == 'qy'){
	    				self.firmList = [];
	    				list.forEach(function(item, index){
	    					self.$set(item,'oldId',item.id.toString())
		    				self.firmList.push(item)
		    			})
	    			}else if(type == 'xz'){
	    				self.askSys();
	    				self.registerFormVisible = false;
	    				self.$refs[formName].resetFields();
	    				self.$message({
				          	message: '新增项目成功',
				          	type: 'success',
				          	duration:1500
				        });
	    			}else if(type == 'sc'){
	    				if(self.sysData.length == 1){
	    					self.currentPage--;
	    				}
	    				self.askSys();
	    				self.delectVisible = false;
	    				self.$message({
				          	message: '删除项目成功',
				          	type: 'success',
				          	duration:1500
				        });
	    			}else if(type == 'bj'){
	    				self.askSys();
				        self.registerFormVisible = false;
				        self.$refs[formName].resetFields();
				        self.$message({
				          	message: '修改项目成功',
				          	type: 'success',
				          	duration:1500
				        });
	    			}else if(type == 'lab'){
	    				self.labList = [];
	    				list.forEach(function(item, index){
	    					self.$set(item,'oldId',item.id.toString())
		    				self.labList.push(item)
		    			})
	    				self.formSys.labId = list[0].oldId;
	    			}
	    		}else{
	    			self.$message({
			          	message: res.data.message,
			          	type: 'warning',
			          	duration:1500
			        });
	    		}
	    	})
	    	.catch(function(res) {
	    		console.log("报错了")
	    	})
		},
		cancel(formSys){//取消按钮
			let self = this;
			self.$refs[formSys].resetFields();
			self.registerFormVisible = false;
		},
		registerCancel(formSys){//关闭注册模态框
    		let self = this;
    		self.$refs[formSys].resetFields();
    		self.registerFormVisible = false;
    	},
    	addUserRel(index, tab) {
    	    let self = this
    	    self.userRelVisible = true
    	    self.form = tab[index]
    	    self.systemId = tab[index].id
    	    self.selUserRel(tab[index].id)
    	    self.queryUser()
    	},
    	selUserRel(systemId) {
    	  	let self = this
    	  	self.checkedCities = []
    	  	self.$axios({
    	  		url: '/basic-platform/system/sel_user_rel?systemId=' + systemId,
    	  		method: 'get',
    	  		responseType: 'json'
    	  	})
    	  	.then(function(res) {
    	  		if(res.status == 200) {
	    	  		let resData = res.data.data
	    	  		function tempArrStory(userId) {
	          	    	this.userId = userId
	          		}
	    	  		for(let index in resData) {
	    	  			self.checkedCities.push(parseInt(resData[index].userId))
	    	  			self.initCities.push(parseInt(resData[index].userId))
	    	  		}
	    	  		/*self.initCities = self.checkedCities*/
	    	  		self.handleCheckedCitiesChange(self.checkedCities)
    	  		}
    	  	})
    	  	.catch(function(res) {
    	  		console.log("error", res)
    	  	})
    	},
    	userRelCancel() {
    	    let self = this
    	    self.form = {}
    	    self.userRelVisible = false
    	    self.initCities = self.checkedCities
    	    self.checkedCities = []
    	    self.isIndeterminate = true
    	    self.userInput = ''
    	},
    	queryUser(userInput) {
    		let self = this
    		let userName = userInput ? userInput : ''
    		self.$axios({
    			url: '/basic-platform/muser/sel?userName=' + userName,
    			method: 'get',
    			responseType: 'json'
    		})
    		.then(function(res) {
    			if(res.status == 200) {
    				self.cityOptions = res.data.data
    				self.cities = self.cityOptions
    			}
    		})
    		.catch(function(res) {
    			console.log("error", res)
    		})
    	},
		handleCheckAllChange(event) {
			let self = this
      		if(event.target.checked) {
      	  		for(let i = 0; i < self.cityOptions.length; i++) {
      	  			self.checkedCities.push(self.cityOptions[i].id)
      	  		}
  			} else {
      			self.checkedCities = []
      		}
        	this.isIndeterminate = false
		},
		handleCheckedCitiesChange(value) {
	        let checkedCount = value.length
	        this.checkAll = checkedCount === this.cities.length
	        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
		},
		resetForm(formName) {
		  this.$refs[formName].resetFields()
		},
		submitForm(formName) {
		  	let self = this
	      	let delArr= self.compare(self.initCities, self.checkedCities)
	      	let addArr= self.compare(self.checkedCities, self.initCities)
	      	function DatasStory(systemId, userId, type) {
		        this.systemId = systemId
		        this.userId = userId
		        this.type = type
	  	  	}
      		var linkDatas = new Array()
	      	if(delArr.length === 0 && addArr.length === 0) {
		      	self.$message("请先关联用户")
		      	return
	      	}
	      	for(let index in delArr) {
				linkDatas.push(new DatasStory(self.systemId, delArr[index], "0"))
	      	}
      		for(let index in addArr) {
      			linkDatas.push(new DatasStory(self.systemId, addArr[index], "1"))
      		}
  	  		self.$axios({
  	  			url: '/basic-platform/system/user_rel_system',
		  	  	method: 'post',
		  	  	data: linkDatas
  	  		})
  	  		.then(function(res) {
  	  			if(res.status == 200) {
  	  				self.$message("关联成功")
  	  				self.initCities = [];
  	  				self.checkedCities = [];
  	  				self.userRelVisible = false
  	  			} else {
  	  				self.$message("关联失败")
  	  			}
  	  		})
  	  		.catch(function(res) {
  	  			console.log("error", res)
  	  		})
		},
		compare(arr1, arr2) {
          	var result = []
        	for(let i = 0; i < arr1.length; i++) {
        		var obj = arr1[i];
        		var isExist = false;
        		for(let j = 0; j < arr2.length; j++) {
        			var aj = arr2[j]
        			if(obj == aj) {
        				isExist = true;
        				break;
        			}
        		}
        		if(!isExist) {
        		    result.push(obj)
        		}
        	}
        	return result;
        }
	}
}
</script>
<style scoped>
	.sys_header{
		margin-bottom: 20px;
	}
	.select_box{
		width: 25%;
	}
	.ipt_wid{
		width: 34%;
	}
</style>