<template>
    <div>
      	<div style="margin-top:20px">
        	<!-- <el-select v-model="compValue" filterable placeholder="请选择企业" @change="compChange(compValue)">
              <el-option
                 v-for="item in compOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
              </el-option>
          </el-select> -->

          <div>
            <el-cascader
            expand-trigger="hover"
            :options="compOptions"
            v-model="selectedOptions2"
            @change="compOptionsChange"
            change-on-select
            filterable
            clearable
            :props="props"
            style="width: 35%"
            placeholder="请选择企业">
            </el-cascader>

            <el-select v-model="spaceValue" filterable placeholder="请选择空间" style="margin-left: 15px" @change="spaceChange(spaceValue)">
            <el-option
              v-for="item in spaceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>

          <el-select v-model="userValue" filterable placeholder="请选择用户类型" style="margin-left:20px" @change="userChange(userValue)">
              <el-option
                 v-for="item in userOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
              </el-option>
          </el-select>
          </div>
    	</div>
    	<div style="margin-top:40px">
    	    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox style="margin-left:0;margin-right:15px;margin-bottom:15px" v-for="city in cities" :label="city.id" :key="city.id" :value="city.id">{{city.urlName}}
                </el-checkbox>
            </el-checkbox-group>
    	</div>

    	<div>
    	   <el-button type="primary" class="sq-btn" @click="linkRel">授权</el-button>
    	</div>  
    </div>
</template>

