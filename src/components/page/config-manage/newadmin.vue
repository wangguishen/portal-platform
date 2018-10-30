<template>
	<div>
		<div class="sys_header">
			<el-input placeholder="请输入管理员帐号" v-model="sysInput" class="select_box leftFloatBox" @keyup.enter.native="queryData(sysInput, 1)">
		    	<template slot="prepend">管理员帐号</template>
		  	</el-input>
		  	<el-button type="primary" icon="search" @click="queryData(sysInput, 1)">查询</el-button>
		  	<el-button type="info" @click="register()">添加管理员</el-button>
		</div>
		<div class="sys_main">
			<el-table
			    :data="tableData.list"
			    border
			    style="width: 100%">
			    <el-table-column
			      	label="序号"
			      	width="120">
			      	<template slot-scope="scope">{{ scope.$index + 1 }}</template>
    			</el-table-column>
			    <el-table-column
			      	label="企业编码"
			      	width="200">
			      	<template slot-scope="scope" >
                        <span>{{scope.row.comp_code}}</span>
                    </template>
    			</el-table-column>
			    <el-table-column
			      	label="管理员帐号"
			      	width="180">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.account}}</span>
			      	</template>
			    </el-table-column>
          <el-table-column
              label="管理员名称"
              width="180">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
          </el-table-column>
			    <el-table-column
			      	label="是否可用"
			      	width="150">
			      	<template slot-scope="scope">
			      		<span>{{scope.row.auditFlag == '0' ? '否' : scope.row.auditFlag == '1' ? '是' : '--'}}</span>
			      	</template>
			    </el-table-column>
			    <el-table-column
			      	label="操作">
				    <template slot-scope="scope">
			        	<!-- <el-button @click="editData(scope.$index, tableData.list)" type="text" size="small">编辑</el-button> -->
			        	<el-button @click="deleteData(scope.$index, tableData.list)" type="text" size="small">删除</el-button>
			      	</template>
    			</el-table-column>
  			</el-table>
		</div>

		<!-- 编辑管理员 -->
		<el-dialog title="编辑管理员" :visible.sync="dialogEditVisible" @close="closeDialog(false)">
  			<el-form :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
  				<el-form-item label="id" style="display:none">
			      	<el-input v-model="form.id" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="企业编码:" prop="comp_code">
			      	<!-- <el-input v-model="form.comp_code"></el-input> -->
              <el-select v-model="form.comp_code" placeholder="请选择企业编码" class="ipt_wid">
                <el-option
                  v-for="item in cliques"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
			    </el-form-item>
			    <el-form-item label="管理员帐号" prop="account">
			      	<el-input v-model="form.account"></el-input>
			    </el-form-item>
			    <el-form-item label="管理员名称" prop="name">
			      	<el-input v-model="form.name"></el-input>
			    </el-form-item>
			    <el-form-item label="管理员密码" prop="password">
			      	<el-input v-model="form.password"></el-input>
			    </el-form-item>
  			</el-form>
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="dialogEditVisible = false">取 消</el-button>
			    <el-button type="primary" @click="updataData('form')">确 定</el-button>
		  	</div>
		</el-dialog>

		<!-- 添加管理员 -->
		<el-dialog title="添加管理员" :visible.sync="dialogAddVisible" @close="registerCancel('ruleForm')">
		    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			  <el-form-item label="企业编码:" prop="comp_code">
			    <!-- <el-input v-model="ruleForm.comp_code" placeholder="请输入企业编码"></el-input> -->
          <el-select v-model="ruleForm.comp_code" placeholder="请选择企业编码" class="ipt_wid" @change="compChange(ruleForm.comp_code)">
            <el-option
              v-for="item in cliques"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
			  </el-form-item>
			  <el-form-item label="用户名称: " prop="adminName">
          <div class="box" @click.stop="show()">
            <el-input
              placeholder="请选择用户"
              :icon="icons"
              v-model="value"
              :on-icon-click="handleIconClick"
              @focus="handleFocus"
              @blur="handleBlur"
              class="user_box">
            </el-input>
            <div class="option_box" v-show="optionBoxShow">
              <ul class="option_ul" v-scroll="onScroll">
                <li class="row_all" @click="userChange(item)" v-for="item in userList">{{item.real_name || item.username}}</li>
                <div class="preloader" v-show="preloaderShow">
                  <i class="el-icon-loading"></i>
                </div>
              </ul>
            </div>
          </div>
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

		<div class="g-footer">
          <div style="margin-top: 20px" v-show="tableData.totalCount">
            <el-pagination
              @size-change="queryData"
              @current-change="changeCur"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="tableData.totalCount"
              ref="paginations"
            >
            </el-pagination>
          </div>
        </div>
	</div>
