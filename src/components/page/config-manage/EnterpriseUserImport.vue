<template>
    <div>
        <el-upload
            class="upload"
            accept="excel"
            drag
            :action="importUserUrl"
            :auto-upload="false"
            :on-preview="handlePreview"
            :on-progress="handleProgress"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :on-success="success"
            :on-error="backError"
            ref="upload"
            :file-list="fileList"
            :limit="limit"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传Excel文件,且不超过5MB</div>
        </el-upload>
        <el-button type="primary" class="btn-upload" @click="submitUpload()">上传到服务器</el-button>
        <el-button type="primary" class="btn-upload" @click="downloadExcelTemplate()">下载Excel模板</el-button>
        <canvas ref="canvas" style="height: 0"></canvas> 
    </div>
</template>

<script>
    export default {
        data() {
            return {
                fileList: [],
                adminSessionId: '',
                importUserUrl: '',
                filesList:[],
                limit:1,
            };
        },
        mounted() {
            let self = this
            self.adminSessionId = localStorage.getItem('adminSessionId')
            console.log('adminSessionId',self.adminSessionId)
            self.importUserUrl = '/account_auth_admin/user-api.importUser?sessionId=' + self.adminSessionId
        },
        methods: {
            submitUpload() {
                let self = this
                console.log("go submitUpload methods")
                if(self.filesList.length == 0) {
                    self.$message.warning("您没有选择文件!")
                    return
                }
                console.log(self.$refs.upload)
                self.$refs.upload.submit();
            },
            handleRemove(file, fileList) {//文件列表移除文件
                let self = this;
                console.log(file, fileList);
                self.$message('文件已被移除!');
            },
            handlePreview(file,fileList) {//点击已上传的文件链接
                console.log("handlePreview", file,fileList);
            },
            handleProgress(file) {//文件上传时
                console.log("handleProgress", file)
            },
            handleChange(file,fileList){//文件状态改变时
                let self = this;

                console.log("file", file, file.raw.type)
                /*获取文件后缀名*/
                let types = file.name.split('.').pop();
                console.log('types',types)

                const fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(item => item === types);

                const isExcel = file.raw.type === 'application/vnd.ms-excel' || file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

                const isLt5M = file.size / 1024 / 1024 < 5

                console.log("isLt5M", isLt5M, "fileType",fileType)

                if(!fileType) {
                    self.$message.warning("只能上传Excel文件!")
                    self.$refs.upload.clearFiles()
                    return
                }

                if(!isLt5M) {
                    self.$message.warning("文件大小不能超过5M")
                    self.$refs.upload.clearFiles()
                    return
                }

                self.filesList = fileList;
                if (self.filesList.length > 1) {
                    self.handleExceed();
                }
            },
            handleExceed(file) {//文件超出个数限制时
                let self = this;
                console.log(file,self.filesList)
                // self.$message.warning('当前限制选择 1 个文件!');
                self.filesList.splice(0,1)
            },
            success(file,response) {
                let self = this
                console.log('file',file,'response',response)
                if (response.response.status == 1) {
                    self.$message("上传文件成功")
                }else if (response.response.status == 2) {
                    self.$message.warning(response.response.message);
                    self.$refs.upload.clearFiles()
                }
            },
            backError(file,response) {
                let self = this
                self.$message.error("上传文件失败")
                console.log(file,response)
            },
            beforeUpload(file) {
                /*let self = this
                console.log("beforeUpload", file, file.type)

                const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                const isLt5M = file.size / 1024 / 1024 < 5

                console.log("isExcel", isExcel, "isLt5M", isLt5M)

                if(!isExcel) {
                    self.$message.warning("只能上传Excel文件!")
                    self.$refs.upload.clearFiles()
                }

                if(!isLt5M) {
                    self.$message.warning("文件大小不能超过5M")
                    self.$refs.upload.clearFiles()
                }

                return isExcel && isLt5M*/  
            },
            //下载excel模板
            downloadExcelTemplate() {
                let self = this
                let canvas = self.$refs.canvas
                canvas.toBlob(function(blob) {
                    //var url = URL.createObjectURL(blob);
                    var url = self.EXCEL_TEMPLATE_URL
                    var a = document.createElement('a')
                    a.download = 'canvas'
                    a.href = url
                    a.click()
                    URL.revokeObjectURL(url)
                })
            }
        }
    }
</script>

<style>
    .el-upload--text {
        width: 360px;
    }
    .btn-upload {
        margin-top: 20px;
    }
</style>