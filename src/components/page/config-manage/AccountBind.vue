<template>
	<div>
		<div class="g-account-head">
			<el-input placeholder="请输入用户账户/名称/手机号/邮箱" v-model="accountInput" class="m-account-select" @keyup.enter.native="queryAccount()">
				<template slot="prepend">用户帐号</template>
			</el-input>
			<el-button type="primary" icon="search" @click="queryAccount()">查询</el-button>
		</div>
		<div class="g-account-main">
			<el-table
				:data="accountList.items"
				border
			    style="width: 100%">
				<el-table-column
			      	label="序号"
			      	width="120">
			      	<template slot-scope="scope">{{ scope.$index + 1 }}</template>
    			</el-table-column>
    			<el-table-column
			      	label="用户帐号"
			      	width="180">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.account}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="用户名"
			      	width="180">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.name}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="用户手机号"
			      	width="180">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.mobile}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="用户邮箱"
			      	width="200">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.email}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="操作">
				    <template slot-scope="scope">
			        	<el-button @click="bindData(scope.$index, accountList.items)" type="text" size="small">绑定</el-button>
			        	<el-button @click="deleteData(scope.$index, accountList.items)" type="text" size="small">解绑</el-button>
			      	</template>
    			</el-table-column>
			</el-table>
		</div>
		<div class="g-footer">
			<div style="margin-top: 20px" v-show="accountList.totalItems">
	            <el-pagination
	              @size-change="queryAccount"
	              @current-change="changeCur"
	              :page-size="pageSize"
	              layout="total, prev, pager, next"
	              :total="accountList.totalItems"
	              ref="paginations"
	            >
	            </el-pagination>
	        </div>
		</div>
		<el-dialog title="绑定设备" @close="registerCancel('formAccount')" :visible.sync="registerFormVisible">
			<el-form :model="formAccount" :rules="formAccountRules" ref="formAccount">
				<el-form-item label="设备标识：" :label-width="formLabelWidth" prop="account_code">
					<el-input v-model="formAccount.account_code" placeholder="请输入设备唯一标识" auto-complete="off" class="ipt_wid"></el-input>
				</el-form-item>
		  	</el-form>
		  	<div slot="footer" class="dialog-footer">
			  	<el-button @click="cancel('formAccount')">取 消</el-button>
			  	<el-button type="primary" @click="sureRegister('formAccount')">确 定</el-button>
		  	</div>
		</el-dialog>
		<el-dialog title="删除设备" @close="registerCancel('formFacility')" :visible.sync="registerFormFacility">
			<el-form :model="formFacility" ref="formFacility">
				<el-form-item label="设备标识：" :label-width="formLabelWidth">
					<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                  	<div style="margin: 15px 0;"></div>
                  	<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                    	<el-checkbox style="margin-left:0;margin-right:15px;margin-bottom:15px" v-for="city in cities" :label="city.id" :key="city.id" :value="city.id">{{city.deviceNumber}}
                  		</el-checkbox>
                	</el-checkbox-group>
				</el-form-item>
		  	</el-form>
		  	<div slot="footer" class="dialog-footer">
			  	<el-button @click="cancel('formFacility')">取 消</el-button>
			  	<el-button type="primary" @click="delectRegister('formFacility')">确 定</el-button>
		  	</div>
		</el-dialog>
	</div>
