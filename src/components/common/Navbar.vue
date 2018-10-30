<template>
	<div style="margin-bottom:30px">
		<div class="m-nav-menu-subsidiary" v-show="secondCompShow">
      <navigation :menuItems="menuItems" v-on:choicePresent="choicePresent"></navigation>
    </div>
		<!-- <el-menu theme="dark" class="el-menu-demo" mode="horizontal" @select="handleSelect" style="margin-bottom: 20px">
      <template v-for="(menuItem, i) in menuItems">
        <el-menu-item style="width: auto" @click.native="changeMenu(menuItem, i)" :index="i | intToString">{{menuItem.comp_name}}</el-menu-item>
      </template>
    </el-menu> -->

	    <!-- 样式方案一 -->
	    <el-radio-group v-model="radio3">
    		<el-radio-button v-show="terraceShow" label="系统管理" @click.native="skip('sysgover', '系统管理')"></el-radio-button>
	    	<el-radio-button label="资源项管理" @click.native="skip('operategover', '资源项管理')"></el-radio-button>
		    <el-radio-button label="空间资源管理" @click.native="skip('resource', '空间资源管理')"></el-radio-button>
		    <!-- <el-radio-button label="组织架构管理" @click.native="skip('orgchagover', '组织架构管理')"></el-radio-button> -->
		    <el-radio-button label="角色管理" @click.native="skip('rolegover', '角色管理')"></el-radio-button>
		    <el-radio-button label="角色授权管理" @click.native="skip('empower', '角色授权管理')"></el-radio-button>
        <el-radio-button label="用户角色管理" @click.native="skip('userrole', '用户角色管理')"></el-radio-button>
	    </el-radio-group>
	</div>
