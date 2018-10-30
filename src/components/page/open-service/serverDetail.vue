<template>
	<div ref="detail">
		<div v-show="qrCodeShow" class="eqcode">
			<el-button type="info" @click="creat()">生成二维码</el-button>
		</div>
		<div class="server_header">
			<div class="input_box">
				<el-input v-model="hickey.name" :readonly="true" class="ipt_btn">
			    	<template slot="prepend">接口名称</template>
			  	</el-input>
			</div>
			<div class="input_box">
				<el-input v-model="hickey.mode" :readonly="true" class="ipt_btn">
			    	<template slot="prepend">请求方式</template>
			  	</el-input>
			</div>
			<div class="input_box">
				<el-input v-model="hickey.url" :readonly="true" class="ipt_btn">
			    	<template slot="prepend">请求链接</template>
			  	</el-input>
			</div>
		</div>
		<div class="server_main">
			<el-table
			    :data="tableData"
			    border
			    empty-text="此接口暂无参数管理"
			    style="width: 100%">
			    <!-- <el-table-column
			      	prop="index"
			      	label="序号"
			      	width="100">
    			</el-table-column> -->
			    <el-table-column
			      	prop="pName"
			      	label="参数名"
			      	width="200">
    			</el-table-column>
			    <el-table-column
			      	prop="pType"
			      	label="类型"
			      	width="200">
    			</el-table-column>
			    <el-table-column
			      	prop="required"
			      	label="必填"
			      	width="200">
			    </el-table-column>
			    <el-table-column
			      	prop="pIntroduce"
			      	label="简介"
			      	width="200">
			    </el-table-column>
			    <el-table-column
			    	prop="sample"
			      	label="参数示例">
    			</el-table-column>
  			</el-table>
		</div>
		<!-- <el-form :model="hickey">
			<el-form-item label="请求示例：" :label-width="formLabelWidth" class="ipt_text">
		      	<el-input v-model="hickey.ask_example" :rows="10" type="textarea" placeholder="请输入接口名称"></el-input>
		    </el-form-item>
		    <el-form-item label="返回示例：" :label-width="formLabelWidth" class="ipt_text">
		      	<el-input v-model="hickey.back_example" :rows="10" type="textarea" placeholder="请输入接口名称"></el-input>
		    </el-form-item>
		</el-form> -->
		<div>
			<div class="cont_text">
				关联主题：
			</div>
			<el-input v-model="hickey.topic" autosize type="textarea" :readonly="true" placeholder="请输入主题"></el-input>
			<div class="cont_text">
				接口简介：
			</div>
			<el-input v-model="hickey.introduce" autosize type="textarea" :readonly="true" placeholder="请输入接口简介"></el-input>
			<div class="cont_text">
				请求示例：
			</div>
			<el-input v-model="hickey.ask_example" autosize type="textarea" :readonly="true" placeholder="请输入接口名称"></el-input>
			<div class="cont_text">
				返回示例：
			</div>
			<el-input v-model="hickey.back_example" autosize type="textarea" :readonly="true" placeholder="请输入接口名称"></el-input>
		</div>
	</div>
