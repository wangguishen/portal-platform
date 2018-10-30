<template>
	<div>
		<div class="sys_header">
			<el-select v-model="spaceValue" filterable placeholder="请选择空间" @change="spaceChange(spaceValue)">
	      <el-option
	        v-for="item in spaceOptions"
	        :key="item.value"
	        :label="item.label"
	        :value="item.value"
	        >
	      </el-option>
	    </el-select>
	    <el-button type="primary" icon="search" @click="searchSys()" style="margin-left: 15px">搜索</el-button>
	    <el-button type="primary" @click="registerSpace()">添加空间资源</el-button>
    </div>
    <div class="sys_main">
      <el-table
			  :data="tableData"
		    border
		    empty-text="暂无数据"
		    style="width: 100%">
			    <el-table-column
			      	label="序列"
			      	width="160">
			      	<template slot-scope="scope">{{ scope.$index + 1 }}</template>
    			</el-table-column>
					<el-table-column
					  label="功能名称"
					  width="600">
					  <template slot-scope="scope">{{ scope.row.url_name}}</template>
					</el-table-column>
			    <el-table-column label="操作">
				    <template slot-scope="scope">
			        	<el-button @click="handleClick(scope.$index, tableData)" type="text" size="small">编辑</el-button>
			        	<el-button type="text" size="small" @click="delectClick(scope.$index, tableData)">删除</el-button>
			      	</template>
    			</el-table-column>
  			</el-table>
    </div>

    <!-- 添加空间资源 -->
    <el-dialog title="添加空间资源" @close="registerCancel('spaceForm')" :visible.sync="dialogFormVisible">
	    <el-form :model="spaceForm" ref="spaceForm" :rules="rules" label-width="100px" class="demo-ruleForm">
	      <el-form-item label="空间: " prop="auditFlag">
	      		<el-select v-model="spaceForm.auditFlag" placeholder="请选择空间" class="ipt_wid">
				      <el-option
				        v-for="item in spaceOptions"
				        :key="item.value"
				        :label="item.label"
				        :value="item.value">
				      </el-option>
				    </el-select>
		    </el-form-item> 
		    <el-form-item label="功能名称: " prop="urlName">
          <el-input v-model="spaceForm.urlName" placeholder="请输入功能名称" auto-complete="off" class="ipt_wid"></el-input>
		    </el-form-item>
		    <el-form-item>
		      <el-button type="primary" @click="submitForm('spaceForm')">
		        <i class="el-icon-circle-check"></i>&nbsp;确定
		      </el-button>
		      <el-button @click="registerCancel('spaceForm')">
		        <i class="el-icon-circle-cross"></i>&nbsp;取消
		      </el-button>
		    </el-form-item>
	    </el-form>
    </el-dialog>

    <!-- 编辑空间资源 -->
    <el-dialog title="修改空间资源" @close="registerCancel('spaceForm')" :visible.sync="dialogEditVisible">
	    <el-form :model="spaceForm" ref="spaceForm" :rules="rules" label-width="100px" class="demo-ruleForm">
	    	<el-form-item label="id: " v-show="false">
          <el-input v-model="spaceForm.id" auto-complete="off" class="ipt_wid">
          </el-input>
	    	</el-form-item>
	      <el-form-item label="空间: " prop="auditFlag">
	      		<el-select v-model="spaceForm.auditFlag" class="ipt_wid" disabled>
				      <el-option
				        v-for="item in spaceOptions"
				        :key="item.value"
				        :label="item.label"
				        :value="item.value">
				      </el-option>
				    </el-select>
		    </el-form-item> 
		    <el-form-item label="功能名称: " prop="urlName">
          <el-input v-model="spaceForm.urlName" auto-complete="off" class="ipt_wid"></el-input>
		    </el-form-item>
		    <el-form-item>
		      <el-button type="primary" @click="editSubmit('spaceForm')">
		        <i class="el-icon-circle-check"></i>&nbsp;确定
		      </el-button>
		      <el-button @click="registerCancel('spaceForm')">
		        <i class="el-icon-circle-cross"></i>&nbsp;取消
		      </el-button>
		    </el-form-item>
	    </el-form>
    </el-dialog>

    <div class="g-footer">
      
    </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				pageSize: 10,
				currentPage: 1,
				spaceValue: '1',
				beginName: '', //保存修改之前的值
				spaceOptions: [{
          value: '1',
          label: '海'
        }, {
          value: '2',
          label: '宝'
        }, {
          value: '3',
          label: '娃'
        }],
        tableData: [],
        dialogFormVisible: false,
        dialogEditVisible: false,
        spaceForm: {
        	id: '',
        	urlName: '',
        	auditFlag: null,
        },
        rules: {
        	auditFlag: [
            { required: true, message: '请选择空间', trigger: 'change' },
          ],
          urlName: [
            { required: true, message: '请输入功能名称', trigger: 'blur' },
          ]
        },
			}
		},
		mounted() {
			let self = this
			self.queryData()
		},
		methods: {
			queryData(auditFlag, currentPage) { //查询
			  let self = this
			  self.currentPage = currentPage
  	    let pageSize = self.pageSize
        currentPage = currentPage ? currentPage : 1
        self.$axios({
        	url: '/UAMS/url/query_all_url',
        	method: 'post',
        	responseType: 'json',
        	data: {
        		type: auditFlag,
        		pageSize: self.pageSize,
        		currentPage: self.currentPage
        	}
        })
        .then(function(res) {
        	if(res.data.success === true) {
        		self.tableData = res.data.data
        	}
        })
        .catch(function(res) {
        	console.log("error", res)
        })
        currentPage++
			},
			spaceChange(spaceValue) {
				let self = this
				self.spaceValue = spaceValue
			},
			searchSys() {
				let self = this
				self.queryData(self.spaceValue, self.currentPage)
			},
			registerSpace() {
				let self = this
				self.dialogFormVisible = true
			},
			registerCancel(formName) {
				let self = this
				self.spaceForm = {
					auditFlag: '',
					urlName: '',
				}
				self.$refs[formName].resetFields()
    		self.dialogFormVisible = false
    		self.dialogEditVisible = false
			},
			submitForm(formName) { //注册空间资源
			  let self = this
			  console.log("formName", self.spaceForm)
        self.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(self.spaceForm);
            self.$axios({
        	    url: '/UAMS/url/addUrl',
        	    method: 'post',
        	    responseType: 'json',
        	    data: {
        	    	url_name: self.spaceForm.urlName,
        	    	auditFlag: self.spaceForm.auditFlag
        	    }
        	  })
            .then(function(res) {
            	if(res.data.success) {
            	  self.$message({
	                type: 'success',
	                message: '添加成功!'
	              }, 300);
            	} else {
            		self.$message({
	                type: 'warning',
	                message: '添加失败!'
	              }, 300);
            	}
            	self.dialogFormVisible = false
            	self.queryData(self.spaceValue, self.currentPage)
            })
            .catch(function(res) {
            	console.log("error", res);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
			},
			delectClick(index, tableData) { //删除
				let self = this
				self.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }, 300).then(() => {
          self.$axios({
            url: '/UAMS/url/deleteUrl',
            method: 'post',
            responseType: 'json',
            data: {
              id: tableData[index].id
            }
          })
          .then(function(res) {
          	if(res.data.success) {
	            self.$message({
	              type: 'success',
	              message: '删除成功!'
	            }, 300);
          	} else {
          		self.$message({
          			type: 'warning',
          			message: '删除失败'
          		}, 300)
          	}
          	self.queryData(self.spaceValue, self.currentPage)
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
			handleClick(index, tableData) {
			  let self = this
			  self.dialogEditVisible = true
			  self.spaceForm.urlName = tableData[index].url_name
			  self.beginName = tableData[index].url_name
			  self.spaceForm.auditFlag = tableData[index].auditFlag
			  self.spaceForm.id = tableData[index].id
			},
			editSubmit(formName) { //修改空间资源
				let self = this
				console.log(self.spaceForm.id, self.spaceForm.urlName)
				if(self.beginName === self.spaceForm.urlName) {
					self.$message("没有进行任何修改")
					return
				}
				self.$axios({
					url: '/UAMS/url/updateUrl',
					method: 'post',
					responseType: 'json',
					data: {
						id: self.spaceForm.id,
						url_name: self.spaceForm.urlName
					}
				})
				.then(function(res) {
					if(res.data.success) {
						self.$message({
              type: 'success',
              message: '修改成功!'
            }, 300);
					} else {
						self.$message({
              type: 'warning',
	            message: '修改失败!'
	          }, 300);
					}
					self.dialogEditVisible = false
					self.queryData(self.spaceValue, self.currentPage)
				})
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
		width: 34%;
	}
	.g-footer,.m-buttons {
      display: flex;
      flex-flow: row nowrap;
    }
    .g-footer{
      justify-content: space-between;
    }
</style>