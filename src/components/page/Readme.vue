<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i> 平台简介</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="ms-doc">
            <h3>README.md</h3>
            <article :style="{height: mHei + 'px'}">
                <!-- <div class="time_box">
                    <el-row :gutter="20">
                        <el-col :span="5"><div class="grid-content bg-purple">{{double2}}{{hour}}时</div></el-col>
                        <el-col :span="3"><div class="grid-content bg-purple">:</div></el-col>
                        <el-col :span="5"><div class="grid-content bg-purple">{{double1}}{{min}}分</div></el-col>
                        <el-col :span="3"><div class="grid-content bg-purple">:</div></el-col>
                        <el-col :span="5"><div class="grid-content bg-purple">{{double}}{{sec}}秒</div></el-col>
                    </el-row>
                </div> -->
                <div class="name_sys">
                    欢迎来到企业管理平台
                </div>
                <div class="main_sys">
                    此系统可以对集团企业信息进行控制，以及本集团企业的数据控制和接口控制。可以添加开放服务、二维码生成、集团企业系统管理、操作管理、组织架构管理、角色管理、资源管理、授权管理等。
                </div>
                <div class="alt-2">
                    <time class="countdown-alt-2" datetime="PT12H27M12S">
                        <span class="item item-hh">
                            <!-- <span class="hh-1"></span> -->
                            <span class="hh-2">{{year}}</span>
                            <span class="label label-hh">Year</span>
                        </span>
                        <span class="separator">:</span>
                        <span class="item item-mm">
                            <!-- <span class="mm-1"></span> -->
                            <span class="mm-2">{{double4}}{{month}}</span>
                            <span class="label label-mm">Month</span>
                        </span>
                        <span class="separator">:</span>
                        <span class="item item-ss">
                            <!-- <span class="ss-1"></span> -->
                            <span class="ss-2">{{double3}}{{data}}</span>
                            <span class="label label-ss">Data</span>
                        </span>
                    </time>
                </div>
                <div class="time_box">
                    <div class="time_hore">{{double2}}{{hour}} ：</div>
                    <div class="time_hore">{{double1}}{{min}} ：</div>
                    <div class="time_hore">{{double}}{{sec}}</div>
                </div>
                <!-- <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="4"><div class="grid-content bg-purple">{{double2}}{{hour}}时</div></el-col>
                    <el-col :span="4"><div class="grid-content bg-purple-light">{{double1}}{{min}}分</div></el-col>
                    <el-col :span="4"><div class="grid-content bg-purple">{{double}}{{sec}}秒</div></el-col>
                </el-row> -->
            </article>
        </div>
    </div>
</template>

<script>
export default {
    data: function(){
        return {
            mHei:0,
            dataJson:{},
            time:{
                hour:0,
                min:0,
                sec:0
            },
            year:0,//年
            month:0,//月
            data:0,//日
            day:0,//星期
            hour:23,//小时
            min:59,//分钟
            sec:50,//秒
            double:"",
            double1:"",
            double2:"",
            double3:"",
            double4:"",
        }
    },
    mounted(){
        let self = this;
        let storage = JSON.parse(localStorage.getItem('dataJson'));//登录取值
        self.dataJson = storage;
        let mHei = document.body.offsetHeight - 80-75;
        self.mHei = mHei;
        console.log(self.dataJson)
        self.first_bload();
        self.times();
        console.log(self.sec)
    },
    watch:{
        'sec':{  
            handler:function(val,oldval){
                let self = this;
                if(val>=0 && val<=9){
                    self.double = "0"
                }else{
                    self.double = ""
                }
            },  
            deep:true//对象内部的属性监听，也叫深度监听  
        },
        'min':{  
            handler:function(val,oldval){  
                let self = this;
                console.log(val)
                if(val>=0 && val<=9){
                    self.double1 = "0"
                }else{
                    self.double1 = ""
                }
            },  
            deep:true//对象内部的属性监听，也叫深度监听  
        },
        'hour':{  
            handler:function(val,oldval){  
                let self = this;
                if(val>=0 && val<=9){
                    self.double2 = "0"
                }else{
                    self.double2 = ""
                }
            },  
            deep:true//对象内部的属性监听，也叫深度监听  
        },
    },
    methods:{
        first_bload(){
            let self = this;
            let time = new Date();
            self.year = time.getFullYear();
            self.month = time.getMonth()+1;
            self.data = time.getDate();
            self.hour = time.getHours();
            self.min = time.getMinutes();
            self.sec = time.getSeconds();
            if(self.sec>=0 && self.sec<=9){
                self.double = "0"
            }else{
                self.double = "";
            }
            if(self.min>=0 && self.min<=9){
                self.double1 = "0"
            }else{
                self.double1 = "";
            }
            if(self.hour>=0 && self.hour<=9){
                self.double2 = "0"
            }else{
                self.double2 = "";
            }
            if(self.data>=0 && self.data<=9){
                self.double3 = "0"
            }else{
                self.double3 = "";
            }
            if(self.month>=0 && self.month<=9){
                self.double4 = "0"
            }else{
                self.double4 = "";
            }
        },
        times(){
            let self = this;
            setInterval(() => {
                if(self.sec==59){
                    self.sec = 0;
                    self.min++;
                    if(self.min == 60){
                        self.min = 0;
                        self.hour++;
                        if(self.hour == 24){
                            self.hour=0;
                            // self.data++;
                            self.first_bload();
                        }
                    }
                }else{
                    self.sec++;
                }
            }, 1000)
        },
    },
}
</script>

