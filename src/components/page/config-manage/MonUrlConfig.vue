<template>
  	<div>
  		<div class="url_header">
			<el-input placeholder="请输入链接地址" v-model="urlInput" class="select_box leftFloatBox" @keyup.enter.native="askUrl()">
		    	<template slot="prepend">链接地址</template>
		  	</el-input>
		  	<el-button type="primary" icon="search" @click="askUrl()">搜索</el-button>
		  	<el-button type="info" @click="registerUrl()">注册链接</el-button>
		</div>
		<div class="url_main">
			<el-table
			    :data="urlsData"
			    border
			    empty-text="暂无监控链接，请注册链接"
			    style="width: 100%">
			    <el-table-column
			      	prop="subIndex"
			      	label="序列"
			      	width="100">
    			</el-table-column>
			    <el-table-column
			      	prop="linkName"
			      	label="链接名称"
			      	width="250">
    			</el-table-column>
			    <el-table-column
			      	prop="link"
			      	label="链接url"
			      	width="400">
			    </el-table-column>
			    <el-table-column
			      	prop="requestMethod"
			      	label="请求方式"
			      	width="250">
			    </el-table-column>
			    <el-table-column
			      	label="操作">
				    <template slot-scope="scope">
			        	<el-button @click="handleClick(scope.$index, urlsData)" type="text" size="small">编辑</el-button>
			        	<el-button type="text" size="small" @click="delectClick(scope.$index, urlsData)">删除</el-button>
		        		<el-button v-show="urlsData[scope.$index].requestMethod == 'POST'" type="text" size="small" @click="addParameter(scope.$index, urlsData)">参数</el-button>
			        	<el-switch
			        		class="el_switch_url"
						  	v-model="urlsData[scope.$index].subenable"
						  	on-color="#13ce66"
						  	off-color="#ff4949"
						  	on-text="启用"
						  	off-text="禁用"
						  	@change="enableChange"
						  	@click.native="enableClick(urlsData[scope.$index])">
						</el-switch>
			      	</template>
    			</el-table-column>
  			</el-table>
		</div>
		<el-dialog :title="objTab.title" @close="registerCancel('formUrl')" :visible.sync="registerFormVisible">
  			<el-form :model="formUrl" ref="formUrl" :rules="formUrlRules">
			    <el-form-item label="链接名称：" :label-width="formLabelWidth" prop="linkName">
			      	<el-input v-model="formUrl.linkName" placeholder="请输入链接名称" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="链接url：" :label-width="formLabelWidth" prop="link">
			      	<el-input v-model="formUrl.link" placeholder="请输入url" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="请求方式：" :label-width="formLabelWidth" prop="requestMethod">
		      		<el-select v-model="formUrl.requestMethod" placeholder="请选择请求方式" class="ipt_wid">
			        	<el-option v-for="type in motheds" :label="type.name" :value="type.name" :key="type.name"></el-option>
			      	</el-select>
			    </el-form-item>
			    <el-form-item label="终端名称：" :label-width="formLabelWidth" prop="type">
			        <el-select v-model="formUrl.type" placeholder="请选择终端名称" class="ipt_wid">
			            <el-option v-for="ter in terminal" :label="ter.name" :value="ter.value" :key="ter.value">
			            </el-option>
			        </el-select>
			    </el-form-item>
			    <el-form-item label="实验室名称：" :label-width="formLabelWidth" prop="deptName">
			        <el-select v-model="formUrl.deptName" placeholder="请选择实验室名称" class="ipt_wid" @change="change(formUrl.deptName)">
			            <el-option v-for="lab in labList" :label="lab.addJoinDep" :value="lab.id" :key="lab.id">
			            </el-option>
			        </el-select>
			    </el-form-item>
			    <el-form-item label="项目名称：" :label-width="formLabelWidth" prop="sysName">
		      		<el-select v-model="formUrl.sysName" placeholder="请选择项目名称" class="ipt_wid">
		        		<el-option v-for="type in sysList" :label="type.systemName" :value="type.id" :key="type.id">
		        		</el-option>
			      	</el-select>
			    </el-form-item>
  			</el-form>
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="registerCancel('formUrl')">取 消</el-button>
			    <el-button type="primary" @click="sureRegister('formUrl')">确 定</el-button>
		  	</div>
		</el-dialog>
		<el-dialog title="删除链接" :visible.sync="delectVisible" size="tiny">
		  	<span>确定要删除此链接吗？</span>
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
export default{
	data(){
		var checkLink = (rule, value, callback) => {
	        if (!value) {
	          	return callback(new Error('请输入链接地址'));
	        }
        	let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
          	if (!reg.test(value)) {
            	callback(new Error('请选择正确的链接地址'));
         	}else {
            	callback();
          	}
      	};
		return{
			dataJson:{},//登录数据
			urlsData:[],//监控url数据
			urlInput:'',//输入框的值
			registerFormVisible:false,//注册模态框显示隐藏
			formLabelWidth: '120px',
			formUrl:{//上传对象
				linkName:'',
				link:'',
				requestMethod:'',
				sysName:'',
				deptName: '',
				type:'',
			},
			formUrlRules:{
				linkName: [{ required: true, message: '请输入链接名称', trigger: 'blur' }],
				link: [{ required: true,validator: checkLink, trigger: 'blur' }],
				requestMethod: [{ required: true, message: '请选择请求方式', trigger: 'change' }],
				deptName: [{ required: true, message: '请选择实验室名称', trigger: 'change' }],
				sysName: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
				type: [{ required: true, message: '请选择终端名称', trigger: 'change' }],
			},
			motheds:[//请求方式
				{name:'GET'},{name:'POST'},{name:'HTML'}
			],
			terminal:[//终端
				{name:'手机端',value:'手机端'},{name:'PC端',value:'PC端'},{name:'两者皆有',value:'手机端、PC端'}
			],
			sysList:[],//所有的系统
			labList: [], //实验室
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
	        listBox: {},
	        sysNameId:'',
		}
	},
	mounted(){
		let self = this;
		let storage = JSON.parse(localStorage.getItem('dataJson'));
    	self.dataJson = storage;
    	self.queryLab()
    	self.askUrl();
    	// self.askSys();
	},
	methods:{
		askUrl(){//请求
			let self = this;
			let url = "/basic-platform/link/sel?linkName="+self.urlInput+'&pageSize='+self.pageSize+'&currentPage='+self.currentPage;
			let data = {
				'linkName': self.urlInput,
				'pageSize': self.pageSize,
				'currentPage': self.currentPage
			};
			let method = 'get';
			console.log(data)
			self.askControl(url, data, method, 'cx')
		},
		delectClick(index, tab){//删除按钮
			let self = this;
			self.delectVisible = true;
			self.selectList = tab[index];
    		self.selectIndex = index;
		},
		addParameter(index, tab){//参数按钮
			let self = this;
    		localStorage.setItem("objParameter", JSON.stringify(tab[index]));
    		self.$router.push('/parameterdetail');
		},
		handleClick(index, tab){//编辑按钮
			console.log(index, tab)
			let self = this;
			console.log(self.sysList)
			self.objTab = {
				'title': '编辑链接',
				'state': 1
			}
			let tempData = tab[index].dept_name
			self.$set(self.formUrl,'linkName',tab[index].linkName);
			self.$set(self.formUrl,'link',tab[index].link);
			self.$set(self.formUrl,'requestMethod',tab[index].requestMethod);
			self.$set(self.formUrl,'sysName',tab[index].systemId.toString());
			self.$set(self.formUrl,'deptName',tab[index].deptId.toString());
			self.$set(self.formUrl,'type',tab[index].type);
			self.sysNameId = tab[index].systemId.toString();
			console.log("---------", self.formUrl)
			self.registerFormVisible = true;
			self.selectList = tab[index];
    		self.selectIndex = index;
    		let data = "&deptId=" + tab[index].deptId
    		self.$axios({
    		    url: '/basic-platform/system/sel?pageSize=10000' + data,
    		    method: 'get',
    		    responseType: 'json'
    		})
    		.then(function(res) {
    			console.log("success", res)
    			let list = res.data.data
				list.forEach(function(item, index){
					item.id = item.id.toString()
					self.$set(item,'addSysName',(item.comp_name + ' -- '  + item.dept_name + ' -- ' + item.systemName))
					self.$set(item,'oldId',item.id.toString())
    				self.sysList.push(item)
    			})
    		})
    		.catch(function(res) {
    			console.log("error", res)
    		})
		},
		enableClick(val){
			let self = this;
			self.listBox = val;
		},
		enableChange(value){
			let self = this;
			let num = 0;
			if(value){
				num = 1;
			}else{
				num = 0;
			}
			let url = '/basic-platform/link/up';
			let method = 'put';
			let type = 'jy';
			let data = {
				'id': self.listBox.id,
				'enable': num,
				'link': self.listBox.link,//链接
				'systemId': self.listBox.systemId,
			};
			console.log(self.listBox)
			console.log(data)
			self.askControl(url, data, method, type)
		},
		delectSure(){//确定删除
			let self = this;
			let url = "/basic-platform/link/del";
			let data = {
				'id': self.selectList.id,
			};
			let method = 'delete';
			console.log(data)
			self.askControl(url, data, method, 'sc')
		},
		changeCur(val){//分页查询
			let self = this;
			self.currentPage = val;
			self.urlsData = [];
			self.askUrl();
		},
		askSys(){//请求系统
			let self = this;
			let  url = "/basic-platform/system/sel?pageSize=10000";
			let data = {
				'pageSize': 10000
			};
			let method = 'get';
			self.askControl(url, data, method, 'xt')
		},
		registerUrl(){//注册按钮
			let self = this;
			self.objTab = {
				'title': '注册链接',
				'state': 0
			}
			self.registerFormVisible = true;
		},
		sureRegister(formUrl){//注册完成
			let self = this;
			// let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
			self.$refs[formUrl].validate((valid) => {
          		if (valid) {
          			let url = '',method = '',data = {},type='';
					if(self.objTab.state == 0){
						url = '/basic-platform/link/add';
						method = 'post';
						type = 'xz';
						data = {
							'linkName': self.formUrl.linkName,//企业名称
							'link': self.formUrl.link,//链接
							'requestMethod': self.formUrl.requestMethod,
							'systemId': self.formUrl.sysName,
							'type': self.formUrl.type,
							'enable':'1',
							'status': '0'
						};
					}else if(self.objTab.state == 1){
						url = '/basic-platform/link/up';
						method = 'put';
						type = 'bj';
						data = {
							'id': self.selectList.id,
							'linkName': self.formUrl.linkName,//企业名称
							'link': self.formUrl.link,//链接
							'requestMethod': self.formUrl.requestMethod,
							'systemId': self.formUrl.sysName,
							'status': '0',
							'type': self.formUrl.type
						};
					}
					console.log(data)
					self.askControl(url, data, method, type, formUrl)
          		} else {
            		console.log('error submit!!');
            		return false;
          		}
        	});
		},
		askControl(url, data, method, type, formUrl){//公共请求
			let self = this;
			self.$axios({
	    		url: url,
	    		method: method,
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(res) {
	    		console.log(res)
	    		if(res.data.status == 200){
	    			let list = res.data.data;
	    			if(type == 'cx'){
	    				self.urlsData = [];
	    				self.totalCount = res.data.page.totalRows;
	    				console.log('==',res)
		    			list.forEach(function(item, index){
		    				self.$set(item,'subIndex',(index+1))
		    				item.link = item.link.replace(/(^\s*)|(\s*$)/g,'')
		    				if(item.enable == 1){
		    					self.$set(item,'subenable',true)
		    				}else if(item.enable == 0){
		    					self.$set(item,'subenable',false)
		    				}
		    				self.urlsData.push(item)
		    			})
	    			}else if(type == 'xt'){
	    				self.sysList = [];
	    				list.forEach(function(item, index){
	    					item.id = item.id.toString()
	    					self.$set(item,'addSysName',(item.comp_name+' -- '+ item.dept_name + ' -- ' + item.systemName))
		    				self.sysList.push(item)
		    			})
	    			}else if(type == 'xz'){
	    				self.askUrl();
	    				self.registerFormVisible = false;
	    				self.$message({
				          	message: '新增链接成功',
				          	type: 'success',
				          	duration:1500
				        });
				        self.$refs[formUrl].resetFields()
	    			}else if(type == 'sc'){
	    				if(self.urlsData.length == 1){
	    					self.currentPage--;
	    				}
	    				self.askUrl();
	    				self.delectVisible = false;
	    				self.$message({
				          	message: '删除链接成功',
				          	type: 'success',
				          	duration:1500
				        });
	    			}else if(type == 'bj'){
	    				self.askUrl();
				        self.registerFormVisible = false;
				        self.$message({
				          	message: '修改链接成功',
				          	type: 'success',
				          	duration:1500
				        });
				        self.$refs[formUrl].resetFields()
	    			}else if(type == 'jy'){
	    				if(res.data.data.enable == 0){
	    					self.$message({
					          	message: '链接已禁用',
					          	type: 'warning',
					          	duration:1500
					        });
	    				}else if(res.data.data.enable == 1){
	    					self.$message({
					          	message: '链接已启用',
					          	type: 'success',
					          	duration:1500
					        });
	    				}
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
		registerCancel(formName){//关闭注册模态框
    		let self = this;
    		self.formUrl={//上传对象
				linkName:'',
				link:'',
				requestMethod:'',
				sysName:'',
				deptName: '',
				type:''
			}
			// self.formUrl = {};
			self.sysNameId = '';
			self.$refs[formName].resetFields()
    		self.registerFormVisible = false;
    	},
    	queryLab() { //获得所有实验室	
    	    let self = this
    	    let data = '&pageSize=10000' + '&currentPage=1'
		  	self.$axios({
		  		url: '/basic-platform/dept/sel?' + data,
		  		method: 'get',
		  		responseType: 'json',
		  	})
    	    .then(function(res) {
    	    	console.log("success", res)
    	    	let list = res.data.data
    	    	list.forEach( function(item, index) {
    	    	  item.id = item.id.toString()
    	    	  self.$set(item,'addJoinDep',(item.comp_name+' -- '+item.deptName))
    	    	})
    	    	/*self.labList = res.data.data*/
    	    	self.labList = list

    	    	console.log("=============", self.labList)
    	    })
    	    .catch(function(res) {
    	    	console.log("error", res)
    	    })
    	},
    	change(val) {
    		let self = this
    		self.sysList = []
    		console.log("go change method", val)
    		if(!val) {
    			console.log("为空")
    			return
    		}else{
    			let data = "&deptId=" + val
	    		self.$axios({
	    		    url: '/basic-platform/system/sel?pageSize=10000' + data,
	    		    method: 'get',
	    		    responseType: 'json'
	    		})
	    		.then(function(res) {
	    			console.log("success", res)
	    			let list = res.data.data
	    			if(list.length == 0){
	    				self.formUrl.sysName = '';
	    			}else{
	    				console.log(self.sysNameId)
	    				self.formUrl.sysName = '';
	    				list.forEach(function(item, index){
	    					if(self.sysNameId == item.id){
	    						console.log()
	    						self.formUrl.sysName = self.sysNameId
	    					}
							item.id = item.id.toString()
							self.$set(item,'addSysName',(item.comp_name + ' -- '  + item.dept_name + ' -- ' + item.systemName))
							self.$set(item,'oldId',item.id.toString())
		    				self.sysList.push(item)
		    			})
		    			
	    			}
						
	    			console.log('====',self.sysNameId)
	    			console.log('++',self.formUrl)
	    			// self.$set(self.formUrl,'sysName',tab[index].systemId.toString());
	    			// self.formUrl.sysName = self.sysNameId
	    		})
	    		.catch(function(res) {
	    			console.log("error", res)
	    		})

    		}
	    		
    		if(self.sysList.length === 0) {
    		    self.formUrl.sysName = ''
    		}
    	}
	},
}
</script>
<style scoped>
	.url_header{
		margin-bottom: 20px;
	}
	.select_box{
		width: 25%;
	}
	.ipt_wid{
		width: 34%;
	}
	.area_ipt{
		width: 68%;
	}
	.el_switch_url{
	    position: absolute;
    	right: 45px;
	}
</style>