<template>
	<div id="addCompLogo">
		<div>
			<el-cascader
				expand-trigger="hover"
				filterable
				clearable
				:change-on-select="true"
	  			:options="enterpriseList"
	  			:props="props"
	  			v-model="selectedEnterprise"
	  			style="width: 35%"
	  			placeholder="请选择集团/企业/子企业"
			></el-cascader>
			<el-cascader
				expand-trigger="hover"
				filterable
				clearable
				:change-on-select="true"
	  			:options="versions"
	  			v-model="selectedSize"
	  			style="width: 35%"
	  			placeholder="请选择LOGO版本/尺寸/颜色"
			></el-cascader>
			<el-button type="primary" icon="search" @click.native="searchLogo()">查询</el-button>
		</div>
		<div class="logo_content">
			<template v-for="item in logoes">
				<div class="single_box">
					<el-upload
		  				class="avatar-uploader"
		  				drag
		  				:class="item.logoClass"
		  				:action="logoUpdataUrl"
		  				:data="extraParameter"
		  				:show-file-list="false"
					  	:on-success="handleAvatarSuccess"
					  	:before-upload="beforeAvatarUpload"
					  	@click.native="presentClick(item)">
					  	<img v-if="item.logo" :src="item.logo" class="avatar">
					  	<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					  	<div class="delete" v-if="item.logo" @click.self.stop="logoBox">
				  			<i class="el-icon-edit close_style" @click="logoEdit"></i>
							<i class="el-icon-delete close_style" @click.stop="logoDelete(item)"></i>
						</div>
					</el-upload>
					<div style="text-align:center;font-size: 12px;color: #1f2d3d;">{{item.logoVersion}}/{{item.logoSize}}/{{item.logoColor}}</div>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
