<template>
	<div class="mainBox">
		<!-- 参数展示 -->
		<div class="logsShow">
			<el-table
			    :data="tableData"
			    border
			    empty-text="此接口暂无参数"
			    style="width: 100%">
			    <el-table-column
			      	prop="topic"
			      	label="主题"
			      	width="160">
	    		</el-table-column>
			    <el-table-column
			      	prop="clientCode"
			      	label="客户端编码"
			      	width="160">
	    		</el-table-column>
			    <el-table-column
			      	prop="message"
			      	label="信息日志"
			      	width="600">
			      	<template slot-scope="scope">
				        <el-popover trigger="hover" placement="top">
				        	<div style="box-sizing: border-box;">
				        		<p style="width: 600px;box-sizing: border-box;word-wrap: break-word;">message: {{ scope.row.message }}</p>
				        	</div>
				          	<div slot="reference" class="name-wrapper">
				            	<el-tag size="medium">{{ scope.row.message }}</el-tag>
				          	</div>
				        </el-popover>
				    </template>
			    </el-table-column>
			    <el-table-column
			      	prop="operation"
			      	label="操作"
			      	width="180">
			    </el-table-column>
			    <el-table-column
			    	prop="lastUpdateDate"
			      	label="最后修改时间">
				</el-table-column>
			</el-table>
		</div>
		<div class="g-footer">
          	<div style="margin-top: 20px;" v-show="PageCount">
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
		data(){
			return {
				// 分页
		        pageSize: 10,
		        totalCount:0,
		        currentPage:1,//当前页数
		        jsonTopic:'',
		        tableData:[],
		        PageCount:false,
		        options:[
		        	{label:'更新',value:'update'},
		        	{label:'新增',value:'add'},
		        	{label:'删除',value:'delete'},
		        	{label:'插入',value:'insert'}
		        ]
			}
		},
		mounted(){
			let self = this;
			let logsShowJson = JSON.parse(localStorage.getItem('logShow'))
			console.log('logsShowJson',logsShowJson)
			self.jsonTopic = logsShowJson.topic;
			self.queryLogs();
		},
		methods:{
			queryLogs(){
				let self = this;
				self.$axios({
					url:'http://172.19.4.232:4444/vr-push/queryApollo?pageSize='+self.pageSize+'&currentPage='+self.currentPage+'&topic='+self.jsonTopic,
					method:'get',
					responseType:'json',
					data:{
						'topic' : self.jsonTopic
					}
				})
				.then((res)=>{
					console.log('queryLogs Success',res)
					if (res.data.status == 200) {
						let resData = res.data.data;
						console.log('resData',resData)
						self.tableData = []
						if (resData.length != 0) {
							self.PageCount = true;
							self.totalCount = res.data.page.totalRows;
							resData.forEach(function(item,index){
								item.lastUpdateDate = self.changeTime(item.lastUpdateDate)
								for(let k in self.options){
									if(self.options[k].value == item.operation){
										item.operation = self.options[k].label
									}
								}
								self.tableData.push(item)
							})
						}else{
							self.PageCount = false;
							// self.$message.warning('该接口暂无数据!')
						}
					}else{
						self.$message.error('服务器信息错误!');
					}
				})
				.catch((res)=>{
					console.log('queryLogs Error',res)
				})
			},
			changeTopic(val){
				let self = this;
				self.currentPage = val;
				self.tableData = []
				self.queryLogs();
			},
			changeTime(time) {
			    let self = this;
			    let newTime = new Date(time);
			    let obj = {
			        month: '',
			        day: ''
			    };
			    let times = '';
			    if (newTime.getMonth() + 1 > 0 && newTime.getMonth() + 1 < 10) {
			        obj.month = '0' + (newTime.getMonth() + 1);
			    } else {
			        obj.month = newTime.getMonth() + 1;
			    }
			    if (newTime.getDate() > 0 && newTime.getDate() < 10) {
			        obj.day = '0' + newTime.getDate();
			    } else {
			        obj.day = newTime.getDate();
			    }
			    times = newTime.getFullYear() + "-" + obj.month + "-" + obj.day;
			    return times;
			},	
		}
	}
</script>

<style scoped>
	
</style>