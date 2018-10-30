<template>
  <div>
    <div class="sys_header">
      <el-input placeholder="请输入服务器名称" v-model="sysInput" class="select_box leftFloatBox" @keyup.enter.native="queryData(sysInput, 1)">
	    <template slot="prepend">服务器名称</template>
	  </el-input>
  	  <el-button type="primary" icon="search" @click="queryData(sysInput, 1)">查询</el-button>
  	  <el-button type="info" @click="register()">添加服务器</el-button>
    </div>

    <div class="sys_main">
      <el-table
	    :data="tableData"
	    border
	    style="width: 100%">
	    <el-table-column
	      label="序号"
	      width="200">
	      <template slot-scope="scope">{{ scope.$index + 1 }}</template>
	    </el-table-column>
	    <el-table-column
	      label="服务器名称"
	      width="300">
	      <template slot-scope="scope">{{ scope.row.serviceName}}</template>
	    </el-table-column>
	    <el-table-column
	      label="服务器地址"
	      width="300">
		  <template slot-scope="scope">{{scope.row.serviceNumber}}</template>
	    </el-table-column>
	    <el-table-column
	      label="操作">
	      <template slot-scope="scope">
	      	<el-button @click="editData(scope.$index, tableData)" type="text" size="small">
	      	  编辑
	      	</el-button>
	      	<el-button @click="deleteData(scope.row.id)" type="text" size="small">
	      	  删除
	      	</el-button>
          <el-button @click="configProcess()" type="text" size="small">
            配置进程
          </el-button>
	      </template>
	    </el-table-column>
      </el-table>
    </div>

    <!-- 添加服务器 -->
    <el-dialog title="添加服务器" :visible.sync="dialogAddVisible" @close="registerCancel('ruleForm')">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
	    <el-form-item label="服务器名称:" prop="serviceName">
	      <el-input v-model="ruleForm.serviceName" placeholder="请输入服务器名称" class="ipt_wid"></el-input>
	    </el-form-item>
	    <el-form-item label="服务器地址:" prop="serviceNumber">
	      <el-input v-model="ruleForm.serviceNumber" placeholder="请输入服务器地址" class="ipt_wid"></el-input>	
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

    <!-- 编辑服务器 -->
    <el-dialog title="编辑服务器" :visible.sync="dialogEditVisible" @close="closeDialog(false)">
      <el-form :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="id" style="display:none">
      	  <el-input v-model="form.id" auto-complete="off" class="ipt_wid"></el-input>
        </el-form-item>
        <el-form-item label="服务器名称:" prop="serviceName">
	      <el-input v-model="form.serviceName" placeholder="请输入服务器名称" class="ipt_wid"></el-input>
	    </el-form-item>
	    <el-form-item label="服务器地址:" prop="serviceNumber">
	      <el-input v-model="form.serviceNumber" placeholder="请输入服务器地址" class="ipt_wid"></el-input>	
	    </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogEditVisible = false">取 消</el-button>
	    <el-button type="primary" @click="updateData('form')">确 定</el-button>
  	  </div>
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

    <!-- 配置服务进程 -->
  </div>
</template>

<script>
  export default {
  	data: function() {
  	  return {
  	    sysInput: '',
  	    tableData: [],
  	    dialogAddVisible: false,
  	    dialogEditVisible: false,
  	    routeId: 0,	
        pageSize: 10,
        currentPage: 1,
        totalRows: 0,
  	    form: {},
  	    ruleForm: {
  	      id: '',
  	      serviceName: '',
  	      serviceNumber: ''	
  	    },
  	    rules: {
  	      serviceName: [
  	        { required: true, message: '请输入服务器名称', trigger: 'blur' }
  	      ],
  	      serviceNumber: [
  	        { required: true, message: '请输入服务器地址', trigger: 'blur' }
  	      ]	
  	    },
  	  }
  	},
  	mounted() {
  	  let self = this
  	  self.queryData()
  	},
  	methods: {
  	  queryData(serviceName, currentPage) {
  	    let self = this
        currentPage = currentPage ? currentPage : 1
        serviceName = serviceName ? serviceName : ''
  	    self.$axios({
  	      url: '/basic-platform/server/sel?pageSize=' + self.pageSize + "&currentPage=" + currentPage + "&serviceName=" + serviceName,
  	      method: 'get',
  	      responseType: 'json'	
  	    })
  	    .then(function(res) {
  	      if(res.status === 200) {
  	        self.tableData = res.data.data
            self.totalRows = res.data.page.totalRows
  	      }
  	    })
  	    .catch(function(res) {
  	      console.log("queryData error", res)	
  	    })
  	  },
  	  editData(index, tab) {
  	    let self = this
		    self.dialogEditVisible = true
		    self.form = tab[index]
  	  },
  	  register() {
  	    let self = this
  	    self.dialogAddVisible = true	
  	  },
  	  registerCancel(formName) {
  	    let self = this
  	    self.ruleForm = {
  	      serviceName: '',
  	      serviceNumber: ''	
  	    }
  	    this.$refs[formName].resetFields()
        self.dialogAddVisible = false
  	  },
  	  resetForm(formName) {
  	    this.$refs[formName].resetFields()
  	  },
  	  closeDialog(msg) {
   	    this.dialogEditVisible = msg
        this.queryData()
      },
      updateData(formName) {
        let self = this
        self.$axios({
          url: '/basic-platform/server/up',
          method: 'put',
          responseType: 'json',
          data: {
          	id: self.form.id,
          	serviceName: self.form.serviceName,
          	serviceNumber: self.form.serviceNumber
          }	
        })
        .then(function(res) {
          if(res.status === 200) {
            self.$message("修改成功")
            self.queryData()
            self.dialogEditVisible = false
            self.routeId++
      	    self.$router.push('ServiceControl?routeId='+self.routeId)
          }
        })
        .catch(function(res) {
           console.log("updateData error", res)
        })
      },
      deleteData(id) {
        let self = this
        self.$confirm('确定要删除此服务器吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }, 300).then(() => {
          self.$axios({
            url: '/basic-platform/server/del',
            method: 'delete',
            responseType: 'json',
            data: {
          	  id: id
            }
          })
          .then(function(res) {
            if(res.status === 200) {
              self.$message("删除成功")
              self.queryData()
              self.routeId++
          	  self.$router.push('ServiceControl?routeId='+self.routeId)
            }
          })
          .catch(function(res) {
            console.log("deleteData error", res)
          })
        })
      },
  	  submitForm(formName) {
  	    let self = this
  	    self.$refs[formName].validate((valid) => {
  	      if(valid) {
 		    self.$axios({
 		      url: '/basic-platform/server/add',
 		      method: 'post',
 		      responseType: 'json',
 		      data: self.ruleForm
 		    })
 		    .then(function(res) {	
 		      if(res.status === 200) {
 		        self.$message("添加成功")
 		        self.queryData()
              	self.dialogAddVisible = false
              	self.routeId++
              	self.$router.push('ServiceControl?routeId='+self.routeId)
 		      }
 		    }) 	
 		    .catch(function(res) {
 		      console.log("submitForm error", res)
 		    })      	
  	      }
  	    })
  	  },
      configProcess() {

      },
      changeCur(val) {
        let self = this
        self.queryData(self.sysInput, val)
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
    width: 54%;
  }	
  .g-footer,.m-buttons {
    display: flex;
    flex-flow: row nowrap;
  }
  .g-footer{
    justify-content: space-between;
  }
</style>