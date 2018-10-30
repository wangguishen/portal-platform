<template>
	<div>
		<div class="port_header">
			<el-input placeholder="请输入接口名称" v-model="iptPort" class="ipt leftFloatBox" @keyup.enter.native="demandPort">
			    <el-select v-model="selectServer" slot="prepend" placeholder="请选择服务名称" @change="selectServerClick(selectServer)">
			      	<el-option
				      	v-for="item in portList"
				      	:key="item.value"
				      	:label="item.label"
				      	:value="item.value">
			    	</el-option>
			    </el-select>
			</el-input>
			<el-button type="primary" class="refer"  icon="search" @click="demandPort()">查询</el-button>
			<el-button type="info" @click="addPort()">新增接口</el-button>
		</div>
		<div class="port_main">
			<el-table
		      	:data="tableData"
		      	border
		      	style="width: 100%">
		      	<el-table-column
			        prop="order"
			        label="序列"
			        width="70">
		      	</el-table-column>
		      	<el-table-column
			        prop="protName"
			        label="接口名称"
			        width="130">
		      	</el-table-column>
		      	<el-table-column
			        prop="pattern"
			        label="请求方式"
			        width="100">
		      	</el-table-column>
		      	<el-table-column
			        prop="askLink"
			        label="请求链接"
			        width="150">
		      	</el-table-column>
		      	<!-- <el-table-column
			        prop="relateTopic"
			        label="关联主题"
			        width="100">
		      	</el-table-column> -->
		      	<el-table-column
			        prop="inParameter"
			        label="入参示例"
			        width="204">
		      	</el-table-column>
		      	<el-table-column
			        prop="outParameter"
			        label="出参示例"
			        width="204">
		      	</el-table-column>
		      	<el-table-column
			        prop="intro"
			        label="简介"
			        width="150">
		      	</el-table-column>
		      	<el-table-column
			      	label="操作">
				    <template slot-scope="scope">
			        	<el-button @click="handleClick(scope.$index, tableData)" size="small">编辑</el-button>
			        	<el-button type="danger" size="small" @click="delectClick(scope.$index, tableData)">删除</el-button>
			        	<el-button type="success" size="small" @click="manage(scope.$index, tableData)">参数管理</el-button>
			      	</template>
    			</el-table-column>
	    	</el-table>
		</div>
		<el-dialog :title="portTitle" @close="registerCancel('formPort')" :visible.sync="registerFormVisible">
  			<el-form :model="formPort" :rules="rules" ref="formPort" class="demo-ruleForm">
  				<el-form-item label="服务名称：" :label-width="formLabelWidth" prop="server_name">
		      		<el-select v-model="formPort.server_name" class="ipt_wid" placeholder="请选择服务名称">
			        	<el-option
					      	v-for="item in portList"
					      	:key="item.value"
					      	:label="item.label"
					      	:value="item.value">
				    	</el-option>
			      	</el-select>
			    </el-form-item>
			    <el-form-item label="接口名称：" :label-width="formLabelWidth" prop="port_name" v-show="isInterface">
			      	<el-input v-model="formPort.port_name" placeholder="请输入接口名称" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="请求方式：" :label-width="formLabelWidth" prop="ask_pattern" v-show="isInterface">
		      		<el-select v-model="formPort.ask_pattern" placeholder="请选择请求方式" class="ipt_wid">
			        	<el-option
					      	v-for="(item,index) in mannerList"
					      	:key="item.value"
					      	:label="item.label"
					      	:value="item.value">
				    	</el-option>
			      	</el-select>
			    </el-form-item>
			    <el-form-item label="接口链接：" :label-width="formLabelWidth" prop="port_link" v-show="isInterface">
			      	<el-input v-model="formPort.port_link" placeholder="请输入接口链接" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			   <!--  <el-form-item label="关联主题：" :label-width="formLabelWidth" prop="relateTopic" v-show="isInterface">
		      		<el-select v-model="formPort.topic" placeholder="请选择主题" class="ipt_wid">
			        	<el-option
					      	v-for="(item,index) in topicList"
					      	:key="item.value"
					      	:label="item.label"
					      	:value="item.value">
				    	</el-option>
			      	</el-select>
			    </el-form-item> -->
			    <el-form-item label="接口简介：" :label-width="formLabelWidth" prop="port_intro" v-show="isInterface">
			      	 <el-input type="textarea" autosize v-model="formPort.port_intro" placeholder="请输入接口简介" class="area_ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="请求示例：" :label-width="formLabelWidth" prop="ask_example" v-show="isInterface">
			      	 <el-input type="textarea" autosize v-model="formPort.ask_example" placeholder="请输入请求示例" class="area_ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="返回示例：" :label-width="formLabelWidth" prop="back_example" v-show="isInterface">
			      	 <el-input type="textarea" autosize v-model="formPort.back_example" placeholder="请输入返回示例" class="area_ipt"></el-input>
			    </el-form-item>
			    <!-- <el-form-item label="服务器名称: " :label-width="formLabelWidth" prop="server_sname" v-show="!isInterface">
			    				    <el-input type="text" autosize v-model="formPort.port_name" placeholder="请输入服务器名称" class="area_ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="IP地址: " :label-width="formLabelWidth" prop="server_ip" v-show="!isInterface">
			    				    <el-input type="text" autosize v-model="formPort.port_link" placeholder="请输入IP地址" class="area_ipt"></el-input>
			    </el-form-item> -->
  			</el-form>
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="registerFormVisible=false">取 消</el-button>
			    <el-button type="primary" @click="sureRegister('formPort')">确 定</el-button>
		  	</div>
		</el-dialog>
		<el-dialog title="删除接口" :visible.sync="delectVisible" size="tiny">
		  	<span>确定要删除此接口吗？</span>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button @click="delectVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="delectSure()">确 定</el-button>
		  	</span>
		</el-dialog>
		<div class="g-footer">
          	<div style="margin-top: 20px" v-show="totalCount">
            	<el-pagination
	              	:page-size="pageSize"
	              	@current-change="changeCur"
	              	layout="total, prev, pager, next"
	              	:total="totalCount"
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
      		routeId: 0,
      		isInterface: true, //是否是接口服务
      		isServer: false, //是否是服务器监控
      		iptPort:'',//输入的接口
      		selectServer:'',//选择的服务名称
      		portList:[],//所有服务列表
      		selServer:'',//选中的服务
      		tableData:[],//所有接口列表
      		portTitle:'',//新增标题或者修改标题
      		type:'',//新增修改状态控制
      		// 新增
      		registerFormVisible:false,//新增框显示隐藏
      		formPort:{//新增数据
      			server_name:'',
      			label_name:"",
      			port_name:'',
      			ask_pattern:'',
      			port_link:'',
      			port_intro:'',
      			ask_example:'',
      			back_example:'',
      			server_sname: '',
      			server_ip: ''
      		},
      		formLabelWidth:'120px',//input宽度
      		mannerList:[//请求方式列表
      			{label:'PUT',value:'PUT'},
      			{label:'POST',value:'POST'},
      			{label:'GET',value:'GET'},
      			{label:'DELETE',value:'DELETE'},
      		],
      		rules:{
      			server_name:[{ required: true, message: '请选择服务名称', trigger: 'change' }],
      			port_name:[{ required: true, message: '请输入接口名称', trigger: 'blur' }],
      			ask_pattern:[{ required: true, message: '请选择请求方式', trigger: 'change' }],
      			port_link:[{ required: true, message: '请输入接口链接', trigger: 'blur' }],
      			port_intro:[{ required: true, message: '请输入接口简介', trigger: 'blur' }],
      			ask_example:[{ required: true, message: '请输入请求示例', trigger: 'blur' }],
      			back_example:[{ required: true, message: '请输入返回示例', trigger: 'blur' }],
      			server_ip: [{required: true, message: '请输入IP地址', trigger: 'blur'}],
      			server_sname: [{required: true, message: '请输入服务器名称', trigger: 'blur'}]
      		},
      		// 删除
      		delectVisible:false,//显示隐藏
      		selectIndex:0,//选中代码
	        selectList:{},//选中状态
	        // 分页
	        pageSize: 10,
	        totalCount:0,
	        currentPage:1,//当前页数
	        autofocusShow:false,
	        // relateTopic:'',
	        // topicList:[],
      	}
    },
    mounted(){
    	let self = this;
    	self.getServer();
    	self.getProt();
    	// self.queryTopic();
    },
    watch:{

    },
    methods:{
    	queryTopic(){
			let self = this;
			self.$axios({
				url:self.BP_HOST+"/messageApplication/queryMesseageApplication?pageSize="+self.pageSize+"&currentPage="+self.currentPage,
				method:'get',
				responseType:'json',
				data:{
					topic:""
				}
			})
			.then((res)=>{
				console.log('queryTopic Success',res)
				if (res.data.status == 200) {
					let resData = res.data.data;
					if (resData) {
						resData.forEach(function(item,index){
							item.value = item.topic;
							item.label = item.topic
							self.topicList.push(item)
						})
					}else{
						self.$message.error('该接口暂无参数!')
					}
				}else{
					self.$message.error('服务器信息错误!')
				}
			})
			.catch((res)=>{
				console.log('queryTopic Error',res)
			})
		},
    	changeCur(val){
    		let self = this;
			self.currentPage = val;
			self.tableData = [];
			self.getProt();
    	},
    	selectServerClick(index){//当前服务选择
    		let self = this;
    		self.selServer = index;
    		self.getProt();
    	},
    	demandPort(){//查询
    		let self = this;
    		self.getProt();
    	},
    	getServer(){//请求服务
    		let self = this;
    		let datas={
    			'serviceName':''
	    	};
      		self.$axios({
      			url: self.BP_HOST+'/module/sel',
      			method: 'get',
	    		responseType: 'json',
	    		data: datas
	    	})
	    	.then(function(response){
	    		console.log(response)
	    		if(response.data.status == 200){
	    			let list = response.data.data;
	    			if(list){
	    				list.forEach(function(item, index){
	    					item.label = item.serviceName;
	    					item.value = item.id.toString();
	    					self.portList.push(item)
	    				})
	    			}
	    		}
      		})
	    	.catch(function(response){
      			console.log(response);
	    	})
    	},
    	getProt(){//请求接口
    		let self = this;
    		console.log(self.selServer)
    		let urls;
    		if(self.selServer == ""){
    			urls = self.BP_HOST+'/inter/sel?pageSize='+self.pageSize+'&currentPage='+self.currentPage+'&mId='+self.selServer+'&interName='+self.iptPort
    		}else{
    			urls = self.BP_HOST+'/inter/sel?pageSize='+self.pageSize+'&currentPage='+self.currentPage+'&mId='+parseInt(self.selServer)+'&interName='+self.iptPort
    		}
    		let datas={
    			'mId' : parseInt(self.selServer),
    			'interName':self.iptPort
	    	};
	    	console.log(datas);
	    	console.log(urls);
      		self.$axios({
      			url: urls,
      			method: 'get',
	    		responseType: 'json',
	    		data: datas
	    	})
	    	.then(function(response){
	    		console.log('getProt Success',response);
	    		if(response.data.status == 200){
	    			let list = response.data.data;
	    			self.totalCount = response.data.page.totalRows;
	    			if(list){
	    				self.tableData = [];
	    				list.forEach(function(item, index){
	    					item.order = index+1;//序号
	    					item.protName = item.interName;//名称
	    					item.pattern = item.interMethod;//请求方式
	    					item.askLink = item.url;//请求链接
	    					item.inParameter = item.reqData;//入参示例
	    					item.outParameter = item.repData;//出参示例
	    					item.intro = item.introduce;//简介
	    					// item.relateTopic = item.topic
	    					self.tableData.push(item)
	    				})
	    			}
	    		}
      		})
	    	.catch(function(response){
      			console.log(response);
	    	})
    	},
    	addPort(){//新增接口
    		let self = this;
    		self.portTitle = "新增接口";
    		self.type = "xz";
    		self.registerFormVisible = true;
    	},
    	handleClick(scope, tab){//编辑接口
    		let self = this;
    		let name = "";
    		console.log("name111", tab[scope])
    		self.portList.forEach(function(item, index){
    			if(tab[scope].mId == item.id){
    				name = item.serviceName;
    			}
    		})
			if(name == "服务器监控") {
    	      // self.isServer = true
    	      self.isInterface = false
    		  console.log(1111111111111,self.isServer, self.isInterface)
    	    } else {
    	      // self.isServer = false
    	      self.isInterface = true
    	      console.log(2222222222222,self.isServer, self.isInterface)
    	    }
    		console.log("name", tab[scope])
    		console.log(self.isServer,self.isInterface)
    		

    		let data = {
    			// server_name : tab[scope].mId.toString(),
    			server_name : name,
      			port_name : tab[scope].interName,
      			ask_pattern : tab[scope].interMethod,
      			port_link : tab[scope].url,
      			port_intro : tab[scope].introduce,
      			ask_example : tab[scope].reqData,
      			back_example : tab[scope].repData,
      			id : tab[scope].id,
      			// topic: tab[scope].topic
    		}
    		console.log(data)
    		self.formPort = data;
    		self.portTitle = "修改接口";
    		self.type = "bj";
    		
    		console.log(tab[scope])

    		self.$nextTick(() => {
    			self.registerFormVisible = true;
    		})
    	},
    	delectClick(scope, tab){//删除接口
    		let self = this;
    		self.delectVisible = true;
    		self.selectList = tab[scope];
    		self.selectIndex = scope;
    	},
    	manage(scope, tab){
    		let self = this;
    		localStorage.setItem("reqDataJson",JSON.stringify(tab[scope]));//当前列表所有信息
  			self.$router.push('/Parameters');
    	},
    	delectSure(){//确定删除
    		let self = this;
    		let datas = {
    			id : self.selectList.id
    		}
    		self.$axios({
      			url: self.BP_HOST+'/inter/del',
      			method: 'delete',
	    		responseType: 'json',
	    		data: datas
	    	})
	    	.then(function(response){
	    		console.log(response)
	    		if(response.data.status == 200){
	    			self.delectVisible = false;
	    			self.$message({
			          	message: '删除系统成功',
			          	type: 'success',
			          	duration:1500
			        });
			        self.getProt();
			        self.routeId++
			        self.$router.push('/Portconfig?id='+self.routeId)
	    		}else{
	    			
	    		}
      		})
	    	.catch(function(response){
      			console.log(response);
	    	})
    	},
    	addSurePort(formPort){
    		let self = this;
    		let datas={};
    		let urls="";
    		let methods = "";
    		if(self.type == 'xz'){
    			urls = "add";
    			methods = "post";
    			console.log("添加时", self.formPort)
    			datas = {
    				mId : parseInt(self.formPort.server_name),
    				interName :	self.formPort.port_name || self.formPort.server_sname,
					interMethod : self.formPort.ask_pattern,
					url : self.formPort.port_link || self.formPort.server_ip,
					introduce : self.formPort.port_intro,
					repData : self.formPort.back_example,
					reqData:self.formPort.ask_example,
					// topic: self.formPort.topic
    			}
    		}else if(self.type == 'bj'){
    			urls = "up";
    			methods = "put";
    			let name = self.formPort.server_name;
    			self.portList.forEach(function(item, index){
	    			if(self.formPort.server_name == item.serviceName){
	    				name = item.id
	    			}
	    		})
    			datas = {
    				mId : parseInt(name),
    				id : self.formPort.id,
    				interName :	self.formPort.port_name,
					interMethod : self.formPort.ask_pattern,
					url : self.formPort.port_link,
					introduce : self.formPort.port_intro,
					repData : self.formPort.back_example,
					reqData:self.formPort.ask_example,
					// topic: self.formPort.topic
    			}
    		}
    		console.log('datas',datas)
      		self.$axios({
      			url: self.BP_HOST+'/inter/'+urls,
      			method: methods,
	    		responseType: 'json',
	    		data: datas
	    	})
	    	.then(function(response){
	    		console.log(response)
	    		if(response.data.status == 200){
	    			if(self.type == 'xz'){
	    				self.$message({
				          	message: '新增接口完成！',
				          	type: 'success',
				          	duration:1500
				        });
				        self.routeId++
				        self.$router.push('/Portconfig?id='+self.routeId)
	    			}else if(self.type == 'bj'){
	    				self.$message({
				          	message: '修改接口成功！',
				          	type: 'success',
				          	duration:1500
				        });
	    				self.routeId++
				        self.$router.push('/Portconfig?id='+self.routeId)
	    			}
	    			self.getProt();
		    		self.$refs[formPort].resetFields();
	    			self.registerFormVisible = false;	
	    		}else{
	    			if(self.type == 'xz'){
	    				self.$message({
				          	message: '新增接口失败！',
				          	type: 'error',
				          	duration:1500
				        });
	    			}else if(self.type == 'bj'){
	    				self.$message({
				          	message: '修改接口失败！',
				          	type: 'error',
				          	duration:1500
				        });
	    			}
	    		}
      		})
	    	.catch(function(response){
      			console.log(response);
	    	})
    	},
    	sureRegister(formPort){//新增接口完成
    		let self = this;
    		self.$refs[formPort].validate((valid) => {
          		if (valid) {
          			self.addSurePort(formPort)
          		} else {
            		console.log('error submit!!');
            		return false;
          		}
        	});
    	},
    	registerCancel(formName){//关闭注册模态框
    		/*console.log("formPort", self.$refs[formPort])*/
    		let self = this;
    		/*self.formPort = {
    			server_name:'',
      			port_name:'',
      			ask_pattern:'',
      			port_link:'',
      			port_intro:'',
      			ask_example:'',
      			back_example:'',
    		};*/
    		/*self.$refs[formPort].resetFields();*/
    		self.registerFormVisible = false;
    		self.formPort = {}
    		self.$refs[formName].resetFields();
    	}
    }
}
</script>
<style scoped>
  	.port_header .ipt{
		width: 34%;
		margin-right:10px;
  	}
  	.refer{
  		width: 80px;
  		/*margin-left: -180px;*/
  	}
  	.port_main{
  		margin-top: 20px;
  	}
  	.el-table__body-wrapper .cell{
  		max-height: 50px;
  	}
  	.g-footer{
      	justify-content: space-between;
    }
</style>
<style>
	.port_header .el-select .el-input {
    	width: 200px;
  	}
  	.port_main .el-table .cell{
  		max-height: 50px;
  		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
  	}
  	.ipt_wid{
		width: 34%;
	}
	.area_ipt{
		width: 68%;
	}
</style>