<script>
  var cityOptions = []
  export default {
    data() {
        return {
          	tempArr: [],
            compOptions: [],
            compValue: '',
            userValue: '',
            spaceValue: '1',
            userOptions: [],
            /*userOptions:[{
                value: 'BUSER',
                label: 'B用户'
            }, {
                value: 'CUSER',
                label: 'C用户'
            }],*/
            spaceOptions: [{
                value: '1',
                label: '海'
            }, {
                value: '2',
                label: '宝'
            }, {
                value: '3',
                label: '娃'
            }],
            checkAll: false,
            checkedCities: [],
            initCities: [],
            cities: cityOptions,
            isIndeterminate: false,
            compCode: '',
            adminSessionId: '',   //用户中心admin帐号的sessionId

            /*cascader*/
            selectedOptions2: [],
            props: {
              label: 'comp_name',
              value: 'comp_code',
              children: 'enterprises'
            },
            compOptions: [],
        }
    },
    mounted() {
        let self = this
        let uams = localStorage.getItem('uams')
        self.adminSessionId = localStorage.getItem('adminSessionId')
        //平台管理员登录
        if(uams === self.PLAT_ADMIN) {
          /*self.queryComp()*/
          self.compCode = ''
        } else {
          /*self.queryCompByCompCode()*/
          self.compCode = JSON.parse(localStorage.getItem('compCode'))
        } 
        /*self.initCities = self.checkedCities*/
        self.queryUrl()
        self.queryAllType()
        self.singleQuery(self.compCode)
    },
    destroyed() {
        cityOptions = []
    },
    methods: {
        queryComp(compName) {  //查询企业
         	let self = this
         	self.$axios({
         	    url: '/UAMS/company/do_comp_query?pageSize=10000',
         	    method: 'post',
         	    data: {
    		    "compName": compName ? compName : ''
    		    }  
         	})
         	.then(function(res) {
         	    if(res.status === 200) {
             	  	function DefaultCompStory(label, value) {
                        this.label = label
                        this.value = value
        	        }

             	  	let resData = res.data.data.list
             	  	for (let index in resData) {
             	  	   self.compOptions.push(new DefaultCompStory(resData[index].comp_name, resData[index].comp_code))
             	  	}
             	}
         	})
         	.catch(function(res) {
         	      console.log("queryComp error", res)
         	})
        },
        queryCompByCompCode() { //根据企业编码查询
          let self = this
          self.$axios({
              url: '/UAMS/Auth/queryCompany',
              method: 'post',
              data: {
                "compCode": self.compCode ? self.compCode : ''
              }   
          })
          .then(function(res) {
              if(res.status === 200) {
                  function DefaultCompStory(label, value) {
                        this.label = label
                        this.value = value
                  }

                  let resData = res.data.data
                  if(resData.company) {
                    self.compOptions.push(new DefaultCompStory(resData.company.comp_name, resData.company.comp_code))
                  }
                  if(resData.companyChildren.length !== 0) {
                    for(let index in resData.companyChildren) {

                      self.compOptions.push(new DefaultCompStory(resData.companyChildren[index].comp_name, resData.companyChildren[index].comp_code))
                    }
                  }
              }
          })
          .catch(function(res) {
                console.log("queryComp error", res)
          }) 
        },
        queryUrl() { /*查询所有链接*/
            let self = this
            self.$axios({
                url: '/UAMS/url/query_all_url',
                method: 'post',
                data: {
                  type: self.spaceValue
                }
            })
            .then(function(res) {
                function DefaultUrlStory(id, urlName) {
                    this.id = id
                    this.urlName = urlName
                }

                if(res.data.success === true) {
                  	let resData = res.data.data
                  	for(let index in resData) {
                  	    cityOptions.push(new DefaultUrlStory(resData[index].id, resData[index].url_name))
                  	}
                }
            })
            .catch(function(res) {
                console.log("queryUrl error", res)
            })
        },
        queryUrlByComp(compCode, userType) { //查询企业下链接
          	let self = this
          	self.$axios({
          	    url: '/UAMS/url/query_url_company',
          	    method: 'post',
          	    data: {
          	  	    compCode: compCode,
          	  	    userType: userType,
          	    }
          	})
          	.then(function(res) {
          	    let resData = res.data.data
                console.log("resData", resData)

              	function tempArrStory(id, urlId) {
              	    this.id = id;
              	    this.urlId = urlId;
              	}
              	self.tempArr = []
                for(let index in resData) {
                    self.checkedCities.push(parseInt(resData[index].url_id))
                    self.tempArr.push(new tempArrStory(resData[index].id, resData[index].url_id))
                    self.initCities.push(parseInt(resData[index].url_id))
                }
                /*self.initCities = self.checkedCities*/
                self.handleCheckedCitiesChange(self.checkedCities)
          	})
          	.catch(function(res) {
          	    console.log("queryUrlByComp error", res)
          	})
        },
        compChange(compValue) { /*改变企业*/
          	let self = this
            self.compValue = compValue
          	self.checkedCities = []
            self.initCities = []
            self.queryUrlByComp(self.compValue, self.userValue)
        },
        spaceChange(spaceValue) { /*改变空间*/
            let self = this
            cityOptions = []
            self.cities = cityOptions
            self.spaceValue = spaceValue
            self.queryUrl()
        },
        userChange(userValue) { /*改变用户*/
            let self = this
            self.checkedCities = []
            self.initCities = []
            self.queryUrlByComp(self.compValue, self.userValue)
        },

        handleCheckAllChange(event) {
            let self = this
            if(event.target.checked) {
              for(let index in cityOptions) {
                self.checkedCities.push(cityOptions[index].id)
              }
            } else {
              self.checkedCities = []
            }
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            /*console.log("============", value.length,this.checkedCities.length, this.cities.length, cityOptions.length)*/
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        linkRel() {
            let self = this
            if(!self.compValue) {
              self.$message("请选择企业!")
              return
            }
            if(!self.userValue) {
              self.$message("请选择用户!")
              return
            }

            let delArr= self.compare(self.initCities, self.checkedCities)
            let addArr= self.compare(self.checkedCities, self.initCities)

            function DatasStory(compCode, userType, urlId, type, id) {
    	        this.compCode = compCode
    	        this.userType = userType
    	        this.urlId = urlId
    	        this.type = type
    	        this.id = id
          	}
            var linkDatas = new Array()
            for(let i in addArr) {
              linkDatas.push(new DatasStory(self.compValue, self.userValue, addArr[i], "1"))
            }

            for(let i in delArr) {
              let tempId
              for(let j in self.tempArr) {
                if(delArr[i] == self.tempArr[j].urlId) {
                  tempId = self.tempArr[j].id
                }
              }
              linkDatas.push(new DatasStory(self.compValue, self.userValue, delArr[i], "0", tempId))
            }
            if(linkDatas.length === 0) {
              self.$message("你还没有进行任何修改")
              return
            }
            self.$axios({
              url: '/UAMS/url/update_url_company',
              method: 'post',
              responseType: 'json',
              data:	linkDatas
            })
            .then(function(res) {
              if(res.data.success === true) {
              	self.$message("配置授权成功")
              } else {
              	self.$message(res.data.msg)
              }
            })
            .catch(function(res) {
              console.log("update_url_company error", res)
            })
        },
        queryAllType() {  //查询出所有的用户类型
          let self = this
          self.$axios({
            url: '/account_auth_admin/user-api.findAllType',
            method: 'post',
            responseType: 'json',
            data: {
              sessionId: self.adminSessionId
            }
          })
          .then(function(res) {
            let list = res.data.data
            list.forEach(function(item, index){
              item.label = item.typeName;
              item.value = item.typeCode;
            })
            self.userOptions = list
          })
          .catch(function(res) {
            console.log("error", res)
          })
        },
        singleQuery(compCode) {
          let self = this
          self.$axios({
            url: '/UAMS/company/do_comp_single_query_bycompanycode',
            method: 'post',
            responseType: 'json',
            data: {
              compCode: compCode,
              type: "0"
            }
          })
          .then(function(res) {
            console.log("success", res)
            if(res.data.success) {
              let list = res.data.data
              self.recursionDelete(list)
              self.compOptions = list
            }
          })
          .catch(function(res) {
            console.log("error", res)
          })
        },
        compOptionsChange(value) {
          let self = this
          console.log("go compOptionsChange" + value, "=================", self.selectedOptions2)
          if(self.selectedOptions2.length > 0) {
            self.compChange(self.selectedOptions2[self.selectedOptions2.length - 1])
          }
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
        compare(arr1, arr2) {
          	var result = []
        	for(let i = 0; i < arr1.length; i++) {
        		var obj = arr1[i];
        		var isExist = false;
        		for(let j = 0; j < arr2.length; j++) {
        			var aj = arr2[j]
        			if(obj == aj) {
        				isExist = true;
        				break;
        			}
        		}
        		if(!isExist) {
        		    result.push(obj)
        		}
        	}
        	return result;
        }
    }
}
</script>

<style scoped>
    .sq-btn {
		width: 180px;
		margin-top: 40px;
	}	

  .el-checkbox-group label {
    width: 140px;
  }
</style>