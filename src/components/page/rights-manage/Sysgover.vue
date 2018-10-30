<template>
	<!-- <div>Sysgover html(系统管理)</div> -->
	<div>
		<v-navbar></v-navbar>
		<div class="sys_header">
			<el-input placeholder="请输入系统名称" v-model="sysInput" class="select_box leftFloatBox" @keyup.enter.native="searchSys()">
				<template slot="prepend">系统名称</template>
			</el-input>
			<el-button type="primary" icon="search" @click="searchSys()">搜索</el-button>
			<el-button type="info" @click="registerSys()">注册系统</el-button>
		</div>
		<div class="sys_main">
			<el-table
			:data="tableData"
			border
			empty-text="暂无系统，请注册系统"
			style="width: 100%">
			<el-table-column
			prop="index"
			label="序列"
			width="120">
		</el-table-column>
		<el-table-column
		prop="system_name"
		label="系统名称"
		width="300">
	</el-table-column>
	<el-table-column
	prop="sys_code"
	label="系统编码"
	width="300">
</el-table-column>
<el-table-column
prop="model"
label="系统模型"
width="300">
</el-table-column>
<el-table-column
label="操作">
<template slot-scope="scope">
	<el-button @click="handleClick(scope.$index, tableData)" type="text" size="small">编辑</el-button>
	<el-button type="text" size="small" @click="delectClick(scope.$index, tableData)">删除</el-button>
