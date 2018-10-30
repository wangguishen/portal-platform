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
      :render-content="renderContent"
      id="box_tree">
    </el-tree>
    <el-dialog :title="branchName" @close="registerCancel('form')" :visible.sync="dialogFormVisible">
		<el-form :model="form" :rules="formRules" ref="form">
		    <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="name">
		      	<el-input v-model="form.name" placeholder="请输入角色名称" auto-complete="off" class="ipt_wid"></el-input>
		    </el-form-item>
		    <el-form-item label="角色描述：" :label-width="formLabelWidth">
			    <el-input type="textarea" v-model="form.desc" class="area_wid"></el-input>
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
      		uams:'',
	        tissues: [],
	        defaultProps: {
	          children: 'children',
	          label: 'label'
	        },
	        branchName: "新增角色",//弹框标题
	        dialogFormVisible:false,
	        formLabelWidth: '120px',
	        form: {
          		name: '',
          		desc: ''
        	},
        	formRules:{
        		name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        	},
        	changeFrom:{
        		name: '',
        		desc: '',//描述
        	},//临时更换from
        	currentData:{},//当前添加的数据
        	currentStore:{},
        	maxId:0,
        	states:0,//状态
        	sysId: "",//第二级
      	}
    },
    mounted(){
    	let self = this;
    	let storage = JSON.parse(localStorage.getItem('dataJson'));
    	self.dataJson = storage;
    	self.uams = localStorage.getItem('uams');
    	if(self.$route.query.second_code){
            self.dataJson.comp_code = Base64.decode(self.$route.query.second_code)
        }else{
            self.dataJson.comp_code = Base64.decode(self.$route.query.comp_code)
        }
    	console.log(self.dataJson)
    	self.sys();
    },
    watch:{
		'$route':{  
            handler:function(val,oldval){  
            	let self = this;
                let storage = JSON.parse(localStorage.getItem('dataJson'));
			    self.dataJson = storage;
			    self.uams = localStorage.getItem('uams');
			    if(val.query.second_code){
                    self.dataJson.comp_code = Base64.decode(val.query.second_code)
                }else{
                    self.dataJson.comp_code = Base64.decode(val.query.comp_code)
                }
			    self.tissues = [];
		    	self.sys();
            },  
            deep:true//对象内部的属性监听，也叫深度监听  
        },
	},
    methods: {
      	append(store, data) {
      		let self = this;
        	self.branchName = "新增角色",
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
      			urls = "/UAMS/Authenticate/addRole";
      			console.log('新增',self.currentData)
      			data = {
	    			'compCode':self.dataJson.comp_code,
	    			'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
	    			'sysCode':self.currentData.sys_code,
					'deptCode':self.currentData.id,
					'roleName':self.form.name,
					'roleDesc':self.form.desc,
					'systemId':self.currentData.id
		    	}
      		}else if(state == 'bj'){
      			urls = "/UAMS/Authenticate/updateRole";
      			console.log(self.currentData)
      			data = {
      				'compCode':self.dataJson.comp_code,
      				'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
	    			'sysCode':self.currentData.code,
	    			'deptCode':self.currentData.dept_code,
		    		'roleId':self.currentData.oldId,
		    		'newRoleName':self.form.name == self.currentData.label?'':self.form.name,
		    		'newDesc':self.form.desc,
		    		'systemId':self.currentData.id
      			}
      		}else if(state == 'sc'){
      			urls = "/UAMS/Authenticate/deleteRole";
      			console.log('1111',self.currentData)
      			data = {
      				'compCode':self.dataJson.comp_code,
	    			'sysCode':self.currentData.id,
	    			'roleId': self.currentData.oldId,
		    		'deptCode':self.currentData.dept_code,
		    		'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
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
	    		console.log('ssss',response)
	    		if(response.data.success){
	    			if(state == 'xz'){
	    				let res = response.data.data;
	    				join.oldId = res.id;
	    				join.dept_code = res.dept_code;
	    				join.dept_name = res.roleName;
	    				join.parent_id = res.dept_code;
	    				join.description = res.description;
	    				join.label = res.roleName;
		    			self.currentStore.append(join, self.currentData);
		    			self.$refs[form].resetFields();
		    			self.dialogFormVisible = false;
		    		}else if(state == 'bj'){
		    			if(self.form.name != ''){
		    				self.currentData.label = self.form.name;
			    			self.currentData.roleName = self.form.name;
			    			self.currentData.dept_name = self.form.name;
		    			}
		    			self.currentData.description = self.form.desc;
		    			self.$refs[form].resetFields();
		    		}else if(state == 'sc'){
		    			self.currentStore.remove(self.currentData);
			          	self.$message({
			            	type: 'success',
			            	message: '删除成功!'
			          	});
		    		}
		    		self.sys();
	    		}else{
    				self.$message({
		            	type: 'warning',
		            	message: response.data.msg
		          	});
	    		}
	    		self.dialogFormVisible = false;
	    		self.form = {};
	    	})
	    	.catch(function(response) {
	    		console.log(response)
	    		console.log("报错了")
	    	})
      	},
      	edit(store, data) {//编辑部门
      		let self = this;
      		console.log("data",data)
        	self.branchName = "编辑角色",
        	self.states = 1;
        	self.form.name = data.label;
        	self.form.desc = data.description;
        	self.changeFrom.name = data.label;
        	self.changeFrom.code = data.dept_code;
        	self.dialogFormVisible = true;
        	self.currentData = data;
        	self.currentStore = store;
      	},
      	remove(store, data) {//删除部门
      		let self = this;
        	self.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
      	role() {//加载角色
      		let self = this;
      		self.$axios({
	    	    url: "/UAMS/Authenticate/queryRole",
	    		method: 'post',
	    		responseType: 'json',
	    		data: {
		    		'compCode':self.dataJson.comp_code,
		    		'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
		    	}
	    	})
	    	.then(function(response) {
	    		console.log('加载角色',response.data.data)
	    		let list = response.data.data;
	    		list.forEach(function(item, index){
	    			item.dept_name = item.roleName;
	    			item.oldId = item.id;
	    			item.parent_id = item.code;
	    			item.id = id++;
	    			self.tissues.push(item);
	    		})
	    		console.log("tissues===",self.tissues)
	    		let jsonData = eval(self.tissues);
 			 	let arr = self.transData(jsonData, 'id', 'parent_id', 'children');
 			 	self.tissues = arr;
 			 	console.log("tissues===",self.tissues)
	    		// self.$nextTick(()=>{
		     //    })
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
      	},
      	ask() {//加载系统
      		let self = this;
      		self.$axios({
	    		url: "/UAMS/Authenticate/do_system_query",
	    		method: 'post',
	    		responseType: 'json',
	    		data: {
		    		'compCode':self.dataJson.comp_code,
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
                        list.forEach(function(item, index){
                            item.label = item.system_name;
                            item.dept_name = item.system_name;
                            item.children = [];
                            item.disabled = true;
                            item.parent_id = self.sysId;
                            self.tissues.push(item)
                        })
                        self.role();
                    }
                }else{
                    console.log("后台返回错误")
                }
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
      	},
      	sys(){//加载企业
      		let self = this;
      		self.tissues = [];
      		self.$axios({
	    		url: "/UAMS/Auth/queryCompany",
	    		// url:"/UAMS/system/do_system_query",
	    		method: 'post',
	    		responseType: 'json',
	    		data: {
		    		'compCode':self.dataJson.comp_code,
		    	}
	    	})
	    	.then(function(response) {
	    		console.log("response",response)
	    		let list = response.data.data.company;
                self.sysId = list.id;
                self.$set(list, 'label', list.comp_name)
                self.$set(list, 'dept_name', list.comp_name)
                self.$set(list, 'children', [])
                self.$set(list, 'disabled', true)
                // self.$set(list, 'parent_id', 'sys_'+list.id)
                self.tissues.push(list);
	    		self.ask();
	    		// self.role();
	    	})
	    	.catch(function(response) {
	    		console.log("报错了")
	    	})
      	},
      	transData(a, idStr, pidStr, childrenStr) { 
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
	 	},
      	registerCancel(form){//关闭模态框
    		let self = this;
    		self.form = {
          		name: '',
          		desc: ''
        	};
    		self.$refs[form].resetFields();
    		self.dialogFormVisible = false;
    	},
      	getRandomString(len) {//随机字符串
	        len = len || 32;
	        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
	        let maxPos = chars.length;
	        let pwd = '';
	        for (let i = 0; i < len; i++) {
	            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	        }
	        return pwd;
	    },
	    /*<el-button size="mini" icon="plus" on-click={ () => this.append(store, data) }></el-button>*/
      	renderContent(h, { node, data, store }) {
      		let self = this;
      		// if(isNaN(data.id) || 'Isdepartment' in data){
      		if("parent_id" in data){
                 if(data.parent_id == self.sysId){
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
                            <span style="float: right; margin-right: 52px; display: block;">
                                <el-button size="mini" icon="edit" on-click={ () => this.edit(store, data)}></el-button>
                                <el-button size="mini" icon="delete2" on-click={ () => this.remove(store, data) }></el-button>
                            </span>
                        </span>
                    );   
                }
            }else{
                return (
                    <span>
                        <span>
                            <span>{node.label}</span>
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
	.area_wid{
		width: 60%;
	}
</style>