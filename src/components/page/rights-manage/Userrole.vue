<template>
  <div>
    <v-navbar :backManage="backManage"></v-navbar>
    <div @click="pageClick" v-loading="loading" element-loading-text="批量授权中">
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
          <li class="row_all" @click="userChange(item)" v-for="item in options">{{item.real_name || item.username}}</li>
          <div class="preloader" v-show="preloaderShow">
            <i class="el-icon-loading"></i>
          </div>
        </ul>
      </div>
    </div>
    <div class="u-btn">
      <el-button type="primary"  @click="userRoleRel">授权</el-button>
      <el-button type="info"  @click="batchRoleRel">批量授权</el-button>  
    </div>
    <div class="role-left">
      <el-tree
      :data="tissues"
      show-checkbox
      node-key="oldId"
      :check-strictly="true"
      default-expand-all
      ref="roleTree"
      :expand-on-click-node="false"
      id="role_id"
      @check-change="inquire">
    </el-tree>
  </div>
</div>
</div>
</template>
<script>
  import vNavbar from '../../common/Navbar.vue'
  let id = 1000;
  var defaultCheck = []
  export default {
    components:{
      vNavbar
    },
    data() {
      return {
        isIndeterminate: true,
        dataJson:{},
        tissues: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        branchName: "新增角色",//弹框标题
        dialogFormVisible:false,
        formLabelWidth: '120px',
        form: {
          name: '',
          desc: ''
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

        options: [],
        value: '',
        values:'',//唯一标示
        pageSize:10,//每页条数
        currentPage:1,//当前第几页
        beforeNode:[],
        statEach:0,
        cloneState:0,
        cloneValue:'',//复印一份值

        // select
        optionBoxShow:false,
        preloaderShow:false,//加载符显示
        state:0,
        icons:"caret-bottom",//尾部图标
        oneClick: true,
        checkUser: '',
        compCode: 'weining',
        loading: false,
        backManage:'0',
        sessionId: '',
      }
    },
    mounted(){
      let self = this;
      self.beforeNode = self.$refs.roleTree.getCheckedNodes()
      let storage = JSON.parse(localStorage.getItem('dataJson'));
      let uams = localStorage.getItem('uams')

      if(uams === self.PLAT_ADMIN) {
        self.sessionId = 'platform_admin'
      } else {
        self.sessionId = storage.sessionId
      }
      self.dataJson = storage;
      self.backManage = self.$route.path.split('/')[1]
      if(self.$route.query.second_code){
        self.compCode = Base64.decode(self.$route.query.second_code)
      }else{
        self.compCode = Base64.decode(self.$route.query.comp_code)
      }
      self.sys()
      self.userList()
    },
    watch:{
      'value':{  
        handler:function(val,oldval){
          let self = this;
          self.preloaderShow = true;
          if(val == oldval){
            self.cloneValue = ''
          }else{
            self.cloneValue = val;
            self.options = [];
            self.currentPage = 1;
            setTimeout(() => {
              self.userList();
            }, 1000)
          }
        },  
        deep:true//对象内部的属性监听，也叫深度监听  
      },
      '$route':{  
        handler:function(val,oldval){  
          let self = this;
          if(val.query.second_code){
            self.compCode = Base64.decode(val.query.second_code)
          }else{
            self.compCode = Base64.decode(val.query.comp_code)
          }
          self.beforeNode = self.$refs.roleTree.getCheckedNodes()
          let storage = JSON.parse(localStorage.getItem('dataJson'));
          self.dataJson = storage;
          self.tissues = [];
          self.options = [];
          self.value = '';
          self.backManage = val.path.split('/')[1]
          self.sys();
          self.userList();
        },  
        deep:true//对象内部的属性监听，也叫深度监听  
      },
    },
    methods: {
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
      },
      selectOne(info){
        let self = this;
        self.value = info.real_name;
        self.icons = "caret-bottom";
        self.optionBoxShow = !self.optionBoxShow;
      },
      handleFocus(){
        let self = this;
        self.icons = "caret-top";
        self.optionBoxShow = true;
        // self.userList();
      },
      handleBlur(e){
        let self = this;
        // self.icons = "caret-bottom";
        // self.optionBoxShow = false;
      },
      handleIconClick(e){
        let self = this;
        // self.optionBoxShow = !self.optionBoxShow;
        if(self.icons == "caret-bottom"){
          self.icons = "caret-top";
          self.optionBoxShow = true;
        }else{
          self.icons = "caret-bottom";
          self.optionBoxShow = false;
        }
      },
      handleSelect(item) {
      },
      append(store, data) {
        let self = this;
        self.branchName = "新增角色",
        self.states = 0;
        self.dialogFormVisible = true;
        self.currentData = data;
        self.currentStore = store;
      },
      sys(){//加载企业
        let self = this;
        self.$axios({
          url: "/UAMS/Auth/queryCompany",
          method: 'post',
          responseType: 'json',
          data: {
            'compCode':self.compCode,
          }
        })
        .then(function(response) {
          let list = response.data.data.company;
          list.dept_name = list.comp_name;
          list.oldId = list.id;
          list.id = "sys_6";
          list.parent_id = list.oldId;
          list.disabled = true;
          self.tissues.push(list);
          console.log("加载企业", self.tissues)
          /*self.ask();*/
          self.system()
          /*self.role();*/
        })
        .catch(function(response) {
          console.log("报错了")
        })
      },
      system() { //加载系统
        let self = this
        self.$axios({
          url: '/UAMS/Authenticate/do_system_query',
          method: 'post',
          responseType: 'json',
          data: {
            'compCode': self.compCode,
            'currentPage': 1,
            'date': new Date().getTime(),
            'pageSize': 10000,
            'sysName': '',
            'sessionId': self.sessionId
          }
        })
        .then(function(res) {
          if(res.data.success === true) {
            let list = res.data.data.list
            list.forEach(function(item, index) {
              item.parent_id = 'sys_6'
              item.disabled = true;
              item.dept_name = item.system_name
              self.tissues.push(item)
            })
            console.log("---------------", self.tissues)
            self.role()
          }
        })
      },
      ask() {//加载部门
        let self = this;
        self.$axios({
          url: "/UAMS/department/query_dep_list",
          method: 'post',
          responseType: 'json',
          data: {
            'compCode':self.compCode,
            "date":new Date().getTime(),
          }
        })
        .then(function(response) {
          let list = response.data.data;
          list.forEach(function(item, index){
            item.disabled = true;
            self.tissues.push(item);
          })
          self.role();//加载角色
        })
        .catch(function(response) {
          console.log("报错了")
        })
      },
      role() {//加载角色
        let self = this;
        self.$axios({
          url: "/UAMS/Authenticate/queryRole",
          method: 'post',
          responseType: 'json',
          data: {
            'compCode':self.compCode,
            'sessionId': self.sessionId
          }
        })
        .then(function(response) {
          let list = response.data.data;
          list.forEach(function(item, index){
            console.log("item", item)
            item.dept_name = item.roleName;
            item.oldId = item.id;
            item.parent_id = item.code;
            item.id = id++;
            self.tissues.push(item);
          })
          console.log("加载角色后", self.tissues)
          let jsonData = eval(self.tissues);
          let arr = self.transData(jsonData, 'id', 'parent_id', 'children');
          self.tissues = arr;
        })
        .catch(function(response) {
          console.log("报错了")
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
      registerCancel(){//关闭模态框
        let self = this;
        self.form = {
          name: '',
        };
        self.dialogFormVisible = false;
      },
      infiniteload(){//无限加载
        let self = this;
        self.preloaderShow = true;
        let data = {
          'username':self.value,
          // 'username':"王",
          'compCode':self.compCode,
          'pageSize':self.pageSize,
          'currentPage':self.currentPage
        }
        self.$axios({
          url: "/UAMS/user/list?pageSize="+self.pageSize+"&currentPage="+data.currentPage,
          method: 'post',
          responseType: 'json',
          data: data
        })
        .then(function(res) {
          if(res.status == 200){
            if(res.data.success){
              let list = res.data.data.data
              if(list.length != 0){
                list.forEach(function(item, index){
                  self.options.push(item)
                })
                self.preloaderShow = false;
              }else{
                self.preloaderShow = false;
              }
            }
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      userList() { //获取企业下用户
        let self = this;
        /*self.preloaderShow = true;*/
        let data = {
          'username':self.value,
          // 'username':"王",
          'compCode':self.compCode,
          'pageSize':self.pageSize,
          'currentPage':self.currentPage
        }
        self.$axios({
          url: "/UAMS/user/list?pageSize="+self.pageSize+"&currentPage="+data.currentPage,
          method: 'post',
          responseType: 'json',
          data: data
        })
        .then(function(res) {
          if(res.status == 200){
            if(res.data.success){
              let list = res.data.data.data
              if(list.length != 0){
                self.options = [];
                list.forEach(function(item, index){
                  self.options.push(item)
                })
                self.preloaderShow = false;
              }else{
                self.options = []
                self.options.push({real_name: "暂无用户"});
                self.preloaderShow = false;
              }
            }
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      userChange(userId) { //选择不同的用户
        let self = this
        console.log("userId", userId)
        self.checkUser = userId
        self.cloneState = 1;
        self.currentPage = 1;
        self.cloneValue = '';

        defaultCheck = [];
        self.value = userId.real_name || userId.username;
        self.icons = "caret-bottom";
        self.optionBoxShow = !self.optionBoxShow;
        self.values = userId.id;
        self.icons = "caret-bottom";
        self.optionBoxShow = false;
        if(!userId.id) {
          return
        }
        self.$axios({
          url: '/UAMS/Authenticate/queryRoleByUserId',
          method: 'post',
          responseType: 'json',
          data: {
            'compCode':self.compCode,
            'userId': userId.id,
            'sessionId': self.sessionId
          }
        })
        .then(function(res) {
          let list = res.data.data
          if(list.length == 0) {
            self.$refs.roleTree.setCheckedNodes(defaultCheck)
            self.beforeNode = self.$refs.roleTree.getCheckedNodes()
            return
          }
          function DefaultCheckStory(oldId, label, relId) {
            this.oldId = oldId
            this.label = label
            this.relId = relId
          }

          list.forEach(function(item, index) {
            defaultCheck.push(new DefaultCheckStory(item.id, item.roleName, item.relId))
          })
          self.$refs.roleTree.setCheckedNodes(defaultCheck)

          self.beforeNode = self.$refs.roleTree.getCheckedNodes()
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      compare(arr1, arr2) {
        var result = [];
        for(var i = 0; i < arr2.length; i++){
          var obj = arr2[i];
          var num = obj.oldId;
          var isExist = false;
          for(var j = 0; j < arr1.length; j++){
            var aj = arr1[j];
            var n = aj.oldId;
            if(n == num){
              isExist = true;
              break;
            }
          }
          if(!isExist){
            result.push(obj);
          }
        }
        return result
      },
      userRoleRel() {
        let self = this
        let roleTree = self.$refs.roleTree.getCheckedNodes()
        console.log("===========", self.beforeNode, roleTree)

        if(!self.value) {
          self.$message("请先选择用户")
          return
        }

        function DatasStory(roleId, userId, type, id, sessionId, compCode) {
          this.roleId = roleId
          this.userId = userId
          this.type = type
          this.id = id
          this.sessionId = sessionId
          this.compCode = compCode
        }
        let addArr = self.compare(self.beforeNode, roleTree)
        let delArr = self.compare(roleTree, self.beforeNode)
        console.log("addArr", addArr, "delArr", delArr)
        var roleUserDatas = new Array()
        if(addArr.length === 0 && delArr.length === 0) {
          self.$message("你还没有进行任何修改")
          return
        }
        for (let index in addArr) {
          roleUserDatas.push(new DatasStory(addArr[index].oldId, self.values, '1','',self.sessionId, self.compCode))
        }
        for(let index in delArr) {
          for(let index1 in defaultCheck) {
            if(delArr[index].oldId == defaultCheck[index1].oldId) {
              delArr[index].id = defaultCheck[index1].relId
            }   
          }
        }
        for(let index in delArr) {
          roleUserDatas.push(new DatasStory(delArr[index].oldId, self.values, '0', delArr[index].id, self.sessionId, self.compCode))
        }
        self.$axios({
          url: '/UAMS/Authenticate/ajax/do_role_user_rel',
          method: 'post',
          responseType: 'json',
          data: roleUserDatas
        })
        .then(function(res) {
          if(res.data.success === false) {
            self.$message(res.data.msg)
          } else {
            self.$message("授权成功")
            self.userChange(self.checkUser)
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      batchRoleRel() { //批量授权
        let self = this
        let roleTree = self.$refs.roleTree.getCheckedNodes()
        if(roleTree.length === 0) {
          self.$message.warning("请至少选择一个角色进行")
          return
        }
        if(roleTree.length > 1) {
          self.$message.warning("批量授权只能选择一个角色")
          return
        }
        console.log(roleTree)
        self.loading = true
        self.$axios({
          url: '/UAMS/role/volumeLicensees',
          method: 'post',
          responseType: 'json',
          data: {
            compCode: self.compCode,
            roleId: roleTree[0].oldId
          }
        })
        .then(function(res) {
          console.log("success", res)
          if(res.data.success) {
            self.$message("批量授权成功")
          } else {
            self.$message.warning(res.data.message)
          }
          self.loading = false
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      pageClick() {
        let self = this
        if(self.icons == "caret-top"){
          self.icons = "caret-bottom"
          self.optionBoxShow = false
        }
      },
      show() {
      },
      inquire() {
        let self = this
          /*self.beforeNode = self.$refs.roleTree.getCheckedNodes()
          console.log("self.beforeNode", self.beforeNode)*/
        }
      }
    };
    </script>
    <style scoped>
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
      .u-batch {
        width: 180px;

      }
      .box{
        position: relative;
        max-width: 200px;
      }
      .u-btn {
        margin-top: -40px;
        margin-left: 220px;
      }
      .u-btn button {
        width: 180px;
      }
      .option_box{
        position: absolute;
        top: 44px;
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