<template>
	<div>
		<div class="g-account-head">
			<el-input :placeholder="selectPlaceholder" v-model="accountInput" class="m-account-select" @keyup.enter.native="queryUserBind()">
				<el-select v-model="selectServer" slot="prepend" placeholder="请选择搜索关键字" @change="selectServerClick(selectServer)">
			      	<el-option
				      	v-for="item in portList"
				      	:key="item.value"
				      	:label="item.label"
				      	:value="item.value">
			    	</el-option>
			    </el-select>
			</el-input>
			<el-button type="primary" icon="search" @click="queryUserBind()">查询</el-button>
			<el-button type="primary" icon="plus" @click="facility()">设备绑定</el-button>
		</div>
		<div class="g-account-main">
			<el-table
				:data="userAccountList.items"
				border
			    style="width: 100%">
				<el-table-column
			      	label="序号"
			      	width="120">
			      	<template slot-scope="scope">{{ scope.$index + 1 }}</template>
    			</el-table-column>
    			<el-table-column
			      	label="用户帐号"
			      	width="160">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.account}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="用户手机号"
			      	width="160">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.mobile}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="用户邮箱"
			      	width="230">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.email}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="绑定设备"
			      	width="280">
			      	<template slot-scope="scope">
			      		<template v-if="scope.row.device.length > 1">
			      			<span>{{scope.row.device[0].deviceNumber}}</span>
				      		<el-button class="s-device-more" @click="exhibitionDevice(scope.$index, userAccountList.items)" type="text" icon="more"></el-button>
			      		</template>
			      		<template v-else>
			      			<span>{{scope.row.device[0].deviceNumber}}</span>
			      		</template>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="操作">
				    <template slot-scope="scope">
			        	<!-- <el-button @click="bindData(scope.$index, userAccountList.items)" type="text" size="small">绑定</el-button> -->
			        	<el-button @click="deleteData(scope.$index, userAccountList.items)" type="text" size="small">解绑</el-button>
			      	</template>
    			</el-table-column>
			</el-table>
		</div>
		<div class="g-footer">
			<div style="margin-top: 20px" v-show="userAccountList.totalItems">
	            <el-pagination
	              @size-change="queryUserBind"
	              @current-change="changeCur"
	              :page-size="userPageSize"
	              layout="total, prev, pager, next"
	              :total="userAccountList.totalItems"
	              ref="paginations"
	            >
	            </el-pagination>
	        </div>
		</div>
		<el-dialog title="账号与设备绑定" @close="registerCancel('formAccount')" :visible.sync="facilityBindShow">
			<el-form :model="formAccount" ref="formAccount">
				<el-form-item label="用户账号：" :label-width="formLabelWidth">
					<my-select-infinite :formAccount="formAccount" v-on:queryUser="queryUser" :selectObj="selectObj" :selectStyle="selectStyle"></my-select-infinite>
                </el-form-item>
                <template v-for="(account,index) in formAccount.account_codes">
                	<template v-if="index === 0">
                		<el-form-item :label="account.account_label+'：'" :label-width="formLabelWidth">
							<el-input v-model="account.account_code" :placeholder="account.account_placeholder" auto-complete="off" class="ipt_wid"></el-input>
							<template v-if="account.account_btn">
								<el-button icon="plus" @click="addIdentification(account,index)"></el-button>
								<i class="el-icon-circle-cross l-icon-cross" @click="emptyIdentification(account,index)" v-show="account.account_icon"></i>
							</template>
							<template v-else>
								<el-button icon="minus" @click="delectIdentification(account,index)"></el-button>
								<i class="el-icon-circle-cross l-icon-cross" @click="emptyIdentification(account,index)" v-show="account.account_icon"></i>
							</template>
						</el-form-item>
                	</template>
	                <template v-else>
	                	<el-form-item :label="account.account_label+(index+1)+'：'" :label-width="formLabelWidth">
							<el-input v-model="account.account_code" :placeholder="account.account_placeholder" auto-complete="off" class="ipt_wid"></el-input>
							<template v-if="account.account_btn">
								<el-button icon="plus" @click="addIdentification(account,index)"></el-button>
								<!-- <el-button icon="circle-cross"></el-button> -->
								<i class="el-icon-circle-cross l-icon-cross" @click="emptyIdentification(account,index)" v-show="account.account_icon"></i>
							</template>
							<template v-else>
								<el-button icon="minus" @click="delectIdentification(account,index)"></el-button>
								<i class="el-icon-circle-cross l-icon-cross" @click="emptyIdentification(account,index)" v-show="account.account_icon"></i>
							</template>
						</el-form-item>
	                </template>
                </template>
				<!-- <el-form-item label="设备标识：" :label-width="formLabelWidth" prop="account_code">
					<el-input v-model="formAccount.account_code" placeholder="请输入设备唯一标识" auto-complete="off" class="ipt_wid"></el-input>
					<el-button icon="plus"></el-button>
				</el-form-item> -->
		  	</el-form>
		  	<div slot="footer" class="dialog-footer">
			  	<el-button @click="cancel('formAccount')">取 消</el-button>
			  	<el-button type="primary" @click="sureRegister('formAccount')">确 定</el-button>
		  	</div>
		</el-dialog>
		<el-dialog title="已绑定设备" @close="registerCancel('formAccount')" :visible.sync="facilityExhibitionShow">
			<div class="s-facility-box">
				<div v-for="(facility,index) in facilityList">
					<div class="s-facility-line">
						设备标识{{index+1}}：<span>{{facility.deviceNumber}}</span>
					</div>
				</div>
			</div>
		</el-dialog>
		<el-dialog title="删除账号与设备绑定" @close="registerCancel('formFacility')" :visible.sync="registerFormFacility">
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
import mySelectInfinite from '../../common/my-select-infinite.vue';
export default {
	components:{
        mySelectInfinite
    },
	data(){
		return{
			dataJson:{},
			adminSessionId:'',
			// 输入框
			selectServer:'',//选择的服务名称
			selectPlaceholder:'请输入用户账户/手机号/邮箱',
			portList:[
				{
					label: '手机号',
					value: 'mobile',
					placeholder:'请输入用户手机号'
				},{
					label: '邮箱',
					value: 'email',
					placeholder:'请输入用户邮箱'
				},{
					label: '帐号',
					value: 'account',
					placeholder:'请输入用户帐号'
				},
			],//所有服务列表
			accountInput: "",//输入的系统名称
			// 选择
			selectObj:{
				selectList:[],
				queryPar:{
					currentPage:1,
					pageSize:10,
					totalPage:0,
					totalNum:0,
				},
				optionBoxShow: false,
			},
			selectStyle:{
				maxiInput:'45%',
				loading:false,
			},
			// 绑定信息列表
			userAccountList:{},
			userCurrentPage:1,
			userPageSize:10,
			// 设备绑定
			facilityBindShow: false,
			formLabelWidth: '120px',
			formAccount:{
	        	account_name:'',//用户账号
	        	account_codes:[
	        		{
	        			account_label:'设备标识',
	        			account_code:'',
	        			account_placeholder:'请输入设备唯一标识',
	        			account_btn:true,
	        		}
	        	],
	        	account_select:{}
	        },
	        // 设备展示
	        facilityExhibitionShow: false,
	        facilityList:[],
	        // 删除设备
	        facilityObj: {},
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
		self.queryUser('',0)
		self.queryUserBind()
	},
	methods: {
		selectServerClick(index){//当前用户选择
    		let self = this;
    		self.selectServer = index;
    		self.portList.forEach(function(val,key){
    			if(index == val.value){
    				self.selectPlaceholder = val.placeholder
    			}
    		})
    	},
    	changeCur(val) {
        	let self = this
        	self.userCurrentPage = val;
        	self.queryUserBind()
      	},
		queryUserBind(){//搜索已绑定设备
			let self = this;
			let datas = {
	          	sessionId: self.adminSessionId,
	          	bean:{
	          		pageSize:self.userPageSize,
	               	pageNumber:self.userCurrentPage,
	               	sort:""
	          	}
	        }
	        if(self.selectServer != ''){
	        	datas.bean[self.selectServer] = self.accountInput
	        }
			console.log(datas)
			self.$axios({
	          	url: '/account_auth_admin/user-api.findUserDevice',
	          	method: 'post',
	          	responseType: 'json',
	          	data: datas
	        })
	        .then(function(res) {
	        	console.log("绑定列表：",res)
	        	if(res.data.status !== 1) return
        		let list = res.data.data
        		console.log("list",list)
        		list.items.forEach(function(item,index){
        			let device = [];
        			let devices = [];
        			if(item.device_number.indexOf(',') > 0){
        				device = item.device_number.split(',')
        				device.forEach(function(item,index){
        					let obj = {}
        					obj.deviceNumber = item;
        					devices.push(obj)
        				})
        			}else{
        				let obj = {}
        				obj.deviceNumber = item.device_number;
        				devices.push(obj)
        			} 
        			self.$set(item, "device", devices)
        		})
        		self.userAccountList = list
	        })
	        .catch(function(res) {
	          	console.log("error", res)
	        })
		},
		queryUser(key,num){//搜索用户
			let self = this;
			let datas = {
	          	pageSize: self.selectObj.queryPar.pageSize,
	          	pageNumber: self.selectObj.queryPar.currentPage,
	          	key: key,
	          	sessionId: self.adminSessionId,
	          	sort: ''
	        }
			console.log(datas)
			self.$axios({
	          	url: '/account_auth_admin/user-api.findUser',
	          	method: 'post',
	          	responseType: 'json',
	          	data: datas
	        })
	        .then(function(res) {
	        	console.log("用户列表：",res)
	        	if(res.data.status !== 1) return
        		let list = res.data.data
        		// if(num == 0){
        		// 	// self.selectObj.selectList = []
        		// 	self.selectStyle.loading = true;
        		// }else{
        		// 	self.selectStyle.loading = false;
        		// }
        		if(list.items.length < 10){
        			self.selectStyle.loading = true;
        		}else{
        			self.selectStyle.loading = false;
        		}
        		list.items.forEach(function(item,index){
        			self.selectObj.selectList.push(item)
        		})
	        })
	        .catch(function(res) {
	          	console.log("error", res)
	        })
		},
		facility(){//设备绑定
			let self = this;
			self.facilityBindShow = true;
		},
		addIdentification(item,index){//设备添加
			let self = this;
			let num = self.formAccount.account_codes.length
			console.log(self.formAccount)
			if(self.formAccount.account_name == ''){
				self.$message({
					message: '请选择用户',
					type: 'warning',
					duration:1500
				});
			}else if(self.formAccount.account_codes[num-1].account_code == ''){
				self.$message({
					message: '请先填写设备唯一标识',
					type: 'warning',
					duration:1500
				});
			}else{
				let obj = {
	    			account_label:'设备标识',
	    			account_code:'',
	    			account_placeholder:'请输入设备'+(num+1)+'唯一标识',
	    			account_btn:true,
	    			account_icon: false,
	    		}
	    		self.formAccount.account_codes.forEach(function(val,key){
	    			val.account_btn = false;
	    		})
	    		self.$nextTick(()=>{
	    			self.formAccount.account_codes.push(obj)
	    		})
			}
		},
		exhibitionDevice(index, tab){//展示设备
			let self = this;
			self.facilityList = tab[index].device;
			self.facilityExhibitionShow = true;
		},
		delectIdentification(item,index){//设备删除
			let self = this;
			self.formAccount.account_codes.splice(index,1)
		},
		emptyIdentification(item,index){//清空输入设备
			let self = this;
			if(index < self.formAccount.account_codes.length-1){
				self.formAccount.account_codes.splice(index,1)
			}else{
				item.account_icon = false;
				item.account_code = ""
			}
		},
		sureRegister(formAcc){//绑定确定
    		let self = this;
    		if(self.formAccount.account_name == ''){
				self.$message({
					message: '请选择用户',
					type: 'warning',
					duration:1500
				});
			}else if(self.formAccount.account_codes[0].account_code == ''){
				self.$message({
					message: '请先填写设备唯一标识',
					type: 'warning',
					duration:1500
				});
			}else{
				let account = [];
				let hash = {};
				let num = [];
				let numShow = false;
				self.formAccount.account_codes.forEach(function(item,index){
					account.push(item)
				})
				let arr = account.reduce(function(item, next, index){
					if(hash[next.account_code]){
						self.$message({
							message: '设备唯一标识输入重复，请查证后提交',
							type: 'warning',
							duration:1500
						});
						num.push(index)
						numShow = true;
					}else{
						hash[next.account_code] = true
						item.push(next)
					}
    				return item
				},[]);
				self.formAccount.account_codes.forEach(function(item,index){
					item.account_icon = false;
				})
				for(let x=0;x<self.formAccount.account_codes.length;x++){
					for(let y=0;y<num.length;y++){
						if(x == num[y]){
							self.formAccount.account_codes[x].account_icon = true
						}
					}
				}
				self.$nextTick(()=>{
					if(!numShow){
						let url = "/account_auth_admin/user-api.bindDevice";
						let data = {
							sessionId: self.adminSessionId,
							list:[]
						}
						self.formAccount.account_codes.forEach(function(item,index){
							let obj = {
								userId: self.formAccount.account_select.userId,
								deviceNumber: item.account_code
							}
							data.list.push(obj)
						})
						self.bindRequest(url, data, 'bind')
						console.log("可以发送请求了。。。")
					}
					
				})
				console.log(self.formAccount.account_codes)
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
					self.facilityBindShow = false;
					self.formAccount = {
			        	account_name:'',//用户账号
			        	account_codes:[
			        		{
			        			account_label:'设备标识',
			        			account_code:'',
			        			account_placeholder:'请输入设备唯一标识',
			        			account_btn:true,
			        		}
			        	],
			        	account_select:{}
			        }
			        self.queryUserBind()
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
					self.queryUserBind()
        		}
	        })
	        .catch(function(res) {
	          	console.log("error", res)
	        })
    	},
    	deleteData(index, tab){//解绑
			let self = this;
			self.facilityObj = tab[index];
			console.log(self.facilityObj)
			let data = {
				sessionId: self.adminSessionId,
				userId: self.facilityObj.user_id
			}
			let url = '/account_auth_admin/user-api.findBindDeviceByUserId';
			self.bindRequest(url, data, 'query')
			self.registerFormFacility = true;
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
		cancel(formAcc){//取消模态框
    		let self = this;
    		// self.$refs[formAcc].resetFields();
    		self.facilityBindShow = false;
    		self.checkedCities = [];
    		self.isIndeterminate = false;
    		self.selectObj.optionBoxShow = false;
    		self.facilityExhibitionShow = false;
    		self.registerFormFacility = false;
    	},
		registerCancel(formAcc){//关闭注册模态框
    		let self = this;
    		self.formAccount = {
	        	account_name:'',//用户账号
	        	account_codes:[
	        		{
	        			account_label:'设备标识',
	        			account_code:'',
	        			account_placeholder:'请输入设备唯一标识',
	        			account_btn:true,
	        		}
	        	],
	        	account_select:{}
	        }
    		// self.$refs[formAcc].resetFields();
    		self.checkedCities = [];
    		self.facilityBindShow = false;
    		self.isIndeterminate = false;
    		self.facilityExhibitionShow = false;
    		self.selectObj.optionBoxShow = false;
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
		width: 40%;
	}
	.l-select-box{
		width:45%;
	}
	.g-footer{
		display: flex;
      	flex-flow: row nowrap;
      	justify-content: space-between;
	}
	.ipt_wid{
		width: 45%;
	}
	.s-device-more{
		margin-left: 10px;
	}
	.s-facility-box{
		min-height: 200px;
	}
	.s-facility-line{
		margin-left: 10%;
		font-size: 18px;
		margin-bottom: 10px;
	}
	.s-facility-line span{
		font-weight: bold;
		margin-left: 5px;
	}
	.l-icon-cross{
		margin-left: 10px;
		color:#ff4949;
	}
</style>