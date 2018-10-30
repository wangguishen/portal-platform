<template>
	<div>
	    <v-navbar></v-navbar>
		<div class="sys_header">
			<!-- <el-input placeholder="请输入功能名称" v-model="operaInput" class="select_box leftFloatBox" @keyup.enter.native="searchOpera()">
		    	<template slot="prepend">功能名称</template>
		  	</el-input> -->
		  	<el-input placeholder="请输入资源项名称" v-model="operaInput" class="select_box leftFloatBox" @keyup.enter.native="searchOpera">
			    <el-select v-model="selectSys" slot="prepend" placeholder="请选择系统名称" @change="selectSysClick(selectSys)">
			      	<el-option
				      	v-for="item in sysList"
				      	:key="item.value"
				      	:label="item.label"
				      	:value="item.value">
			    	</el-option>
			    </el-select>
			</el-input>
		  	<el-button type="primary" icon="search" @click="searchOpera()">查询</el-button>
		  	<el-button type="info" @click="registerOpera()">新增资源项</el-button>
		</div>
		<div class="sys_main">
			<el-table
			    :data="tableData"
			    empty-text="暂无资源项，请添加资源项"
			    border
			    style="width: 100%">
			    <el-table-column
			      	prop="index"
			      	label="序列"
			      	width="120">
    			</el-table-column>
			    <el-table-column
			      	prop="action_name"
			      	label="资源项名称"
			      	width="400">
    			</el-table-column>
			    <el-table-column
			      	prop="action_code"
			      	label="资源项编码"
			      	width="400">
			    </el-table-column>
			    <el-table-column
			      	label="操作">
				    <template slot-scope="scope">
			        	<el-button @click="handleClick(scope.$index, tableData)" type="text" size="small">编辑</el-button>
			        	<el-button @click="delectClick(scope.$index, tableData)" type="text" size="small">删除</el-button>
			      	</template>
    			</el-table-column>
  			</el-table>
		</div>
		<el-dialog title="编辑资源项" @close="registerCancel('compileForm')" :visible.sync="dialogFormVisible">
  			<el-form :model="compileForm" :rules="formOperaRules" ref="compileForm">
			    <el-form-item label="资源项名称：" :label-width="formLabelWidth" prop="action_name">
			      	<el-input v-model="compileForm.action_name" placeholder="请输入资源项名称" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="资源项编码：" :label-width="formLabelWidth" prop="action_code">
			      	<el-input v-model="compileForm.action_code" placeholder="请输入资源项编码" readonly auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
  			</el-form>
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="registerCancel('compileForm')">取 消</el-button>
			    <el-button type="primary" @click="compileOpera('compileForm')">确 定</el-button>
		  	</div>
		</el-dialog>
		<el-dialog title="删除资源项" :visible.sync="delectVisible" size="tiny">
		  	<span>确定要删除此资源吗？</span>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button @click="delectCancel">取 消</el-button>
		    	<el-button type="primary" @click="delectSure()">确 定</el-button>
		  	</span>
		</el-dialog>
		<el-dialog title="注册资源项" @close="registerCancel('formOpera')" :visible.sync="registerFormVisible">
  			<el-form :model="formOpera" :rules="formOperaRules" ref="formOpera">
  				<el-form-item label="系统名称：" :label-width="formLabelWidth" prop="system_name">
		      		<el-select v-model="formOpera.system_name" class="ipt_wid" placeholder="请选择系统名称" @change="switchRegistSys(formOpera.system_name)">
			        	<el-option
					      	v-for="item in sysList"
					      	:key="item.value"
					      	:label="item.label"
					      	:value="item.value">
				    	</el-option>
			      	</el-select>
			    </el-form-item>
			    <el-form-item label="资源项名称：" :label-width="formLabelWidth" prop="action_name">
			      	<el-input v-model="formOpera.action_name" placeholder="请输入资源项名称" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="资源项编码：" :label-width="formLabelWidth" prop="action_code">
			      	<el-input v-model="formOpera.action_code" placeholder="请输入资源项编码" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
  			</el-form>
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="registerCancel('formOpera')">取 消</el-button>
			    <el-button type="primary" @click="sureRegister('formOpera')">确 定</el-button>
		  	</div>
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
import vNavbar from '../../common/Navbar.vue'
export default {
	components: {
	  vNavbar
	},
    data: function() {
        return {
        	sysList:[],//系统名称列表
        	selectSys:'',//选中的系统名称
        	dataJson:{},
        	sessionId:"61d0cc973f3a4436bf4300850403e38c",
        	operaInput:"",//输入的名称
        	registerFormVisible: false,//注册弹出框
        	dialogFormVisible: false,//编辑弹出框
        	delectVisible:false,//删除弹出框
        	formLabelWidth: '120px',
        	tableData: [],
	        form: {},
	        compileForm: {},
	        system_name:'',//系统名称
        	formOpera: {
        		
        		action_name:'',//名称
	        	action_code:'',//编码
        	},
        	formOperaRules:{
        		system_name: [{ required: true, message: '请选择系统名称', trigger: 'change'}],
        		action_name: [{ required: true, message: '请输入资源项名称', trigger: 'blur' }],
				action_code: [{ required: true, message: '请输入资源项编码', trigger: 'blur'}],
        	},
        	selectIndex:0,//选中代码
	        selectList:{},//选中状态
	        // 分页
	        pageSize: 10,
	        totalCount:0,
	        currentPage:1,//当前页数

	        isEditChange: false, //是否发生了改变
	        initEditForm: [],  //编辑初始值数据
	        myUams:'',
	        sysId:'',//系统id
	        regSystemId:'',//注册弹框系统id
        }
    },
    mounted(){
    	let self = this;
    	let storage = JSON.parse(localStorage.getItem('dataJson'));
    	self.dataJson = storage;
    	let uams = localStorage.getItem('uams')
		self.myUams = uams;
    	if(self.$route.query.second_code){
            self.dataJson.comp_code = Base64.decode(self.$route.query.second_code)
        }else{
            self.dataJson.comp_code = Base64.decode(self.$route.query.comp_code)
        }
    	self.ask();
    	self.querySysList();
    },
    watch:{
		'$route':{  
            handler:function(val,oldval){  
            	let self = this;
                let storage = JSON.parse(localStorage.getItem('dataJson'));
			    self.dataJson = storage;
			    if(val.query.second_code){
                    self.dataJson.comp_code = Base64.decode(val.query.second_code)
                }else{
                    self.dataJson.comp_code = Base64.decode(val.query.comp_code)
                }
		    	self.ask();
            },  
            deep:true//对象内部的属性监听，也叫深度监听  
        },
	},
    methods: {
    	selectSysClick(sysName){//切换系统
    		let self = this;
    		console.log(sysName)
    		self.sysId = sysName
    		self.ask()
    	},
    	switchRegistSys(registId){//注册弹框切换系统
    		let self = this;
    		console.log('注册系统id',registId)
    		self.regSystemId = registId
    	},
    	querySysList(){//获取系统列表
    		let self = this;
    		let datas = {
    			'compCode':self.dataJson.comp_code,
    			"sysName":'',
    			"sessionId":self.myUams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
    			"pageSize":self.pageSize,
    			"currentPage":self.currentPage
    		}
    		console.log('querySysList datas',datas)
    		self.$axios({
    			url:"/UAMS/Authenticate/do_system_query?pageSize="+self.pageSize+"&currentPage="+self.currentPage,
    			method:'post',
    			responseType:'json',
    			data:datas
    		})
    		.then((res)=>{
    			console.log('querySysList Success',res)
    			if (res.data.success) {
    				let resData = res.data.data.list;
    				resData.forEach(function(item,index){
    					item.label = item.system_name;
    					item.value = item.id.toString();
    					self.sysList.push(item)
    				})
    			}
    		})
    		.catch((res)=>{
    			console.log('querySysList Error',res)
    		})

    	},
    	handleClick (index, tab){//编辑
    		let self = this;
    		console.log('编辑',tab[index])
    		self.dialogFormVisible = true;
    		self.form = tab[index];

    		self.initEditForm = {
    			system_name: tab[index].system_name,
    		    action_name: tab[index].action_name,
    			action_code: tab[index].action_code,
    			actionId: tab[index].id
    		}

    		self.compileForm = {
    			system_name: tab[index].system_name,
    			action_name: tab[index].action_name,
    			action_code: tab[index].action_code,
    			actionId: tab[index].id
    		};
    	},
    	changeCur(val){//切换分页
			let self = this;
			self.currentPage = val;
			self.tableData = [];
			self.ask();
		},
    	delectClick(index, tab){//删除
    		let self = this;
    		self.delectVisible = true;
    		self.selectList = tab[index];
    		self.selectIndex = index;
    	},
    	delectSure(){//确定删除
    		let self = this;
    		self.register('sc');
    	},
    	compileOpera(compileForm){//确认编辑
    		let self = this;
    		// if(self.formOpera.action_name == ''){
    		// 	self.$message({
		    //       	message: '请输入功能名称',
		    //       	type: 'warning',
		    //       	duration:1500
		    //     });
    		// }else if(self.formOpera.action_code == ''){
    		// 	self.$message({
		    //       	message: '请输入功能编码',
		    //       	type: 'warning',
		    //       	duration:1500
		    //     });
    		// }else{
    		// 	self.register('bj')
    		// }

    		if(isObjectUtil(self.compileForm, self.initEditForm)) {
    			self.$message.warning("你还没有进行任何修改")
    			return
    		}

    		self.$refs[compileForm].validate((valid) => {
          		if (valid) {
            		self.register('bj', compileForm)
          		} else {
            		console.log('error submit!!');
            		return false;
          		}
        	});
    	},
    	searchOpera (){//搜索
    		let self = this;
      		self.ask();
    	},
    	registerOpera(){//新增资源项
    		let self = this;
    		self.registerFormVisible = true;
    	},
    	sureRegister(formOpera){//注册确定
    		let self = this;
    		// if(self.formOpera.action_name == ''){
    		// 	self.$message({
		    //       	message: '请输入功能名称',
		    //       	type: 'warning',
		    //       	duration:1500
		    //     });
    		// }else if(self.formOpera.action_code == ''){
    		// 	self.$message({
		    //       	message: '请输入功能编码',
		    //       	type: 'warning',
		    //       	duration:1500
		    //     });
    		// }else{
	    	// 	self.register("zc");
    		// }
    		self.$refs[formOpera].validate((valid) => {
          		if (valid) {
            		self.register('zc', formOpera)
          		} else {
            		console.log('error submit!!');
            		return false;
          		}
        	});
    	},
    	register(ur, formOpera){//注册资源项 或者  编辑资源项  或者  删除资源项
    		let self = this;
    		let urls = "";
    		let data = "";
    		console.log(self.selectList)
    		if(ur == "zc"){//注册
    			urls = "/UAMS/Authenticate/ajax/do_add_action";
    			data = {
    				'systemId': self.regSystemId,
    				'compCode':self.dataJson.comp_code,
		    		"actionName":self.formOpera.action_name,
		    		"actionCode":self.formOpera.action_code,
		    		"sessionId" : self.myUams == 'plat_admin' ? self.dataJson.account:self.dataJson.sessionId
    			}
    		}else if(ur == "bj"){//编辑
    			urls = "/UAMS/Authenticate/ajax/do_update_action";
    			data = {
    				'compCode':self.dataJson.comp_code,
		    		"actionCode":self.compileForm.action_code,
		    		"actionName":self.compileForm.action_name,
		    		"actionId":self.compileForm.actionId,
		    		"sessionId":self.myUams == 'plat_admin' ? self.dataJson.account:self.dataJson.sessionId
    			}
    		}else if(ur == "sc"){//删除
    			urls = "/UAMS/Authenticate/ajax/do_del_action";
    			data = {
					'compCode': self.dataJson.comp_code,
					"actionId": self.selectList.id,
					"sessionId": self.myUams == 'plat_admin' ? self.dataJson.account:self.dataJson.sessionId
    			}
    		}
    		console.log('datas',data)
    		self.$axios({
	    		url: urls,
	    		method: 'post',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(response) {
	    		console.log('register Success',response)
	    		if(ur == "zc"){
	    			if(response.data.success){
			    		self.$message({
				          	message: '新增资源项成功',
				          	type: 'success',
				          	duration:1500
				        });
				        self.ask()
				        self.$refs[formOpera].resetFields();
			    		self.registerFormVisible = false;
	    			}else{
	    				self.$message({
				          	message: response.data.msg,
				          	type: 'warning',
				          	duration:1500
				        });
	    			}	
	    		}else if(ur == "bj"){
	    			if (response.data.success) {
	    				self.$message({
				          	message: '修改资源项成功',
				          	type: 'success',
				          	duration:1500
				        });
				        self.ask()
		    			// self.form.action_code = self.compileForm.action_code;
		    			// self.form.action_name = self.compileForm.action_name;
		    			self.$refs[formOpera].resetFields();
		    			self.dialogFormVisible = false;
	    			}else{
	    				self.$message.error(response.data.msg)
	    			}
	    		}else if(ur == "sc"){
	    			if (response.data.success) {
	    				self.$message({
				          	message: '删除资源项成功',
				          	type: 'success',
				          	duration:1500
				        });
				        self.ask()
			    		self.delectVisible = false;
	    			}else {
	    				self.$message.error(response.data.msg)
	    			}
	    		}
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
    	},
    	delectCancel(){
    		let self =this;
    		self.$message.warning('已取消删除!')
    		self.delectVisible = false;
    	},
    	ask(){
    		let self = this;
    		let data = {
	    		'compCode':self.dataJson.comp_code,
	    		// "date":new Date().getTime(),
	    		"systemId" : self.sysId,
	    		"actionName":self.operaInput,
	    		"pageSize":self.pageSize,
	    		"currentPage":self.currentPage,
	    		"sessionId":self.myUams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId
	    	}
	    	console.log('ask data',data)
	    	self.$axios({
	    		url: "/UAMS/Authenticate/ajax/do_query_action?pageSize="+self.pageSize+"&currentPage="+self.currentPage,
	    		method: 'post',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(response) {
	    		console.log('ask Success',response)
	    		if (response.data.success) {
	    			self.totalCount = response.data.data.totalCount;
		    		let list = response.data.data.list;
		    		list.forEach(function(item, index){
		    			item.index = index+1;
		    		})
		    		self.tableData = response.data.data.list;
	    		}
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
    	},
    	registerCancel(formOpera){//关闭注册模态框
    		let self = this;
    		self.$refs[formOpera].resetFields();
    		self.registerFormVisible = false;
    		self.dialogFormVisible = false;
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