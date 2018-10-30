<template>
    <div>
        <div class="box" :style="{maxWidth:selectStyle.maxiInput}" @click.stop="show()">
            <el-input
                placeholder="请选择用户"
                :icon="icons"
                v-model="formAccount.account_name"
                :on-icon-click="handleIconClick"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleSelectValue"
                class="user_box">
            </el-input>
            <div class="option_box" v-show="selectObj.optionBoxShow">
                <ul class="option_ul" v-scroll="onScroll">
                    <template v-for="item in selectObj.selectList">
                        <li class="row_all" @click="userChange(item)">{{item.name || item.userName}}</li>
                    </template>
                    <div class="preloader" v-if="!selectStyle.loading">
                        <i class="el-icon-loading"></i>
                    </div>
                    <div class="preloader" v-else>
                        <template v-if="selectObj.selectList.length == 0">
                            暂无数据
                        </template>
                        <template v-else>
                            数据已加载完毕
                        </template>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            icons:"caret-bottom",//尾部图标
            // selectValue: '',//输入内容
            // optionBoxShow: false,//盒子显示框
            preloaderShow: false,//
        }
    },
    props:{
        selectObj: Object,
        selectStyle: Object,
        formAccount: Object
    },
    mounted(){
        let self = this;
        console.log(self.selectObj)
    },
    methods: {
        handleIconClick(e){//点击输入框
            let self = this;
            console.log(88)
            if(self.icons == "caret-bottom"){
                self.icons = "caret-top";
                self.selectObj.optionBoxShow = true;
            }else{
                self.icons = "caret-bottom";
                self.selectObj.optionBoxShow = false;
            }
        },
        handleFocus(){//输入框获取焦点
            let self = this;
            self.icons = "caret-top";
            self.selectObj.optionBoxShow = true;
            self.selectObj.selectList = []
            self.selectStyle.loading = false;
            self.selectObj.queryPar.currentPage = 1
            self.$emit('queryUser',self.formAccount.account_name,0)
        },
        handleBlur(e){//输入框失去焦点
            let self = this;
            // self.icons = "caret-bottom";
            // self.optionBoxShow = false;
        },
        onScroll(e, position){
            let self = this;
            let ulBox = document.getElementsByClassName('option_ul');
            let ofH = ulBox[0].offsetHeight;
            let scH = ulBox[0].scrollHeight;
            if(position.scrollTop == (scH-ofH)){
                if(self.statEach == 0){
                    self.preloaderShow = true;
                    self.statEach++;
                    self.selectObj.queryPar.currentPage++
                    self.$emit('queryUser',self.formAccount.account_name,1)
                } 
            }else{
                console.log(222)
                self.statEach = 0;
            }
        },
        handleSelectValue(item) {
            console.log("item", item)
            let self = this
            self.selectObj.queryPar.currentPage = 1;
            self.selectObj.selectList = []
            self.selectStyle.loading = false;
            self.$emit('queryUser',self.formAccount.account_name,0)
        },
        userChange(item){
            let self = this;
            // self.selectValue = item.name || item.userName
            self.icons = "caret-bottom";
            self.selectObj.optionBoxShow = false;
            self.formAccount.account_select = item
            self.formAccount.account_name = item.name || item.userName
            // self.selectObj.selectList = []
            // self.selectStyle.loading = false;
            console.log(item)
        },
        show(){
            let self = this;
        },
    },
}
</script>
<style scoped>
    .box{
        position: relative;
        /*max-width: 200px;
        margin-top: -38px;
        margin-left: 45%;*/
    }
    .option_box{
        position: absolute;
        top: 37px;
        left: 0;
        z-index: 10;
        width: 100%;
        height: 250px;
        background-color: #fff;
        border: 1px solid #eee;
        overflow: hidden;
        box-sizing: border-box;
    }
    .option_ul{
        width: 120%;
        max-height: 250px;
        overflow-y:scroll;
        overflow-x:hidden;
        white-space:nowrap;
    }
    .row_all,.preloader{
        width: 100%;
        height: 35px;
        line-height: 35px;
        padding-left: 10px;
        color: #666;
        cursor: pointer;
    }
    .preloader{
        /* color: ; */
        width: 88%;
        padding: 0;
        text-align: center;
        cursor: default;
    }
    .row_all:hover{
        color: #333;
        background: #eee;
    }
</style>
