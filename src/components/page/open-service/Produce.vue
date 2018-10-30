<template>
    <div style="position:relative;height:500px;">
        <div>
            <el-input v-model="inputText" placeholder="请输入内容" @keyup.enter.native="btn_code"></el-input>
            <el-button type="primary" class='btn' v-show="qrCodeShow" @click="btn_code()">生成二维码</el-button>
        </div>
        <div v-show="qrcodeUrl" id="qrcodejs" ref="tree">
            <img :src="qrUrl">
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            inputText:'',
            qrCodeShow:true,
            type:0,//0为普通内容,1为网址
            qrUrl:'',
            qrcodeUrl:false,
        }
    },
    methods:{
        btn_code(){//提交二维码
            let self = this;
            let reg = /((https|http|ftp|rtsp|mms):\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)/g;
            if(reg.test(self.inputText)){
                self.type = 1;
            }else{
                self.type = 0;
            }
            self.ask();
        },
        ask(){
            let self=this;
            let datas={
                "moduleid": "1",
                "content": self.inputText,
                "type":self.type
            };
            self.$axios({
                url:'/vr-qrcode/qr/generate',
                method:'POST',
                responseType:'json',
                data:datas
            })
            .then(function(response){
                console.log(response);
                if(response.data.status == 200){
                    let qr = self.$refs.tree;
                    self.qrcodeUrl = true;
                    self.qrUrl = response.data.data.qrUrl;
                    self.inputText = '';
                }else{
                    self.$message({
                        message: '二维码提交失败！',
                        type: 'warning',
                        duration:1500
                    });
                }
            })
            .catch(function(response){
                console.log('报错', response);
                self.$message({
                    message: '请输入内容！',
                    type: 'warning',
                    duration:1500
                });
            })
        }
    }
}
</script>
<style scoped>
    .el-input{
        width: 300px;
    }
    #qrcodejs{
        position: fixed;
        top: 20%;
        left: 46%;
        text-align: center; 
        padding:20px;
    }
    .btn{
        margin-left:20px;
    }
    .back{
        margin-right:20px;
    }
</style>