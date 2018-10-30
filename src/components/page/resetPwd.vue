<template>
	<div class="registForm">
		<div class="resetTitle">
			<span>修改密码</span>
		</div>
		<div class="registBox">
			<el-form :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="原密码" prop="oldPass">
				    <el-input type="password" @keyup.enter.native="submitForm('ruleForm')" v-model="ruleForm.oldPass" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="pass">
				    <el-input type="password" @keyup.enter.native="submitForm('ruleForm')" v-model="ruleForm.pass" auto-complete="off"></el-input>
				</el-form-item>
			  	<el-form-item label="确认密码" prop="checkPass">
			    	<el-input type="password" @keyup.enter.native="submitForm('ruleForm')" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
			  	</el-form-item>
			  	<el-form-item>
			    	<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
			    	<el-button @click="resetForm('ruleForm')">重置</el-button>
			  	</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data(){
			var validateoldPass = (rule, value, callback) => {
	        	if (value === '') {
		          	callback(new Error('请输入原密码'));
		        } else {
		          	if (this.ruleForm.oldPass !== '') {
		            	this.$refs.ruleForm.validateField('oldPass');
		          	}
		          	callback();
		        }
		    };
			var validatePass = (rule, value, callback) => {
	        	if (value === '') {
		          	callback(new Error('请输入新密码'));
		        } else {
		          	if (this.ruleForm.checkPass !== '') {
		            	this.$refs.ruleForm.validateField('checkPass');
		          	}
		          	callback();
		        }
		    };
	      	var validatePass2 = (rule, value, callback) => {
	        	if (value === '') {
	          		callback(new Error('请再次输入密码'));
	        	} else if (value !== this.ruleForm.pass) {
	          		callback(new Error('两次输入密码不一致!'));
	        	} else {
	          		callback();
	        	}
	        };	
			return {
				ruleForm: {
					oldPass:'',
		          	pass: '',
		          	checkPass: '',
		        },
		        userId:'',
		        compCode:'',
		        account:'',
		        name:'',
		        rules2: {
		        	oldPass: [
		            	{ validator: validateoldPass, trigger: 'blur' }
		          	],
		          	pass: [
		            	{ validator: validatePass, trigger: 'blur' }
		          	],
		          	checkPass: [
		            	{ validator: validatePass2, trigger: 'blur' }
		          	]
		        },
		        storage:{}
			}
		},
		mounted(){
			let self = this;
			let storage = JSON.parse(localStorage.getItem('dataJson'))
			self.storage = storage;
			self.compCode = storage.comp_code;
			self.userId = storage.id;
			self.account = storage.account;
			self.name = storage.name;
			console.log(storage)
		},
		methods:{
			submitForm(formName){
				let self = this;
				self.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	let datas={
		            		'comp_code': self.storage.comp_code,
		            		'id' : self.storage.id,
		            		'account' : self.storage.account,
		            		'name' : self.storage.name,
		            		'old_password' : md5(self.ruleForm.oldPass),
		            		'password' : md5(self.ruleForm.checkPass)
		            	}
		            	console.log('datas',datas);
		            	self.$axios({
		            		url:'/UAMS/adminReq/updateAdminManager',
		            		method:'post',
		            		responseType:'json',
		            		data:datas
		            	})
		            	.then(function(res){
		            		console.log(res)
		            		if (res.data.success == true) {
		            			self.$message({
                                    message: '修改密码成功！',
                                    type: 'success',
                                    duration:1500
                                });
                                self.$router.push('/readme');
		            		}else{
		            			self.$message({
                                    message: '修改密码失败!',
                                    type: 'error',
                                    duration:1500
                                });
		            		}
		            	})
		            	.catch(function(res){
		            		console.log('error',res);
		            		self.$message({
                                message: '服务器信息错误！',
                                type: 'error',
                                duration:1500
                            });
		            	})
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
		        })
			},
			resetForm(formName){
				let self = this;
				self.$refs[formName].resetFields();
			},
			// getRandomString(len) {
		 //        len = len || 32;
		 //        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
		 //        let maxPos = chars.length;
		 //        let pwd = '';
		 //        for (let i = 0; i < len; i++) {
		 //            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
		 //        }
		 //        return pwd;
		 //    },
		}
	}
</script>

<style>
	.registForm {
		/* width: 110=40px; */
		height: 600px;
		background: #fff;
		margin: 40px 40px;
		position: relative;
	}
	.registForm .resetTitle span {
		display: inline-block;
		position: absolute;
		top: 20px;
		left: 40px;
		/*font-size: 18px;*/
		font-weight: bold;
		/* text-shadow: 0 2px 16px #000; */
		font-size:20px;
        text-shadow:4px 4px 2px gray;
        -webkit-text-shadow: 4px 4px 2px gray;
        -moz-text-shadow: 4px 4px 2px gray;
	}
	.registForm .registBox {
		/* position: absolute;
		top: 130px;
		left: 24%; */
		/* div宽高按比例放大缩小 */
		float: left;
		/* width: 40%; */
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center 0;
		background-position: 50% 50%;
		-webkit-background-size: 100%;
		padding: 16% 28%;
	}
	.registForm .el-input {
		width: 120%;
	}
</style>