</template>
<script>
  var Base64 = require('js-base64').Base64;
  import Navigation from './Navigation.vue'
  export default {
    components:{
      Navigation
    },
    data() {
      return {
        terraceShow: false,
      	sysname: '',
      	radio3: '',
      	activeIndex: '-1',
        compCode: '',
        menuItems: [],
        number :[],
        secondCompShow: false,
      }
    },
    watch: {
      '$route': {
        handler: function(val, oldval) {
          let self = this
          if(val.path === '/sysgover' || val.path === '/operategover' || val.path === '/resource' || val.path === '/orgchagover' ||
            val.path === 'rolegover' || val.path === '/userrole' || val.path === '/empower') {
            self.compCode = Base64.decode(self.$route.query.comp_code)
            self.childrenQuery()
          }
        }
      },
      'menuItems':{
        handler:function(val, old){
          let self = this;
          self.showBgColor(self.number)
        },
        deep:true
      },
    },
    mounted() {
      let self = this;
      let uams = localStorage.getItem('uams');
      console.log(uams)
      if(uams === self.ENTERPRISE_ADMIN){
      	self.terraceShow = false;
      }else if(uams === self.PLAT_ADMIN){
      	self.terraceShow = true;
      }
      self.sysname = self.$route.path
      if(self.sysname === '/sysgover') {
      	self.radio3 = '系统管理'
      } else if (self.sysname === '/operategover') {
      	self.radio3 = '资源项管理'
      } else if (self.sysname === '/orgchagover') {
      	self.radio3 = '组织架构管理'
      } else if(self.sysname === '/rolegover') {
      	self.radio3 = '角色管理'
      } else if(self.sysname === '/resource') {
      	self.radio3 = '空间资源管理'
      } else if(self.sysname === '/empower') {
      	self.radio3 = '角色授权管理'
      } else if(self.sysname === '/userrole') {
      	self.radio3 = '用户角色管理'
      }

      let storage = JSON.parse(localStorage.getItem('dataJson'))
      /*self.compCode = storage.comp_code*/      
      self.compCode = Base64.decode(self.$route.query.comp_code)
      self.childrenQuery()
    },
    methods: {
      skip(sysname, radio) {
      	let self = this
      	self.radio3 = radio
        console.log("skip,,,,", sysname, self.radio3, self.compCode)
      	/*let storage = JSON.parse(localStorage.getItem('dataJson'))
      	let compCode = storage.comp_code*/
        let comp_code = Base64.encode(self.$route.query.comp_code)
        let second_code = Base64.encode(self.$route.query.second_code)
        if(self.$route.query.second_code){
          self.$router.push(sysname+'?comp_code='+self.$route.query.comp_code+'&second_code='+self.$route.query.second_code);
        }else{
          self.$router.push(sysname+'?comp_code='+self.$route.query.comp_code);
        }
      	// self.$router.push(sysname + '?comp_code=' + self.compCode)
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      choicePresent(item){
        let self = this;
        console.log(self.$route)
        self.$router.push(self.$route.path+'?comp_code='+self.$route.query.comp_code+'&second_code='+Base64.encode(item.comp_code));
        console.log(item)
      },
      changeMenu(menuItem, i) {
        console.log("go changeMenu methods", menuItems, i)
      	let self = this
        /*self.activeIndex = i.toString()*/
      	let storage = JSON.parse(localStorage.getItem('dataJson'))
      	storage.comp_code = menuItem.comp_code
      	localStorage.setItem("dataJson", JSON.stringify(storage))
      	self.$router.push(self.sysname + '?comp_code=' + menuItem.comp_code)
      },
      childrenQuery() { //查询出子企业
      	let self = this
      	self.$axios({
      	  url: '/UAMS/company/do_compcode_children_query',
      	  method: 'post',
      	  responseType: 'json',
      	  data: {
      	  	"compCode": self.compCode
      	  }
      	})
      	.then(function(res) {
      	  // console.log("success", res)
      	  let list = res.data.data
      	  if(res.data.success) {
            if(list.length == 0){
              self.secondCompShow = false;
              return
            }
            self.secondCompShow = true;
            self.menuItems = []
      	  	list.forEach(function(item, index) {
      	  	  if(self.$route.query.second_code && Base64.decode(self.$route.query.second_code) == item.comp_code){
                  self.$set(item,'secondClass',true)
                }else{
                  self.$set(item,'secondClass',false)
                }
                self.number = []
                self.menuItems.push(item)
                let arr = []
                arr.push(index)
                self.childQuery(item,item.comp_code,arr)
      	  	})
      	  	console.log("=============", self.menuItems)
      	  }
      	})	
      	.catch(function(res) {
      	  console.log("error", res)
      	})
      },
      childQuery(parse,code,num) { //查询出子企业
        let self = this
        self.$axios({
            url: '/UAMS/company/do_compcode_children_query',
            method: 'post',
            responseType: 'json',
            data: {
              "compCode": code
            }
        })
        .then(function(res) {
            let list = res.data.data
            if(res.data.success) {
              if(list.length == 0){return}
              self.$set(parse,'children',[])
              list.forEach(function(item, index) {
                let temp = []
                num.forEach(function(val,key){
                  temp.push(val)
              })
              temp.push(index)
              if(self.$route.query.second_code && Base64.decode(self.$route.query.second_code) == item.comp_code){
                self.number = temp
              }else{
                self.$set(item,'secondClass',false)
              }
              parse.children.push(item)
              self.childQuery(item,item.comp_code,temp)
            })
          }
        })  
        .catch(function(res) {
            console.log("error", res)
        })
      },
      showBgColor(num){
        let self = this;
          if(!self.menuItems[num[0]])return
          if(num.length == 1){
            self.$set(self.menuItems[num[0]],'secondClass',true)
          }else if(num.length == 2){
            self.$set(self.menuItems[num[0]],'secondClass',true)
            self.$set(self.menuItems[num[0]].children[num[1]],'secondClass',true)
          }else if(num.length == 3){
            console.log(self.menuItems[num[0]])
            self.$set(self.menuItems[num[0]],'secondClass',true)
            self.$set(self.menuItems[num[0]].children[num[1]],'secondClass',true)
            self.$set(self.menuItems[num[0]].children[num[1]].children[num[2]],'secondClass',true)
          }else if(num.length == 4){
            self.$set(self.menuItems[num[0]],'secondClass',true)
            self.$set(self.menuItems[num[0]].children[num[1]],'secondClass',true)
            self.$set(self.menuItems[num[0]].children[num[1]].children[num[2]],'secondClass',true)
            self.$set(self.menuItems[num[0]].children[num[1]].children[num[2]].children[num[3]],'secondClass',true)
          }else if(num.length == 5){
            self.$set(self.menuItems[num[0]],'secondClass',true)
            self.$set(self.menuItems[num[0]].children[num[1]],'secondClass',true)
            self.$set(self.menuItems[num[0]].children[num[1]].children[num[2]],'secondClass',true)
            self.$set(self.menuItems[num[0]].children[num[1]].children[num[2]].children[num[3]],'secondClass',true)
            self.$set(self.menuItems[num[0]].children[num[1]].children[num[2]].children[num[3]].children[num[4]],'secondClass',true)
          }
      },
    },
    filters: {
      intToString(value) { 
        if(!value) return ''
        return value.toString()
      }
    }
  }
</script>
<style scoped>
	.pan-btn {
	  	font-size: 14px;
	  	color: #000;
	  	padding: 14px 36px;
	  	border-radius: 8px;
	  	border: none;
	  	outline: none;
	  	margin-right: 25px;
	  	transition: 600ms ease all;
	  	position: relative;
	  	display: inline-block;
	  	background: #a6a1a8;
	}
	a {
	    text-decoration: none;
	    cursor: pointer;	
	}
	.checked {
	    background: #50bfff;
	    color: #fff;
	}
	.pan-btn:hover {
		background: #a9abaa;
	}
	.pan-btn:hover:before,.pan-btn:hover:after {
		width: 100%;
      	transition: 600ms ease all;
	}
	.pan-btn:before,.pan-btn:after {
		content: '';
	    position: absolute;
	    top: 0;
	    right: 0;
	    height: 2px;
	    width: 0;
	    transition: 400ms ease all;
	}
	.pan-btn::after {
	    right: inherit;
	    top: inherit;
	    left: 0;
	    bottom: 0;
  	}
  .m-nav-menu-manage .el-menu--horizontal .el-menu-item:hover, .el-menu--horizontal .el-submenu__title:hover, .el-menu--horizontal .el-menu-item:focus{
    background-color:#b01e24 !important;
    color:#fff !important;
    font-weight: bold;
  }
  .el-menu--horizontal .el-menu-item{
    border-bottom: none;
  }
</style>