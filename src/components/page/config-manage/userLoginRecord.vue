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
		</div>
		<div class="g-account-main">
			<el-table
				:data="userAccountList.items"
				border
			    style="width: 100%">
				<el-table-column
			      	label="序号"
			      	width="80">
			      	<template slot-scope="scope">{{ scope.$index + 1 }}</template>
    			</el-table-column>
    			<el-table-column
			      	label="用户帐号"
			      	width="150">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.account}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="用户手机号"
			      	width="130">
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
			      	label="手机型号"
			      	width="160">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.mobile_model}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="象谱版本"
			      	width="130">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.xiangpu_no}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="操作系统版本"
			      	width="130">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.operatingsystem_no}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="设备ID">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.device_number}}</span>
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
	</div>
</template>
<script>
export default {
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
			// 绑定信息列表
			userAccountList:{},
			userCurrentPage:1,
			userPageSize:10,
		}
	},
	mounted(){
		let self = this;
		self.dataJson = JSON.parse(localStorage.getItem('dataJson'));
		self.adminSessionId = localStorage.getItem('adminSessionId')
		console.log("dataJson",self.dataJson)
		self.queryUserBind()
	},
	methods: {
		selectServerClick(index){//搜索关键字搜索
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
	          	url: '/account_auth_admin/user-api.findDeviceLoginInfo',
	          	method: 'post',
	          	responseType: 'json',
	          	data: datas
	        })
	        .then(function(res) {
	        	console.log("登录数据列表：",res)
	        	if(res.data.status !== 1) return
        		let list = res.data.data
        		console.log("list",list)
        		// list.items.forEach(function(item,index){
        		// 	let device = [];
        		// 	let devices = [];
        		// 	if(item.device_number.indexOf(',') > 0){
        		// 		device = item.device_number.split(',')
        		// 		device.forEach(function(item,index){
        		// 			let obj = {}
        		// 			obj.deviceNumber = item;
        		// 			devices.push(obj)
        		// 		})
        		// 	}else{
        		// 		let obj = {}
        		// 		obj.deviceNumber = item.device_number;
        		// 		devices.push(obj)
        		// 	} 
        		// 	self.$set(item, "device", devices)
        		// })
        		self.userAccountList = list
	        })
	        .catch(function(res) {
	          	console.log("error", res)
	        })
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
</style>