<style scoped>
    .ms-doc{
        width:100%;
        /* max-width: 980px; */
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
    .ms-doc h3{
        padding: 9px 10px 10px;
        margin: 0;
        font-size: 14px;
        line-height: 17px;
        background-color: #f5f5f5;
        border: 1px solid #d8d8d8;
        border-bottom: 0;
        border-radius: 3px 3px 0 0;
    }
    .ms-doc article{
        /* padding: 45px; */
        word-wrap: break-word;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        position: relative;
        background: url('/static/images/1.jpg') no-repeat;
        background-size: 100%;
        background-color: rgb(1,6,10);
    }
    .ms-doc article h1{
        font-size:32px;
        padding-bottom: 10px;
        margin-bottom: 15px;
        border-bottom: 1px solid #ddd;
    }
    .ms-doc article h2 {
        margin: 24px 0 16px;
        font-weight: 600;
        line-height: 1.25;
        padding-bottom: 7px;
        font-size: 24px;
        border-bottom: 1px solid #eee;
    }
    .ms-doc article p{
        margin-bottom: 15px;
        line-height: 1.5;
    }
    .ms-doc article .el-checkbox{
        margin-bottom: 5px;
    }

    .time_box{
        width: 20%;
        float: right;
        height: 50px;
        /* background-color: red; */
        /* margin-top: 50px; */
        border-radius: 5px;
    }
    .time_hore{
        float: left;
        color: #fff;
        font-size: 30px;
    }

    .alt-2{
        overflow: hidden;
    }
    .countdown-alt-2 {
        font-size: 0;  /* Hack for inline and inline-block extra markup generated spaces */
        display: block;
        overflow: auto;
        padding: 20px 0;
        /* margin: 50px 0; */
        font-family: 'Trebuchet MS', 'Lucida Grande', Verdana, Arial, Sans-Serif;
        color: #333;
        -webkit-transform: skew(-2deg, -2deg);
        transform: skew(-2deg, -2deg);
        float: right;
    }
    .countdown-alt-2 .item {
        display: block;
        float: left;
        position: relative;
        font-size: 15px;
        font-weight: bold;
        padding: 36px 20px 10px 20px;
        margin: 0 10px;
        min-width: 40px;
        max-width: 40px;
        text-align: center;
        background: #FFF;
        border: 2px solid #FFF;
        box-shadow: 5px 5px 10px 1px rgba(0, 0, 0, 0.2);
    }
    .countdown-alt-2 .dd,
    .countdown-alt-2 .hh-1,
    .countdown-alt-2 .hh-2,
    .countdown-alt-2 .mm-1,
    .countdown-alt-2 .mm-2,
    .countdown-alt-2 .ss-1,
    .countdown-alt-2 .ss-2 {
        font: italic;
        text-shadow: 1px 1px 10px #FFF, 1px 1px 3px #333;
    }
    .countdown-alt-2 .label {
        font-weight: normal;
        position: absolute;
        top: 0;
        left: 0;
        font-size: 14px;
        width: 50px;
        padding: 5px 15px;
        background: #0B81BC;
        color: #FFF;
    }
    .name_sys{
        position: absolute;
        top: 20%;
        left: 20%;
        font-size: 40px;
        color: #fff;
    }
    .main_sys{
        position: absolute;
        top: 40%;
        left: 15%;
        color: #fff;
        max-width: 600px;
        line-height: 50px;
    }
</style>