export default{
	data(){
		return{
			dataJson:{},//账户信息
			enterpriseList:[],//集团集合
		    selectedEnterprise: [],//选中集团集合
		    versions: [
		    	{
		    		value: 'PC',
          			label: 'PC端',
          			children: []
		    	},{
		    		value: 'Android',
          			label: 'Android端',
          			children: []
		    	},{
		    		value: 'IOS',
          			label: 'IOS端',
          			children: []
		    	}
		    ],//尺寸集合
		    photoSizeList:[
		    	{
		    		value: 'l',
          			label: '大',
          			children: []
		    	},{
		    		value: 'm',
          			label: '中',
          			children: []
		    	},{
		    		value: 's',
          			label: '小',
          			children: []
		    	}
		    ],
		    color:[
		    	{
		    		value: 'colorful',
          			label: '彩色',
		    	},{
		    		value: 'black_white',
          			label: '黑白',
		    	}
		    ],
		    selectedSize: [],//选择尺寸集合
		    props: {
	          	label: 'comp_name',
	          	value: 'comp_code',
	          	children: 'enterprises'
	        },
	        selectFirm: '',//一个集团或者企业或者子企业
	        logoes:[],//图片显示
	        presentLogo:{},//当前选中的图片数组
	        logoUpdataUrl: '',//logo上传路径
	        extraParameter:{module_id:1},//上传图片额外的参数
	        hasAlready: [],//已经有的图片
	        states:0,//判断是上传还是编辑状态码  0: 上传  1：编辑
		}
	},
	mounted(){
		let self = this;
		self.dataJson = JSON.parse(localStorage.getItem('dataJson'));
		console.log(self.dataJson)
		let uams = localStorage.getItem('uams')
		self.photoSizeList.forEach(function(item, index){
			item.children = self.color
		})
		self.versions.forEach(function(item, index){
			item.children = self.photoSizeList;
		})
		// self.logoUpdataUrl = 'http://xpomg.weilian.cn/vr-content/file/upload'
		self.logoUpdataUrl = self.LOGO_UPDATE_URL
		if(uams === self.PLAT_ADMIN){
			//admin登录
			self.queryAllGroup()
		}else{
			self.queryAllGroup()
		}
	},
	methods:{
		queryAllGroup(){//调取所有集团信息
			let self = this;
			self.$axios({
	          	url: '/UAMS/company/do_comp_single_query_bycompanycode',
	          	method: 'post',
	          	responseType: 'json',
	          	data: {
	            	compCode: self.dataJson.compCode,
	            	type:"0"
	          	}
	        })
	        .then(function(res) {
          		console.log('queryAllType',res);
          		if(!res.data.success){
          			self.$message.warning(res.data.msg)
          			return
          		}
          		if(res.data.success){
          			let list = res.data.data;
          			self.recursionDelete(list)
          			self.enterpriseList = list
          		}
        	})
	        .catch(function(res) {
	          	console.log("error", res)
	        })
		},
		recursionDelete(list) { //递归删除enterprises为空的属性
	        let self = this
	        list.forEach(function(item, index) {
	          	if(item.enterprises.length === 0) {
	            	delete item.enterprises
	          	} else {
	            	self.recursionDelete(item.enterprises)
	          	}
	        })
      	},
      	searchLogo(){//查询logo
      		let self = this;
      		console.log(self.selectedEnterprise)
      		if(self.selectedEnterprise.length == 0){//没有选择企业的时候
      			self.$message.warning('请选择一个集团/企业/子企业')
      			return
      		}else{
      			//获取选择集团数组中的最后一个
      			self.selectFirm = self.selectedEnterprise[self.selectedEnterprise.length-1];
      			// ajax请求的参数以及url
      			let url = '/UAMS/logo/queryLogo';
      			let data = {
      				compCode: self.selectFirm,
      			}
      			if(self.selectedSize.length == 1){
      				data.logoVersion = self.selectedSize[self.selectedSize.length-1]
      			}else if(self.selectedSize.length == 2){
      				data.logoVersion = self.selectedSize[0]
      				data.logoSize = self.selectedSize[self.selectedSize.length-1]
      			}else if(self.selectedSize.length == 3){
      				data.logoVersion = self.selectedSize[0]
      				data.logoSize = self.selectedSize[1]
      				data.logoColor = self.selectedSize[self.selectedSize.length-1]
      			}
      			self.$axios({
                    url: url,
                    method: 'post',
                    responseType: 'json',
                    data: data
                })
                .then(function(res) {
                	console.log("查询",res)
                	if(!res.data.success){
                		self.$message.error(res.data.msg)
      					return
                	}
                	let list = res.data.data;
                	self.logoes = [];
                	self.presentLogo = {};
                	self.hasAlready = []
                	if(list){
                		self.hasAlready = list;
                		self.bloatedLogoes()
                	}else{//为空，显示18个
                		self.bloatedLogoes()
                	}
                })
                .catch(function(res) {
                    console.log("error", res)
                })
      		}
      	},
      	bloatedLogoes(){//获取渲染logo  公共方法
      		let self = this;
      		self.logoes = [];
      		let logoObj = {
      			compCode: self.selectedEnterprise[self.selectedEnterprise.length-1],//企业code
      			logo:'',//图片路径
      			logoSize:'',//图片尺寸
      			logoColor:'',//图片颜色
      			logoVersion:'',//图片版本
      			logoClass:'',//图片样式
      			size:'',
      			color:'',
      			version:'',
      		}
      		// versions   photoSizeList    color
      		if(self.selectedSize.length == 1){//只有版本
      			let size = self.selectedSize[self.selectedSize.length-1];
  				self.versions.forEach(function(item, index){
  					if(size == item.value){
  						logoObj.logoVersion = item.label;
  						logoObj.version = item.value;
  					}
  				})
  				for(let y=0;y<self.photoSizeList.length;y++){
  					for(let x=0;x<self.color.length;x++){
  						let obj = {}
  						for(let key in logoObj){
  							obj[key] = logoObj[key]
  						}
  						obj.logoColor = self.color[x].label;
  						obj.color = self.color[x].value;
  						obj.logoSize = self.photoSizeList[y].label+'尺寸';
  						obj.size = self.photoSizeList[y].value;
  						obj.logoClass = self.photoSizeList[y].value+'_logo';
  						self.logoes.push(obj)
  					}
  				}
  			}else if(self.selectedSize.length == 2){//有版本 尺寸
  				let version = self.selectedSize[0];
  				let size = self.selectedSize[self.selectedSize.length-1];
  				self.versions.forEach(function(item, index){
  					if(version == item.value){
  						logoObj.logoVersion = item.label;
  						logoObj.version = item.value;
  						logoObj.logoClass = item.value+'_logo';
  					}
  				})
  				self.photoSizeList.forEach(function(item, index){
  					if(size == item.value){
  						logoObj.logoSize = item.label;
  						logoObj.size = item.value;
  						logoObj.logoClass = item.value+'_logo';
  					}
  				})
  				for(let y=0;y<self.color.length;y++){
  					let obj = {}
					for(let key in logoObj){
						obj[key] = logoObj[key]
					}
					obj.logoColor = self.color[y].label;
					obj.color = self.color[y].value;
					self.logoes.push(obj)
				}
  			}else if(self.selectedSize.length == 3){//有版本、尺寸、颜色
  				let versions = self.selectedSize[0];
  				let size = self.selectedSize[1];
  				let color = self.selectedSize[self.selectedSize.length-1];
  				self.versions.forEach(function(item, index){
  					if(versions == item.value){
  						logoObj.logoVersion = item.label;
  						logoObj.version = item.value;
  					}
  				})
  				self.photoSizeList.forEach(function(item, index){
  					if(size == item.value){
  						logoObj.logoSize = item.label;
  						logoObj.size = item.value;
  						logoObj.logoClass = item.value+'_logo';
  					}
  				})
  				self.color.forEach(function(item, index){
  					if(color == item.value){
  						logoObj.logoColor = item.label;
  						logoObj.color = item.value;
  					}
  				})
  				self.logoes.push(logoObj)
  			}else{
  				for(let x=0;x<self.versions.length;x++){
	  				for(let y=0;y<self.photoSizeList.length;y++){
	  					for(let z=0;z<self.color.length;z++){
	  						let obj = {}
	  						for(let key in logoObj){
	  							obj[key] = logoObj[key]
	  						}
	  						obj.logoVersion = self.versions[x].label;
	  						obj.logoClass = self.photoSizeList[y].value+'_logo';
	  						obj.logoSize = self.photoSizeList[y].label+'尺寸';
	  						obj.logoColor = self.color[z].label;
	  						obj.version = self.versions[x].value;
	  						obj.size = self.photoSizeList[y].value;
	  						obj.color = self.color[z].value;
	  						self.logoes.push(obj)
	  					}
	  				}
	  			}
  			}
  			self.$nextTick(()=>{
  				if(self.hasAlready == 0) return;
  				for(let j=0;j<self.hasAlready.length;j++){
  					for(let k=0;k<self.logoes.length;k++){
  						if(self.logoes[k].size == self.hasAlready[j].logo_size && self.logoes[k].color == self.hasAlready[j].logo_color && self.logoes[k].version == self.hasAlready[j].logo_version){
  							self.logoes[k].logo = self.hasAlready[j].logo;
  						}
  					}
  				}
  				let arrLogo = [];
  				self.logoes.forEach(function(item, index){
  					if(item.size == 'l'){
  						arrLogo.push(item)
  					}
  				})
  				self.logoes.forEach(function(item, index){
  					if(item.size == 'm'){
  						arrLogo.push(item)
  					}
  				})
  				self.logoes.forEach(function(item, index){
  					if(item.size == 's'){
  						arrLogo.push(item)
  					}
  				})
  				self.logoes = arrLogo
  			})
  			console.log(self.logoes)
      	},
      	presentClick(item){//点击图片，保存当前图片对象
      		let self = this;
      		console.log(item)
      		if(item.logo == ''){
      			self.states = 0;
      		}else{
      			self.states = 1;
      		}
      		self.presentLogo = item;
      	},
	    handleAvatarSuccess(res, file, fileList) {//图片上传成功
	    	let self = this;
	    	let logo = res.data[0].file_url;
	    	let url,data,type;
	    	if(self.states == 0){//上传
	    		url = "/UAMS/logo/addLogo";
	    		data = {
	    			compCode: self.presentLogo.compCode,
	    			logoSize: self.presentLogo.size,
	    			logoVersion: self.presentLogo.version,
	    			logoColor: self.presentLogo.color,
	    			logo: logo
	    		}
	    		type = "up"
	    	}else if(self.states == 1){//编辑
	    		url = "/UAMS/logo/ updateLogo";
	    		data = {
	    			compCode: self.presentLogo.compCode,
	    			logoSize: self.presentLogo.size,
	    			logoVersion: self.presentLogo.version,
	    			logoColor: self.presentLogo.color,
	    			logo: logo
	    		}
	    		type = "edit"
	    	}
	    	self.commonalityData(data, url, type)
        	// self.presentLogo.logo = url;
        	// console.log(self.presentLogo)
      	},
      	beforeAvatarUpload(file) {//限制上传图片格式
      		console.log(file.type)
	        const isJPG = file.type === 'image/jpeg' || 'image/png';
	        const isLt2M = file.size / 1024 / 1024 < 2;
	        if (!isJPG) {
	          this.$message.error('上传头像图片只能是 JPG 格式!');
	        }
	        if (!isLt2M) {
	          this.$message.error('上传头像图片大小不能超过 2MB!');
	        }
	        return isJPG && isLt2M;
      	},
      	logoBox(){
      	},
      	logoEdit(e){//编辑图片
      		let self = this;
      		self.states = 1;
      	},
      	logoDelete(item){//删除图片
      		let self = this;
      		console.log(item)
      		let url = "/UAMS/logo/delLogo";
    		let data = {
    			compCode: item.compCode,
    			logoSize: item.size,
    			logoVersion: item.version,
    			logoColor: item.color
    		}
    		let type = "del"
    		self.commonalityData(data, url, type, item)
      	},
      	commonalityData(data, url, type, item){//公共请求方法
      		// type => up  上传 -->  edit  编辑  -->  del  删除
      		let self = this;
      		self.$axios({
	          	url: url,
	          	method: 'post',
	          	responseType: 'json',
	          	data: data
	        })
	        .then(function(res) {
          		console.log('res===',res);
          		if(!res.data.success){
          			self.$message.warning(res.data.msg)
          			return
          		}
          		let hint = self.presentLogo.logoVersion+'/'+self.presentLogo.logoSize+'/'+self.presentLogo.logoColor;
          		self.states = 0;
          		if(type == 'up'){
	    			self.$message.success(hint+"  上传logo成功")
	    			self.presentLogo.logo = data.logo;
          		}else if(type == 'edit'){
          			self.$message.success(hint+"  修改logo成功")
          			self.presentLogo.logo = data.logo;
          		}else if(type == 'del'){
          			self.$message.success(hint+"  删除logo成功")
          			item.logo = '';
          		}
        	})
	        .catch(function(res) {
	          	console.log("error", res)
	        })
      	},
	}
}
</script>
<style scoped>
	.logo_content{
		margin-top: 30px;
	}
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
  	}
  	.avatar-uploader .el-upload:hover {
    	border-color: #20a0ff;
  	}
  	.avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
  	}
  	.avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
  	}
  	.single_box{
  		position: relative;
  		display:inline-block;
  		margin: 0 10px 30px 0;
  	}
  	.l_logo .delete{
		width:180px;
	    height:180px;
	    line-height: 180px;
	    font-size: 25px;
  	}
  	.m_logo .delete{
		width:150px;
	    height:150px;
	    line-height: 150px;
	    font-size: 22px;
  	}
  	.s_logo .delete{
		width:120px;
	    height:120px;
	    line-height: 120px;
	    font-size: 20px;
  	}
  	.delete{
  		display: none;
	    position: absolute;
	    top: 0;
	    right: 0;
	    text-align: center;
	    cursor: pointer;
	    border-radius: 6px;
	    background: rgba(0,0,0,.5);
	    color: #fff;
  	}
  	.single_box:hover .delete{
		display: block;
  	}
  	.delete .close_style{
  		margin: 0 5px;
  	}
</style>