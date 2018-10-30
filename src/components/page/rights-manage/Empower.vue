<template>
  <div>
    <v-navbar></v-navbar>
    <div>
      <el-button type="primary" class="empower-button" @click="empower">授权</el-button>
    </div>
    <el-tree
      :data="tissues"
      show-checkbox
      node-key="id"
      :check-strictly="true"
      default-expand-all
      :expand-on-click-node="false"
      ref="roleTree"
      class="el-roletree"
      v-loading.body="loading"
      @check-change="inquire"
      id="box_tree">
    </el-tree>
    <el-tree
      :data="reTissues"
      show-checkbox
      node-key="resource_id"
      :check-strictly="false"
      ref="resourceTree"
      @check-change="inquire1"
      default-expand-all
      :expand-on-click-node="false"
      class="el-retree"
      v-loading.body="loading"
      id="resource_tree">
    </el-tree>
</div>
</template>
<script>
  import vNavbar from '../../common/Navbar.vue'
  let id = 1000;
  var defaultCheck = []
  export default {
    components: {
      vNavbar
    },
    data() {
      return {
        roleIs: false,
        resourceIs: false,
        tempHeight: 0,

        dataJson:{},
        tissues: [],
        reTissues: [],
        defaultProps: {
         children: 'children',
         label: 'label'
       },
       dialogFormVisible:false,
       formLabelWidth: '120px',
       sessionId: '',
       parentIds: [],       
       form: {
        name: '',
        desc: ''
      },
      sysId: '',
      changeFrom:{
        name: '',
            desc: '',//描述
          },//临时更换from
          currentData:{},//当前添加的数据
          currentStore:{},
          maxId:0,
          states:0,//状态
          sysId: "",//第二级
          loading: false,

          beforeNode: [],
          checkbox: false,

          timer1: null,
          timHei1: null,
          timHei2: null,
        }
      },
      created() {
        console.log("go created method")
      },
      mounted(){
        let self = this;
        self.beforeNode = self.$refs.resourceTree.getCheckedNodes()
        let storage = JSON.parse(localStorage.getItem('dataJson'));
        self.dataJson = storage

        let uams = localStorage.getItem('uams')

        if(uams === self.PLAT_ADMIN) {
          self.sessionId = 'platform_admin'
        } else {
          self.sessionId = storage.sessionId
        }

        if(self.$route.query.second_code){
          self.dataJson.comp_code = Base64.decode(self.$route.query.second_code)
        }else{
          self.dataJson.comp_code = Base64.decode(self.$route.query.comp_code)
        }
        self.sys()
        self.reSys()
        console.log("self.reTissues", self.reTissues)
      },
      updated() {
      /*let self = this
      let boxTree = document.getElementById("box_tree")
      let boxHeight = boxTree.clientHeight
      let resourceTree = document.getElementById("resource_tree")
      let resourceHeight = resourceTree.clientHeight

      self.tempHeight = boxHeight > resourceHeight ? boxHeight : resourceHeight
      console.log("boxHeight", boxHeight,"resourceHeight", resourceHeight, "self.tempHeight", self.tempHeight)
      if(boxHeight > resourceHeight) {
        resourceTree.style.height = boxHeight + 'px';
      } else if(resourceHeight > boxHeight) {
        boxTree.style.height = resourceHeight + 'px';
      }*/
    },
    watch:{
      '$route': {  
        handler:function(val,oldval) {
          let self = this;
          self.beforeNode = self.$refs.resourceTree.getCheckedNodes()
          let storage = JSON.parse(localStorage.getItem('dataJson'));
          self.dataJson = storage;
          if(val.query.second_code){
            self.dataJson.comp_code = Base64.decode(val.query.second_code)
          }else{
            self.dataJson.comp_code = Base64.decode(val.query.comp_code)
          }
          self.tissues = [];
          self.reTissues = [];
          self.sys();
          self.reSys();
        },  
        deep:true//对象内部的属性监听，也叫深度监听  
      },
    },
    methods: {
      node(data, node, state, status){
        let self = this;
        let closeBox = state.$el.offsetHeight;
        let closeLast = state.$el.lastChild.offsetHeight
        let boxTree = document.getElementById("box_tree")
        let boxHeight = boxTree.clientHeight
        let resourceTree = document.getElementById("resource_tree");
        let resourceHeight = resourceTree.clientHeight
        let boxTree2 = document.getElementById("box_tree").firstChild;
        let resourceTree2 = document.getElementById("resource_tree").firstChild;
        let boxHeight2 = boxTree2.clientHeight
        let resourceHeight2 = resourceTree2.clientHeight
        let rightBad;
        if(status == 0){
          rightBad = resourceHeight2-closeLast;
          let k = 0;
          self.timHei1 = setInterval(function(){
            let resource = document.getElementById("resource_tree").firstChild;
            let closeLast = state.$el.lastChild.offsetHeight
            let resHei= resource.clientHeight
            let height = resourceTree2 - resHei;
            if(closeLast == 0){
              clearInterval(self.timHei1)
              self.timHei1 = null
            }else{
              k = closeLast;
              if(boxHeight2 > rightBad){
                if(resHei == boxHeight2 || resHei < boxHeight2){
                  boxTree.style.height = boxHeight2 + 'px'
                  resourceTree.style.height = boxHeight2 + 'px'
                }else{
                  boxTree.style.height = resHei + 'px'
                  resourceTree.style.height = resHei + 'px'
                }
              }   
            } 
          },20)
        }else{
          let k = 0;
          self.timHei2 = setInterval(function(){
            let resource = document.getElementById("resource_tree").firstChild;
            let closeLast = state.$el.lastChild.offsetHeight
            let resHei= resource.clientHeight
            let height = resHei - resourceTree2;
            k++
            if(k == closeLast){
              clearInterval(self.timHei2)
              self.timHei2 = null
            }else{
              k = closeLast;
              rightBad = resourceHeight2+closeLast;
              if(boxHeight2 > rightBad){
                boxTree.style.height = boxHeight2 + 'px'
                resourceTree.style.height = boxHeight2 + 'px'
              }else{
                boxTree.style.height = resHei + 'px'
                resourceTree.style.height = resHei + 'px'
              }   
            }
          }, 20)
        }
      },
      openNode(data, node, state){
        let self = this;
        clearInterval(self.timHei1)
        self.timHei1 = null
        self.node(data, node, state, 1)
      },
      closeNode(data, node, state){
        let self = this;
        clearInterval(self.timHei2)
        self.timHei2 = null
        self.node(data, node, state, 0)
      },
      sys(){//加载企业
        let self = this;
        self.$axios({
          url: "/UAMS/Auth/queryCompany",
          method: 'post',
          responseType: 'json',
          data: {
            'compCode':self.dataJson.comp_code,
          }
        })
        .then(function(response) {
          console.log("response", response)
          let list = response.data.data.company;
          list.dept_name = list.comp_name;
          list.oldId = list.id;
          list.id = "sys_6";
          list.parent_id = list.oldId;
          list.disabled = true;
          self.tissues.push(list);
          // self.ask();
          //self.role()
          self.system()
        })
        .catch(function(response) {
          console.log("报错了")
        })
      },
      system() { //加载系统
        console.log("go system methods")
        let self = this
        self.$axios({
          url: '/UAMS/Authenticate/do_system_query',
          method: 'post',
          responseType: 'json',
          data: {
            'compCode': self.dataJson.comp_code,
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
      role() {//加载角色
        console.log("go role methods")
        let self = this;
        self.$axios({
          url: "/UAMS/Authenticate/queryRole",
          method: 'post',
          responseType: 'json',
          data: {
            'compCode':self.dataJson.comp_code,
            'sessionId': self.sessionId
          }
        })
        .then(function(response) {
          let list = response.data.data;
          list.forEach(function(item, index){
            item.dept_name = item.roleName;
            item.oldId = item.id;
            item.parent_id = item.code;
            item.id = id++;
            item.disabled = false;
            self.tissues.push(item);
          })
          let jsonData = eval(self.tissues);
          let arr = self.transData(jsonData, 'id', 'parent_id', 'children');
          self.tissues = arr;
          self.checkbox = true
        })
        .catch(function(response) {
          console.log("报错了")
        })
        self.$nextTick(() => {
          self.roleIs = true
          if(self.roleI && self.resourceIs) {
            self.setHeight()
          }
        })
      },
      setHeight() {
        let self = this
        let boxTree = document.getElementById("box_tree")
        if(boxTree) {
          let boxHeight = boxTree.clientHeight
          console.log(boxHeight)
          let resourceTree = document.getElementById("resource_tree")
          if(resourceTree) {
            let resourceHeight = resourceTree.clientHeight
            self.tempHeight = boxHeight > resourceHeight ? boxHeight : resourceHeight
            console.log("self.tempHeight", self.tempHeight, "boxHeight", boxHeight, "resourceHeight", resourceHeight)
            boxTree.style.height = self.tempHeight + 'px'
            resourceTree.style.height = self.tempHeight + 'px'
          }
        }
      },
      ask() {//加载部门
        let self = this;
        self.$axios({
          url: "/UAMS/department/query_dep_list",
          method: 'post',
          responseType: 'json',
          data: {
            'compCode':self.dataJson.comp_code,
            "date":new Date().getTime(),
          }
        })
        .then(function(response) {
          console.log(response)
          let list = response.data.data;
          list.forEach(function(item, index){
            item.label = item.dept_name;
            item.oldId = item.id;
            item.disabled = true;
            self.tissues.push(item);
          })
          self.role();///加载角色
        })
        .catch(function(response) {
          console.log("报错了")
        })
      },
      reSys() { //加载资源
        let self = this
        self.$axios({
          url: "/UAMS/Authenticate/do_system_query",
          method: 'post',
          responseType: 'json',
          data: {
            'compCode':self.dataJson.comp_code,
            'sessionId': self.sessionId,
            'systemId': self.sysId
          }
        })
        .then(function(res) {
          if(res.data){
            let list = res.data.data.list;
            self.reTissues = []
            list.forEach(function(item, index){
              let id = 'sys_'+String(item.id);
              item.label = item.system_name;
              item.dept_name = item.system_name;
              item.children = [];
              item.disabled = true;
              item.id = id;
              self.reTissues.push(item);
            })
            self.reAsk();
          }
        })
        .catch(function(res) {
          console.log("error", res)
        })
      },
      reAsk() {//加载模块
        let self = this;
        var obj = new Array
        function ObjStory(label, dept_name, id, parent_id, resource_id) {
          this.label = label
          this.dept_name = dept_name
          this.id = id
          this.parent_id = parent_id
          this.resource_id = resource_id
        }
        self.$axios({
          url: "/UAMS/Authenticate/ajax/do_find_module_by_comp",
          method: 'post',
          responseType: 'json',
          data: {
            'compCode':self.dataJson.comp_code,
            "date":new Date().getTime(),
            "sessionId": self.sessionId,
            "systemId": self.sysId
          }
        })
        .then(function(response) {
          console.log("res",response)
          let list = JSON.parse(response.data.data);
          let obj1 = [{
            label:"添加操作",
            dept_name:"添加操作",
            id:88,
            parent_id:18
          },{
            label:"删除操作",
            dept_name:"删除操作",
            id:88,
            parent_id:16
          }]
          list.forEach(function(item, index){
            if(isNaN(item.parent_id)){
              item.old_oarent_id = item.parent_id;
              item.parent_id = item.parent_id.substring(4)
            }
            item.label = item.module_name;
            // item.disabled = true;
            item.dept_name = item.module_name;
            self.reTissues.push(item);
          })
          self.reTissues.forEach(function(item, index) {
            self.$axios({
              url: '/UAMS/Authenticate/ajax/do_find_dept_role_module_action_for_authorization',
              method: 'post',
              responseType: 'json',
              data: {
                moduleId: item.id,
                sessionId: self.sessionId,
                compCode: self.dataJson.comp_code,
                systemId: self.sysId
              }
            })
            .then(function(res) {
              let list1 = res.data.data
              if(list1.length != 0) {
                for(let index in list1) {
                  obj.push(new ObjStory(list1[index].action_name, list1[index].action_name, 'zy_' + list1[index].id, list1[index].module_id, list1[index].resource_id))
                }
              }else{
                item.disabled = true;
              }
            })
            .catch(function(res) {
              console.log("error", res)
            })  
          })
          setTimeout(function() {
            for(let i = 0; i < obj.length; i++) {
              self.reTissues.push(obj[i])
            }
            let jsonData = eval(self.reTissues);
            let arr = self.transData(jsonData, 'id', 'parent_id', 'children');
            self.reTissues = arr;
            self.resourceIs = true
            self.$nextTick(() => {
              if(self.roleIs && self.resourceIs) {
                self.setHeight()
              }
            })
          }, 1000)
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
        console.log('hash',hash) 
        for (; j < len; j++) {
          let aVal = a[j],hashVP; 
          if('module_name' in a[j]){
            console.log(aVal[pid])
            hashVP = hash['sys_'+String(aVal[pid])]
          }else{
            hashVP = hash[aVal[pid]]
          }

          if (hashVP) { 
            !hashVP[children] && (hashVP[children] = []); 
            hashVP[children].push(aVal); 

          } else { 
            r.push(aVal); 
          } 
        }
        console.log(r) 
        return r;
      },
      registerCancel(){//关闭模态框
        let self = this;
        self.form = {
          name: '',
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
      inquire(data, checked, prep){
        let self = this;
        console.log(data,checked,prep, self.changeNum)

        if(checked) {  //选中节点时触发
          console.log("发送请求,获得该角色下的所有操作")
          self.$refs.roleTree.setCheckedKeys([data.id])
          self.$axios({
            url: '/UAMS/Authenticate/ajax/do_find_role_action_for_authorization',
            method: 'post',
            responseType: 'json',
            data: {
              roleId: data.oldId,
              compCode: self.dataJson.comp_code,
              sessionId: self.sessionId
            }
          })
          .then(function(res) {
            let list = res.data.data
            console.log("lsit", list)
            if(!list || list.length == 0) {
              /*self.$refs.resourceTree.setCheckedKeys([list.id])*/
              self.$refs.resourceTree.setCheckedNodes(defaultCheck)
              //      return
            }else{
              let arr = [];
              list.forEach(function(item, index){
                arr.push(item.id)
              })
              self.$refs.resourceTree.setCheckedKeys(arr)
            }
            self.beforeNode = self.$refs.resourceTree.getCheckedNodes()

            self.sysId = data.parent_id
            self.reSys()
          })
          .catch(function(res) {
            console.log("error", res)
          })
        } else {
          console.log("进入else")
          self.$refs.resourceTree.setCheckedNodes(defaultCheck)  
        }
      },
      inquire1(data, checked, prep) {
        /*console.log(data,checked,prep)*/
      },
      compare(arr1, arr2) {
        var result = [];
        for(var i = 0; i < arr2.length; i++){
          var obj = arr2[i];
          var num = obj.resource_id;
          var isExist = false;
          for(var j = 0; j < arr1.length; j++){
            var aj = arr1[j];
            var n = aj.resource_id;
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
      empower() { //角色资源关联
        let self = this
        let resourceTree = self.$refs.resourceTree.getCheckedNodes()
        let roleTree = self.$refs.roleTree.getCheckedNodes()
        if(roleTree.length === 0) {
          self.$message("请先选择角色!")
          return
        }
        let roleId = roleTree[0].oldId
        let addArr = self.compare(self.beforeNode, resourceTree)
        let delArr = self.compare(resourceTree, self.beforeNode)
        if(addArr.length === 0 && delArr.length === 0) {
          self.$message("你还没有进行任何修改")
          return
        }
        var roleResourceDatas = new Array()
        function DatasStory(roleId, resourceId, type, sessionId, compCode) {
          this.roleId = roleId
          this.resourceId = resourceId
          this.type = type
          this.sessionId = sessionId
          this.compCode = compCode
        }
        for (let index in addArr) {
          roleResourceDatas.push(new DatasStory(roleId, addArr[index].resource_id, '1', self.sessionId, self.dataJson.comp_code))
        }
        for(let index in delArr) {
          roleResourceDatas.push(new DatasStory(roleId, delArr[index].resource_id, '0', self.sessionId, self.dataJson.comp_code))
        }
        roleResourceDatas.forEach(function(item,index){
          if(!item.resourceId){
            roleResourceDatas.splice(index,1)
          }
        })
        console.log("roleResourceDatas", roleResourceDatas)
        self.$nextTick(()=>{
          self.$axios({
            url: "/UAMS/Authorization/ajax/do_authorization_update",
            method: 'post',
            responseType: 'json',
            data: roleResourceDatas
          })
          .then(function(res) {
            console.log(res.data.success)
            if(res.data.success === false) {
              self.$message(res.data.msg)
            } else {
              self.$message("授权成功")
              self.beforeNode = self.$refs.resourceTree.getCheckedNodes()
              /*self.inquire(data, checked, prep)*/
            }
          })
          .catch(function(res) {
            console.log("error", res)
          })
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
  .el-tree {
    width: 48%;
    float: left;
    /* margin-left: 1%; */
    /* min-height: 650px; */
  }
  .empower-button {
    width: 180px;
    margin-top: 10px;
    margin-bottom: 35px;
  }
  .tarn_height{
    -webkit-transition: height 2s;
    -moz-transition: height 2s;
    -ms-transition: height 2s;
    -o-transition: height 2s;
    transition: height 2s;
  }
</style>