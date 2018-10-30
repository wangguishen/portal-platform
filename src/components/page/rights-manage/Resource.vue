<template>
    <div>
        <v-navbar></v-navbar>
        <!-- <el-select v-model="value" placeholder="请选择" style="margin-bottom: 15px">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select> -->
        <el-tree
            :data="tissues"
            empty-text="暂无系统，请注册系统"
            show-checkbox
            node-key="id"
            ref="tree"
            default-expand-all
            :check-strictly = "true"
            :expand-on-click-node="false"
            :render-content="renderContent"
            @check-change="inquire"
            id="box_tree"
            :filter-node-method="filterNode"
            >
        </el-tree>
        <el-dialog :title="branchName" @close="registerCancel('form')" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="formRules" ref="form">
                <el-form-item label="模块名称：" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" placeholder="请输入模块名称" auto-complete="off" class="ipt_wid"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="registerCancel('form')">取 消</el-button>
                <el-button type="primary" @click="appendSure('form')">确 定</el-button>
            </div>
        </el-dialog>
        <div class="select_box" v-show = "moduleRelevanceVisible">
            <el-checkbox id="checkboxId" ref="checkboxId" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" id="select_case">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
            <div style="text-align: center;margin-top:20px;">
                <el-button type="primary" class="model_add" @click="moduleAdd()">模块关联功能</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import vNavbar from '../../common/Navbar.vue'
