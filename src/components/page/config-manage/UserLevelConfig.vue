<template>
  <div>
  	<div class="sys_header">
  		<el-input placeholder="请输入用户名称" v-model="sysInput" class="select_box leftFloatBox" @keyup.enter.native="queryData(sysInput, 1)">
		    	<template slot="prepend">用户名称</template>
		  	</el-input>
		  	<el-button type="primary" icon="search" @click="queryData(sysInput, 1)">查询</el-button>
		  	<el-button type="info" @click="register()">添加用户</el-button>
  	</div>

  	<div class="sys_main">
  	  <el-table
  	    :data="tableData.data"
  	    border
  	    style="width: 100%">
  	    <el-table-column
  	      label="ID"
  	      width="200">
  	      <template slot-scope="scope">{{scope.row.id}}</template>
  	    </el-table-column>
  	    <el-table-column
  	      label="用户名称"
  	      width="300">
  	      <template slot-scope="scope" >
            <span>{{scope.row.userName}}</span>
          </template>
  	    </el-table-column>
  	    <el-table-column
  	      label="联系方式"
  	      width="200">
  	      <template slot-scope="scope" >
            <span>{{scope.row.contactWay}}</span>
          </template>
  	    </el-table-column>
  	    <el-table-column
  	      label="监控级别"
  	      width="200">
  	      <template slot-scope="scope" >
            <span>{{scope.row.level}}</span>
          </template>
  	    </el-table-column>
  	    <el-table-column
		      label="操作">
			    <template slot-scope="scope">
		        	<el-button @click="editData(scope.$index, tableData.data)" type="text" size="small">编辑</el-button>
		        	<el-button @click="deleteData(scope.row.id)" type="text" size="small">删除</el-button>
		      	</template>
  			</el-table-column>
  	  </el-table>
  	</div>

  	<!-- 添加用户级别 -->
  	<el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="registerCancel('ruleForm')">
  		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  		  <el-form-item label="用户名称:" prop="userName" class="ipt_wid">
            <el-input v-model="ruleForm.userName" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item label="监控级别" prop="level">
            <el-select v-model="ruleForm.level" placeholder="请选择监控级别" style="width: 77%" @change="changeL(ruleForm.level)">
              <el-option label="一级" value="一级"></el-option>
              <el-option label="二级" value="二级"></el-option>
              <el-option label="三级" value="三级"></el-option>
            </el-select>
          </el-form-item>
	      <el-form-item label="联系方式:" prop="contactWay" class="ipt_wid">
            <el-input v-model="ruleForm.contactWay" :placeholder="phText"></el-input>
          </el-form-item>
        <el-form-item>
		    <el-button type="primary" @click="submitForm('ruleForm')">
		        <i class="el-icon-circle-check"></i>&nbsp;确定
		    </el-button>
		    <el-button @click="resetForm('ruleForm')">
		        <i class="el-icon-circle-cross"></i>&nbsp;重置
		    </el-button>
	    </el-form-item>
  		</el-form>
  	</el-dialog>

  	<!-- 修改用户信息 -->
  	<el-dialog title="修改用户信息" :visible.sync="dialogEditVisible" @close="closeDialog(false)">
  		<el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
  		  <el-form-item label="用户名称:" prop="userName" class="ipt_wid">
            <el-input v-model="form.userName" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="监控级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择监控级别" style="width: 77%" @change="changeL(form.level)">
              <el-option label="一级" value="一级"></el-option>
              <el-option label="二级" value="二级"></el-option>
              <el-option label="三级" value="三级"></el-option>
          </el-select>
	      </el-form-item>
        <el-form-item label="联系方式:" prop="contactWay" class="ipt_wid">
            <el-input v-model="form.contactWay" placeholder="请输入号码、字号或邮件"></el-input>
        </el-form-item>
	      </el-form-item>
			    <el-button type="primary" @click="updataData('form')" style="margin-left: 25px">
			        <i class="el-icon-circle-check"></i>&nbsp;确定
			    </el-button>
			    <el-button @click="dialogEditVisible = false">取 消</el-button>
			  </el-form-item>
  		</el-form>
  	</el-dialog>

  	<div class="g-footer">
      <div style="margin-top: 20px" v-show="totalRows">
        <el-pagination
            @size-change="queryData"
            @current-change="changeCur"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="totalRows"
            ref="paginations">
        </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
	const reg = /^1[3|4|5|7|8][0-9]{9}$/ 
	const reg1 = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
	var validatePhone = (rule, value, callback) => {
	  if(value === '') {
	  	callback(new Error('请输入手机号'))
	  } else if(!reg.test(value)) {
	  	callback(new Error('请填写正确的手机号码格式'))
	  } else {
	  	callback()
	  }
	};
	var validateEmail = (rule, value, callback) => {
		if(value === '') {
			callback(new Error('请输入邮箱'))
		} else if(!reg1.test(value)) {
			callback(new Error('请填写正确的邮箱格式'))
		} else {
			callback()
		}
	};

	export default {
		data() {
			return {
				tableData: [],
				sysInput: '',
			  dialogFormVisible: false,
			  dialogEditVisible: false,
			  pageSize: 10,
			  totalRows: 0,
			  form: {},
			  piShow: false,
			  phText: '根据监控级别输入不同的联系方式',
			  phVal: '',
			  ruleForm: {
			  	userName: '',
			  	contactWay: '',
			  	level: '',
			  },
			  rules: {
			  	userName: [
			  	  { required: true, message: '请输入用户名称', trigger: 'blur' },
			  	],
			  	level: [
			  	  { required: true, message: '请选择监控级别', trigger: 'change' }
			  	],
			  	contactWay: [
			  	  { required: true, message: '请输入联系方式', trigger: 'blur' }
			  	],
			  	checkPhone: [
			  	  { validator: validatePhone, trigger: 'blur'}
			  	],
			  	checkEmail: [
			  	  { validator: validateEmail, trigger: 'blur'}
			  	]
			  }
			}
		},
		mounted() {
			let self = this
			self.$nextTick(function () {
        self.queryData()
	    })
		},
		methods: {
			queryData(userName, currentPage) {
				console.log(userName, currentPage)
				let self = this
				let pageSize = self.pageSize
  	    currentPage = currentPage ? currentPage : 1
  	    userName = userName ? userName : ""

  	    if (!currentPage) {
          this.$refs.paginations.internalCurrentPage = 1;
        }

				self.$axios({
					url: '/basic-platform/muser/sel' + "?pageSize=" + self.pageSize + "&currentPage=" + currentPage + "&userName=" + userName,
					method: 'get',
					responseType: 'json'
				})
				.then(function(res) {
					if(res.status == 200) {
						console.log("res", res)
						self.tableData = res.data
						self.totalRows = self.tableData.page.totalRows
					}
				})	
				.catch(function(res) {
					console.log("error", res)
				})
				currentPage++
			},
			editData(index, tab) {
				let self = this
				self.dialogEditVisible = true
				self.form = tab[index]
			},
			updataData(formName) {
				console.log(formName)
				let self = this
				if (self.form.isGroup === 'Y') {
					self.form.parentId = 0
				}
				self.$refs[formName].validate((valid) => {
					if(valid) {
						self.$axios({
							url: '/basic-platform/muser/up',
							method: 'put',
							responseType: 'json',
							data: self.form
						})
						.then(function(res) {
							if(res.status == 200) {
								self.$message("修改成功")
							} else {
								self.$message("修改失败")
							}
							self.dialogEditVisible = false
						})	
						.catch(function(res) {
							console.log("error", res)
						})
					}
				})
			},
			deleteData(id) {
				let self = this
				self.$confirm('确定要删除这个用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }, 300).then(() => {
          self.$axios({
          url: '/basic-platform/muser/del',
          method: 'DELETE',
          responseType: 'json',
          data: {
            id: id
          }
        })
      	.then(function(res) {
          self.queryData();
          self.$message({
            type: 'success',
            message: '删除成功!'
          }, 300);
      	})
      	.catch(function(res) {
      		console.log("error", res);
      	})
        }).catch(() => {
          self.$message({
          type: 'info',
          message: '已取消删除'
        });          
        });
			},
			changeCur(val) {
        let self = this
        self.queryData("", val)
      },
			register() {
				let self = this
				self.dialogFormVisible = true
			},
			closeDialog(msg) {
				let self = this
				self.dialogEditVisible = msg
				self.queryData()
			},
			change(isGroup) {
				let self = this
				self.piShow = isGroup === 'N' ? true : false
			},
			submitForm(formName) {
				let self = this
				self.$refs[formName].validate((valid) => {
					if(valid) {
						self.$axios({
							url: '/basic-platform/muser/add',
							method: 'post',
							responseType: 'json',
							data: self.ruleForm
						})
						.then(function(res) {
						  if(res.status == 200) {
						  	self.$message("添加成功")
						  	self.queryData()
						  } else {
						  	self.$message("添加失败")
						  }
					  	self.dialogFormVisible = false
						})
						.catch(function(res) {
							console.log("error", res)
						})
					}
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields()
			},
			registerCancel(formName) {
				let self = this
				self.ruleForm = {
			  	userName: '',
			  	contactWay: '',
			  	level: ''
			  }
			  this.$refs[formName].resetFields()
			  self.dialogFormVisible = false
			},
			changeL(level) {
				let self = this
				self.rules.contactWay = []
				let va1 = { required: true, message: '请输入号码、字号、邮箱', trigger: 'blur' }
			  let va2	= { validator: validatePhone, trigger: 'blur'}
			  let	va3 = { validator: validateEmail, trigger: 'blur'}
				if(level === '一级') {
					console.log("进入一级页面")
					self.phText = '请输入手机号码'
					self.rules.contactWay.push(va2)
				} else if(level === '二级') {
					self.phText = '请输入号码、字号或邮件'
					self.rules.contactWay.push(va1)
				} else if(level === '三级') {
					self.phText = '请输入邮箱'
					self.rules.contactWay.push(va3)
				}
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
		width: 80%;
	}

	.g-footer,.m-buttons {
    display: flex;
    flex-flow: row nowrap;
  }
  .g-footer{
    justify-content: space-between;
  }
</style>