</template>
<script>
var cityOptiones = []
import md5 from 'js-md5'
export default {
	data(){
		return{
			dataJson:{},
			adminSessionId:'',
			accountInput: "",//输入的系统名称
			currentPage:1,
			pageSize:10,
			accountList:[],
			registerFormVisible: false,//绑定弹出框
			formLabelWidth: '120px',
			formAccount:{
	        	account_code:'',//名称
	        },
	        formAccountRules:{
	        	account_code: [{ required: true, message: '请输入设备唯一标识', trigger: 'blur' }],
	        },
	        accountObj:{},
	        facilityList:[],
	        registerFormFacility:false,//解绑弹出框
	        formFacility:{},
	        isIndeterminate: false,
	        checkAll: false,
	        checkedCities: [],
            cities: cityOptiones,
		}
	},
	mounted(){
		let self = this;
		self.dataJson = JSON.parse(localStorage.getItem('dataJson'));
		self.adminSessionId = localStorage.getItem('adminSessionId')
		console.log("dataJson",self.dataJson)
		self.queryAccount()
	},
	methods: {
		changeCur(val) {
        	let self = this
        	self.currentPage = val;
        	self.queryAccount()
      	},
		queryAccount(){
			let self = this;
			let datas = {
	          	pageSize: self.pageSize,
	          	pageNumber: self.currentPage,
	          	key: self.accountInput,
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
	        	console.log("用户列表：",res)
	        	if(res.data.status !== 1) return
        		if (!self.currentPage) {
              		self.$refs.paginations.internalCurrentPage = 1;
            	}
        		self.accountList = []
        		let list = res.data.data
        		self.accountList = res.data.data
        		// list.forEach(function(item, index) {
		        //     self.accountList.push(item)
	         //  	})
	          	console.log(self.accountList)
	        })
	        .catch(function(res) {
	          	console.log("error", res)
	        })
		},
		bindData(index, tab){//绑定
			let self = this;
			self.registerFormVisible = true;
			self.accountObj = tab[index];
			console.log(index)
			console.log(tab[index])
		},
		deleteData(index, tab){//解绑
			let self = this;
			self.accountObj = tab[index];
			let data = {
				sessionId: self.adminSessionId,
				userId: self.accountObj.userId
			}
			let url = '/account_auth_admin/user-api.findBindDeviceByUserId';
			self.bindRequest(url, data, 'query')
		},
    	sureRegister(formAcc){//绑定确定
    		let self = this;
    		self.$refs[formAcc].validate((valid) => {
    			if (valid) {
					let data = {
						sessionId: self.adminSessionId,
						userId: self.accountObj.userId,
						deviceNumber: self.formAccount.account_code
					}
					let url = '/account_auth_admin/user-api.bindDevice';
					self.bindRequest(url, data, 'bind')
				} else {
					console.log('error submit!!');
					return false;
				}
			});
    	},
    	cancel(formAcc){//取消模态框
    		let self = this;
    		self.checkedCities = [];
    		self.$refs[formAcc].resetFields();
    		self.registerFormVisible = false;
    		self.registerFormFacility = false;
    	},
    	handleCheckAllChange(event) {
            let self = this;
            if(event.target.checked) {
              for(let index in cityOptiones) {
                self.checkedCities.push(cityOptiones[index].id)
              }
            } else {
              self.checkedCities = []
            }
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        delectRegister(formAcc){//解除绑定确定
        	let self = this;
        	console.log(self.checkedCities)
        	let data = {
				sessionId: self.adminSessionId,
				ids: self.checkedCities
			}
			let url = '/account_auth_admin/user-api.unBindDevice';
			if(self.checkedCities.length == 0){
				self.$message({
					message: '请选择要解绑的设备',
					type: 'warning',
					duration:1500
				});
			}else{
				self.bindRequest(url, data, 'delete')
			}
        },
    	bindRequest(url, datas, arg){//绑定操作
    		let self = this;
    		self.$axios({
	          	url: url,
	          	method: 'post',
	          	responseType: 'json',
	          	data: datas
	        })
	        .then(function(res) {
	        	if(arg == 'bind'){
	        		console.log("绑定：",res)
	        	}else if(arg == 'query'){
	        		console.log("请求已绑定：",res)
	        	}else if(arg == "delete"){
	        		console.log("解除绑定",res)
	        	}
	        	if(res.data.status !== 1){
	        		self.$message({
						message: res.data.message,
						type: 'error',
						duration:1500
					});
					self.registerFormVisible = false;
					return
	        	}
        		if(arg == 'bind'){
        			self.$message({
						message: '设备绑定成功',
						type: 'success',
						duration:1500
					});
					self.registerFormVisible = false;
        		}else if(arg == 'query'){
        			let list = res.data.data;
        			if(list.length == 0){
        				self.$message({
							message: '设备暂无绑定数据',
							type: 'warning',
							duration:1500
						});
						return
        			}else{
        				self.cities = [];
        				cityOptiones = [];
	        			list.forEach(function(item, index){
	        				cityOptiones.push(item)
	        				self.cities.push(item)
	        			})
	        			self.handleCheckedCitiesChange(self.checkedCities)
	        			self.registerFormFacility = true;
        			}	
        		}else if(arg == 'delete'){
        			self.$message({
						message: '设备解绑成功',
						type: 'success',
						duration:1500
					});
					self.registerFormFacility = false;
					self.checkedCities = [];
        		}
	        })
	        .catch(function(res) {
	          	console.log("error", res)
	        })
    	},
    	registerCancel(formAcc){//关闭注册模态框
    		let self = this;
    		self.checkedCities = [];
    		self.$refs[formAcc].resetFields();
    		self.registerFormVisible = false;
    		self.registerFormFacility = false;
    	},
	},
}
</script>
<style scoped>
	.g-account-head{
		margin-bottom: 20px;
	}
	.m-account-select{
		width: 50%;
	}
	.g-footer{
		display: flex;
      	flex-flow: row nowrap;
      	justify-content: space-between;
	}
	.ipt_wid{
		width: 45%;
	}
</style>