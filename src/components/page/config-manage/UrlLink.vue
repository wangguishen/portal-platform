<template>
	<div>
		<div class="port_header">
			<el-select
				class="sel"
				v-model="selectLab"
				filterable
				placeholder="请选择实验室"
				no-match-text="暂无数据"
				@change="visitLab"
				:loading="loading">
    			<el-option
	      			v-for="item in labList"
			      	:key="item.value"
			      	:label="item.label"
			      	:value="item.value"
			      	@click.native="visitLabs(item)">
			    </el-option>
  			</el-select>
			<el-input placeholder="请输入项目名称或者链接地址" v-model="iptSysLink" class="ipt" @keyup.enter.native="demandPort">
			</el-input>
			<el-button type="primary" class="refer"  icon="search" @click="demandPort()">查询</el-button>
		</div>
		<el-row style="margin-top: 20px">
		  	<el-col :span="24">
			    <el-table
				    :data="linkList"
				    border
				    empty-text="暂无监控链接，请注册监控链接"
				    style="width: 100%">
				    <el-table-column
				      	prop="linkIndex"
				      	label="序号"
				      	width="100">
	    			</el-table-column>
	    			<el-table-column
				      	prop="system_name"
				      	label="项目名称"
				      	width="150">
	    			</el-table-column>
				    <el-table-column
				      	prop="linkName"
				      	label="链接名称"
				      	width="150">
	    			</el-table-column>
	    			<el-table-column
				      	prop="type"
				      	label="终端"
				      	width="150">
	    			</el-table-column>
	    			<el-table-column
				      	prop="link"
				      	label="链接地址"
				      	width="500">
	    			</el-table-column>
				    <el-table-column
				      	prop="status"
				      	label="链接状态">
				      	<template slot-scope="scope">
				        	<template v-if="linkList[scope.$index].status == 1">
				        		<span class="iconfont" style="color:#f6a20f; font-size:20px;float:left;">&#xe602;</span>
				        		<span class="icon_text">异常</span>
				        	</template>
				        	<template v-if="linkList[scope.$index].status == 0">
				        		<span class="iconfont" style="color:#2be74f;float:left;">&#xe602;</span>
				        		<span class="icon_text">正常</span>
				        	</template>
				        	<template v-if="linkList[scope.$index].status == 2">
				        		<span class="iconfont" style="color:#eb1735;float:left;">&#xe602;</span>
				        		<span class="icon_text">宕机</span>
				        	</template>
				      	</template>
				    </el-table-column>
	  			</el-table>
		    </el-col>
	  	</el-row>
	  	<el-row style="margin-top: 40px">
		  	<el-col :span="24" style="height:32px;">
			    <el-pagination
			    	v-show="totalCount"
	              	:page-size="pageSize"
	              	@current-change="changeCur"
	              	layout="total, prev, pager, next"
	              	:total="totalCount"
	              	ref="paginations">
            	</el-pagination>
		  	</el-col>
		</el-row>
	</div>