</template>
</el-table-column>
</el-table>
</div>
<el-dialog title="编辑系统" @close="registerCancel('compileForm')" :visible.sync="dialogFormVisible">
	<el-form :model="compileForm" :rules="compileFormRules" ref="compileForm">
		<el-form-item label="系统名称：" :label-width="formLabelWidth" prop="system_name">
			<el-input v-model="compileForm.system_name" placeholder="请输入系统名称" auto-complete="off" class="ipt_wid"></el-input>
		</el-form-item>
		<el-form-item label="系统编码：" :label-width="formLabelWidth" prop="sys_code">
			<el-input v-model="compileForm.sys_code" placeholder="请输入系统编码" auto-complete="off" class="ipt_wid"></el-input>
		</el-form-item>
			    <!-- <el-form-item label="系统模型：" :label-width="formLabelWidth" prop="system_model">
			    		      		<el-select v-model="compileForm.system_model" placeholder="请选择系统模型" class="ipt_wid">
			        	<el-option label="用户类型模型" value="0"></el-option>
			        	<el-option label="角色类型模型" value="1"></el-option>
			      	</el-select>
			      </el-form-item> -->
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			  	<el-button @click="cancel('compileForm')">取 消</el-button>
			  	<el-button type="primary" @click="compileSys('compileForm')">确 定</el-button>
			  </div>
			</el-dialog>
			<el-dialog title="注册系统" @close="registerCancel('formSys')" :visible.sync="registerFormVisible">
				<el-form :model="formSys" :rules="formSysRules" ref="formSys">
					<el-form-item label="系统名称：" :label-width="formLabelWidth" prop="system_name">
						<el-input v-model="formSys.system_name" placeholder="请输入系统名称" auto-complete="off" class="ipt_wid"></el-input>
					</el-form-item>
					<el-form-item label="系统编码：" :label-width="formLabelWidth" prop="sys_code">
						<el-input v-model="formSys.sys_code" placeholder="请输入系统编码" auto-complete="off" class="ipt_wid"></el-input>
					</el-form-item>
			    <!-- <el-form-item label="系统模型：" :label-width="formLabelWidth" prop="system_model">
			    		      		<el-select v-model="formSys.system_model" placeholder="请选择系统模型" class="ipt_wid">
			        	<el-option label="用户类型模型" value="0"></el-option>
			        	<el-option label="角色类型模型" value="1"></el-option>
			      	</el-select>
			      </el-form-item> -->
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			  	<el-button @click="cancel('formSys')">取 消</el-button>
			  	<el-button type="primary" @click="sureRegister('formSys')">确 定</el-button>
			  </div>
			</el-dialog>
			<el-dialog title="删除系统" :visible.sync="delectVisible" size="tiny">
				<span>确定要删除此系统吗？</span>
				<span slot="footer" class="dialog-footer">
					<el-button @click="delectCancel">取 消</el-button>
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
</div>
</template>
<script>
	import vNavbar from '../../common/Navbar.vue'
	export default {
		components: {
			vNavbar
		},
		data: function(){
			return {
				dataJson:{},
        	sysInput:"",//输入的系统名称
        	dialogFormVisible: false,//编辑弹出框
        	registerFormVisible: false,//注册弹出框
        	delectVisible:false,//删除弹出框
        	formLabelWidth: '120px',
        	tableData: [],
	        form: {},//弹出框内容
	        compileForm: {},
	        compileFormRules:{
	        	system_name: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
	        	sys_code: [{ required: true, message: '请选择系统编码', trigger: 'blur'}],
	        	/*system_model: [{ required: true, message: '请选择系统模型', trigger: 'change'}]*/
	        },
	        formSys:{
	        	system_name:'',//名称
	        	sys_code:'',//编码
	        	system_model:'1',//模型
	        },
	        formSysRules:{
	        	system_name: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
	        	sys_code: [{ required: true, message: '请选择系统编码', trigger: 'blur'}],
	        	/*system_model: [{ required: true, message: '请选择系统模型', trigger: 'change'}]*/
	        },
	        selectIndex:0,//选中代码
	        selectList:{},//选中状态
	        // 分页
	        pageSize: 10,
	        totalCount:0,
	        currentPage:1,//当前页数
	        autofocusShow:true,

	        isEditChange: false, //是否发生了改变
	        initEditForm: [],  //编辑初始值数据
	        systemName:'',//系统名称
	        myUams:'',
	    }
	},
	mounted(){
		let self = this;
		let storage = JSON.parse(localStorage.getItem('dataJson'));
		let uams = localStorage.getItem('uams')
		self.myUams = uams;
		self.dataJson = storage;
		console.log('dataJson',self.dataJson)
		if(self.$route.query.second_code){
			self.dataJson.comp_code = Base64.decode(self.$route.query.second_code)
		}else{
			self.dataJson.comp_code = Base64.decode(self.$route.query.comp_code)
		}
		self.ask();
	},
	watch:{
		'$route':{  
			handler:function(val,oldval){  
				let self = this;
				let storage = JSON.parse(localStorage.getItem('dataJson'));
				this.dataJson = storage;
				if(val.query.second_code){
					self.dataJson.comp_code = Base64.decode(val.query.second_code)
				}else{
					self.dataJson.comp_code = Base64.decode(val.query.comp_code)
				}
				this.ask();

		    	/*console.log("this.$route.query.compCode", this.$route.query.comp_code)
		    	this.$emit('menu-change', this.$route.query.comp_code)*/
		    },  
            deep:true//对象内部的属性监听，也叫深度监听  
        },

    },
    methods: {
    	keydownup(){
    		alert(88888)
    	},
    	getStatus (urlStr) {
    		let self = this;
    		let storage = JSON.parse(localStorage.getItem('dataJson'));
    		self.dataJson = storage;
    		self.ask();
    	},
    	changeCur(val){
			// console.log(val)
			let self = this;
			self.currentPage = val;
			self.tableData = [];
			self.ask();
		},
    	handleClick (index, tab){//编辑
    		let self = this;
    		self.dialogFormVisible = true;
    		self.form = tab[index];
    		self.compileForm = {
    			system_name: tab[index].system_name,
    			sys_code: tab[index].sys_code,
    			system_model: tab[index].system_model,
    			model: tab[index].model,
    		};

    		self.initEditForm = {
    			system_name: tab[index].system_name,
    			sys_code: tab[index].sys_code,
    			system_model: tab[index].system_model,
    			model: tab[index].model,
    		}
    	},
    	delectClick(index, tab){//删除
    		let self = this;
    		console.log(index,tab[index])
    		self.delectVisible = true;
    		self.selectList = tab[index];
    		self.selectIndex = index;
    		self.systemName = tab[index].system_name
    	},
    	delectSure(){//确定删除
    		let self = this;
    		self.$axios({
    			url: "/UAMS/Authenticate/do_system_del",
    			method: 'post',
    			responseType: 'json',
    			data: {
    				'compCode':self.dataJson.comp_code,
    				"sysCode":self.selectList.sys_code,
    				"sessionId":self.myUams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
    				"sysName":self.systemName
    			}
    		})
    		.then(function(response) {
	    		// console.log(response)
	    		if(response.data.success){
	    			self.ask();
	    			self.delectVisible = false;
	    			self.$message({
	    				message: '删除系统成功',
	    				type: 'success',
	    				duration:1500
	    			});
	    		} else {
	    			self.delectVisible = false;
	    			self.$message.warning(response.data.msg)
	    		}
	    	})
    		.catch(function(response) {
    			console.log("报错了")
    		})
    	},
    	delectCancel(){
    		let self = this;
    		self.$message.warning('已取消删除!')
    		self.delectVisible = false;
    	},
    	compileSys(compileForm){//编辑确定
    		let self = this;
    		if(isObjectUtil(self.compileForm, self.initEditForm)) {
    			self.$message.warning("你还没有进行任何修改")
    			return
    		}

    		self.$refs[compileForm].validate((valid) => {
    			if (valid) {
    				if(compileForm.system_model == 0){
    					compileForm.model = "用户类型模型";
    				}else if(compileForm.system_model == 1){
    					compileForm.model = "角色类型模型"
    				}
    				self.register("bj", compileForm);
    				self.dialogFormVisible = false;
    			} else {
    				console.log('error submit!!');
    				return false;
    			}
    		});
    	},
    	searchSys (){//搜索
    		let self = this;
    		self.ask();
    	},
    	ask(){//请求系统列表
    		let self = this;
    		let data = {
    			'compCode':self.dataJson.comp_code,
    			// "date":new Date().getTime(),
    			"sysName":self.sysInput,
    			"pageSize":self.pageSize,
    			"currentPage":self.currentPage,
    			"sessionId":self.myUams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId
    		};
	    	console.log(data)
	    	self.$axios({
	    		url: "/UAMS/Authenticate/do_system_query?pageSize="+self.pageSize+"&currentPage="+self.currentPage,
	    		method: 'post',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(response) {
	    		console.log('ask Success',response)
	    		self.totalCount = response.data.data.totalCount;
	    		// let arr = [];
	    		let list = response.data.data.list;
	    		list.forEach(function(item, index){
	    			let model = "";
	    			if(item.system_model == 0){
	    				model = "用户类型模型";
	    			}else{
	    				model = "角色类型模型"
	    			}
	    			item.model = model;
	    			item.index = index+1;
	    		})
	    		self.tableData = response.data.data.list;
	    		// console.log(self.tableData)
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
	    },
    	registerSys(){//注册系统
    		let self = this;
    		self.registerFormVisible = true;
    	},
    	sureRegister(formSys){//注册确定
    		let self = this;
    		let num = self.tableData.length;
    		self.$refs[formSys].validate((valid) => {
    			if (valid) {
    				self.formSys.index = num+1;
		    		/*if(self.formSys.system_model == 0){
						self.formSys.model = "用户类型模型";
					}else if(self.formSys.system_model == 1){
						self.formSys.model = "角色类型模型"
					}*/
					/*self.formSys.model = "角色类型模型"*/
					self.register("zc", formSys);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
    	},
    	register(ur, formSys){//注册系统 或者  编辑系统
    		let self = this;
    		console.log(self.formSys)
    		let urls = "";
    		let data = "";
    		if(ur == "zc"){
    			urls = "regist";
    			data = {
    				'compCode':self.dataJson.comp_code,
    				"sysName":self.formSys.system_name,
    				"sysCode":self.formSys.sys_code,
    				"sysModel":self.formSys.system_model,
    				"sessionId":self.myUams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId
    			}
    		}else if(ur == "bj"){
    			urls = "update";
    			data = {
    				'compCode':self.dataJson.comp_code,
    				"sysName":self.form.system_name,
    				"sysCode":self.form.sys_code,
    				"sysModel":self.compileForm.system_model,
    				"newSysName":self.compileForm.system_name,
    				"newSysCode":self.compileForm.sys_code,
    				"sessionId":self.myUams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId
    			}
    		}
    		console.log('data',data)
    		self.$axios({
    			url: "/UAMS/Authenticate/do_system_"+urls,
    			method: 'post',
    			responseType: 'json',
    			data: data
    		})
    		.then(function(response) {
    			console.log(response)
    			if(response.data.success){
    				if(ur == "zc"){
    					self.ask();
    					self.$message({
    						message: '新增系统成功',
    						type: 'success',
    						duration:1500
    					});
    					self.registerFormVisible = false;
    					self.formSys={
			    			system_name:'',//名称
				        	sys_code:'',//编码
				        	system_model:'1',//模型
				        };
				    }else if(ur == "bj"){
				    	self.$message({
				    		message: '修改系统成功',
				    		type: 'success',
				    		duration:1500
				    	});
				    	self.form.sys_code = self.compileForm.sys_code;
				    	self.form.system_name = self.compileForm.system_name;
				    	self.form.system_model = self.compileForm.system_model;
				    	self.form.model = self.compileForm.model;
				    }
				    self.$refs[formSys].resetFields();
				    self.ask()
				}else{
					self.$message({
						message: response.data.msg,
						type: 'warning',
						duration:1500
					});
				}
			})
    		.catch(function(response) {
    			console.log("报错了")
    		})
    	},
    	cancel(formSys){//取消模态框
    		let self = this;
    		self.$refs[formSys].resetFields();
    		self.registerFormVisible = false;
    		self.dialogFormVisible = false;
    	},
    	registerCancel(formSys){//关闭注册模态框
    		let self = this;
    		self.$refs[formSys].resetFields();
    		self.registerFormVisible = false;
    	},
    },
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
	.g-footer,.m-buttons {
		display: flex;
		flex-flow: row nowrap;
	}
	.g-footer{
		justify-content: space-between;
	}
</style>