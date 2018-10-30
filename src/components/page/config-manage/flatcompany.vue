<template>
    <div>
        <div class="sys_header">
            <el-input placeholder="请输入企业名称" v-model="sysInput" class="select_box leftFloatBox" @keyup.enter.native="queryData(sysInput, 1)">
                <template slot="prepend">企业名称</template>
            </el-input>
            <el-button type="primary" icon="search" @click="queryData(sysInput, 1)">查询</el-button>
            <el-button type="info" @click="register('company')">企业注册</el-button>
            <el-button type="info" @click="register('orgCompany')">生态企业注册</el-button>
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
                    label="企业名称"
                    width="200">
                    <template slot-scope="scope" >
                        <span>{{scope.row.comp_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="企业编码"
                    width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.comp_code}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="企业简称"
                    width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.comp_short_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="企业类型"
                    width="200">
                    <template slot-scope="scope">
                        <span>
                {{scope.row.isGroup == 'Y' && scope.row.comp_parent_code === 0 ? '集团' : scope.row.comp_parent_code === 1 ? '生态企业' : '企业'}}
                </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editData(scope.$index, tableData.list)" type="text" size="small">编辑</el-button>
                        <el-button @click="deleteData(scope.row.comp_code, scope.$index, tableData.list)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 修改企业 -->
        <el-dialog :title="editTitle" :visible.sync="dialogFormVisible" @close="closeDialog(false)">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="企业名称：" :label-width="formLabelWidth">
                    <el-input v-model="form.comp_name" auto-complete="off" class="ipt_wid"></el-input>
                </el-form-item>
                <el-form-item label="企业编码：" :label-width="formLabelWidth">
                    <el-input v-model="form.comp_code" :disabled="true" auto-complete="off" class="ipt_wid"></el-input>
                </el-form-item>
                <el-form-item label="企业简称：" :label-width="formLabelWidth">
                    <el-input v-model="form.comp_short_name" auto-complete="off" class="ipt_wid"></el-input>
                </el-form-item>
                <el-form-item label="企业地址：" prop="addresses" :label-width="formLabelWidth">
                    <el-cascader
                        size="large"
                        class="casc"
                        placeholder="请选择企业地址"
                        :options="options"
                        v-model="selectedOptions"
                        filterable
                        clearable
                        @change="handleChanges">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址：" prop="address" :label-width="formLabelWidth" v-show="selectedOptions.length == 3">
                    <el-input v-model="form.address" placeholder="请输入企业详细地址"></el-input>
                </el-form-item>
                <el-form-item label="联系人:" prop="contact" :label-width="formLabelWidth">
                    <el-input v-model="form.contact" placeholder="请输入企业联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:" :label-width="formLabelWidth">
                    <el-input v-model="form.telephone" placeholder="请输入企业电话"></el-input>
                </el-form-item>
              <!-- 生态企业 -->
              <el-form-item label="选择关联集团:" v-show="orgCompanyShow" :label-width="formLabelWidth">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                  <div style="margin: 15px 0;"></div>
                  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                    <el-checkbox style="margin-left:0;margin-right:15px;margin-bottom:15px" v-for="city in cities" :label="city.value" :key="city.value" :value="city.value">{{city.label}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>


                <el-form-item label="是否集团企业：" :label-width="formLabelWidth" v-show="companyShow">
                    <el-select v-model="form.isGroup" class="ipt_wid">
                        <el-option label="是" value="Y"></el-option>
                        <el-option label="否" value="N"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="企业编码：" prop="groupCode" :label-width="formLabelWidth" v-show="isGroupShow">
                    <el-select v-model="form.groupCode" filterable placeholder="请选择企业编码">
                        <el-option
                            v-for="item in cliques"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：" prop="remarks" :label-width="formLabelWidth">
                    <el-input v-model="form.remarks" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updataClear()">取 消</el-button>
                <!-- <el-button type="primary" @click="updataData(form.comp_name, form.comp_code)">确 定</el-button> -->
          <el-button type="primary" @click="updateDataT('form')">确定</el-button>
            </div>
        </el-dialog>

        <!-- 企业注册,生态企业注册 -->
        <el-dialog :title="registerTitle" :visible.sync="registerFormVisible" @close="registerCancel('ruleForm')">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="企业编码:" prop="enterpriseCode">
                    <el-input v-model="ruleForm.enterpriseCode" placeholder="请输入企业编码"></el-input>
                </el-form-item>
                <el-form-item label="企业名称:" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入企业名称"></el-input>
                </el-form-item>
                <el-form-item label="企业简称:" prop="shortName">
                    <el-input v-model="ruleForm.shortName" placeholder="请输入企业简称"></el-input>
                </el-form-item>
                <el-form-item label="企业地址:" prop="addresses">
                    <el-cascader
                        size="large"
                        class="casc"
                        placeholder="请选择企业地址"
                        :options="options"
                        v-model="selectedOptionsZc"
                        filterable
                        clearable
                        @change="handleChanges">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址:" prop="address" v-show="selectedOptionsZc.length == 3">
                    <el-input v-model="ruleForm.address" placeholder="请输入企业详细地址"></el-input>
                </el-form-item>
                <el-form-item label="联系人:" prop="contact">
                    <el-input v-model="ruleForm.contact" placeholder="请输入企业联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:">
                    <el-input v-model="ruleForm.telephone" placeholder="请输入企业电话"></el-input>
                </el-form-item>
                <el-form-item label="是否集团企业" v-show="companyShow" prop="isGroup"> 
                    <el-select v-model="ruleForm.isGroup" placeholder="请选择是否集团企业">
                        <el-option label="是" value="Y"></el-option>
                        <el-option label="否" value="N"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 生态企业 -->
                <el-form-item label="选择关联集团:" v-show="orgCompanyShow">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                            <el-checkbox style="margin-left:0;margin-right:15px;margin-bottom:15px" v-for="city in cities" :label="city.value" :key="city.value" :value="city.value">{{city.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="企业编码" prop="groupCode" v-show="isGroupShow" :rules="[
                    { required: requireded, message: '请选择企业编码', trigger: 'change' }
                ]">
                    <el-select v-model="ruleForm.groupCode" placeholder="请选择企业编码" filterable>
                        <el-option
                            v-for="item in cliques"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注:" prop="remarks">
                    <el-input v-model="ruleForm.remarks" placeholder="请输入备注"></el-input>
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
                    ref="paginations">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
/*
    CodeToText["110000"] //输出汉字  北京
    TextToCode["北京市"] //输出代码  110000
*/
var cityOptions = []
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
    data: function(){
        return {
            routeId: 0,
            sessionId: '2f7d49d4ca0b4fc3aec27a534633ee95',
            queryUrl: '/UAMS/company/do_comp_query',
            dataJson:{},
            isGroupShow: false,
            compName: '',
            pageSize: 10,
            currentPage: 1,
            sysInput: "",//输入的系统名称
            dialogFormVisible: false,//编辑弹出框
            registerFormVisible: false, //企业注册弹出框
            dialogImgVisible: false,
            formLabelWidth: '120px',
            tableData: {},
            index: 0,
            form: {},
            oldForm:{},
            ruleForm: {
                enterpriseCode: '',
                name: '',
                shortName: '',
                address: '',
                addresses: '',
                contact: '',
                telephone: '',
                isGroup: '',
                groupCode: '',
                remarks: '',
            },
            rules: {
                enterpriseCode: [
                    { required: true, message: '请输入企业编码', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入企业名称', trigger: 'blur' }
                ],
                shortName: [
                    { required: true, message: '请输入企业简称', trigger: 'blur' },
                ],
                isGroup: [
                    { required: true, message: '请选择是否集团企业', trigger: 'change' }
                ],
            },
            requireded: false,
            cliques:[],//集团集合

            checkAll: false,
            checkedCities: [],
            initCities: [],
            cities: cityOptions,
            isIndeterminate: false,
            companyShow: true, //企业注册
            orgCompanyShow: false, //生态企业注册
            registerTitle: '',
            addCompType: '', //企业注册类型
            editTitle: '',
            backup_copy:{},
            states:0,

            // 测试三级联动地址
            options: regionData,
            selectedOptions: [],
            selectedOptionsZc: [],

            requestData:[],
            dialogImageUrl: '',
            dialogVisible: false,

            
        }
    },
    watch:{
        ruleForm: {
            handler(curVal,oldVal){
                let self = this;
                if(curVal.isGroup == "Y"){
                    self.isGroupShow = false;
                    self.requireded = false;
                }else if(curVal.isGroup == "N"){
                    self.isGroupShow = true;
                    self.requireded = true;
                }else{
                    self.isGroupShow = false;
                }
            },
            deep:true
        },
        form: {
            handler(curVal,oldVal){
                let self = this;
                if(curVal.isGroup == "Y"){
                    self.isGroupShow = false;
                }else if(curVal.isGroup == "N"){
                    self.isGroupShow = true;
                }else{
                    self.isGroupShow = false;
                }
            },
            deep:true
        }
    },
    mounted: function() {
        let self = this;
        let storage = JSON.parse(localStorage.getItem('dataJson'));
        self.sessionId = storage.sessionId
        self.dataJson = storage;
        self.referCode()
        self.$nextTick(function () {
            self.queryData()
            self.transerfBloc()
        })
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleChanges (value) {
            let self = this;
            let arr = [];
            value.forEach(function(item, index){
                arr.push(CodeToText[item])
            })
            self.ruleForm.addresses = arr.join(" ");
            self.form.addresses = arr.join(" ");
            console.log(value)
        },
        updataClear(){
            let self = this;
            self.states = 0;
            self.dialogFormVisible = false;
            self.queryData(self.sysInput, self.currentPage)
        },
        editData:function(index, tab) {//编辑
            console.log("1111", index, tab)
            console.log("22222", tab[index])
            let self = this
            if(self.states == 0){
                self.backup_copy = tab[index]
            }
            self.states++;
            self.ruleForm.addresses = ''
            self.form={}
            self.dialogFormVisible = true
            self.form = tab[index];
            // self.oldForm = tab[index];
            let addressArr = [],arr = [];
            if(self.form.address == null){
                self.form.address = ''
            }
            if(self.form.address!=''){
                if(self.form.address.indexOf('&') > 0){
                    addressArr = self.form.address.split('&')
                    arr = addressArr[0].split(' ')
                    self.form.addresses = addressArr[0]
                    self.form.address = addressArr[1]
                }else{
                    self.form.addresses = self.form.address
                    self.form.address = ''
                    arr = self.form.addresses.split(' ')
                } 
                console.log("arr===",arr)
                if(arr.length == 3){
                    let str1 = TextToCode[arr[0]].code;
                    let str2 = TextToCode[arr[0]][arr[1]].code;
                    let str3 = TextToCode[arr[0]][arr[1]][arr[2]].code;
                    self.selectedOptions.push(str1)
                    self.selectedOptions.push(str2)
                    self.selectedOptions.push(str3)
                }
            }  
            for(var key in self.form){
                self.oldForm[key] = tab[index][key]
            }
            if(self.form.comp_parent_code === 1) {
              self.$axios({
                url: '/UAMS/company/query_comp_ecology',
                method: 'post',
                responseType: 'json',
                data: {
                  compId: self.form.id
                }
              })
              .then(function(res) {
                console.log("success", res)
                if(res.data.success) {
                  let list = res.data.data

                  for(let index in list) {
                    self.checkedCities.push(list[index].group_id)
                    self.initCities.push(list[index].group_id)
                  }
                  self.handleCheckedCitiesChange(self.checkedCities)
                }
              })
              .catch(function(res) {
                console.log("error", res)
              })
            }

            self.orgCompanyShow = self.form.comp_parent_code === 1 ? true : false
            self.companyShow = self.form.comp_parent_code === 1 ? false : true
            self.editTitle = self.form.comp_parent_code === 1 ? '修改生态企业' : '修改企业'

            if(self.cliques.length != 0){
                if(self.form.isGroup == "Y"){
                    self.form.groupCode = "";
                }else{
                    console.log(self.form)
                    self.cliques.forEach(function(item, index){
                        if(item.id == self.form.comp_parent_code){
                            self.form.groupCode = item.comp_code
                        }
                    })
                }
            }else{
                self.form.groupCode = "";
            }
                
        },
        changeCur(val) {
          let self = this
          self.queryData(self.sysInput, val)
        },
        queryData: function(compName, currentPage) {
            let self = this
            let pageSize = self.pageSize
            currentPage = currentPage ? currentPage : 1
            self.currentPage = currentPage
            let config = {
                url: self.queryUrl + "?pageSize=" + self.pageSize + "&currentPage=" + currentPage,
                method: 'post',
                data: {
                   "compName": compName ? compName : ''
                }
            }
            if (!currentPage) {
              this.$refs.paginations.internalCurrentPage = 1;
            }
            self.$axios(config).then(function (res) {
                console.log(res)
                if(res.data.success == false){
                    return
                }else{
                    self.tableData = res.data.data;
                    console.log("self.tableData", self.tableData)
                }
                // reportError(res)
                
            }).catch(function (error) {
                console.log(error);
            });
            currentPage++;
        },
        referCode() { //查询所有的企业
            let self = this;
            self.$axios({
              url: '/UAMS/company/do_group_query?pageSize=100000',
              method: 'post',
              responseType: 'json',
              data: {},
            })
            .then(function(res) {
              let list = res.data.data;
              console.log("list ===============", list)
              list.forEach(function(item, index){
                item.label = item.comp_name;
                item.value = item.id;
              })
              cityOptions = list;
              self.cities = cityOptions
            })
            .catch(function(res) {
              console.log("error", res);
            })
        },
        updataData: function(compName, compCode) {
            let self = this
            console.log('修改企业', self.form);
            console.log(self.cliques[0].id)
            let ress = "";
            if(self.form.address !== ''){
                ress = self.form.addresses + '&' + self.form.address;
            }else{
                ress = self.form.addresses;
            }
            // let ress = self.form.addresses +'&'+ self.form.address
            let data = {
                sessionId: self.sessionId,
                enterpriseCode: self.form.comp_code,//企业编码
                shortName: self.form.comp_short_name,//简称
                name: self.oldForm.comp_name,//企业名称
                isGroup: self.form.isGroup,//是否为集团
                newCompName: self.form.comp_name,//新企业名称
                address: ress,
                contact: self.form.contact,
                telephone: self.form.telephone,
                remarks: self.form.remarks,
            };
            if(self.form.isGroup == "Y"){
                data.enterpriseParentCode = 0;  //
            }else{
                if(self.form.groupCode === null){
                    console.log("gogogogogog")
                    self.$message({
                        type: 'warning',
                        message: '请选择集团编码!'
                    }, 300);
                    return
                }else{
                    if(typeof self.form.groupCode == 'string'){
                        // console.log("455555",self.form.groupCode)
                        // data.enterpriseParentCode = self.cliques[0].id;
                        data.enterpriseParentCode = Number(self.form.groupCode);
                    }else{
                        console.log(99999)
                        data.enterpriseParentCode = self.form.groupCode;
                    }
                }
            }
            console.log("修改参数",data)
            self.$axios({
                url: self.BP_HOST + '/updateComp',
                method: 'post',
                responseType: 'json',
                data: data
            })
            .then(function(res) {
                self.$message('修改成功!');
                self.dialogFormVisible = false;
                self.states = 0;
                self.orgCompanyShow = false;
                self.queryData("", self.currentPage)
                self.$router.push('flatcompany?routeId='+self.routeId)
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        deleteData: function(compName, index, tab) {//删除企业
            console.log(compName)
            console.log(index)
            console.log(tab)
            let self = this;
            console.log(self.tableData)
            self.$confirm('确定要删除这个企业吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }, 300).then(() => {
                self.$axios({
                    url: self.BP_HOST + '/deleteComp',
                    method: 'post',
                    responseType: 'json',
                    data: {
                        sessionId: self.dataJson.sessionId,
                        enterpriseCode: compName
                    }
                })
                .then(function(res) {
                    // self.queryData();
                    tab.splice(index,1)
                    self.$message({
                        type: 'success',
                        message: '删除成功!'
                    }, 300);
                    self.$router.push('flatcompany?routeId='+self.routeId)
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
        register: function(value) {
            let self = this
            self.addCompType = value
            self.orgCompanyShow = value === 'orgCompany' ? true : false
            self.companyShow = value === 'orgCompany' ? false : true
            self.registerTitle = value === 'orgCompany' ? '生态企业注册' : '企业注册'
            self.oldForm = {}
            self.registerFormVisible = true
        },
        transerfBloc() {//查出所有企业
            let self = this;
            let data = {
                // compParentCode
            }
            self.$axios({
                url: '/UAMS/company/do_comp_query?pageSize=10000',
                method: 'post',
                responseType: 'json',
                data: data
            })
            .then(function(res) {
                console.log(res)
                if(res.status === 200) {
                    let list = res.data.data.list;
                    console.log("---------------------", list)
                    list.forEach(function(item, index){
                        item.label = item.comp_code;
                        item.value = item.id.toString();
                    })
                    self.cliques = list;
                }
            })
            .catch(function(res) {
                console.log("error", res);
            })
        },
        change(){
            let self = this;
            self.ruleForm.log = document.getElementById('myFile').files[0]
            self.form.log = document.getElementById('myFile').files[0]
        },
        submitForm(formName) {//确认添加新企业
            let self = this;
            console.log(self.ruleForm)
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    self.ruleForm.sessionId = self.dataJson.sessionId
                    console.log("============", self.ruleForm.groupCode, self.ruleForm)
                    if(self.ruleForm.isGroup == "N"){
                        self.ruleForm.enterpriseParentCode = self.ruleForm.groupCode;
                        if(self.ruleForm.enterpriseParentCode === "") {
                          self.$message("请选择集团编码")
                          return
                        }
                    } else{
                        self.ruleForm.enterpriseParentCode = 0
                    }
                    self.ruleForm.enterpriseParentCode = self.addCompType === 'orgCompany' ? 1 : self.ruleForm.enterpriseParentCode
                    // self.enterpriseParentCode =  子企业传值（集团编码）
                    // if(self.ruleForm.addresses !== '' && self.ruleForm.address !== ''){
                    //     self.ruleForm.address = self.ruleForm.addresses + '&' + self.ruleForm.address;
                    // }else if(self.ruleForm.addresses !== '' &&  self.ruleForm.address == ''){
                    //     self.ruleForm.address = self.ruleForm.addresses;
                    // }
                    if(self.ruleForm.address !== ''){
                        self.ruleForm.address = self.ruleForm.addresses + '&' + self.ruleForm.address;
                    }else{
                        self.ruleForm.address = self.ruleForm.addresses;
                    }
                    
                    delete self.ruleForm.addresses;
                    console.log("提交的ruleForm",self.ruleForm)
                    self.$axios({
                        url: self.BP_HOST + '/addComp',
                        method: 'post',
                        responseType: 'json',
                        data: self.ruleForm
                    })
                    .then(function(res) {
                        console.log("success=====", res);
                        let list = res.data.data
                        if(typeof list=='string'){
                            list = JSON.parse(list);
                            if(list.success == false){
                                self.$message({
                                    message: list.msg,
                                    type: 'error'
                                });
                            }else {
                                let compId = list.data.id
                                self.flatUpLoad(1, compId)
                                if(self.requestData.length === 0) {
                                    self.$message('添加成功!');
                                    self.queryData("", self.currentPage);
                                    self.registerFormVisible = false;
                                    self.$router.push('flatcompany?routeId='+self.routeId)
                                }else{
                                    self.releaseEcologyComp(0)
                                }
                                
                            }
                        }
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
            console.log("formName", formName)
            this.selectedOptionsZc = []
            this.$refs[formName].resetFields();
        },
        releaseEcologyComp(type) { //生态企业关联添加
          let self = this
          self.$axios({
            url: '/UAMS/company/release_ecology_comp',
            method: 'post',
            responseType: 'json',
            data: self.requestData
          })
          .then(function(res) {
            if(type == 1 && res.data.success) {
                self.$message("修改成功")
            }else{
                self.$message("添加成功")
            }
            self.dialogFormVisible = false
            self.registerFormVisible = false;
            self.queryData("", self.currentPage)
            self.$router.push('flatcompany?routeId='+self.routeId)
          })
          .catch(function(res) {
            console.log("error", res)
          })
        },
        closeDialog(msg) {
            this.dialogFormVisible = msg
            this.checkedCities = []
            this.initCities = []
            /*this.queryData()*/
        },
        registerCancel(formName){//关闭注册模态框
            let self = this;
            self.ruleForm = {
                enterpriseCode: '',
                name: '',
                shortName: '',
                address: '',
                contact: '',
                telephone: '',
                isGroup: '',
                groupCode: '',
                remarks: ''
            }
            self.oldForm = {}
            self.checkedCities = []
            self.initCities = []
            self.selectedOptionsZc = []
            self.handleCheckedCitiesChange(self.checkedCities)
            this.$refs[formName].resetFields();
            self.registerFormVisible = false;
        },
        handleCheckAllChange(val) {
            let self = this
            if(event.target.checked) {
              for(let index in cityOptions) {
                self.checkedCities.push(cityOptions[index].value)
              }
            } else {
              self.checkedCities = []
            }
            this.isIndeterminate = false;
            console.log("self.initCities", self.initCities, "self.checkedCities", self.checkedCities)
        },
        handleCheckedCitiesChange(value) {
            /*console.log("============", value.length,this.checkedCities.length, this.cities.length, cityOptions.length)*/
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        updateDataT(formName) {
            let self = this
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    self.flatUpLoad(0, self.form.id)
                    if(isObjectUtil(self.form, self.oldForm) && self.requestData.length === 0){
                        self.$message.warning("你还没有进行任何修改")
                        return
                    }
                    if(self.form.comp_parent_code === 1) { //修改生态企业
                        
                        self.updataDataOrg()
                    } else {
                        self.updataData(self.form.comp_name, self.form.comp_code)
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        flatUpLoad(type, compId){
            let self = this;
            let requestData = new Array()
              if(type == 1) {  //添加
                for(let index in self.checkedCities) {
                  requestData.push({
                    compId: compId,
                    groupId: self.checkedCities[index],
                    type: type
                  })
                }
              } else {  //修改,可添加，可删除
                let delArr = self.compare(self.initCities, self.checkedCities)
                let addArr = self.compare(self.checkedCities, self.initCities)
                console.log("self.delArr", delArr, "self.addArr", addArr)

                for(let index in delArr) {
                  requestData.push({
                    compId: compId,
                    groupId: delArr[index],
                    type: "0"
                  })
                }

                for(let index in addArr) {
                  requestData.push({
                    compId: compId,
                    groupId: addArr[index],
                    type: "1"
                  })
                }
              }
            self.requestData = requestData
        },
        updataDataOrg() {
            let self = this
            let ress = "";
            if(self.form.address !== ''){
                ress = self.form.addresses + '&' + self.form.address;
            }else{
                ress = self.form.addresses;
            }
            let data = {
                sessionId: self.sessionId,
                enterpriseCode: self.form.comp_code,//企业编码
                shortName: self.oldForm.comp_short_name,//简称
                name: self.oldForm.comp_name,//企业名称
                isGroup: self.form.isGroup,//是否为集团
                newCompName: self.form.comp_name,//新企业名称
                address: ress,
                contact: self.form.contact,
                telephone: self.form.telephone,
                remarks: self.form.remarks,
            };
          self.$axios({
            url: self.BP_HOST + '/updateComp',
            method: 'post',
            responseType: 'json',
            data: data
          })
          .then(function(res) {
            console.log("success", res)
            if(self.requestData.length === 0){
                self.$message("修改成功")
                self.dialogFormVisible = false
                self.queryData("", self.currentPage)
                self.$router.push('flatcompany?routeId='+self.routeId)
                return
            }else{
                self.releaseEcologyComp(1)
            }
          })
          .catch(function(res) {
            console.log("success", res)
          })
        },
        compare(arr1, arr2) {
          var result = []
          for(let i = 0; i < arr1.length; i++) {
            var obj = arr1[i];
            var isExist = false;
            for(let j = 0; j < arr2.length; j++) {
              var aj = arr2[j]
              if(obj == aj) {
                isExist = true;
                break;
              }
            }
            if(!isExist) {
                result.push(obj)
            }
          }
          return result;
        }
    },
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
    
</style>