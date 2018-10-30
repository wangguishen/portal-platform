<template>
	<div class="mainBox">
		<!-- 输入-搜索框 -->
		<div class="topicHeader">
			<el-input placeholder="请输入主题名称" v-model="iptTopic" class="ipt" @keyup.enter.native="demandTopic">
			</el-input>
			<el-button type="primary" class="refer"  icon="search" @click="demandTopic()">查询</el-button>
			<el-button type="info" @click="addTopic()">新增主题</el-button>
		</div>
		<!-- 参数展示 -->
		<div class="presentPara">
			<el-table
			    :data="tableData"
			    border
			    empty-text="此接口暂无参数"
			    @cell-click="urlClick()"
			    style="width: 100%">
			    <el-table-column
			      	prop="topic"
			      	label="主题"
			      	width="160">
	    		</el-table-column>
			    <el-table-column
			      	prop="sender"
			      	label="发送者"
			      	width="140">
	    		</el-table-column>
			    <el-table-column
			      	prop="recevier"
			      	label="接收者"
			      	width="140">
			    </el-table-column>
			    <el-table-column
			      	prop="remark"
			      	label="备注"
			      	width="140">
			    </el-table-column>
			    <el-table-column
			      	prop="url"
			      	label="文档链接"
			      	width="220">
			    </el-table-column>
			    <el-table-column
			    	prop="servicer"
			      	label="服务器"
			      	width="200">
				</el-table-column>
				<el-table-column
		      	label="操作">
				    <template slot-scope="scope">
				    	<el-button @click="relateTopic(scope.$index, tableData)" size="small">注册关联主题</el-button>
			        	<el-button @click="handleClickEdit(scope.$index, tableData)" size="small">编辑</el-button>
			        	<el-button type="danger" size="small" @click="handleClickDelete(scope.$index, tableData)">删除</el-button>
			      	</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 关联主题弹框 -->
		<el-dialog title="注册关联主题" @close="relateTopicCancel('relateTopicForm')" :visible.sync="relateTopicFormVisible">
  			<el-form :model="relateTopicForm" :rules="topicRules" ref="relateTopicForm" class="demo-ruleForm">
  				<el-form-item label="关联主题：" :label-width="formLabelWidth" prop="associateTopic">
			      	<el-input v-model="associateTopic" auto-complete="off" readonly class="ipt_wid"></el-input>
			    </el-form-item>
  				<el-form-item label="服务名称：" :label-width="formLabelWidth" prop="serverName">
		      		<el-select v-model="relateTopicForm.serverName" class="ipt_wid" placeholder="请选择服务名称" @change="selectServerClick(relateTopicForm.serverName)">
			        	<el-option
					      	v-for="item in portList"
					      	:key="item.value"
					      	:label="item.label"
					      	:value="item.value">
				    	</el-option>
			      	</el-select>
			    </el-form-item>
			    <el-form-item label="接口名称：" :label-width="formLabelWidth" prop="interName">
			      	<el-input v-model="relateTopicForm.interName" placeholder="请输入接口名称" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <!-- <el-form-item label="接口名称：" :label-width="formLabelWidth" prop="ask_pattern">
		      		<el-select v-model="inter_name" placeholder="请选择接口名称" class="ipt_wid" @change="changePort(inter_name)">
			        	<el-option
					      	v-for="(item,index) in interNameList"
					      	:key="item.value"
					      	:label="item.label"
					      	:value="item.value">
				    	</el-option>
			      	</el-select>
			    </el-form-item> -->
			    <el-form-item label="请求方式：" :label-width="formLabelWidth" prop="interMethod">
		      		<el-select v-model="relateTopicForm.interMethod" placeholder="请选择请求方式" class="ipt_wid">
			        	<el-option
					      	v-for="(item,index) in mannerList"
					      	:key="item.value"
					      	:label="item.label"
					      	:value="item.value">
				    	</el-option>
			      	</el-select>
			    </el-form-item>
			    <el-form-item label="接口链接：" :label-width="formLabelWidth" prop="url">
			      	<el-input v-model="relateTopicForm.url" placeholder="请输入接口链接" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="接口简介：" :label-width="formLabelWidth" prop="introduce">
			      	 <el-input type="textarea" autosize v-model="relateTopicForm.introduce" placeholder="请输入接口简介" class="area_ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="请求示例：" :label-width="formLabelWidth" prop="reqData">
			      	 <el-input type="textarea" autosize v-model="relateTopicForm.reqData" placeholder="请输入请求示例" class="area_ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="返回示例：" :label-width="formLabelWidth" prop="repData">
			      	 <el-input type="textarea" autosize v-model="relateTopicForm.repData" placeholder="请输入返回示例" class="area_ipt"></el-input>
			    </el-form-item>
  			</el-form>
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="relateTopicFormVisible=false">取 消</el-button>
			    <el-button type="primary" @click="sureRelateTopic('relateTopicForm')">确 定</el-button>
		  	</div>
		</el-dialog>
		<!-- 编辑或新增弹框 -->
		<el-dialog :title="portTitle" @close="registerCancel('formPort')" :visible.sync="registerFormVisible">
  			<el-form :model="formPort" :rules="rules" ref="formPort" class="demo-ruleForm">
			    <el-form-item label="topic" :label-width="formLabelWidth" prop="topic">
			      	<el-input v-model="formPort.topic" placeholder="请输入topic" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="发送者" :label-width="formLabelWidth" prop="sender">
			      	<el-input v-model="formPort.sender" placeholder="请输入发送者" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="接收者" :label-width="formLabelWidth" prop="recevier">
			      	<el-input v-model="formPort.recevier" placeholder="请输入发送者" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
				<el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
			      	<el-input v-model="formPort.remark" placeholder="请选择" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
				<el-form-item label="文档链接" :label-width="formLabelWidth" v-show="urlShow" >
			      	<el-input v-model="formPort.url" placeholder="获取文档链接" auto-complete="off" class="ipt_wid" :readonly="true"></el-input>
			    </el-form-item>
			    <el-form-item label="文档链接" :label-width="formLabelWidth" prop="url" v-show="!urlShow">
			      	<el-input v-model="formPort.url" placeholder="获取文档链接" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="服务器" :label-width="formLabelWidth" prop="servicer">
			      	<el-input v-model="formPort.servicer" placeholder="请输入服务器" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="上传文档" style="margin-left: 7%;">
			    	<div style="display: inline-block;float: left;">
			    		<el-upload
						  	:action="importUserUrl"
						  	multiple
						  	ref="upload"
						  	:show-file-list="showFileList"
						  	:on-preview="handlePreview"
						  	:on-remove="handleRemove"
						  	:on-success="handleSuccess"
						  	:on-error="handleError"
						  	:on-progress="handleProgress"
						  	:on-change="handleChange"
						  	:before-upload="beforeUpload"
						  	:auto-upload="false"
						  	:limit="1"
						  	:on-exceed="handleExceed"
						  	:data="uploadData">
						  <i class="el-icon-plus"></i>
						</el-upload>
			    	</div>
			    		
					<div style="display: inline-block;float: left;margin-left: 17%;">
						<el-button class="btn-upload" @click="submitUpload()">上传服务器</el-button>
					</div>
			    </el-form-item>
  			</el-form>
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="registerFormVisible=false">取 消</el-button>
			    <el-button type="primary" @click="sureRegister('formPort')">确 定</el-button>
		  	</div>
		</el-dialog>
		<!-- 删除弹框 -->
		<el-dialog title="删除主题" :visible.sync="delectVisible" size="tiny">
		  	<span>确定要删除此数据吗？</span>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button @click="delectVisibleCancel">取 消</el-button>
		    	<el-button type="primary" @click="delectSure()">确 定</el-button>
		  	</span>
		</el-dialog>
		<div class="g-footer">
          	<div style="margin-top: 20px" v-show="PageCount">
            	<el-pagination
	              	:page-size="pageSize"
	              	@current-change="changeTopic"
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
				urlShow:false,
				routeId:0,
				deleteId:'',
				tableData:[],
				fileList:[],
				showFileList:true,
				iptTopic:'',//输入框
				listFiles:[],//文件条数
				registerFormVisible:false,
				type:'',//注册或编辑状态改变控制
				relateTopicForm:{//关联主题form
					serverName:'',
					interName:'',
					interMethod:'',
					url:'',
					introduce:'',
					reqData:'',
					repData:''
				},
				formPort:{//编辑或者注册弹框内容
					topic:'',
					sender:'',
					recevier:'',
					remark:'',
					url:'',
					servicer:''
				},
				formLabelWidth:'120px',//input宽度
				portTitle:'',//编辑或注册框表头
				rules:{
					topic:[{ required: true, message: '请输入topic', trigger: 'blur' }],
      				sender:[{ required: true, message: '请输入发送者', trigger: 'blur' }],
      				recevier:[{ required: true, message: '请输入接收者', trigger: 'blur' }],
      				remark:[{ required: true, message: '请输入备注', trigger: 'blur' }],
      				url:[{ required: true, message: '未获取到链接', trigger: 'blur'}],
      				servicer:[{ required: true, message: '请输入服务器', trigger: 'blur'}],
				},
				topicRules:{
					serverName:[{required:true,message:'请选择服务名称',trigger:'change'}],
					interName:[{required:true,message:'请输入接口名称',trigger:'blur'}],
					interMethod:[{required:true,message:'请选择请求方式',trigger:'change'}],
					url:[{required:true,message:'请输入接口链接',trigger:'blur'}],
					introduce:[{required:true,message:'请输入接口简介',trigger:'blur'}],
					reqData:[{required:true,message:'请输入请求示例',trigger:'blur'}],
					repData:[{required:true,message:'请输入返回示例',trigger:'blur'}]
				},
				delectVisible:false,
				PageCount:false,
				// 分页
		        pageSize: 10,
		        totalCount:0,
		        currentPage:1,//当前页数
		        importUserUrl:'',
		        uploadData:{module_id:1},
		        docUrl:'',//上传文档网络路径
		        relateTopicFormVisible:false,
		        portList:[],//所有服务列表
		        mannerList:[//请求方式列表
	      			{label:'PUT',value:'PUT'},
	      			{label:'POST',value:'POST'},
	      			{label:'GET',value:'GET'},
	      			{label:'DELETE',value:'DELETE'},
	      		],
	      		serveMid:'',
	      		server_name:'',//服务名称
	      		inter_name:'',//接口名称
	      		interNameList:[],//接口列表
	      		currentTopic:'',//当前点击topic
	      		associateTopic:'',
			}
		},
		mounted(){
			let self = this;
			self.getTopicMehtods();
			self.adminSessionId = localStorage.getItem('adminSessionId')
            console.log('adminSessionId',self.adminSessionId)
            self.importUserUrl = self.LOGO_UPDATE_URL
            self.getServer()
		},
		methods:{
			urlClick(){
				let self = this;
				console.log('cell click')
			},
			relateTopic(scope,tab){
				let self = this;
				console.log('关联主题',tab[scope])
				self.currentTopic = tab[scope].topic
				console.log(self.currentTopic)
				self.associateTopic = self.currentTopic
				self.isRelate()
			},
			isRelate(){//判断该主题下是否已有关联
				let self = this;
				self.$axios({
					url:self.BP_HOST+"/inter/query_by_topic?topic="+self.currentTopic,
					responseType:'json',
					method:'get',
					data:{
						'topic' : self.currentTopic
					}
				})
				.then((res)=>{
					console.log('isRelate Success',res)
					if (res.data.status == 200) {
						let resData = res.data.data;
						if (resData) {
							self.relateTopicFormVisible = false;
							self.$message.warning('该主题已关联接口,请选择其他主题')
							return
						}
						self.relateTopicFormVisible = true;
					}
				})
				.catch((res)=>{
					console.log('isRelate Error',res)
				})
			},
			sureRelateTopic(relateTopic){//确认关联
				let self = this;
				self.$refs[relateTopic].validate((valid)=>{
	    			if (valid) {
	    				let datas = {
							mId : parseInt(self.serveMid),
		    				interName :	self.relateTopicForm.interName,
							interMethod : self.relateTopicForm.interMethod,
							url : self.relateTopicForm.url,
							introduce : self.relateTopicForm.introduce,
							repData : self.relateTopicForm.repData,
							reqData:self.relateTopicForm.reqData,
							topic: self.currentTopic
						}
						console.log('datas',datas)
						self.$axios({
							url:self.BP_HOST+'/inter/add',
							method:'post',
							responseType:'json',
							data:datas
						})
						.then((res)=>{
							console.log('sureRelateTopic Success',res)
							if (res.data.status == 200) {
								self.$message.success('主题关联成功')
								self.relateTopicFormVisible = false;
							}else{
								self.$message.error('主题关联失败')
							}
						})
						.catch((res)=>{
							console.log('sureRelateTopic Error',res)
						})
	    			}else{
	    				console.log('error submit!!');
            			return false;
	    			}
	    		})
					
			},
			relateTopicCancel(relateTopic){//关闭关联主题模态框
				let self = this;
				self.relateTopicFormVisible = false;
	    		self.relateTopicForm = {}
	    		self.$refs[relateTopic].resetFields();
	    		self.server_name = ''
			},
			selectServerClick(index){//选择切换服务
				let self = this;
				console.log('selectServerClick index',index)
				self.serveMid = index;
				// self.getPort();
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
	    	getPort(){//请求接口
	    		let self = this;
	    		console.log('mId',self.serveMid)
	    		let urls;
    			urls = self.BP_HOST+'/inter/sel?mId='+parseInt(self.serveMid)+'&interName='
	    		let datas={
	    			'mId' : parseInt(self.serveMid),
	    			'interName':''
		    	};
		    	console.log('datas',datas);
	      		self.$axios({
	      			url: urls,
	      			method: 'get',
		    		responseType: 'json',
		    		data: datas
		    	})
		    	.then(function(response){
		    		console.log('getPort Success',response);
		    		if(response.data.status == 200){
		    			let list = response.data.data;
		    			console.log('list',list)
		    			self.interNameList = []
		    			if(list){
		    				// self.relateTopicForm = list;
		    				list.forEach(function(item,index){
		    					item.label = item.interName;
		    					item.value = item.interName
		    					self.interNameList.push(item)
		    				})
		    				console.log('interNameList',self.interNameList)
		    			}else{
		    				self.$message.warning('该接口下暂无参数')
		    			}
		    		}else{
		    			self.$message.error('服务器信息错误')
		    		}
	      		})
		    	.catch(function(response){
	      			console.log(response);
		    	})
	    	},
	    	changePort(port){//切换接口
	    		let self =this;
	    		console.log('changePort port',port)
	    		// self.relateParas(port);
	    	},
	    	relateParas(portName){//请求关联主题表数据
	    		let self = this;
	    		self.$axios({
	    			url: self.BP_HOST+'/inter/sel?mId='+parseInt(self.serveMid)+'&interName='+portName+'&pageSize='+self.pageSize+'&currentPage='+self.currentPage,
	      			method: 'get',
		    		responseType: 'json',
		    		data: {
		    			'mId' : parseInt(self.serveMid),
		    			'interName' : portName
		    		}
	    		})
	    		.then((res)=>{
	    			console.log('relateParas Success',res)
	    			self.relateTopicForm = []
	    			if (res.data.status == 200) {
	    				let resData = res.data.data[0]
	    				self.relateTopicForm = resData
	    			}
	    		})
	    		.catch((res)=>{
	    			console.log('relateParas Error',res)
	    		})
	    	},	
			demandTopic(){//查询Topic
				let self = this;
				console.log('查询topic')
				self.$nextTick(()=>{
					self.getTopicMehtods();
				})
			},
			changeTopic(val){//分页
				let self = this;
				self.currentPage = val;
				self.tableData = [];
				self.getTopicMehtods();
			},
			getTopicMehtods(){//请求topic列表
				let self = this;
				self.$axios({
					url:self.BP_HOST+"/messageApplication/queryMesseageApplication?pageSize="+self.pageSize+"&currentPage="+self.currentPage+"&topic="+self.iptTopic,
					method:'get',
					responseType:'json',
					data:{
						'topic' : self.iptTopic
					}
				})
				.then((res)=>{
					console.log('getTopicMehtods Success',res);
					if (res.data.status == 200) {
						let resData = res.data.data;
						self.totalCount = res.data.page.totalRows
						if (resData) {
							self.tableData = []
							resData.forEach(function(item,index){
								self.tableData.push(item)
							})
							self.PageCount = true;
						}else{
							self.$message.warning('此接口暂无参数')
						}	
					}else{
						self.$message.error('服务器信息错误')
					}
				})
				.catch((res)=>{
					console.log('getTopicMehtods Error',res)
				})
			},
			handleClickEdit(scope,tab){//编辑
				let self = this;
				console.log('编辑',scope,tab[scope])
				self.urlShow = false;
				self.portTitle = "编辑Topic框"
				self.registerFormVisible = true;
				let editForm = {
					topic : tab[scope].topic,
					sender : tab[scope].sender,
					recevier : tab[scope].recevier,
					remark : tab[scope].remark,
					url : tab[scope].url,
					servicer : tab[scope].servicer,
					id : tab[scope].id
				}
				self.formPort = editForm;
				self.type = 'bj'
			},
			addTopic(){//新增topic
				let self = this;
				self.portTitle = "注册Topic框"
				self.type = 'xz'
				if (self.type == 'xz') {
					self.urlShow = true;
				}
				self.registerFormVisible = true;
			},
			handleClickDelete(scope,tab){//删除
				let self = this;
				console.log('删除',scope,tab[scope])
				self.delectVisible = true;
				self.deleteId = tab[scope].id;
			},
			delectVisibleCancel(){//取消删除
				let self = this;
				self.delectVisible = false;
				self.$message.warning("您已取消删除")
			},
			delectSure(){//确认删除
				let self = this;
				console.log('go delectSure methods')
				self.$axios({
					url:self.BP_HOST+'/messageApplication/delMessageApplication',
					method:'post',
					responseType:'json',
					data:{
						id : self.deleteId
					}
				})
				.then((res)=>{
					console.log('delectSure Success',res)
					if (res.data.status == 200) {
						self.$message.success('主题删除成功');
						self.delectVisible = false;
						self.getTopicMehtods();
						self.routeId++;
						self.$router.push('/TopicPushConfig?id='+self.routeId)
					}else{
						self.$message.error('删除主题失败')
					}
				})
				.catch((res)=>{
					console.log('delectSure Error',res)
				})
			},
			registerCancel(formName){//关闭注册编辑模态框
    			let self = this;
    			console.log('go registerCancel methods')
	    		self.registerFormVisible = false;
	    		self.formPort = {}
	    		self.$refs[formName].resetFields();
	    		self.$refs.upload.clearFiles()
	    	},
	    	sureRegister(formPort){//确认编辑或注册
	    		let self = this;
	    		console.log('编辑弹框确认')
	    		self.$refs[formPort].validate((valid)=>{
	    			if (valid) {
	    				self.addSurePort(formPort);
	    			}else{
	    				console.log('error submit!!');
            			return false;
	    			}
	    		})
	    	},
	    	addSurePort(formPort){//确认编辑或注册
	    		let self = this;
	    		let datas = {};
	    		let urls = '';
    			let methods = '';
	    		console.log('go addSurePort methods')
	    		if (self.type == 'xz') {
	    			methods = 'post'
	    			urls = self.BP_HOST+'/messageApplication/addMessageApplication'
	    			datas = {
	    				'topic' : self.formPort.topic,
	    				'sender' : self.formPort.sender,
	    				'recevier' : self.formPort.recevier,
	    				'remark' : self.formPort.remark,
	    				'url' : self.formPort.url,
	    				'servicer' : self.formPort.servicer
	    			}
	    		}else if (self.type == 'bj') {
	    			methods = 'post';
	    			urls = self.BP_HOST+'/messageApplication/updateMesseageApplication'
	    			datas = {
	    				'id' : self.formPort.id,
	    				'topic' : self.formPort.topic,
	    				'sender' : self.formPort.sender,
	    				'recevier' : self.formPort.recevier,
	    				'remark' : self.formPort.remark,
	    				'url' : self.formPort.url,
	    				'servicer' : self.formPort.servicer
	    			}
	    		}
	    		console.log('datas',datas);
	    		self.$axios({
	    			url:urls,
	    			method:methods,
	    			responseType:'json',
	    			data:datas
	    		})
	    		.then((res)=>{
	    			console.log('addSurePort Success',res)
	    			if (res.data.status == 200) {
	    				if (self.type == 'xz') {
	    					self.routeId++;
	    					self.$message.success('新增主题成功');
	    					self.$router.push('/TopicPushConfig?id='+self.routeId)
	    				}else if (self.type == 'bj') {
	    					self.routeId++;
	    					self.$message.success('编辑主题成功');
	    					self.$router.push('/TopicPushConfig?id='+self.routeId)
	    				}
	    				self.getTopicMehtods()
	    				self.registerFormVisible = false;
	    			}else{
	    				self.$message.error('服务器信息错误')
	    			}
	    		})
	    		.catch((res)=>{
	    			console.log('addSurePort Error',res)
	    		})
	    	},
			handlePreview(file){//点击已上传文件触发
				let self = this;
				console.log('file',file)
			},
			handleRemove(file,fileList){//文件被移除时触发
				let self = this;
				console.log('file',file,'fileList',fileList)
				self.$message.warning('文件被移除');
			},
			handleSuccess(response,file,fileList){//文件上传成功时触发
				let self = this;
				console.log('handleSuccess','response',response,'file',file,'fileList',fileList)

				if (response.returncode == 0) {
                    self.$message.success("上传文件成功")
                    self.docUrl = response.data[0].file_url;
                    console.log('docUrl',self.docUrl)
                    self.formPort.url = self.docUrl;
                }else{
                    self.$message.warning(response.errmsg);
                    self.$refs.upload.clearFiles()
                }
			},
			handleError(err,file,fileList){//文件上传失败时触发
				let self = this;
				console.log('err',err,'file',file,'fileList',fileList)
				self.$message.error('文件上传失败');
			},
			handleProgress(event, file, fileList){//文件上传时触发
				let self = this;
				console.log('handleProgress,event',event,'file',file,'fileList',fileList)
			},
			handleChange(file, fileList){//文件状态改变时触发
				let self = this;
				console.log('handleChange,file',file,'fileList',fileList)
				/*获取文件后缀名*/
                let types = file.name.split('.').pop();
                console.log('types',types)

                const fileType = ['docx','dotx','doc','dot','docm','dotm'].some(item => item === types)

                const isLt5M = file.size / 1024 / 1024 < 5

                console.log('fileType',fileType,'isLt5M',isLt5M)
                if (!fileType) {
                	self.$message.warning('请上传指定文件')
                	self.$refs.upload.clearFiles()
                	return
                }
                if (!isLt5M) {
                	self.$message.warning('文件大小不能超过5M')
                	self.$refs.upload.clearFiles()
                	return
                }
				self.listFiles = fileList;

				if (self.listFiles.length > 1) {
                    self.handleExceed();
                }
			},
			beforeUpload(file){//上传文件之前
				let self = this;
				console.log('file',file)
			},
			handleExceed(files, fileList){//超出文件限制触发
				let self = this;
				console.log('files',files,'fileList',fileList)
				self.listFiles.splice(0,1);//限制一条文件上传
			},
			submitUpload(){//上传服务器
				let self = this;
				console.log('go submitUpload methods')
				if (self.listFiles.length == 0) {
					self.$message.warning('您没有选择文件');
					return
				}else{
					self.$refs.upload.submit();
				}
			},
			downloadTemplate(){//下载模板
				let self = this
                let canvas = self.$refs.canvas
                canvas.toBlob(function(blob) {
                    var url = self.EXCEL_TEMPLATE_URL
                    var a = document.createElement('a')
                    a.download = 'canvas'
                    a.href = url
                    a.click()
                    URL.revokeObjectURL(url)
                })
			},
		}
	}
</script>

<style scoped>
	/*.presentPara .el-table__header .is-leaf {
		text-align: center;
	}*/
	.topicHeader .ipt{
		width: 20%;
		margin-right:10px;
  	}
  	.presentPara {
  		margin-top: 10px;
  	}
	.mainBox {
		overflow: hidden;
	}
	.upDownModel .el-upload__tip {
		font-size: 16px;
	}
	.ipt_wid{
		width: 50%;
	}
	.el-upload--text{
		height: 80px;
		width: 80px;
	}
</style>

<style>
	.el-upload--text{
		height: 40px;
		width: 100px;
	}
	.presentPara .el-table__header .is-leaf .cell {
		text-align: center;
		height: 30px;
	}
	.presentPara .el-table__body-wrapper .cell{
		text-align: center;
	}
</style>