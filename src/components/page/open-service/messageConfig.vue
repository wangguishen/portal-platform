<template>
	<div class="mainBox">
		<!-- 参数展示 -->
		<div class="presentPara">
			<el-table
			    :data="tableData"
			    border
			    empty-text="此接口暂无参数管理"
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
			        	<el-button @click="parametersDetails(scope.$index, tableData)" size="small">参数详情</el-button>
			        	<el-button @click="recordShow(scope.$index, tableData)" size="small">日志展示</el-button>
			      	</template>
				</el-table-column>
  			</el-table>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData:[],
				fileList:[],
				showFileList:true,
				listFiles:[],//文件条数
				topic:'',
			}
		},
		mounted(){
			let self = this;
			self.queryTopic();
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
								self.tableData.push(item)
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
			recordShow(scope,tab){//日志展示
				let self = this;
				console.log('日志展示')
				localStorage.setItem('logShow',JSON.stringify(tab[scope]))
				self.$router.push('/LogsShow');
			},
			parametersDetails(scope,tab){//参数详情
				let self = this;
				console.log('参数详情')
				console.log(scope,tab[scope])
				let relateTopic = tab[scope].topic
				let datas = {
					'topic' : relateTopic
				}
				self.$axios({
					url:self.BP_HOST+"/inter/query_by_topic?topic="+relateTopic,
					// url:"http://172.19.4.232:3333/basic-platform/inter/query_by_topic?topic="+self.topic,
					method:"get",
					responseType:'json',
					data:datas
				})
				.then((res)=>{
					console.log('parametersDetails Success',res)
					if (res.data.status == 200) {
						let resData = res.data.data;
						if (!resData) {
							console.log('resData',resData)
							self.$message.warning('该主题下暂无参数!')
							return
						}
						let paraMid = resData.mId;
						let paraId = resData.id;
						console.log(paraMid,paraId)

						self.$router.push('/serverDetail?id='+paraMid+'-'+paraId)
					}else{
						self.$message.error('服务器信息错误!')
					}
				})
				.catch((res)=>{
					console.log('parametersDetails Error',res)
				})
			},
		}
	}
</script>

<style scoped>
	.mainBox {
		overflow: hidden;
	}

</style>

<style>
	.presentPara .el-table__header .is-leaf {
		text-align: center;
	}
	.presentPara .el-table__body-wrapper .cell{
		text-align: center;
	}
</style>