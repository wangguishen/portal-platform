<template>
	<div>
		<div class="par_header">
			<el-input placeholder="请输入参数名称" v-model="parInput" class="select_box leftFloatBox" @keyup.enter.native="askPar()">
		    	<template slot="prepend">参数名称</template>
		  	</el-input>
		  	<el-button type="primary" icon="search" @click="askPar()">搜索</el-button>
		  	<el-button type="info" @click="registerpar()">注册参数</el-button>
		</div>
		<div class="par_main">
			<el-table
			    :data="paramData"
			    border
			    empty-text="暂无监控链接参数，请注册链接参数"
			    style="width: 100%">
			    <el-table-column
			      	prop="parIndex"
			      	label="序列"
			      	width="100">
    			</el-table-column>
    			<el-table-column
			      	prop="paramName"
			      	label="参数名称"
			      	width="400">
			    </el-table-column>
			    <el-table-column
			      	prop="field"
			      	label="参数字段"
			      	width="250">
    			</el-table-column>
			    <el-table-column
			      	prop="sample"
			      	label="示例"
			      	width="250">
			    </el-table-column>
			    <el-table-column
			      	label="操作">
				    <template slot-scope="scope">
			        	<el-button @click="handleClick(scope.$index, paramData)" type="text" size="small">编辑</el-button>
			        	<el-button type="text" size="small" @click="delectClick(scope.$index, paramData)">删除</el-button>
			      	</template>
    			</el-table-column>
  			</el-table>
		</div>
		<el-dialog :title="objStat.title" @close="registerCancel()" :visible.sync="parameterVisible">
		  	<el-form :model="formPar">
		  		<el-form-item label="参数名称：" :label-width="formLabelWidth">
			      	<el-input v-model="formPar.paramName" placeholder="请输入参数名称" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
		  		<el-form-item label="字段：" :label-width="formLabelWidth">
		  			<el-input v-model="formPar.field" placeholder="请输入字段" auto-complete="off" class="ipt_wid"></el-input>
			    </el-form-item>
			    <el-form-item label="示例：" :label-width="formLabelWidth">
			      	<el-input type="textarea" autosize v-model="formPar.sample" placeholder="请输入示例" class="area_ipt"></el-input>
			      	<!-- <el-input v-model="formPar.sample" placeholder="请输入示例" auto-complete="off" class="ipt_wid"></el-input> -->
			    </el-form-item>
  			</el-form>
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="registerFormVisible=false">取 消</el-button>
			    <el-button type="primary" @click="paramSure()">确 定</el-button>
		  	</div>
		</el-dialog>
		<el-dialog title="删除参数" :visible.sync="delectVisible" size="tiny">
		  	<span>确定要删除此参数吗？</span>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button @click="delectVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="delectSure()" :autofocus="autofocusShow" @keyup.enter.native="delectSure()">确 定</el-button>
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
export default{
	data(){
		return{
			objParameter:{},//进入的对象
			parInput: '',//参数输入值
			paramData: [],//参数列表
			//分页
			totalCount:0,
			pageSize:10,
			currentPage:1,
			// 新增
			formLabelWidth: '120px',
			parameterVisible:false,
			selectIndex:0,//选中代码
	        selectList:{},//选中状态
			formPar:{
				paramName:'',
	        	field:'',
	        	sample:''
			},
			objStat:{
				state:0,
				title:'',
			},
			// 删除
			delectVisible: false,
			autofocusShow:true,
		}
	},
	mounted(){
		let self = this;
		self.objParameter = JSON.parse(localStorage.getItem('objParameter'));
		self.askPar();
	},
	methods:{
		askPar(){//请求参数
			let self = this;
			let url = '/basic-platform/param/sel?linkId='+self.objParameter.id+'&paramName='+self.parInput+'&pageSize='+self.pageSize+'&currentPage='+self.currentPage;
			let data = {
				'linkId': self.objParameter.id,
				'paramName': self.parInput,
				'pageSize': self.pageSize,
				'currentPage': self.currentPage
			};
			let method = 'get';
			self.asklinkparm(url, data, method, 'cx')
		},
		registerpar(){//注册
			let self = this;
			self.objStat = {
				title:"注册参数",
				state:0
			}
			self.parameterVisible = true;
		},
		changeCur(val){//分页查询
			let self = this;
			self.currentPage = val;
			self.paramData = [];
			self.askPar();
		},
		handleClick(index, tab){//编辑按钮
			let self = this;
			self.objStat = {
				'title': '编辑参数',
				'state': 1
			}
			self.formPar = {//上传对象
				'paramName': tab[index].paramName,
				'field': tab[index].field,
				'sample': tab[index].sample,
			}
			self.parameterVisible = true;
			self.selectList = tab[index];
    		self.selectIndex = index;
		},
		delectClick(index, tab){//删除按钮
			let self = this;
			self.delectVisible = true;
			self.selectList = tab[index];
    		self.selectIndex = index;
		},
		delectSure(){//确定删除
			let self = this;
			let url = "/basic-platform/param/del";
			let data = {
				'id': self.selectList.id,
			};
			let method = 'delete';
			self.asklinkparm(url, data, method, 'sc')
		},
		paramSure(){//确定
			let self = this;
			if(self.formPar.paramName == ''){
				self.$message({
		          	message: '请输入参数介绍',
		          	type: 'warning',
		          	duration:1500
		        });
			}else if(self.formPar.field == ''){
				self.$message({
		          	message: '请输入字段',
		          	type: 'warning',
		          	duration:1500
		        });
			}else if(self.formPar.sample == ''){
				self.$message({
		          	message: '请输入示例',
		          	type: 'warning',
		          	duration:1500
		        });
			}else{
				let url = '',method = '',data = {},type='';
				if(self.objStat.state == 0){
					url = '/basic-platform/param/add';
					data = {
						paramName: self.formPar.paramName,
						field: self.formPar.field,
						linkId: self.objParameter.id,
						sample: self.formPar.sample
					}
					method = 'post';
					type = 'xz';
				}else if(self.objStat.state == 1){
					url = '/basic-platform/param/up';
					data = {
						paramName: self.formPar.paramName,
						field: self.formPar.field,
						id: self.selectList.id,
						sample: self.formPar.sample
					}
					method = 'put';
					type = 'bj';
				}
				self.asklinkparm(url, data, method, type)
			}
		},
		asklinkparm(url, data, method, type){//公共请求
			let self = this;
			self.$axios({
	    		url: url,
	    		method: method,
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(res) {
	    		console.log(res)
	    		if(res.data.status == 200){
	    			let list = res.data.data;
	    			if(type == 'xz'){
	    				self.parameterVisible = false;
	    				self.$message({
				          	message: '新增参数成功',
				          	type: 'success',
				          	duration:1500
				        });
	    				self.askPar();
	    			}else if(type == 'cx'){
	    				self.paramData = [];
	    				self.totalCount = res.data.page.totalRows;
	    				list.forEach(function(item, index){
	    					self.$set(item,'parIndex',(index+1))
	    					self.paramData.push(item);
	    				})
	    			}else if(type == 'bj'){
	    				self.askPar();
	    				self.parameterVisible = false;
	    				self.$message({
				          	message: '新增参数成功',
				          	type: 'success',
				          	duration:1500
				        });
	    			}else if(type == 'sc'){
	    				if(self.paramData.length == 1){
	    					self.currentPage--;
	    				}
	    				self.askPar();
	    				self.delectVisible = false;
	    				self.$message({
				          	message: '删除参数成功',
				          	type: 'success',
				          	duration:1500
				        });
	    			}
	    		}else{
	    			self.$message({
			          	message: res.data.message,
			          	type: 'warning',
			          	duration:1500
			        });
	    		}
	    	})
	    	.catch(function(res) {
	    		console.log("报错了")
	    	})
		},
		registerCancel(){//关闭注册模态框
    		let self = this;
			self.formPar={
	        	paramName:'',
	        	field:'',
	        	sample:''
	        }
    		self.registerFormVisible = false;
    	},
	}
}
</script>
<style scoped>
	.par_header{
		margin-bottom: 20px;
	}
	.select_box{
		width: 25%;
	}
	.ipt_wid{
		width: 34%;
	}
	.area_ipt{
		width: 68%;
	}
</style>