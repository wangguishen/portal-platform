<template>
	<div class="accountMessage">
		<!-- <div class="navTag">
			<el-radio-group v-model="radio1">
		    	<el-radio-button label="账户信息" @click.native="handover('accountInfos', '账户信息')"></el-radio-button>
			    <el-radio-button label="修改密码" @click.native="handover('resetPwd', '修改密码')"></el-radio-button>
			</el-radio-group>
		</div> -->
		<div class="accountTitle">
			<span>账户信息</span>
		</div>
		<div class="messageBox">
			<el-form>
	            <el-row :gutter="20">
	              <el-col :span="12">
	                <div class="grid-content bg-purple">
	                  <el-form-item label="登录名：" :label-width="formLabelWidth">
	                      {{ storage.account }}
	                  </el-form-item>
	                  <el-form-item label="邮箱：" :label-width="formLabelWidth">
	                      {{ storage.email }}
	                  </el-form-item>
	                  <el-form-item label="手机号码：" :label-width="formLabelWidth">
	                      {{ storage.mobile }}
	                  </el-form-item>
	                <el-form-item label="登录身份：" :label-width="formLabelWidth">
	                      {{ storage.name }}
	                  </el-form-item>
	                </div>
	              </el-col>
	              <el-col :span="12">
	                <div class="grid-content bg-purple">
	                  <el-form-item label="账户名：" :label-width="formLabelWidth">
	                      {{ storage.adminName }}
	                  </el-form-item>
	                  <el-form-item label="昵称：" :label-width="formLabelWidth">
	                      {{ storage.nick }}
	                  </el-form-item>
	                  <el-form-item label="企业编码：" :label-width="formLabelWidth">
	                      {{ storage.enterpriseCode }}
	                  </el-form-item>
	                  <el-form-item label="性别：" :label-width="formLabelWidth">
	                      {{ storage.name_sex }}
	                  </el-form-item>
	                </div>
	              </el-col>
	          </el-row>
	        </el-form>
		</div>
	</div>
</template>
<script>
import resetPwd from './resetPwd'
	export default {
		components:{
			resetPwd
		},
		data(){
			return{
				radio1:'',
				message:'',
				formLabelWidth: '30%',
				storage:{},
			}
		},
		mounted(){
			let self = this;
			let storage = JSON.parse(localStorage.getItem('dataJson'));
			self.storage = storage;
			console.log('##########',storage)
			storage.sex?storage.name_sex = "男":storage.name_sex = "女";
			self.message = self.$route.path;
			if (self.message === '/accountInfos') {
				self.radio1 = '账户信息';
			}else if (self.message == '/resetPwd') {
				self.radio1 = '修改密码'
			}
		},
		methods:{
			handover(message,radio){
				let self = this;
				self.radio1 = radio;
				let jsonData = JSON.parse(localStorage.getItem('dataJson'));
				let compCode = jsonData.comp_code
      			self.$router.push(message + '?comp_code=' + compCode)
      			// if (self.message == resetPwd) {
      			// 	self.resetPassword = true;
      			// }else if (self.message == accountInfos) {
      			// 	self.infoMessage = true;
      			// }
			},
		}
	}
</script>
<style>
	.navTag {
		margin-left: 40px;
	}
	.accountMessage {
		position: relative;
	}
	.accountMessage .accountTitle span {
		display: inline-block;
		position: absolute;
		top: 20px;
		left: 80px;
		/*font-size: 18px;*/
		font-weight: bold;
		/* text-shadow: 0 2px 16px #000; */
		/* text-shadow: 1px 1px rgba(197, 223, 248,0.8),2px 2px rgba(197, 223, 248,0.8),3px 3px rgba(197, 223, 248,0.8),
					 4px 4px rgba(197, 223, 248,0.8),5px 5px rgba(197, 223, 248,0.8),6px 6px rgba(197, 223, 248,0.8); */
		font-size:20px;
        text-shadow:4px 4px 2px gray;
        -webkit-text-shadow: 4px 4px 2px gray;
        -moz-text-shadow: 4px 4px 2px gray;
	}
	.messageBox {
		margin: 40px 40px;
		height: 600px;
		background: #fff;
	}
	.grid-content {
		/* margin: 80px 100px; */
		width: 100%;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center 0;
		background-position: 50% 50%;
		-webkit-background-size: 100%;
		padding: 26% 10%;
	}
	
</style>