</template>
<script>
export default {
    data(){
        return {
        	num : 0,
        	parameter:{},//参数
        	qrCodeShow:false,//生成二维码显示
        	hickey:{
        		name:'',//接口名称
        		mode:'',//请求方式
        		url:'',//请求链接
        		ask_example:'',//请求示例
        		back_example:'',//返回示例
        		introduce:'',
        		topic:'',
        	},
        	tableData:[],
        	formLabelWidth:'100px',
        }
    },
    mounted(){
    	let self = this;
    	let url = self.$route.fullPath;
    	self.GetRequest(url)
    },
    watch:{
		'$route':{  
            handler:function(val,oldval){  
            	let self = this;
                self.GetRequest(val.fullPath)
            },  
            deep:true//对象内部的属性监听，也叫深度监听  
        },
	},
	methods:{
		getPort(){//请求接口
			let self = this;
			let data = {
				id : self.parameter.id,
				date : new Date().getTime()
			}
			// console.log(data)
			self.$axios({
	    		url: self.BP_HOST+"/inter/single?id="+self.parameter.id,
	    		method: 'get',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(response) {
	    		console.log(response)
	    		if(response.data.status == 200){
	    			let obj = response.data.data;
	    			console.log("============", obj)
	    			let reqDatas = JSON.parse(obj.reqData.replace(/^\s+|\s+$/g,""));//格式化入示参数
	    			// let repDatas = JSON.parse(obj.repData.split("\n").join(""));//格式化出示参数*/*/
	    			let repDatas = JSON.parse(obj.repData.replace(/(^\s*)|(\s*$)/g, ""));//格式化出示参数*/*/
	    			//console.log(JSON.stringify(obj.repData.replace(/^\s+|\s+$/g,"")))

	    			reqDatas = self.formatJson(reqDatas)
	    			repDatas = self.formatJson(repDatas)
	    			console.log(reqDatas)
	    			console.log(repDatas)
	    			let reqData = self.syntaxHighlight(reqDatas);
	    			let repData = self.syntaxHighlight(repDatas);
	    			self.hickey = {};
	    			self.hickey = {
	    				name : obj.interName,
		        		mode : obj.interMethod,
		        		url : obj.url,
		        		ask_example : reqData,
		        		back_example : repData,
		        		introduce : obj.introduce,
		        		topic: obj.topic
	    			}
	    			if(self.hickey.url == '/vr-qrcode/qr/generate'){
	    				self.qrCodeShow = true;
	    			}else{
	    				self.qrCodeShow = false;
	    			}
	    		}
	    	})
	    	.catch(function(response) {
	    		console.log("error",response)
	    	})
		},
		management(){//请求参数管理
			let self = this;
			let data = {
				interId : self.parameter.id,
				date : new Date().getTime()
			}
			self.$axios({
	    		url: self.BP_HOST+"/parm/sel?interId="+self.parameter.id,
	    		method: 'get',
	    		responseType: 'json',
	    		data: data
	    	})
	    	.then(function(response) {
	    		console.log('=',response)
	    		if(response.data.status == 200){
	    			let list = response.data.data;
	    			self.tableData = [];
	    			list.forEach(function(item, index){
	    				self.tableData.push(item)
	    			})
	    		}
	    	})
	    	.catch(function(response) {
	    		console.log("error",response)
	    	})
		},
		creat(){//生成二维码
			let self = this;
			self.$router.push('/produce')
		},
		GetRequest : function(url){//解析url传递的参数
			let self = this;
		    if (url.indexOf("?") != -1) {
		    	url = "?"+url.split("?")[1];
		        let str = url.substr(1);
		        let strs = str.split("&");
		        for (var i = 0; i < strs.length; i++) {
		        	let stres = decodeURIComponent(strs[i].split("=")[1].split("-")[1]);//截取
		        	let mid = decodeURIComponent(strs[i].split("=")[1].split("-")[0]);
		            // theRequest[strs[i].split("=")[0]] = stres;	
		            self.parameter.id = parseInt(stres);
		            self.parameter.mId = parseInt(mid);
		        }
		    }
		    self.getPort();
		    self.management();
		},
		formatJson(json, options){//格式化json文件
			console.log(json)
			let reg = null,formatted = '',pad = 0,PADDING = ''; 
			options = options || {};
			options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
			options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
			if (typeof json !== 'string') {
				json = JSON.stringify(json);
			} else {
				json = JSON.parse(json);
				json = JSON.stringify(json);
			}
			reg = /([\{\}])/g;
			json = json.replace(reg, '\r\n$1\r\n');
			reg = /([\[\]])/g;
			json = json.replace(reg, '\r\n$1\r\n');
			reg = /(\,)/g;
			json = json.replace(reg, '$1\r\n');
		 
			// remove multiple newlines
			reg = /(\r\n\r\n)/g;
			json = json.replace(reg, '\r\n');
		 
			// remove newlines before commas
			reg = /\r\n\,/g;
			json = json.replace(reg, ',');
			console.log(json)
			// optional formatting...
			if (!options.newlineAfterColonIfBeforeBraceOrBracket) {			
				reg = /\:\r\n\{/g;
				json = json.replace(reg, ':{');
				reg = /\:\r\n\[/g;
				json = json.replace(reg, ':[');
			}
			if (options.spaceAfterColon) {			
				reg = /\:/g;
				json = json.replace(reg, ':');
			}
			// for(let k=0;k<){}
			json.split('\r\n').forEach(function(node, index) {
				let i = 0,indent = 0,padding = '';
				if (node.match(/\{$/) || node.match(/\[$/)) {
					indent = 1;
				} else if (node.match(/\}/) || node.match(/\]/)) {
					if (pad !== 0) {
						pad -= 1;
					}
				} else {
					indent = 0;
				}
				for (i = 0; i < pad; i++) {
					padding += PADDING;
				}
				formatted += padding + node + '\r\n';
				pad += indent;
			});
		 	console.log(formatted)
			return formatted;
		},
		syntaxHighlight(json){
			if (typeof json != 'string') {
		        json = JSON.stringify(json, undefined, 2);
		    }
		    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
		    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
		        var cls = 'number';
		        if (/^"/.test(match)) {
		            if (/:$/.test(match)) {
		                cls = 'key';
		            } else {
		                cls = 'string';
		            }
		        } else if (/true|false/.test(match)) {
		            cls = 'boolean';
		        } else if (/null/.test(match)) {
		            cls = 'null';
		        }
		        return match
		    })
		},
	}
}
</script>
<style scoped>
	.input_box{
		float: left;
		width: 30%;
		margin-right: 3%;
	}
	.ipt_btn{
		color: red;
	}
	.server_main{
		margin: 20px 0;
	}
	.server_header{
		overflow: hidden;
	}
	.eqcode{
		margin-bottom: 20px;
	}
	.ipt_text{
		color: #fff;
	}
	.cont_text{
		color: #333;
		margin: 20px 0 5px;
	}
</style>