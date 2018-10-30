<template>
  <div>
  	<div class="sys_header">
  		<el-input placeholder="请输入企业名称" v-model="sysInput" class="select_box leftFloatBox" @keyup.enter.native="queryData(sysInput, 1)">
		    	<template slot="prepend">企业名称</template>
		  	</el-input>
		  	<el-button type="primary" icon="search" @click="queryData(sysInput, 1)">查询</el-button>
		  	<el-button type="info" @click="register()">添加监控企业</el-button>
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
  	      label="企业名称"
  	      width="300">
  	      <template slot-scope="scope" >
            <span>{{scope.row.compName}}</span>
          </template>
  	    </el-table-column>
  	    <el-table-column
  	      label="是否集团"
  	      width="200">
  	      <template slot-scope="scope" >
            <span>{{scope.row.isGroup == 'Y' ? '是' : scope.row.isGroup == 'N' ? '否' : '--'}}</span>
          </template>
  	    </el-table-column>
  	    <el-table-column
  	      label="父集团id"
  	      width="200">
  	      <template slot-scope="scope" >
            <span>{{scope.row.parentId}}</span>
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

  	<!-- 添加监控企业 -->
  	<el-dialog title="添加监控企业" :visible.sync="dialogFormVisible" @close="registerCancel('ruleForm')">
  		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  		  <el-form-item label="企业名称:" prop="compName" class="ipt_wid">
            <el-input v-model="ruleForm.compName" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="是否集团企业" prop="isGroup">
          <el-select v-model="ruleForm.isGroup" placeholder="请选择是否集团企业" @change="change(ruleForm.isGroup)" style="width: 77%">
              <el-option label="是" value="Y"></el-option>
              <el-option label="否" value="N"></el-option>
          </el-select>
	      </el-form-item>
	      <el-form-item label="父集团ID:" prop="parentId" v-show="piShow" class="ipt_wid">
            <el-input v-model="ruleForm.parentId" placeholder="请输入父集团ID"></el-input>
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

  	<!-- 修改监控企业 -->
  	<el-dialog title="修改监控企业" :visible.sync="dialogEditVisible" @close="closeDialog(false)">
  		<el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  		  <el-form-item label="企业名称:" prop="compName" class="ipt_wid">
            <el-input v-model="form.compName" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="是否集团企业" prop="isGroup">
          <el-select v-model="form.isGroup" placeholder="请选择是否集团企业" @change="change(form.isGroup)" style="width: 77%">
              <el-option label="是" value="Y"></el-option>
              <el-option label="否" value="N"></el-option>
          </el-select>
	      </el-form-item>
	      <el-form-item label="父集团ID:" prop="parentId" v-show="form.isGroup === 'N' ? true : false" class="ipt_wid">
            <el-input v-model="form.parentId" placeholder="请输入父集团ID"></el-input>
        </el-form-item>
        <el-form-item>
			    <el-button type="primary" @click="updataData('form')">
			        <i class="el-icon-circle-check"></i>&nbsp;确定
			    </el-button>
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
	export default {
		data() {
			return {
				routeId: 0,
				tableData: [],
				sysInput: '',
			  dialogFormVisible: false,
			  dialogEditVisible: false,
			  pageSize: 10,
			  totalRows: 0,
			  form: {},
			  piShow: false,
			  ruleForm: {
			  	compName: '',
			  	isGroup: '',
			  	parentId: '',
			  },
			  rules: {
			  	compName: [
			  	  { required: true, message: '请输入企业名称', trigger: 'blur' },
			  	],
			  	isGroup: [
			  	  { required: true, message: '请选择是否集团企业', trigger: 'change' }
			  	],
			  	/*parentId: [
			  	  { required: true, message: '请输入父集团ID', trigger: 'blur' }
			  	],*/
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
			queryData(compName, currentPage) {
				let self = this
				let pageSize = self.pageSize
  	    currentPage = currentPage ? currentPage : 1
  	    compName = compName ? compName : ""
  	    if (!currentPage) {
          this.$refs.paginations.internalCurrentPage = 1;
        }

				self.$axios({
					url: '/basic-platform/enterprise/sel' + "?pageSize=" +
					 self.pageSize + "&currentPage=" + currentPage + "&compName=" + compName,
					method: 'get',
					responseType: 'json'
				})
				.then(function(res) {
					if(res.status == 200) {
						console.log(res)
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
				let self = this
				if (self.form.isGroup === 'Y') {
					self.form.parentId = 0
				}
				self.$axios({
					url: '/basic-platform/enterprise/up',
					method: 'put',
					responseType: 'json',
					data: self.form
				})
				.then(function(res) {
					if(res.status == 200) {
						self.$message("修改成功")
						self.routeId++
						self.$router.push('monEnConfig?routeId='+self.routeId)
					} else {
						self.$message("修改失败")
					}
					self.dialogEditVisible = false
				})	
				.catch(function(res) {
					console.log("error", res)
				})
			},
			deleteData(id) {
				let self = this
				self.$confirm('确定要删除这个监控企业吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }, 300).then(() => {
          self.$axios({
          url: '/basic-platform/enterprise/del',
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
          self.routeId++
          self.$router.push('monEnConfig?routeId='+self.routeId)
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
						if (self.ruleForm.isGroup === 'Y') {
							self.ruleForm.parentId = 0
						}
						self.$axios({
							url: '/basic-platform/enterprise/add',
							method: 'post',
							responseType: 'json',
							data: self.ruleForm
						})
						.then(function(res) {
						  if(res.status == 200) {
						  	self.$message("添加成功")
						  	self.queryData()
						  	self.routeId++
						  	self.$router.push('monEnConfig?routeId='+self.routeId)
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
			  	compName: '',
			  	isGroup: '',
			  	parentId: ''
			  }
			  this.$refs[formName].resetFields()
			  self.dialogFormVisible = false
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