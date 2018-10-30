<template>
    <div class="login-wrap">
        <video autoplay="autoplay" loop="loop" poster="../../../static/images/logo_1.jpg" width='100%' height='100%'>
            <source src="/static/images/logo_bg.mp4" type="video/mp4">
        </video>
        <div>
            <div class="ms-title">
                <img src="/static/images/LOGO.png">
                企业管理平台
            </div>
        </div>
        <div class="info">
            <div class="ms-login">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm" :showMessage="showMessage">
                    <el-form-item prop="username">
                        <el-input v-model="ruleForm.username" id="companyName" ref="company_name" class="ipt_text" :placeholder="name" @click.native="iptName('a')" @keyup.tab.native="iptName('a')" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" class="ipt_text" :placeholder="word" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')" @keyup.tab.native="iptName('b')" @click.native="iptName('b')"></el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button class="login" type="primary" @click="submitForm('ruleForm')" @keyup.tab.native="iptName('c')" :autofocus="true" @keyup.enter="submitForm('ruleForm')" element-loading-text="拼命加载中" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
                    </div>
                    <div class="box_yk" @click="submitGuest()">
                        <span class="text_yk">游客</span>
                        <span class="text_icon icon1">></span>
                        <span class="text_icon icon2">></span>
                        <span class="text_icon icon3">></span>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import md5 from 'js-md5'
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: '',
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'change' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'change' }
                    ]
                },
                showMessage:false,//是否显示提示文字
                ringShow:false,
                selectShow:false,
                fullscreenLoading: false,
                name:'username',
                word:'password',
                adminData: {
                  "appCode":"ACCOUNT",
                  "clientIp":"127.0.0.1",
                  "enterpriseCode":"SYSTEM",
                  "account":"admin",
                  "password":"e10adc3949ba59abbe56e057f20f883e"
                }
            }
        },
        methods: {
            companyUp(){
                let self = this;
                self.$refs.company_name.$el.firstElementChild.focus();
            },
            iptName(sub){
                let self = this;
                if(sub == 'a'){
                    self.name = '';
                    self.word = 'password';
                }else if(sub == 'b'){
                    self.word = '';
                    self.name = 'username';
                }else{
                    self.name = 'username';
                    self.word = 'password';
                }
            },
            submitForm(formName) {
                let self = this;
                self.fullscreenLoading = true;
                self.name = 'username';
                self.word = 'password';
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        let datas={
                            "name": self.ruleForm.username,
                            "password": md5(self.ruleForm.password)
                        };
                        self.$axios({
                            url: self.BP_HOST + "/login",
                            method: 'post',
                            responseType: 'json',
                            data: datas
                        })
                        .then(function(response) {
                            console.log(response);
                            self.fullscreenLoading = false;
                            if(response.data != null){
                                let msg = response.data;
                                console.log("msg.uams============", msg.uams)
                                if(msg.uams === self.PLAT_ADMIN) {
                                    localStorage.setItem("dataJson", JSON.stringify(msg.data));
                                    localStorage.setItem("compCode", JSON.stringify(msg.data.enterpriseCode));
                                    localStorage.setItem("uams", msg.uams)
                                } else {
                                    let dataJson = {
                                        account: '',
                                        adminId: '',
                                        adminName: '',
                                        compCode: '',
                                        email: '',
                                        enabled: '',
                                        enterpriseCode: '',
                                        mobile: '',
                                        name: '',
                                        password: '',
                                        sessionId: ''
                                    }

                                    let user = msg.data.user
                                    dataJson.account = user.account
                                    dataJson.email = user.email
                                    dataJson.enabled = user.enabled
                                    dataJson.mobile = user.mobile
                                    dataJson.sessionId = user.sessionId
                                    dataJson.name = user.name
                                    dataJson.compCode = msg.compCode

                                    localStorage.setItem("dataJson", JSON.stringify(dataJson))
                                    localStorage.setItem("compCode", JSON.stringify(msg.compCode))
                                    localStorage.setItem("uams", msg.uams)
                                    
                                }

                                //用admin帐号登录用户中心，取session
                                self.adminLogin()

                                self.$message({
                                    message: '登录成功！',
                                    type: 'success',
                                    duration:1500
                                });

                                self.$nextTick(()=>{
                                    self.$router.push('/readme');
                                })
                               
                            }else{
                                self.fullscreenLoading = false;
                                self.$message({
                                    message: '登录失败！请检查用户信息是否正确！',
                                    type: 'error',
                                    duration:1500
                                });
                                console.log("error");
                            }
                        })
                        .catch(function(response){
                            self.$message({
                                message: '服务器信息错误！',
                                type: 'error',
                                duration:1500
                            });
                            self.fullscreenLoading = false
                            self.showMessage = false
                            console.log(response);
                        })
                    } else {
                        self.showMessage=true;
                        self.fullscreenLoading = false;
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitGuest(){//游客模式登录
                let self=this;
                let data = {
                    name:'游客',
                    pattern:'visitors',
                    account:'visitors'
                }
                localStorage.setItem("dataJson", JSON.stringify(data));
                self.$message({
                    message: '登录成功！',
                    type: 'success',
                    duration:1500
                });
                self.$router.push('/readme');
            },
            showRing(){
                let self = this;
                self.ringShow = !self.ringShow;
                self.selectShow = !self.selectShow;
            },
            adminLogin() {  //用户中心管理员帐号登录
                let self = this
                self.$axios({
                    url: '/account_auth_admin/administrator-api.login',
                    method: 'post',
                    responseType: 'json',
                    data: self.adminData
                })
                .then(function(res) {
                    console.log("success", res)
                    if(res.data.status === 1) {
                        localStorage.setItem("adminSessionId", res.data.data.sessionId)
                    }
                })
                .catch(function(res) {
                    console.log("error", res)
                })
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        /*position: relative;*/
        /* background: #00b6c1 url(../../../static/images/logo_8.gif) no-repeat center top; */
        width:100%;
        height:100%;
        background-size: cover;
    }
    .ms-title{
        position: absolute;
        top:32%;
        left: -34%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:36px;
        color: #fff;
    }
    .ms-title img{
        vertical-align: middle;
        margin-right: 12px;
        width: 80px;
        /*height: 100px;*/
    }
    .ms-login{
        position: absolute;
        right:32%;
        top:30%;
        width:300px;
        height:200px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        /*background: #fff;*/
        border: 1px solid #aaa;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:45%;
        height:36px;
    }
    .box_bar{
        overflow: hidden;
        margin-bottom: 40px;
    }
    .box_bar_btn{
        float: left;
        width: 50%;
        margin-left: 0;
    }
    .btn_left{
        border-radius: 4px 0 0 4px;
    }
    .btn_right{
        border-radius: 0 4px 4px 0;
        background-color: rgb(19, 206, 102);
        color: #fff;
    }
    .login-btn .login{
        display: inline-block;
        float: right;
        width: 100%;
    }
    .login-btn .guest{
        margin-left: 0;
        display: inline-block;
        float: left;
        width: 50%;
        margin-bottom: 20px;
        border-radius: 0;
    }
    video {
        position: fixed;
        right: 0;
        bottom: 0;
        min-width: 100%;
        min-height: 100%;
        width: auto;
        height: auto;
        z-index: -100;
    }
    .box_yk{
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 25%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 5px;
        background: #3c77ba;
        cursor: pointer;
    }
    .text_yk{
        display: inline-block;
        color: #fff;
    }
    .text_icon{
        color: #fff;
        opacity:0;
    }
    .icon1{
        -webkit-animation:fill 3s linear 0s infinite normal;
        -moz-animation:fill 3s linear 0s infinite normal;
    }
    .icon2{
        -webkit-animation:fill1 3s linear 0s infinite normal;
        -moz-animation:fill1 3s linear 0s infinite normal;
    }
    .icon3{
        -webkit-animation:fill2 3s linear 0s infinite normal;
        -moz-animation:fill2 3s linear 0s infinite normal;
    } 
    @-moz-keyframes fill {
        0%{ opacity:0; }
        33%{opacity:1;}
        100%{ opacity:1; }  
    }
    @-webkit-keyframes fill {
        0%{ opacity:0; }
        33%{opacity:1;}
        100%{ opacity:1; }  
    }
    @-moz-keyframes fill1 {
        0%{ opacity:0; }
        33%{ opacity:0; }
        66%{ opacity:1; }
        100%{ opacity:1; }  
    }
    @-webkit-keyframes fill1 {
        0%{ opacity:0; }
        33%{ opacity:0; }
        66%{ opacity:1; }
        100%{ opacity:1; }  
    }
     @-moz-keyframes fill2 {
        0%{ opacity:0; }
        66%{ opacity:0; }
        99%{ opacity:1; }
        100%{ opacity:1; }  
    }
    @-webkit-keyframes fill2 {
        0%{ opacity:0; }
        66%{ opacity:0; }
        99%{ opacity:1; }
        100%{ opacity:1; }  
    }

</style>
<style>
    .ms-login .ipt_text input{
        background: #393434!important;
        color:#fff;
    }
    .el-loading-mask.is-fullscreen {
        opacity: 0.4;
    }
</style>