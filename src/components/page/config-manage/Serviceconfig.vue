<template>
	<!-- <div>Sysgover html(系统管理)</div> -->
	<div>
		<div class="sys_header">
			<el-input placeholder="请输入服务名称" v-model="sysInput" class="select_box leftFloatBox" @keyup.enter.native="searchSys">
		    	<template slot="prepend">服务名称</template>
		  	</el-input>
		  	<el-button type="primary" icon="search" @click="searchSys()">查询</el-button>
		  	<el-button type="info" @click="registerSys()">新增服务</el-button>
		</div>
		<div class="sys_main">
			<el-table
			    :data="tableData"
			    border
			    style="width: 100%">
			    <el-table-column
			      	prop="index"
			      	label="序列"
			      	width="120">
    			</el-table-column>
			    <el-table-column
			      	prop="serviceName"
			      	label="服务名称"
			      	width="450">
    			</el-table-column>
			    <el-table-column
			      	prop="id"
			      	label="服务编号"
			      	width="450">
			    </el-table-column>
			    <el-table-column
			      	label="操作">
				    <template slot-scope="scope">
			        	<el-button @click="handleClick(scope.$index, tableData)" size="small">编辑</el-button>
			        	<el-button type="danger" size="small" @click="delectClick(scope.$index, tableData)">删除</el-button>
			      	</template>
    			</el-table-column>
  			</el-table>
		</div>
		<el-dialog title="编辑服务" @close="editService('compileForm')" :visible.sync="dialogFormVisible">
  			<el-form :model="compileForm" ref="compileForm" :rules="rules" class="demo-ruleForm">
			    <el-form-item label="服务名称：" :label-width="formLabelWidth" prop="system_name">
			      	<el-input v-model="compileForm.system_name" placeholder="请输入服务名称" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
  			</el-form>
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">取 消</el-button>
			    <el-button type="primary" @click="compileSys('compileForm')">确 定</el-button>
		  	</div>
		</el-dialog>
		<el-dialog title="新增服务" @close="registerCancel('formSys')" :visible.sync="registerFormVisible">
  			<el-form :model="formSys" ref="formSys" :rules="rules" class="demo-ruleForm">
			    <el-form-item label="服务名称：" :label-width="formLabelWidth" prop="system_name">
			      	<el-input v-model="formSys.system_name" placeholder="请输入服务名称" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
  			</el-form>
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="registerFormVisible=false">取 消</el-button>
			    <el-button type="primary" @click="sureRegister('formSys')">确 定</el-button>
		  	</div>
		</el-dialog>
		<el-dialog title="删除系统" :visible.sync="delectVisible" size="tiny">
		  	<span>确定要删除吗？</span>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button @click="delectVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="delectSure()">确 定</el-button>
		  	</span>
		</el-dialog>
	</div>