let id = 1000;
export default {
    components: {
      vNavbar
    },
    data() {
        return {
            dataJson:{},
            uams:'',
            tissues: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            branchName: "新增模块",//弹框标题
            dialogFormVisible:false,
            formLabelWidth: '120px',
            form: {
                name: '',
                desc: ''
            },
            formRules:{
                name: [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
            },
            changeFrom:{
                name: '',
                desc: '',//描述
            },//临时更换from
            currentData:{},//当前添加的数据
            currentStore:{},
            maxId:0,
            states:0,//状态
            sysId: "",//第二级

            checkAll: false,//是不是全选
            checkedCities: [],//选中的
            cities: [],//操作模板的集合
            isIndeterminate: false,//checkbox 的不确定状态，全选效果
            cityOptions : [],
            showfalse:false,
            checkedNodes:[],
            isClickChangeCheckbox :false,
            moduleRelevanceVisible : false,
            intrinsicity:[],//原有的操作备份
            allCity:[],//所有的数据
            citiesAffix:[],//附件
            sysItem:{},
            options: [{
                value: '海',
                label: '海',
            }, {
                value: '宝',
                label: '宝',
            }, {
                value: '娃',
                label: '娃'
            }],
            value: '',
            // checkeded:false,

            doubleAllCity:[],//二次备份所有数据
            doubleChecked:[],//备份已经选择的
            doubleIntrins:[],//备份已经有的数据
            objString:{},
            objstate:0
        }
    },
    mounted(){
        let self = this;
        let storage = JSON.parse(localStorage.getItem('dataJson'));
        self.dataJson = storage;
        self.uams = localStorage.getItem('uams');
        if(self.$route.query.second_code){
            self.dataJson.comp_code = Base64.decode(self.$route.query.second_code)
        }else{
            self.dataJson.comp_code = Base64.decode(self.$route.query.comp_code)
        }
        self.tissues = [];
        self.objstate = 0;
        self.comp();
        // self.firstBlood();
    },
    watch:{
        '$route':{  
            handler:function(val,oldval){  
                let self = this;
                let storage = JSON.parse(localStorage.getItem('dataJson'));
                self.dataJson = storage;
                self.uams = localStorage.getItem('uams');
                if(val.query.second_code){
                    self.dataJson.comp_code = Base64.decode(val.query.second_code)
                }else{
                    self.dataJson.comp_code = Base64.decode(val.query.comp_code)
                }
                self.tissues = [];
                self.objstate = 0
                self.comp();
                // self.firstBlood();
            },  
            deep:true//对象内部的属性监听，也叫深度监听  
        },
        'tissues':{
            handler:function(val, old){
                let self = this;
                if(val.length != 1) return
                if(val[0].children) return
                if(val[0].children.length === 0){
                    // self.moduleRelevanceVisible = false
                }else{
                    // self.moduleRelevanceVisible = true
                }
                
            },
            deep:true
        }
    },
    methods: {
        handleCheckAllChange(event) {//操作全选
            let self = this;
            self.checkedCities = event.target.checked ? self.cityOptions : [];
            self.isIndeterminate = false;            
        },
        handleCheckedCitiesChange(value) {//操作单选
            let self = this;
            let checkedCount = value.length;
            self.checkAll = checkedCount === self.cities.length;
            self.isIndeterminate = checkedCount > 0 && checkedCount < self.cities.length;
        },
        append(store, data) {
            let self = this;
            self.branchName = "新增模块",
            self.states = 0;
            self.dialogFormVisible = true;
            self.currentData = data;
            self.currentStore = store;
        },
        appendSure(form){//确定添加或者编辑
            let self = this;
            self.$refs[form].validate((valid) => {
                if (valid) {
                    if(self.states == 0){
                        let join = { id: self.maxId++, label: self.form.name, children: [] };
                        self.joinSure(join, 'xz', form)
                    }else if(self.states == 1){
                        let join = { id: self.maxId++, label: self.form.name, children: [] };
                        self.joinSure(join, 'bj', form)
                    }
                } else {
                    return false;
                }
            });
        },
        joinSure(join, state, form){//添加ajax
            let self = this;
            let data = {};
            let urls = "";
            if(state == 'xz'){
                urls = "/UAMS/Authenticate/ajax/do_add_module_for_system_app";
                self.form.random = self.getRandomString(10);
                data = [{
                    'id': -1,
                    'compCode': self.dataJson.comp_code,
                    'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
                    'moduleCode': self.form.random,
                    'moduleName': self.form.name,
                    'parentId': self.currentData.id,
                    'systemId': self.currentData.system_id || self.currentData.id
                }]
            }else if(state == 'bj'){
                urls = "/UAMS/materiel/ajax/do_add_module_for_system_app";
                data = [{
                    'id': self.currentData.id,
                    'compCode': self.dataJson.comp_code,
                    'moduleCode': self.getRandomString(10),
                    'moduleName': self.form.name,
                    'parentId': self.currentData.parent_id,
                    'systemId': self.currentData.system_id
                }]
            }else if(state == 'sc'){
                urls = "/UAMS/Authenticate/ajax/do_del_module_for_system_app";
                data = [{
                    'compCode':self.dataJson.comp_code,
                    // 'systemId':self.currentData.system_id,
                    'id': self.currentData.id,
                    'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
                }]
            }
            console.log(data)
            self.$axios({
                url: urls,
                method: 'post',
                responseType: 'json',
                data:data
            })
            .then(function(response) {
                console.log(response)
                if(response.data.success){
                    if(state == 'xz'){
                        let item = response.data.data;
                        item.label = self.form.name;
                        item.module_name = self.form.name;
                        item.dept_name = self.form.name;
                        self.currentStore.append(item, self.currentData);
                        self.$refs[form].resetFields();
                        self.dialogFormVisible = false;
                    }else if(state == 'bj'){
                        self.currentData.label = self.form.name;
                        self.currentData.module_name = self.form.name;
                        self.currentData.dept_name = self.form.name;
                        self.form = {};
                        self.$refs[form].resetFields();
                        self.dialogFormVisible = false;
                    }else if(state == 'sc'){
                        self.currentStore.remove(self.currentData);
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        self.form = {};
                        self.dialogFormVisible = false;
                    }
                    self.comp()
                }else{
                    self.$message({
                        type: 'warning',
                        message: response.data.msg
                    });
                }
            })
            .catch(function(response) {
                console.log(response)
                console.log("报错了")
            })
        },
        edit(store, data) {//编辑部门
            let self = this;
            self.branchName = "编辑模块",
            self.states = 1;
            self.form.name = data.label;
            self.form.desc = data.description;
            self.changeFrom.name = data.label;
            self.changeFrom.code = data.dept_code;
            self.dialogFormVisible = true;
            self.currentData = data;
            self.currentStore = store;
        },
        remove(store, data) {//删除部门
            let self = this;
            self.$confirm('此操作将永久删除该模块, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.currentData = data;
                self.currentStore = store;
                let join = { id: self.maxId++, label: self.form.name, children: [] };
                self.joinSure(join, 'sc')
            }).catch(() => {
                self.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        comp(){//加载企业
            let self = this;
            self.tissues = [];
            self.$axios({
                url: "/UAMS/Auth/queryCompany",
                method: 'post',
                responseType: 'json',
                data: {
                    'compCode':self.dataJson.comp_code,
                }
            })
            .then(function(res) {
                console.log("加载企业",res)
                if(res.data.success){
                    let list = res.data.data.company;
                    self.sysId = list.id;
                    self.$set(list, 'label', list.comp_name)
                    self.$set(list, 'dept_name', list.comp_name)
                    self.$set(list, 'children', [])
                    self.$set(list, 'disabled', true)
                    // self.$set(list, 'parent_id', 'sys_'+list.id)
                    self.tissues.push(list);
                    console.log('1',self.tissues)
                    self.sys();
                }else{
                    console.log("后台返回错误")
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        moduleRole() {//加载三级
            let self = this;
            self.$axios({
                url: "/UAMS/role/queryRole",
                method: 'post',
                responseType: 'json',
                data: {
                    'compCode':self.dataJson.comp_code,
                }
            })
            .then(function(response) {
                console.log(response.data.data)
                let list = response.data.data;
                list.forEach(function(item, index){
                    item.dept_name = item.roleName;
                    item.oldId = item.id;
                    item.parent_id = item.dept_code;
                    item.id = id++;
                    self.tissues.push(item);
                })
                console.log(self.tissues)
                let jsonData = eval(self.tissues);
                let arr = self.transData(jsonData, 'id', 'parent_id', 'children');
                self.tissues = arr;
                console.log(self.tissues)
            })
            .catch(function(response) {
                console.log("报错了")
            })
        },
        modu() {//加载模块
            let self = this;
            self.$axios({
                url: "/UAMS/Authenticate/ajax/do_find_module_by_comp",
                method: 'post',
                responseType: 'json',
                data: {
                    'compCode':self.dataJson.comp_code,
                    'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
                }
            })
            .then(function(response) {
                console.log(response)
                if(response.data.success){
                    let list = JSON.parse(response.data.data);
                    if(list.length == 0){
                        // self.moduleRelevanceVisible = false;
                    }else{
                        list.forEach(function(item, index){
                            if(isNaN(item.parent_id)){
                                item.old_oarent_id = item.parent_id;
                                item.parent_id = item.parent_id.substring(4)
                            }
                            item.label = item.module_name;
                            item.dept_name = item.module_name;
                            self.tissues.push(item);
                        })
                        let jsonData = eval(self.tissues);
                        let arr = self.transData(jsonData, 'id', 'parent_id', 'children');
                        self.tissues = arr;
                        // self.moduleRelevanceVisible = true;
                    }
                }else{
                    console.log("后台服务器错误")
                }
            })
            .catch(function(response) {
                console.log("报错了")
            })
        },
        sys(){//加载系统
            let self = this;
            self.$axios({
                url: "/UAMS/Authenticate/do_system_query",
                method: 'post',
                responseType: 'json',
                data: {
                    'compCode':self.dataJson.comp_code,
                    'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
                }
            })
            .then(function(res) {
                console.log("加载系统",res)
                if(res.data.success){
                    let list = res.data.data.list;
                    if(list.length == 0){
                        // self.moduleRelevanceVisible = false;
                    }else{
                        let list = res.data.data.list;
                        list.forEach(function(item, index){
                            item.label = item.system_name;
                            item.dept_name = item.system_name;
                            item.children = [];
                            item.disabled = true;
                            item.parent_id = self.sysId;
                            self.tissues.push(item)
                        })
                        self.modu();
                    }
                }else{
                    console.log("后台返回错误")
                }
            })
            .catch(function(res) {
                console.log("error", res)
            })
        },
        transData(a, idStr, pidStr, childrenStr) { 
            let r = [], hash = {}, id = idStr, pid = pidStr, children = childrenStr, i = 0, j = 0, len = a.length;
            for (; i < len; i++) {
                a[i].label = a[i].dept_name;
                if(a[i].id > self.maxId){
                    self.maxId = a[i].id;
                }
                hash[a[i][id]] = a[i];
            } 
            for (; j < len; j++) { 
                let aVal = a[j], hashVP = hash[aVal[pid]]; 
                if (hashVP) { 
                    !hashVP[children] && (hashVP[children] = []); 
                    hashVP[children].push(aVal); 
                } else { 
                    r.push(aVal); 
                } 
            } 
            return r;
        },
        registerCancel(form){//关闭模态框
            let self = this;
            self.$refs[form].resetFields();
            self.form = {
                name: '',
                desc: ''
            };
            self.dialogFormVisible = false;
        },
        getRandomString(len) {//随机字符串
            len = len || 32;
            let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
            let maxPos = chars.length;
            let pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        firstBlood(obj) {//加载当前所有系统下所有功能
            let self = this;
            self.$axios({
                url: "/UAMS/Authenticate/ajax/do_query_action?currentPage=1&pageSize=10000",
                method: 'post',
                responseType: 'json',
                data: {
                    'compCode':self.dataJson.comp_code,
                    'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
                    'actionName':'',
                    'systemId':parseInt(obj.parent_id)
                }
            })
            .then(function(response) {
                console.log("所有模块",response)
                let list = response.data.data.list;
                self.cities = []
                self.cityOptions = []
                // if(self.objstate == 0){
                    list.forEach(function(item, index){
                        item.type = 0;
                        self.cities.push(item.action_name)
                        self.cityOptions.push(item.action_name)
                    })
                // }
                self.allCity = list;
                self.operate(obj)
            })
            .catch(function(response) {
                console.log("报错了")
            })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        inquire(data, checked, prep){
            let self = this;
            if(checked){
                let sex = self.$refs.tree.getCheckedKeys();
                self.$refs.tree.setCheckedKeys([data.id])
                self.checkedNodes = [];
                self.checkedNodes.push(data);
                self.isIndeterminate = false;
                // self.checkeded = false;
                self.checkAll = false;
                self.moduleRelevanceVisible = true;
                self.firstBlood(data)
                // self.operate(data)
            }else{
                self.isIndeterminate = false;
                // self.checkeded = false;
                self.checkAll = false;
                self.checkedCities = [];
            }
        },
        operate(obj){//企业操作
            let self = this;
            self.objString = obj
            self.$axios({
                url: "/UAMS/Authorization/ajax/do_find_dept_role_module_action_for_authorization",
                method: 'post',
                responseType: 'json',
                data: {
                    'moduleId':obj.id,
                }
            })
            .then(function(response) {
                console.log("当前模块所有的操作",response)
                if(response.data.success){
                    if(response.data.data.length == 0){
                        self.checkedCities = [];
                        self.intrinsicity = [];
                    }else{
                        self.checkedCities = [];
                        self.intrinsicity = [];
                        self.allCity.forEach(function(item, index){
                            item.type = 0;
                        })
                        let list = response.data.data;
                        list.forEach(function(item, index){
                            item.type = 1;
                            self.checkedCities.push(item.action_name)
                        })
                        self.intrinsicity = list;
                        self.$nextTick(()=>{
                            console.log(self.checkedCities.length)
                            console.log(self.allCity.length)
                            if(self.checkedCities.length == self.allCity.length){
                                self.isIndeterminate = false;//控制全选显示隐藏
                                self.checkAll = true;
                            }else{
                                self.isIndeterminate = true;//控制全选显示隐藏
                                self.checkAll = false;
                            }
                            
                        })
                    }
                }else{
                    console.log("后台数据返回错误")
                }
            })
            .catch(function(response) {
                console.log("报错了")
            })
        },
        moduleAdd(){//关联模块
            let self = this;
            let doubleIntrins = [];
            let datas = [];
            let submitArr = [];
            let checkBox = [];//第一步  把选中的转化为数组对象
            self.doubleChecked = [];
            self.doubleIntrins = [];
            self.doubleAllCity = [];
            self.checkedCities.forEach(function(item, index){
                self.doubleChecked.push(item);//备份选中的数组
            })
            self.intrinsicity.forEach(function(item, index){
                self.doubleIntrins.push(item);//备份已经有的数组对象
                doubleIntrins.push(item)
            })
            console.log(self.allCity)
            self.allCity.forEach(function(item, index){
                console.log(item.type)
                self.doubleAllCity.push(item);//备份全部的操作数据
            })
            if(self.checkedNodes.length == 0){
                self.$message({
                    message: '请选择模块',
                    type: 'warning'
                });
            }else{
                
                // let deleteArr = [];//删除的数组
                // let addArr = [];//新增的数组
                // 拿到选中的整体数组对象
                for(let i=0;i<self.doubleAllCity.length;i++){
                    for(let k=0;k<self.doubleChecked.length;k++){
                        if(self.doubleAllCity[i].action_name == self.doubleChecked[k]){
                            self.doubleAllCity[i].type = 1;
                            checkBox.push(self.doubleAllCity[i])
                        }
                    }
                }
                console.log("checkBox1",checkBox)
                console.log("doubleAllCity1",self.doubleAllCity)
                // 选中的和已经有的进行对比
                for(let i=0;i<checkBox.length;i++){
                    for(let k=0;k<self.doubleIntrins.length;k++){
                        if(checkBox[i].id == self.doubleIntrins[k].id && checkBox[i].type == self.doubleIntrins[k].type){
                            self.doubleIntrins.splice(k,1)
                        }
                    }
                }
                for(let k=0;k<doubleIntrins.length;k++){
                    for(let i=0;i<checkBox.length;i++){
                        if(checkBox[i].id == doubleIntrins[k].id && checkBox[i].type == doubleIntrins[k].type){
                            checkBox.splice(i,1);
                        }
                    }
                }
                console.log("checkBox2",checkBox)
                console.log("doubleAllCity2",self.doubleAllCity)
                self.doubleIntrins.forEach(function(item, index){
                    item.type = 0;
                })
                checkBox.forEach(function(item, index){
                    item.type = 1;
                })
                let isDel = false
                self.$nextTick(()=>{
                    submitArr = self.doubleIntrins.concat(checkBox);
                    console.log("===============", self.checkedNodes)
                    submitArr.forEach(function(item, index){
                        console.log("item = ", item)
                        let data = {
                            moduleId:self.checkedNodes[0].id,
                            systemId:self.checkedNodes[0].system_id,
                            compCode:item.comp_code,
                            type:item.type,//0或者1  取消或保存
                            actionId:item.id,
                            actionName:item.action_name,
                            resourceId: item.resource_id,
                            'sessionId':self.uams=='plat_admin'?self.dataJson.account:self.dataJson.sessionId,
                        }
                        if(item.type === 0) {
                            isDel = true
                        }
                        datas.push(data)
                    })

                    if(datas.length === 0) {
                        self.$message("你还没有进行任何修改")
                        return
                    }

                    if(isDel) {
                        self.$confirm('你有删除操作,删除模块关联功能将同时删除角色所拥有的功能,是否确定删除?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }, 300).then(() => {
                            self.saveModePermission(datas)
                        }).catch(() => {
                            self.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                            return
                        })
                    } else {
                        self.saveModePermission(datas)
                    }
                })
            }
        },
        verify(){
            let self = this;
            let box_tree = document.getElementById('box_tree');
            let select = box_tree.getElementsByClassName('is-checked');
            for(let k=0;k<select.length;k++){
                if(self.hasClass(select[k],'is-checked')){  
                    self.removeClass(select[k],'is-checked');
                }else{  
                    self.addClass(select[k],'is-checked');  
                }
            }
        },
        /*<el-button size="mini" icon="plus" on-click={ () => this.append(store, data) }></el-button>*/
        renderContent(h, { node, data, store }) {
            let self = this;
            if("parent_id" in data){
                 if(data.parent_id == self.sysId){
                    return (
                        <span>
                            <span>
                                <span>{node.label}</span>
                            </span>
                            <span style="float: right; margin-right: 84px; display: block;">
                                <el-button size="mini" icon="plus" on-click={ () => this.append(store, data) }></el-button>
                            </span>
                        </span>
                    );
                }else{
                    return (
                        <span>
                            <span>
                                <span>{node.label}</span>
                            </span>
                            <span style="float: right; margin-right: 52px; display: block;">
                                <el-button size="mini" icon="edit" on-click={ () => this.edit(store, data)}></el-button>
                                <el-button size="mini" icon="delete2" on-click={ () => this.remove(store, data) }></el-button>
                            </span>
                        </span>
                    );   
                }
            }else{
                return (
                    <span>
                        <span>
                            <span>{node.label}</span>
                        </span>
                    </span>
                );
            }
        },
        saveModePermission(datas) {
            let self = this
             self.$axios({
                url: "/UAMS/permission/ajax/do_action_is_save_module_for_permission",
                method: 'post',
                responseType: 'json',
                data: datas
            })
            .then(function(response) {
                console.log(response)
                if(response.data.success){
                    self.$message({
                        type: 'success',
                        message: '已修改模块关联功能完成'
                    });
                    self.doubleChecked = [];
                    self.doubleIntrins = [];
                    self.doubleAllCity = [];
                    self.operate(self.objString)
                    // self.objstate = 1;
                    // self.firstBlood()
                }else{
                    self.$message({
                        type: 'warning',
                        message: '修改模块关联功能失败'
                    });
                }
            })
            .catch(function(response) {
                console.log("报错了")
            })   
        }
    }
};
</script>
<style scoped>
    .ipt_wid{
        width: 34%;
    }
    .area_wid{
        width: 60%;
    }
    .select_box{
        margin-top: 20px;
        padding:20px;
        background: #fff;
    }
    .select_box .el-checkbox{
        margin-left:0;
        margin-right:15px;
    }
    .model_add{
        margin-top:20px;
    }
</style>