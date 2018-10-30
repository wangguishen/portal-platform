<template>
	<div>
		<div>
			<el-input placeholder="请输入参数名称" v-model="configInput" @keyup.enter.native="search" class="select_box leftFloatBox">
				<template slot="prepend">参数名称</template>
			</el-input>
			<el-button type="primary" icon="search" @click="search">查询</el-button>
			<el-button type="info" @click="addParameters()">新增参数</el-button>
			<el-dialog title="编辑参数" @close= "registerCancel('addform')" :visible.sync="addParameter">
				<el-form :model="addform" ref="addform" :rules="rules" class="demo-ruleForm">
				    <el-form-item label="参数名称" :label-width="formLabelWidth" prop="name">
				      	<el-input v-model="addform.name" auto-complete="off" placeholder="请输入参数名称"></el-input>
				    </el-form-item>
				    <el-form-item label="参数类型" :label-width="formLabelWidth" prop="type">
				      	<el-input v-model="addform.type" auto-complete="off" placeholder="请输入参数类型"></el-input>
				    </el-form-item>
				    <el-form-item label="参数介绍" :label-width="formLabelWidth" prop="desc">
				      	<el-input v-model="addform.desc" auto-complete="off" placeholder="请输入参数介绍"></el-input>
				    </el-form-item>
				    <el-form-item label="必填" :label-width="formLabelWidth" prop="require">
					    <el-select v-model="addform.require" placeholder="请选择是否为必填">
						    <el-option
						      	v-for="item in items"
						      	:key="item.value"
						      	:label="item.label"
						      	:value="item.label">
						    </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="参数示例" :label-width="formLabelWidth" prop="example">
				      	<el-input v-model="addform.example" auto-complete="off" placeholder="请输入参数示例"></el-input>
				    </el-form-item>
	  			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="registerCancel('addform')">取 消</el-button>
				<el-button type="primary" @click="addParaSure('addform')">确 定</el-button>
			</div>
			</el-dialog>
		</div>
		<div class="parasMain">
			<el-table
			    :data="tableData"
			    border style="width: 100%">
	    		<el-table-column
	    		prop="index"
	      		label="序列"
	      		width="160">
	    		</el-table-column>
		    	<el-table-column
		    		prop="pName"
		      		label="参数名称"
		      		width="160">
		    	</el-table-column>
		    	<el-table-column
		    	prop="pType" 
		    	label="参数类型" 
		    	width="160">
		    	</el-table-column>
		    	<el-table-column
		    	prop="pIntroduce" 
		    	label="介绍"
		    	width="160">
		    	</el-table-column>
		    	<el-table-column
		    	prop="required" 
		    	label="必填" 
		    	width="160">
		    	</el-table-column>
		    	<el-table-column
		    	prop="sample" 
		    	label="示例" 
		    	width="160">
		    	</el-table-column>
		    	<el-table-column label="操作">
		      		<template slot-scope="scope">
			        	<el-button
			          		size="small"
			          		@click="handleEdit(scope.$index, tableData)">编辑</el-button>
			          	<el-dialog title="编辑参数" @close="editCancel('form')" :visible.sync="handleEdits">
		  					<el-form :model="form" ref="form" :rules="rules" class="demo-ruleForm">
							    <el-form-item label="参数名称" :label-width="formLabelWidth" prop="name">
							      	<el-input v-model="form.name" auto-complete="off"></el-input>
							    </el-form-item>
							    <el-form-item label="参数类型" :label-width="formLabelWidth" prop="type">
							      	<el-input v-model="form.type" auto-complete="off"></el-input>
							    </el-form-item>
							    <el-form-item label="参数介绍" :label-width="formLabelWidth" prop="desc">
							      	<el-input v-model="form.desc" auto-complete="off"></el-input>
							    </el-form-item>
							    <el-form-item label="必填" :label-width="formLabelWidth" prop="require">
								    <el-select v-model="form.require" placeholder="是">
									    <el-option
									      	v-for="item in items"
									      	:key="item.value"
									      	:label="item.label"
									      	:value="item.label">
									    </el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="参数示例" :label-width="formLabelWidth" prop="example">
							      	<el-input v-model="form.example" auto-complete="off"></el-input>
							    </el-form-item>
					  		</el-form>
							  <div slot="footer" class="dialog-footer">
							    	<el-button @click="editCancel('form')">取 消</el-button>
							    	<el-button type="primary" @click="editSure('form')">确 定</el-button>
							  </div>
						</el-dialog>
			        	<el-button
			          		size="small"
			          		type="danger"
			          		@click="handleDelete(scope.$index, tableData)">删除</el-button>
			          	<el-dialog title="删除系统" :visible.sync="delectVisible" size="tiny">
				  			<span>确定要删除吗？</span>
				  			<span slot="footer" class="dialog-footer">
							    <el-button @click="delectVisible = false">取 消</el-button>
							    <el-button type="primary" @click="delectSure()">确 定</el-button>
							 </span>
						</el-dialog>
		      		</template>
		    	</el-table-column>
	  		</el-table>
		</div>
  	</div>