</template>
<script>
import md5 from 'js-md5'
export default {
    data: function(){
        return {
        	sessionId: '2f7d49d4ca0b4fc3aec27a534633ee95',
          queryUrl: '/UAMS/adminReq/queryAdminManager',
          dataJson:{},
        	compName: '',
        	pageSize: 10,
        	sysInput: "",//输入的系统名称
        	dialogEditVisible: false,//修改管理员弹出框
        	dialogAddVisible: false, //添加管理员弹出框
        	formLabelWidth: '180px',
        	tableData: {},
        	index: 0,
	        form: {},
	        ruleForm: {
	        	comp_code: '',
	        	account:'' , 
            password: '',
            mobile: '',
            email: '',
            adminName: ''
	        },
	        rules: {
	          comp_code: [
	            { required: true, message: '请输入企业编码', trigger: 'blur' },
	          ],
	          account: [
	            { required: true, message: '请输入管理员帐号', trigger: 'blur' }
	          ],
	          name: [
	            { required: true, message: '请输入管理员名称', trigger: 'blur' },
	          ],
	          password: [
	            { required: true, message: '请输入管理员密码', trigger: 'blur' }
	          ],
	          telephone: [
	            { min: 11, max: 11, message: '请输入长度为11位的数字', trigger: 'number' }
	          ],
            adminName: [
              { required: true, message: '请选择用户', trigger: 'blur' },
            ]
	        },
          cliques:[],//全部企业编码
          currentPage: 1,
          userList: [],
          username: '',

          /*下拉*/
          value: '',
          optionBoxShow:false,
          preloaderShow:false,//加载符显示
          state:0,
          icons:"caret-bottom",//尾部图标
          oneClick: true,
          checkUser: '',
          accountCompCode: '',
        }
    },
    methods: {
    	editData:function(index, tab) {//编辑
    		let self = this
    		self.dialogEditVisible = true
    		self.form = tab[index]
    	},
      changeCur(val) {
        let self = this
        self.queryData("", val)
      },
    	queryData: function(account, currentPage) {
  	    let self = this
        self.currentPage = currentPage
  	    let pageSize = self.pageSize
        currentPage = currentPage ? currentPage : 1
    		let config = {
    			url: self.queryUrl + "?pageSize=" + self.pageSize + "&currentPage=" + currentPage,
    			method: 'post',
    			data: {
    		       "compCode": self.accountCompCode ? self.accountCompCode : '',
               "account": account ? account: ''
    		    }
    		}

    		if (!currentPage) {
              this.$refs.paginations.internalCurrentPage = 1;
            }

    		self.$axios(config).then(function (res) {
              if(res.data.success === false) {
                return
              }
              self.tableData = res.data.data;
              console.log("---------------", self.tableData)
    		  console.log(self.tableData);
            }).catch(function (error) {
              console.log(error);
            });
        currentPage++
    	},
    	updataData: function(formName) {
    	    let self = this
    		console.log('修改管理员', self.form);
    	    self.dialogEditVisible = false
    	    self.$axios({
    	    	url: '/UAMS/adminReq/updateAdminManager',
    	    	method: 'post',
    	    	responseType: 'json',
    	    	data: {
    	    	   id: self.form.id,
    	    	   comp_code: self.form.comp_code,
    	    	   account: self.form.account,
    	    	   name: self.form.name,
    	    	   password: self.form.password
    	    	}
    	    })
    	    .then(function(res) {
    	    	self.$message('修改成功!')
    	    	self.queryData("", self.currentPage)
    	    })
    	    .catch(function(res) {
    	    	console.log("error", res)
    	    })
    	},
    	deleteData: function(index, tableData) {
    	  console.log("================", index, tableData)
        let self = this
        self.$confirm('确定要删除这个管理员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }, 300).then(() => {
        	self.$axios({
        	  url: '/UAMS/adminReq/deleteAdminManager',
        	  method: 'post',
        	  responseType: 'json',
        	  data: {
        	    id: tableData[index].id,
              adminId: tableData[index].admin_code
         	  }
        	})
        	.then(function(res) {
            self.queryData("", self.currentPage);
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
    	register: function() {
    		let self = this
    		/*self.dialogAddVisible = true;*/
        /*self.referCode();*/
        self.$router.push("/addadmin")
    	},
      referCode(){
        let self = this;
        console.log(self.dataJson.comp_code)
        self.$axios({
          url: '/UAMS/company/do_comp_query?pageSize=1000',
          method: 'post',
          responseType: 'json',
          data: {
            "compName":""
          }
        })
        .then(function(res) {
          console.log(res)
          let list = res.data.data.list;
          list.forEach(function(item, index){
            item.label = item.comp_code;
            item.value = item.comp_code;
          })
          self.cliques = list;
        })
        .catch(function(res) {
          console.log("error", res);
        })
      },
      submitForm(formName) {
        let self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            let obj = {
              account:self.ruleForm.account,
              comp_code:self.ruleForm.comp_code,
              name:self.ruleForm.name,
              password:md5(self.ruleForm.password)
            }
            console.log(obj);
            console.log(self.ruleForm);
            self.$axios({
        	    url: '/UAMS/adminReq/addAdminManager',
        	    method: 'post',
        	    responseType: 'json',
        	    data: obj
        	  })
            .then(function(res) {
            	self.$message('添加成功!');
            	self.queryData("", self.currentPage);
            	self.dialogAddVisible = false;
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      closeDialog(msg) {
        this.dialogFormVisible = msg
        this.queryData("", this.currentPage)
      },
      registerCancel(formName) {
        let self = this;
        self.ruleForm = {
          comp_code: '',
          name: '',
          password: '',
          account:''
        }
        this.$refs[formName].resetFields();
        self.dialogAddVisible = false;
      },
      compChange(compCode) { //更换企业
        let self = this
        console.log("compCode", compCode)
        self.queryUser(compCode)
      },
      userChange(item) { //选择用户
        let self = this
        console.log("userChange", userChange)
        console.log("item", item)
        self.$axios({
          url: '/UAMS/Auth/addAdmin',
          method: 'post',
          responseType: 'json',
          /*let adminName = item.real_name || item.username*/
          data: {
            account: item.account,
            password: item.password,
            compCode: item.comp_code,
            mobile: item.mobile,
            email: item.email,
            adminName: adminName
          }
        })
      },
      queryUser(compCode) { //获取企业下用户
        let self = this
        self.userList = []
        self.$axios({
          url: "/UAMS/user/list?pageSize=10",
          method: 'post',
          responseType: 'json',
          data: {
            compCode: compCode
          }
        })
        .then(function(res) {
          if(res.data.success) {
            let list = res.data.data.data
            if(list.length != 0) {
              list.forEach(function(item, index){
                self.userList.push(item)
              })
            } else {
              console.log("数据为0")
            }
            console.log("===================", self.userList)
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      handleIconClick() {

      },
      handleFocus() {
        let self = this;
        self.icons = "caret-top";
        self.optionBoxShow = true;
      },
      handleBlur() {

      },
      show() {
        console.log("show")
      },
      onScroll(e, position){
        let self = this;
        let ulBox = document.getElementsByClassName('option_ul');
        let ofH = ulBox[0].offsetHeight;
        let scH = ulBox[0].scrollHeight;
        if(position.scrollTop == (scH-ofH)){
          if(self.statEach == 0){
            self.statEach++;
            self.currentPage++;
            self.infiniteload();
          }
        }else{
          self.statEach = 0;
        }
      }
    },
    mounted: function() {
      let self = this;
      let storage = JSON.parse(localStorage.getItem('dataJson'));
      self.accountCompCode = localStorage.getItem('compCode')

      if(self.accountCompCode) {
        self.accountCompCode = self.accountCompCode.replace("\"","").replace("\"","")
      }

      if(self.accountCompCode === self.PLAT_COMPCODE) {
        self.accountCompCode = ''
      }
      
      self.dataJson = storage;
    	self.$nextTick(function () {
          self.queryData()
        })
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
	.avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
   .avatar-uploader .el-upload:hover {
       border-color: #20a0ff;
   }
   .avatar-uploader-icon {
       font-size: 28px;
       color: #8c939d;
       width: 178px;
       height: 178px;
       line-height: 178px;
       text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .g-footer,.m-buttons {
      display: flex;
      flex-flow: row nowrap;
    }
    .g-footer{
      justify-content: space-between;
    }

    /* select */
    ul,li{
      list-style:none;  
    }
    .ipt_wid{
      width: 34%;
    }
    .area_wid{
      width: 60%;
    }
    
    .role-left {
      margin-top: 10px;
      min-height: 600px;
    }
    .sq-btn {
      width: 180px;
      margin-top: 15px;
    }
    .box{
      position: relative;
      max-width: 200px;
    }
    .option_box{
      position: absolute;
      top: 37px;
      left: 0;
      z-index: 10;
      width: 100%;
      height: 250px;
      background-color: #fff;
      border: 1px solid #eee;
      overflow: hidden;
      box-sizing: border-box;
    }
    .option_ul{
      width: 120%;
      max-height: 250px;
      overflow-y:scroll;
      overflow-x:hidden;
      white-space:nowrap;
    }
    .row_all,.preloader{
      width: 100%;
      height: 35px;
      line-height: 35px;
      padding-left: 10px;
      color: #666;
      cursor: pointer;
    }
    .preloader{
      /* color: ; */
      width: 200px;
      padding: 0;
      text-align: center;
      cursor: default;
    }
    .row_all:hover{
      color: #333;
      background: #eee;
    }
</style>