</template>
<script>
export default {
	data() {
	  	return {
	  		//搜索
	  		iptSysLink: '',//搜索值
	  		timer:null,//定时器
	  		selectLab:'',//选择实验室
	  		labList:[],//所有实验室集合
	  		labPageSize:10000,//实验室分页
	  		labCurrentPage:1,//实验室当前页数
	  		loading: false,//是否正在获取数据
	  		labObj: '',//当前id

	  		linkList:[],//链接集合
	  		parameter:{},
	  		selectId:0,
	  		// 分页
	  		pageSize: 10,
	  		currentPage: 1,
	  		totalCount: 0,
	  		timer: null,
	  	}
	},
	mounted(){
		let self = this;
		self.GetRequest();
		self.$nextTick(()=>{
			self.stat = 0;
			self.askCompanySys();//查询所有链接
			self.askLab();//查询所有实验室
		})
	},
	watch:{
		'$route':{
			handler: function(val, oldval) {
				let self = this;
				clearInterval(self.timer)
				self.timer = null;
				self.GetRequest()
				self.$nextTick(()=>{
					self.stat = 0;
					self.askCompanySys();//查询所有链接
					// self.timer = setInterval(()=>{
					// 	self.askCompany();//查询所有链接
					// },3000)
					self.askLab();//查询所有实验室
				})
			},
			deep:true
		},
	},
	methods: {
		selectLabClick(index){//当前选择实验室
    		let self = this;
    		console.log(index)
    	},
    	demandPort(){//查询按妞
    		let self = this;
    		self.currentPage = 1;
    		let  url = "/basic-platform/link/sel?enterpriseId="+self.parameter.id+'&deptId='+self.selectLab+'&linkName='+self.iptSysLink+'&pageSize='+self.pageSize+'&currentPage='+self.currentPage+'&enable=1';
			let data = {};
			let method = 'get';
			console.log(url)
			self.askControl(url, data, method, 'lj')
    	},
    	visitLab(value){//实验室选中后执行的操作
    		let self = this;
    		let  url = "/basic-platform/link/sel?enterpriseId="+self.parameter.id+'&deptId='+value+'&linkName='+self.iptSysLink+'&pageSize='+self.pageSize+'&currentPage='+self.currentPage+'&enable=1';
			let data = {};
			let method = 'get';
			console.log(url)
			self.askControl(url, data, method, 'lj')
    	},
    	visitLabs(item){
    		let self = this;
    		self.labObj = item.enterpriseId;
    		console.log(item)
    	},
    	remoteMethod(val){//输入实验室进行选择
    		let self = this;
    		clearTimeout(self.timer);
			self.timer = null;
    		let url = "/basic-platform/dept/sel?enterpriseId="+self.parameter.id+"&deptName="+val;
    		let data = {};
    		let method = 'get';
			self.loading = true;
			self.timer = setTimeout(() => {
				clearTimeout(self.timer);
				self.timer = null;
	            self.loading = false;
	            self.askControl(url, data, method, 'lab')
	        }, 1000);
    	},
    	askLab(){//查询所有实验室
    		let self = this;
    		let url = "/basic-platform/dept/sel?enterpriseId="+self.parameter.id;
    		let data = {};
    		let method = 'get';
    		self.askControl(url, data, method, 'lab')
    	},
		askCompany(){//查询监控链接
			let self = this;
			let  url = "/basic-platform/link/sel?enterpriseId="+self.parameter.id+'&deptId='+self.selectLab+'&linkName='+self.iptSysLink+'&pageSize='+self.pageSize+'&currentPage='+self.currentPage+'&enable=1';
			let data = {};
			let method = 'get';
			console.log(url)
			self.askControl(url, data, method, 'lj')
		},
		askCompanySys(){
			let self = this;
			self.askCompany();
			self.timer = setInterval(()=>{
				self.askCompany();//查询所有链接
			},3000)
		},
		changeCur(val){//分页查询
			let self = this;
			self.currentPage = val;
			self.linkList = [];
			self.askCompany();
		},
	  	askControl(url, data, method, type){//公共请求
			let self = this;
			self.$axios({
	    		url: url,
	    		method: method,
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(res) {
	    		console.log(type,res)
	    		if(res.data.status == 200){
	    			let list = res.data.data;
	    			if(type == 'lab'){
	    				self.labList = [];
	    				list.forEach(function(item,index){
	    					self.$set(item,'label',item.deptName)
	    					self.$set(item,'value',item.id)
	    					self.labList.push(item)
	    				})
	    				console.log(self.labList)
	    			}else if(type == 'lj'){
	    				self.linkList = [];
	    				self.totalCount = res.data.page.totalRows;
	    				list.forEach(function(item, index){
	    					self.$set(item,'linkIndex',(index+1));
	    					self.linkList.push(item)
	    				})
	    			}
	    		}
	    	})
	    	.catch(function(res) {
	    		console.log("报错了")
	    	})
		},
		GetRequest(){//解析url传递的参数
			let self = this;
		    let theRequest = new Object();
		    let url = self.$route.fullPath;
		    if (url.indexOf("?") != -1) {
		    	url = url.substring(url.indexOf('?') + 1, url.length)
		        let strs = url.split("&");
		        for (let i = 0; i < strs.length; i++) {
		            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
		        }
		    }
		    self.parameter = theRequest;
		}
	},
	beforeDestroy(){
		let self = this;
		console.log(1231231)
		clearInterval(self.timer)
		self.timer = null;
	}
}
</script>
<style scoped>
	.icon_text{
		float: left;
		margin-left: 5px;
	}
	.sel{
		width: 15%;
	}
	.port_header .ipt{
		width: 30%;
		margin-right:10px;
  	}
</style>