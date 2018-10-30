<template>
	<div>
		<div class="sys_header">
			<el-input placeholder="请输入实验室名称" v-model="sysInput" class="select_box leftFloatBox" @keyup.enter.native="queryData(sysInput, 1)">
				<template slot="prepend">实验室名称</template>
			</el-input>
			<el-button type="primary" icon="search" @click="queryData(sysInput, 1)">查询</el-button>
		  <el-button type="info" @click="register()">添加实验室</el-button>
		</div>
		<div class="sys_main">
			<el-table
			  :data="tableData"
			  border
			  style="width: 100%">
			  <el-table-column
			    label="ID"
			    width="200">
			    <template slot-scope="scope">{{scope.row.id}}</template>
			  </el-table-column>
			  <el-table-column
			    label="企业名称"
			    width="200">
			    <template slot-scope="scope">{{scope.row.comp_name}}</template>
			  </el-table-column>
			  <el-table-column
			    label="实验室名称"
			    width="200">
			    <template slot-scope="scope">{{scope.row.deptName}}</template>
			  </el-table-column>
			  <el-table-column label="操作">
			    <template slot-scope="scope">
	        	<el-button @click="editData(scope.$index, tableData)" type="text" size="small">编辑</el-button>
	        	<el-button @click="deleteData(scope.row.id)" type="text" size="small">删除</el-button>
	      	</template>
			  </el-table-column>
			</el-table>
		</div>

		<!-- 添加实验室 -->
		<el-dialog title="添加实验室" :visible.sync="dialogAddVisible" @close="registerCancel('addForm')">
		  <el-form :model="addForm" ref="addForm" :rules="rules" label-width="100px" class="demo-ruleForm">
		    <el-form-item label="实验室名称:" prop="deptName" class="ipt_wid">
		      <el-input v-model="addForm.deptName" placeholder="请输入实验室名称"></el-input>
		    </el-form-item>
		    <el-form-item label="企业名称: " prop="enterpriseId" class="ipt_wid">
		      <el-select v-model="addForm.enterpriseId" placeholder="请选择企业名称" style="width: 100%">
		        <el-option v-for="type in firmList" :label="type.compName" :value="type.id" :key="type.id">
		        </el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item>
		      <el-button type="primary" @click="submitForm('addForm')">
	          <i class="el-icon-circle-check"></i>&nbsp;确定
			    </el-button>
			    <el-button @click="registerCancel('addForm')">
			      <i class="el-icon-circle-cross"></i>&nbsp;取消
			    </el-button>
		    </el-form-item>
		  </el-form>
		</el-dialog>

		<!-- 修改实验室 -->
		<el-dialog title="修改实验室" :visible.sync="dialogEditVisible" @close="closeDialog(false)">
		  <el-form :model="editForm" ref="editForm" :rules="rules" label-width="100px" class="demo-ruleForm">
		    <el-form-item label="实验室名称:" prop="deptName" class="ipt_wid">
		      <el-input v-model="editForm.deptName" placeholder="请输入实验室名称"></el-input>
		    </el-form-item>
		    <el-form-item label="企业名称: " prop="comp_name" class="ipt_wid">
		      <el-select v-model="editForm.comp_name" placeholder="请选择企业名称" style="width: 100%">
		        <el-option v-for="type in firmList" :label="type.compName" :value="type.id" :key="type.id">
		        </el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item>
		      <el-button type="primary" @click="updateData('editForm')">
	          <i class="el-icon-circle-check"></i>&nbsp;确定
			    </el-button>
			    <el-button @click="closeDialog(false)">
			      <i class="el-icon-circle-cross"></i>&nbsp;取消
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
				sysInput: '',
				tableData: [],
				dialogAddVisible: false,
				dialogEditVisible: false,
				formLabelWidth: '120px',
				pageSize: 10,
				currentPage: 1,
				totalRows: 0,
				firmList: [], //企业集合
				rules: {
					deptName: [
					  { required: true, message: '请输入实验室名称', trigger: 'blur' },
					],
					enterpriseId: [
					  { required: true, message: '请选择企业名称', trigger: 'change' }
					],
					comp_name: [
					  { required: true, message: '请选择企业名称', trigger: 'change' }
					]
				},
				addForm: {
				  deptName: '',
				  enterpriseId : '',
				  comp_name: '',
				},
				editForm: {},
			}
		},
		mounted() {
			let self = this
			self.queryData()
			self.querySel()
		},
		methods: {
		  register() {
		  	let self = this
		  	self.dialogAddVisible = true
		  },
		  queryData(deptName, currentPage) { //查询实验室
		  	let self = this
		  	deptName = deptName ? deptName : ''
		  	currentPage = currentPage ? currentPage : 1
		  	self.currentPage = currentPage
		  	let data = '&pageSize=' + self.pageSize + '&currentPage=' + self.currentPage + "&deptName=" + deptName
		  	self.$axios({
		  		url: '/basic-platform/dept/sel?' + data,
		  		method: 'get',
		  		responseType: 'json',
		  	})
		  	.then(function(res) {
		  		console.log("success", res)
		  		if(res.status == 200) {
		  			self.tableData = res.data.data
		  			self.totalRows = res.data.page.totalRows
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
				self.editForm = tab[index]
		  },
		  updateData(formName) {  //修改
		  	let self = this
		  	self.$axios({
		  		url: '/basic-platform/dept/up',
		  		method: 'put',
		  		responseType: 'json',
		  		data: {
		  			id: self.editForm.id,
		  			deptName: self.editForm.deptName,
		  			enterpriseId: self.editForm.comp_name
		  		}
		  	})
		  	.then(function(res) {
		  		if(res.status == 200) {
		  			self.$message("修改成功")
		  		} else {
		  			self.$message("修改失败")
		  		}
		  		self.dialogEditVisible = false
		  		self.queryData("", self.currentPage)
		  	})
		  	.catch(function(res) {
		  		console.log("error", res)
		  	})
		  },
		  deleteData(id) { //删除
		  	let self = this
		  	self.$confirm('确定要删除这个监控企业吗?', '提示', {
		  		confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
		  	}, 300).then(() => {
			  	self.$axios({
			  		url: '/basic-platform/dept/del',
			  		method: 'delete',
			  		responseType: 'json',
			  		data: {
			  			id: id
			  		}
			  	})
			  	.then(function(res) {
			  		console.log("success", res)
			  		if(res.status == 200) {
			  			self.$message("删除成功")
			  		} else {
			  			self.$message("删除失败")
			  		}
		  			self.queryData('', self.currentPage)
			  	})
			  	.catch(function(res) {
			  		console.log("error", res)
			  	})
		  	})
		  	.catch(() => {
          self.$message({
          type: 'info',
          message: '已取消删除'
        })
        })
		  },
		  querySel() { //查询所有企业
		  	let self = this
		  	self.$axios({
			  	url: '/basic-platform/enterprise/sel',
			  	method: 'get',
			  	responseType: 'json',
			  	data: {
			  		compName: ''
			  	}
		  	})
		  	.then(function(res) {
		  		if(res.data.status == 200) {
			  		let list = res.data.data
			  		self.firmList = []
	  				list.forEach(function(item, index){
	  					item.id = item.id.toString()
	  				  self.firmList.push(item)
	    			})
	    			console.log("===========", self.firmList)
		  		}
		  	})	
		  	.catch(function(res) {
		  		console.log("error", res)	
		  	})
		  },
		  submitForm(formName) { //添加
		  	let self = this
		  	self.$refs[formName].validate((valid) => {
		  		if(valid) {
		  			self.$axios({
		  				url: '/basic-platform/dept/add',
		  				method: 'post',
		  				responseType: 'json',
		  				data: {
		  					deptName: self.addForm.deptName,
		  					enterpriseId: parseInt(self.addForm.enterpriseId)
		  				}
		  			})
		  			.then(function(res) {
		  				if(res.status == 200) {
		  				  self.$message("添加成功")
		  				} else {
		  					self.$message("添加失败")
		  				}
	  					self.dialogAddVisible = false
	  					self.queryData('', self.currentPage)
		  			})
		  			.catch(function(res) {
		  				console.log("error", res)
		  			})
		  		}
		  	})
		  },
		  registerCancel(formName) {
		  	let self = this
		  	self.addForm = {
		  		deptName: '',
		  		enterpriseId: ''
		  	}
		  	this.$refs[formName].resetFields()
		  	self.dialogAddVisible = false
		  },
		  closeDialog(msg) {
		  	let self = this
		  	self.dialogEditVisible = msg
		  	self.queryData("", self.currentPage)
		  },
		  changeCur(val) {
        let self = this
        self.queryData("", val)
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