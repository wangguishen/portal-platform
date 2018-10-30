<template>
  <div>
    <v-navbar></v-navbar>
  	<el-tree
      :data="tissues"
      :props="defaultProps"
      :show-checkbox = "false"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
    <el-dialog :title="branchName" @close="registerCancel('form')" :visible.sync="dialogFormVisible">
		<el-form :model="form" :rules="formRules" ref="form">
		    <el-form-item label="部门名称：" :label-width="formLabelWidth" prop="name">
		      	<el-input v-model="form.name" placeholder="请输入部门名称" auto-complete="off" class="ipt_wid"></el-input>
		    </el-form-item>
		</el-form>
	  	<div slot="footer" class="dialog-footer">
		    <el-button @click="registerCancel('form')">取 消</el-button>
		    <el-button type="primary" @click="appendSure('form')">确 定</el-button>
	  	</div>
	</el-dialog>
  </div>
</template>
<script>
  import vNavbar from '../../common/Navbar.vue'
  let id = 1000;
  export default {
  	components: {
	  vNavbar
	},
    data() {
      	return {
      		dataJson:{},
	        tissues: [],
	        defaultProps: {
	          children: 'children',
	          label: 'label'
	        },
	        branchName: "新增部门",//弹框标题
	        dialogFormVisible:false,
	        formLabelWidth: '120px',
	        form: {
          		name: '',
        	},
        	formRules:{
        		name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        	},
        	changeFrom:{
        		name: '',
        	},//临时更换from
        	currentData:{},//当前添加的数据
        	currentStore:{},
        	maxId:0,
        	states:0,//状态

      	}
    },
    mounted(){
    	let self = this;
    	let storage = JSON.parse(localStorage.getItem('dataJson'));
    	self.dataJson = storage;
    	self.tissues = [];
    	console.log(self.dataJson)
    	self.sys();
    },
    watch:{
		'$route':{  
            handler:function(val,oldval){  
            	let self = this;
                let storage = JSON.parse(localStorage.getItem('dataJson'));
			    self.dataJson = storage;
			    self.tissues = [];
		    	self.sys();
            },  
            deep:true//对象内部的属性监听，也叫深度监听  
        },
	},
    methods: {
      	append(store, data) {
      		let self = this;
        	self.branchName = "新增部门",
        	self.states = 0;
        	self.dialogFormVisible = true;
        	self.currentData = data;
        	self.currentStore = store;
      	},
      	appendSure(form){
      		let self = this;
      		self.$refs[form].validate((valid) => {
          		if (valid) {
            		if(self.states == 0){
		      			let join = { id: self.maxId++, label: self.form.name, children: [] };
		      			self.joinSure(join, 'xz', form)
		      		}else if(self.states == 1){
		      			let join = { id: self.maxId++, label: self.form.name, children: [] };
		      			self.joinSure(join, 'bj', form)
		      		}
          		} else {
            		console.log('error submit!!');
            		return false;
          		}
        	});
      	},
      	joinSure(join, state, form){//添加ajax
      		let self = this;
      		let data = {};
      		let urls = ""
      		if(state == 'xz'){
      			urls = "/UAMS/department/addDep";
      			data = {
	    			'compCode':self.dataJson.comp_code,
	    			'sysCode':self.currentData.system_id || self.dataJson.comp_code,
		    		'deptName':self.form.name,
					'deptCode':self.getRandomString(10),
					'deptParentCode':self.currentData.id,
		    	}
      		}else if(state == 'bj'){
      			urls = "/UAMS/department/updateDep";
      			data = {
      				'compCode':self.dataJson.comp_code,
	    			'sysCode':self.currentData.system_id,
		    		'oldDeptCode':self.changeFrom.code,
		    		'id': self.currentData.id,
		    		'newDeptName':self.form.name,
		    		'newDeptCode':self.getRandomString(10),
					'newParentCode':self.currentData.id,
      			}
      		}else if(state == 'sc'){
      			urls = "/UAMS/department/deleteDep";
      			console.log(self.currentData)
      			data = {
      				'compCode':self.dataJson.comp_code,
	    			'sysCode':self.currentData.system_id,
	    			'id': self.currentData.id,
		    		'deptCode':self.currentData.dept_code,
      			}
      		}
      		console.log(data)
      		self.$axios({
	    		url: urls,
	    		method: 'post',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(response) {
	    		console.log(response)
	    		if(response.data.success){
	    			if(state == 'xz'){
		    			join = response.data.data;
		    			join.label = join.dept_name;
		    			self.currentStore.append(join, self.currentData);
		    			self.$message({
			            	type: 'success',
			            	message: response.data.msg
			          	});
			          	self.$refs[form].resetFields();
		    		}else if(state == 'bj'){
		    			self.currentData.dept_name = self.form.name;
		    			self.$refs[form].resetFields();
		    		}else if(state == 'sc'){
		    			self.currentStore.remove(self.currentData);
			          	self.$message({
			            	type: 'success',
			            	message: '删除成功!'
			          	});
		    		}
		    		self.dialogFormVisible = false;
	    			self.form = {};
	    		}else{
	    			if(state == 'sc'){
	    				// self.currentStore.remove(self.currentData);
	    			}
	    			self.$message({
		            	type: 'warning',
		            	message: response.data.msg
		          	});
	    		}
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
      	},
      	edit(store, data) {
      		let self = this;
      		console.log(data)
        	self.branchName = "编辑部门",
        	self.states = 1;
        	self.form.name = data.label;
        	self.changeFrom.name = data.label;
        	self.changeFrom.code = data.dept_code;
        	self.dialogFormVisible = true;
        	self.currentData = data;
        	self.currentStore = store;
      	},
      	remove(store, data) {
      		let self = this;
        	// store.remove(data);
        	self.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
	          	confirmButtonText: '确定',
	          	cancelButtonText: '取消',
	          	type: 'warning'
	        }).then(() => {
	        	self.currentData = data;
        		self.currentStore = store;
	        	let join = { id: self.maxId++, label: self.form.name, children: [] };
	        	self.joinSure(join, 'sc')
	        }).catch(() => {
	          	self.$message({
	            	type: 'info',
	            	message: '已取消删除'
	          	});          
	        });
      	},
      	ask() {
      		let self = this;
      		self.$axios({
	    		url: "/UAMS/department/query_dep_list",
	    		method: 'post',
	    		responseType: 'json',
	    		data: {
		    		'compCode':self.dataJson.comp_code,
		    		"date":new Date().getTime(),
		    	}
	    	})
	    	.then(function(response) {
	    		console.log(response)
	    		let list = response.data.data;
				function transData(a, idStr, pidStr, childrenStr) { 
			 		let r = [], hash = {}, id = idStr, pid = pidStr, children = childrenStr, i = 0, j = 0, len = a.length;
			 		for (; i < len; i++) {
			 			a[i].label = a[i].dept_name;
			 			if(a[i].id > self.maxId){
			 				self.maxId = a[i].id;
			 			}
			 			hash[a[i][id]] = a[i];
		 			} 
		 			for (; j < len; j++) { 
			 			let aVal = a[j], hashVP = hash[aVal[pid]]; 
			 			if (hashVP) { 
			 			 	!hashVP[children] && (hashVP[children] = []); 
			 			 	hashVP[children].push(aVal); 

			 			} else { 
		 			 		r.push(aVal); 
		 			 	} 
	 			 	} 
	 			 	return r;
 			 	}
 			 	let jsonData = eval(list);
 			 	let arr = transData(jsonData, 'id', 'parent_id', 'children');
 			 	self.tissues[0].children = arr;
 			 	console.log(self.tissues)
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
      	},
      	sys(){
      		let self = this;
      		self.$axios({
	    		url: "/UAMS/Auth/queryCompany",
	    		method: 'post',
	    		responseType: 'json',
	    		data: {
		    		'compCode':self.dataJson.comp_code,
		    	}
	    	})
	    	.then(function(response) {
	    		console.log(response)
	    		let list = response.data.data;
    			let obj = { 
	    			id: list.company.id, 
	    			label: list.company.comp_name, 
	    			// system_id: list.company.comp_code,
	    			children: [] 
	    		}
    			self.tissues.push(obj);
    			self.ask()
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
      	},
      	registerCancel(form){//关闭模态框
    		let self = this;
    		self.$refs[form].resetFields();
    		self.dialogFormVisible = false;
    	},
      	getRandomString(len) {
	        len = len || 32;
	        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
	        let maxPos = chars.length;
	        let pwd = '';
	        for (let i = 0; i < len; i++) {
	            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	        }
	        return pwd;
	    },
      	renderContent(h, { node, data, store }) {
		    if("parent_id" in data){
                if(data.parent_id == data.id){
                    return (
                        <span>
                            <span>
                                <span>{node.label}</span>
                            </span>
                            <span style="float: right; margin-right: 84px; display: block;">
                                <el-button size="mini" icon="plus" on-click={ () => this.append(store, data) }></el-button>
                            </span>
                        </span>
                    );
                }else{
                    return (
                        <span>
                            <span>
                                <span>{node.label}</span>
                            </span>
                            <span style="float: right; margin-right: 20px; display: block;">
                                <el-button size="mini" icon="plus" on-click={ () => this.append(store, data) }></el-button>
                                <el-button size="mini" icon="edit" on-click={ () => this.edit(store, data)}></el-button>
                                <el-button size="mini" icon="delete2" on-click={ () => this.remove(store, data) }></el-button>
                            </span>
                        </span>
                    );
                }   
            }else{
                self.sysId = data.id;
                return (
                    <span>
                        <span>
                            <span>{node.label}</span>
                        </span>
                        <span style="float: right; margin-right: 84px; display: block;">
                            <el-button size="mini" icon="plus" on-click={ () => this.append(store, data) }></el-button>
                        </span>
                    </span>
                );
            }   
      	}
    }
};
</script>
<style scoped>
	.ipt_wid{
		width: 34%;
	}
</style>