</template>
<script>
export default {
    data: function(){
        return {
        	dataJson:{},
        	sessionId:"61d0cc973f3a4436bf4300850403e38c",
        	sysInput:"",//输入的系统名称
        	dialogFormVisible: false,//编辑弹出框
        	registerFormVisible: false,//注册弹出框
        	delectVisible:false,//删除弹出框
        	formLabelWidth: '120px',
        	tableData: [],
	        form: {},//弹出框内容
	        compileForm: {},
	        formSys:{
	        	system_name:'',//名称
	        },
	        selectIndex:0,//选中代码
	        selectList:{},//选中状态
	        routeId:0,
	        rules:{
	        	system_name:[{required:true,message:'请输入服务名称',trigger:'blur'}]
	        }
        }
    },
    mounted(){
    	let self = this;
    	let storage = JSON.parse(localStorage.getItem('dataJson'));
    	console.log(storage)
    	self.dataJson = storage;
    	self.ask();
    },
    methods: {
    	handleClick (index, tab){//编辑
    		let self = this;
    		self.dialogFormVisible = true;
    		console.log(index)
    		self.form = tab[index];
    		console.log(self.form)
    		self.compileForm = {
    			system_name: tab[index].serviceName
    		};
    	},
    	delectClick(index, tab){//删除
    		let self = this;
    		self.delectVisible = true;
    		self.selectList = tab[index];
    		self.selectIndex = index;
    		console.log(self.selectIndex);
    	},
    	delectSure(){//删除确认按钮
    		let self = this;
    		self.$axios({
	    		url: "/basic-platform/module/del",
	    		method: 'delete',
	    		responseType: 'json',
	    		data: {
	    			'id':self.selectList.id
	    		}
	    	})
	    	.then(function(response) {
	    		console.log(response)
	    		self.$message({
		          	message: '删除服务成功!',
		          	type: 'success',
		          	duration:1500
			    });
	    		self.ask();
	    		self.routeId++
    			self.$router.push('/serviceconfig?id='+self.routeId)
	    		self.delectVisible = false;
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
    	},
    	compileSys(compileForm){//编辑确定
    		let self = this;
    		self.$refs[compileForm].validate((valid) => {
		        if (valid) {
		            console.log(self.compileForm)
		    		self.register("bj");
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
    		console.log(self.sysInput)
    		let data = {
	    		'serviceName' : self.sysInput
	    	}
	    	console.log(data)
	    	self.$axios({
	    		url: self.BP_HOST+'/module/sel?serviceName='+self.sysInput,
	    		method: 'get',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(response) {
	    		console.log(response.data.data)
	    		let list = response.data.data;
	    		list.forEach(function(item, index){
	    			item.index=index+1;
	    		})
	    		self.tableData = list;
	    		console.log(self.tableData)
	    		localStorage.setItem("tableDataJson",JSON.stringify(list));
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
    	},
    	registerSys(){//新增服务
    		let self = this;
    		self.registerFormVisible = true;
    	},
    	sureRegister(formSys){//新增服务
    		let self = this;
    		self.$refs[formSys].validate((valid) => {
	          	if (valid) {
	            	let num = self.tableData.length;
		    		console.log(self.formSys)
		    		self.formSys.index = num+1;
		    		self.tableData.push(self.formSys)
		    		self.register("zc");
		    		self.registerFormVisible = false;
		    		self.formSys={
		    			system_name:'',//名称
		    		};
	          	} else {
		            console.log('error submit!!');
		            return false;
	          	}
	        });
    		
    	},
    	register(ur){//新增服务 或者  编辑系统
    		let self = this;
    		let urls = "";
    		let data = "";
    		let types="";
    		// self.form = tab[index];
    		if(ur == "zc"){
    			types="post";
    			urls = "add";
    			data = {
		    		"serviceName":self.formSys.system_name
    			}
    		}else if(ur == "bj"){
    			types="put";
    			urls = "up";
    			data = {
    				'id':self.form.id,//弹出框列表数据id
		    		"serviceName":self.compileForm.system_name
    			}
    		}
    		console.log(data)
    		self.$axios({
	    		url: "/basic-platform/module/"+urls,
	    		method: types,
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(response) {
	    		console.log(response)
	    		if (response.data.status == 200) {
	    			if(ur == "bj"){	
		    			self.form.serviceName = self.compileForm.system_name;
		    			console.log(self.compileForm.system_name)
		    			self.$message({
					          	message: '修改服务完成！',
					          	type: 'success',
					          	duration:1500
						    });
		    			self.dialogFormVisible = false;
		    			self.routeId++
		    			self.$router.push('/serviceconfig?id='+self.routeId)
		    		}else if (ur == "zc") {
		    			self.$message({
				          	message: '新增服务完成！',
				          	type: 'success',
				          	duration:1500
					    });
		    			self.routeId++
		    			self.$router.push('/serviceconfig?id='+self.routeId)
		    			self.ask();
		    			self.registerFormVisible=false;
		    		}
	    		}else{
	    			if (ur == "bj") {
	    				self.$message({
				          	message: '修改服务失败！',
				          	type: 'error',
				          	duration:1500
					    });
	    			}else if (ur == "zc") {
	    				self.$message({
				          	message: '新增服务失败！',
				          	type: 'error',
				          	duration:1500
					    });
	    			}
	    		}
	    		
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
    	},
    	registerCancel(formSys){//关闭注册模态框
    		let self = this;
    		self.formSys = {
    			system_name:'',//服务名称
    		};
    		self.registerFormVisible = false;
    		self.$refs[formSys].resetFields();
    	},
    	editService(compileForm){
    		let self = this;
    		self.compileForm = {
    			system_name:'',//服务名称
    		};
    		self.dialogFormVisible = false;
    		self.$refs[compileForm].resetFields();
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
	.el-button--primary{
		/* margin-left: 10px; */
	}
</style>