</template>

<script>
export default {
    	data() {
	    return {
	    	handleEdits:false,
	    	addParameter:false,
	    	delectVisible:false,
	    	dialogFormVisible:false,
	    	configInput:'',//输入参数名称
	        tableData: [
	        ],
	        items:[{
		        	value:'选项一',
		        	label:'是'
		        },{
		        	value:'选项二',
		        	label:'否'
		    }],
		    addform: {
		        name: '',//参数名称
		        region: '',
		        date1: '',
		        date2: '',
		        delivery: false,
		        type: '',//参数类型
		        require:'',//必填
		        example:'',//参数示例
		        resource: '',
		        desc: ''//参数介绍
        	},
	        form: {
		        name: '',//参数名称
		        region: '',
		        date1: '',
		        date2: '',
		        delivery: false,
		        type: '',//参数类型
		        require:'',//必填
		        example:'',//参数示例
		        resource: '',
		        desc: ''//参数介绍
        	},
        	rules:{
        		name:[{required:true,message:'请输入参数名称',trigger:'blur'}],
        		type:[{required:true,message:'请输入参数类型',trigger:'blur'}],
        		desc:[{required:true,message:'请输入参数介绍',trigger:'blur'}],
        		require:[{required:true,message:'请选择必填类型',trigger:'change'}],
        		example:[{required:true,message:'请输入参数示例',trigger:'blur'}]
        	},
        	formResult:'',//弹出框内容
        	formLabelWidth: '120px'
	    }
    },
    mounted(){
    	let self = this;
    	let storage = JSON.parse(localStorage.getItem('dataJson'));//登录取值
    	let reqStorage = JSON.parse(localStorage.getItem('reqDataJson'));//入参示例取值
    	console.log(storage);
    	console.log(reqStorage);
    	self.dataJson = storage;
    	self.reqDataJson = reqStorage;
    	self.request();
    },
    methods: {
      	handleEdit(index, row) {//编辑
        	// console.log(index, row);
        	let self=this;
        	self.handleEdits=true;
        	self.selectIndex = index;
        	self.formResult=row[index];//新增或改变后数据表单
        	console.log(self.formResult);
        	self.form={//左边编辑表单内容，右边后台请求对应内容
        		name:row[index].pName,
        		type:row[index].pType,
        		desc:row[index].pIntroduce,
        		require:row[index].required,
        		example:row[index].sample
        	}
        	console.log(self.form)
      	},
      	// getUrlParam(name){//获取url中的参数
      		// let interId = '';
      		// let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");//含有目标函数
      		// let r = window.location.search.substr(1).match(reg); //匹配目标参数
      		// if (r!=null) return unescape(r[2]); return null;
      	// },
      	editSure(form){//编辑确认按钮
      		let self=this;
      		self.$refs[form].validate((valid) => {
		        if (valid) {
		            console.log('submit!');
		            console.log(self.form);//编辑框内容
		      		if (self.form.require == 0) {
		      			self.form.required="是";
		      		}else if(self.form.require == 1){
		      			self.form.required="否";
		      		}
		            self.register('bj');
		            self.handleEdits = false;
		        } else {
		            console.log('error submit!!');
		            return false;
		        }
		    });
      	},
      	handleDelete(index, row) {//删除按钮
        	console.log(index, row);
        	let self = this;
	    	self.delectVisible = true;
	    	self.selectList = row[index];
	    	self.selectIndex = index;
      	},
      	delectSure(){//确认删除
      		let self = this;
      		console.log(self.reqDataJson)
    		self.$axios({
	    		url: "/basic-platform/parm/del",
	    		method: 'delete',
	    		responseType: 'json',
	    		data: {
	    			'id':self.selectList.id
	    		}
	    	})
	    	.then(function(response) {
	    		console.log(response)
	    		self.tableData.splice(self.selectIndex,1);
	    		self.tableData.forEach(function(item, index){
	    			item.index = index+1;
	    		})
	    		self.delectVisible = false;
	    		self.$message({
		          	message: '删除参数成功!',
		          	type: 'success',
		          	duration:1500
			    });
	    		self.request();

	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
      	},
      	search(){//查询
      		let self=this;
      		self.request();
      	},
      	request(){//请求数据列表
      		let self = this;
      		console.log(self.configInput);
      		console.log(self.reqDataJson)
      		let datas={
      			'pName' : self.configInput,
	    		'interId' : self.reqDataJson.id
      		};
      		console.log(datas);
      		self.$axios({
      			url:'/basic-platform/parm/sel?pName='+self.configInput+'&interId='+self.reqDataJson.id,
      			method: 'get',
	    		responseType: 'json',
	    		data: datas
      		})
      		.then(function(response){
      			console.log(response);
      			let list=response.data.data;
      			list.forEach(function(item,index){
      				item.index = index+1;
      			})
      			self.tableData = response.data.data;//查询数据赋给列表
      			console.log(self.tableData);
      		})
      		.catch(function(response){
      			console.log(error);
      		})
      	},
      	register(ur){//新增参数或编辑
      		let self=this;
      		let urls="";
      		let types="";
      		let datas="";
      		if (ur == "zc") {//新增参数
      			types="post";
      			urls="add";
      			datas={
      				'id' : self.formResult.id,
      				'pName' : self.addform.name,
      				'pType' : self.addform.type,
      				'pIntroduce' : self.addform.desc,
      				'required' : self.addform.require,
      				'sample' : self.addform.example,
      				'interId' : self.reqDataJson.id
      			}
      		}else if (ur == "bj") {//编辑参数
      			types="put";
      			urls="up";
      			console.log(self.reqDataJson)
      			datas={
      				'id' : self.formResult.id,
      				'pName' : self.form.name,
      				'pType' : self.form.type,
      				'pIntroduce' : self.form.desc,
      				'required' : self.form.require,
      				'sample' : self.form.example,
      				'interId' : self.reqDataJson.id
      			}
      		}
      		console.log(datas);
      		self.$axios({
      			url:"/basic-platform/parm/"+urls,
      			method:types,
      			responseType:'json',
      			data:datas
      		})
      		.then(function(response){
      			console.log(response);
      			if (response.data.status == 200) {
      				if (ur == "bj") {//编辑后渲染页面
	      				self.formResult.pName = self.form.name;
	      				self.formResult.pType = self.form.type;
	      				self.formResult.pIntroduce = self.form.desc;
	      				self.formResult.required = self.form.require;
	      				self.formResult.sample = self.form.example;
	      				self.$message({
				          	message: '修改参数完成！',
				          	type: 'success',
				          	duration:1500
					    });
      				}else if(ur == "zc"){
	      				self.$message({
				          	message: '新增参数完成！',
				          	type: 'success',
				          	duration:1500
					    });
      				}
	      			self.request();
	      			self.addParameter = false;
      			}else{
      				if (ur == "bj") {
      					self.$message({
				          	message: '修改参数失败！',
				          	type: 'error',
				          	duration:1500
					    });
      				}else if (ur == "zc") {
      					self.$message({
				          	message: '新增参数失败！',
				          	type: 'error',
				          	duration:1500
					    });
      				}
      			}
      			
      		})
      		.catch(function(response){
      			console.log(error);
      		})
      	},
      	addParameters(ur){//新增参数
      		let self=this;
      		self.addParameter=true;
      	},
      	addParaSure(addform){//新增参数确认
      		let self=this;
      		self.$refs[addform].validate((valid) => {
		        if (valid) {
		            console.log('submit!');
		            let num = self.tableData.length;
	      			console.log(self.addform);
	      			self.addform.index = num+1;
		      		if (self.addform.require == 0) {
		      			self.addform.required="是";
		      		}else if(self.addform.require == 1){
		      			self.addform.required="否";
		      		}
		      		self.register("zc");
		        } else {
		            console.log('error submit!!');
		            return false;
		        }
		    });
	      		
      	},
      	registerCancel(addform){//关闭新增参数模板
      		let self=this;
      		self.addParameter = false;
      		self.addform={
      			name:'',//参数名称
      			type:'',//参数类型
      			desc:'',//简介
      			example:'',//示例
      			require:''//是否必填
      		}
      		self.$refs[addform].resetFields();
      	},
      	editCancel(form){
      		let self=this;
      		self.handleEdits = false;
      		self.form={
      			name:'',//参数名称
      			type:'',//参数类型
      			desc:'',//简介
      			example:'',//示例
      			require:''//是否必填
      		}
      		self.$refs[form].resetFields();
      	}
    }
}
</script>

<style scoped>
	.el-input{
		width: 172px;
	}
	.el-table{
		margin-top: 30px;
	}
	.el-dialog .el-form .el-select{
		width: 172px;
	}
	.cell .el-button{
		margin: 0 6px 0 40px;
	}
	.content .el-button--info{
		margin: 0 2px 0 14px;
	}
	.select_box{
		width: 25%;
	}
	.el-button--primary {
		/* margin-left: 10px; */
	}
</style>
<style>
	.parasMain .el-table .cell{
  		max-height: 50px;
  		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
  	}
</style>