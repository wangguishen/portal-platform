<template>
  <div class="g-container" v-loading="loading" element-loading-text="页面加载中">
    <div class="box m-title"><span>威宁投资集团用户登录使用情况</span></div>
    <div class="m-date">
      <div>
        <span class="iconfont" @click="loadPreData()">&#xea5e;</span>{{titleDate}}
        <span class="iconfont" @click="loadNextData()">&#xe600;</span>
      </div>
    </div>
    <div class="grid m-data">
      <div class="grid-cell u-11b">
        <div class="box"><b>{{userTotal}} 个</b></div>
        <div class="box u-span">总用户</div>
      </div>
      <div class="grid-cell u-11b">
        <div class="box"><b>{{userCount}} 个</b></div>
        <div class="box u-span">活跃用户</div>
      </div>
      <div class="grid-cell u-11b">
        <div class="box"><b>{{messageTotal}} 条</b></div>
        <div class="box u-span">消息总数</div>
      </div>
      <div class="grid-cell u-11b">
        <div class="box"><b>{{averageMessage}} 条</b></div>
        <div class="box u-span">人均消息数</div>
      </div>
      <div class="grid-cell u-11b" style="border: none">
        <div class="box"><b>{{averageTime}} 分钟</b></div>
        <div class="box u-span">平均在线时长</div>
      </div>
    </div>
    <div class="grid m-data">
      <div class="grid-cell u-11b">
        <div class="box"><b>{{mobileAverage}}</b></div>
        <div class="box u-span">手机登录占比</div>
      </div>
      <div class="grid-cell u-11b">
        <div class="box"><b>{{meetCount}} 条</b></div>
        <div class="box u-span">会议巢消息数</div>
      </div>
      <div class="grid-cell u-11b">
        <div class="box"><b>{{orgCount}} 条</b></div>
        <div class="box u-span">组织巢消息数</div>
      </div>
      <div class="grid-cell u-11b">
        <div class="box"><b>{{workCount}} 条</b></div>
        <div class="box u-span">工作巢消息数</div>
      </div>
      <div class="grid-cell u-11b" style="border: none">
        <div class="box"><b>{{audioCount}} 条</b></div>
        <div class="box u-span">音频总数</div>
      </div>
    </div>
    <div class="grid m-data" style="margin-bottom: 20px">
      <div class="grid-cell u-11b">
        <div class="box"><b>{{vedioCount}} 条</b></div>
        <div class="box u-span">视频总数</div>
      </div>
      <div class="grid-cell u-11b">
        <div class="box"><b>{{uploadCount}} 条</b></div>
        <div class="box u-span">上传文件总数</div>
      </div>
      <div class="grid-cell u-11b">
        <div class="box"><b>{{uploadWorkCount}} 条</b></div>
        <div class="box u-span">工作巢上传文件总数</div>
      </div>
      <div class="grid-cell u-11b">
        <div class="box"><b>{{uploadMeetCount}} 条</b></div>
        <div class="box u-span">会议巢上传文件总数</div>
      </div>
      <div class="grid-cell u-11b" style="border: none">
        <div class="box"><b>{{uploadOrgCount}} 条</b></div>
        <div class="box u-span">组织巢上传文件总数</div>
      </div>
    </div>

    <div class="box">
      <div id="chart1" class="u-chart1"></div>
    </div>
    <div class="box">
      <div id="chart2" class="u-chart2"></div>
    </div>
    <div class="box">
      <div id="chart3" class="u-chart3"></div> 
    </div>
    <div class="box">
      <div id="chart4" class="u-chart4"></div>
    </div>
    <div class="box">
      <div id="chart5" class="u-chart5"></div>
    </div>
    <div class="box">
      <div id="chart6" class="u-chart6"></div>
    </div>
    <div class="box">
      <div id="chart7" class="u-chart7"></div>
    </div>
    <div class="box">
      <div id="chart8" class="u-chart8"></div>
    </div>
  </div>
</template>

<script>
  import Highcharts from 'highcharts/highstock';
  import HighchartsMore from 'highcharts/highcharts-more';
  import HighchartsDrilldown from 'highcharts/modules/drilldown';
  import Highcharts3D from 'highcharts/highcharts-3d';
  import Highmaps from 'highcharts/modules/map';

  HighchartsMore(Highcharts)
  HighchartsDrilldown(Highcharts);
  Highcharts3D(Highcharts);
  Highmaps(Highcharts);

  export default {
    data() {
      return {
        titleDate: '', //当天日期
        userTotal: '', //总用户
        userCount: '', //活跃用户
        averageTime: '', //平均在线时长
        messageTotal: '', //消息总数,
        averageMessage: '', //人均消息数
        mobileAverage: '', //手机登录占比

        userUrl: '/account_auth_admin/user-api.loginStatistics', //24小时登录用户接口
        account: 'admin',
        encryptCode: '123456',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        appCode: 'XIANGPU',
        clientIp: '127.0.0.1',
        userTimes: [], //时间
        userCounts: [], //用户量
        countNums: [], //总数
        successNums: [], //成功数
        failNums: [], //失败数
        colors: ['#730000','#c16712', '#001f4d', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#8085e8', '#8d4653', '#91e8e1'],
        userColors: ['#c33430','#963463','#ffffcb'],

        messageUrl: 'vr-push/countMessageByHour',  //24小时消息数接口
        messageTime: [], //消息时间
        messageCount: [], //数量
        messageColors: ['#6ab1b9'],

        loading: false,
        userLoading: false,
        messageLoading: false,

        startTimeShow: '',
        endTimeShow: '',
        compCode: 'WEINING',

        nestDayUrl: 'vr-push/countNestByDay',
        allCount: 0, // 
        orgCount: 0, //组织巢消息总数
        workCount: 0, //工作巢消息总数
        meetCount: 0, //会议巢消息总数

        nestHourUrl: 'vr-push/countNestByHour',
        orgCounts: [],
        workCounts: [],
        meetCounts: [],
        orgColors: ['#d58364'],
        workColors: ['#2e4454'],
        meetColors: ['#3c91cb'],
        nestHourTimes: [],
        orgLoading: false,
        workLoading: false,
        meetLoading: false,

        meetUrl: 'vr-push/query_meeting_count', //音频,视频次数
        audioCount: 0, //音频总数
        audioCounts: [],
        audioColors: ['#de9325'],
        audioHourTimes: [],
        audioLoading: false,

        vedioCount: 0, //视频总数
        vedioCounts: [], //视频24小时数
        vedioColors: ['#749f83'],
        vedioHourTimes: [],
        vedioLoading: false,

        uploadUrl: 'vr-push/countFiles',
        uploadCount: 0, //当天上传文件总数
        uploadWorkCount: 0, //工作巢当天上传文件总数
        uploadMeetCount: 0, //会议巢当天上传文件总数
        uploadOrgCount: 0, //组织巢当天上传文件总数
        uploadCounts: [], //以当前小时往前推24小时的各小时上传文件数
        uploadHourTimes: [], //24小时数
        uploadColors: ['#bda29a'],
        uploadLoading: false,
      }
    },
    mounted() {
      let self = this
      let nowDate = new Date()
      self.titleDate = self.formatDate1(nowDate)
      self.loading = true
      self.startTimeShow = self.formatPreDate(nowDate)
      self.endTimeShow = self.formatDate(nowDate)
      self.getUserData(self.startTimeShow, self.endTimeShow)
      self.getMessageData()
      self.getNestDayData()
      self.getNestHourData()
      self.getAudioData()
      self.getVedioData()
      self.getcountFilesData()
    },
    methods: {
      initChart1() {
        let self = this
        var chart1 = new Highcharts.Chart({
           chart: {//图标配置
                    renderTo: 'chart1',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1,
                    options3d: {//3D配置
                        enabled: false,
                        alpha: 0,
                        beta: 0,
                        depth: 50,
                        viewDistance: 25
                    }
                },
                title: {//标题
                    text: '24小时登录用户'
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    labels: {
                        format:'{value}',
                    },
                    categories: self.userTimes,
                },
                yAxis:{//y坐标轴
                    type: 'logarithmic',
                    title:{
                        text:'登录用户数量'
                    },
                    labels: {
                        formatter:function(){
                            return this.value
                        }
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#87898a'
                            }
                        },
                        depth: 25,
                        pointPadding: 0.05,
                        borderWidth: 0
                    }
                },
                series: [//数据列
                    {
                        name:'用户量',
                        data: self.userCounts
                    }/*,{
                        name:'成功数',
                        data: self.successNums
                    },{
                        name:'失败数',
                        data: self.failNums
                    }*/
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: self.userColors
        });
        self.userLoading = true
        if(self.userLoading && self.messageLoading && self.meetLoading && self.workLoading && self.orgLoading && self.audioLoading && self.vedioLoading) {
          self.loading = false
        }
      },
      initChart2() {
        let self = this
        var chart2 = new Highcharts.Chart({
          chart: {//图标配置
                    renderTo: 'chart2',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1,
                    options3d: {//3D配置
                        enabled: false,
                        alpha: 0,
                        beta: 0,
                        depth: 50,
                        viewDistance: 25
                    }
                },
                title: {//标题
                    text: '24小时消息数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    labels: {
                        format:'{value}',
                    },
                    categories: self.messageTime
                },
                yAxis:{//y坐标轴
                    type: 'logarithmic',
                    title:{
                        text:'消息数量'
                    },
                    labels: {
                        formatter:function(){
                            return this.value
                        }
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#87898a'
                            }
                        },
                        depth: 25,
                        pointPadding: 0,
                        borderWidth: 0
                    }
                },
                series: [//数据列
                    {
                        name:'消息数量',
                        data: self.messageCount
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: self.messageColors
              });
        self.messageLoading = true
        if(self.userLoading && self.messageLoading && self.meetLoading && self.workLoading && self.orgLoading && self.audioLoading && self.vedioLoading) {
          self.loading = false
        }
      },
      initChart3() { //会议巢
        let self = this
        var chart3 = new Highcharts.Chart({
          chart: {//图标配置
                    renderTo: 'chart3',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1,
                    options3d: {//3D配置
                        enabled: false,
                        alpha: 0,
                        beta: 0,
                        depth: 50,
                        viewDistance: 25
                    }
                },
                title: {//标题
                    text: '会议巢24小时消息数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    labels: {
                        format:'{value}',
                    },
                    categories: self.nestHourTimes
                },
                yAxis:{//y坐标轴
                    type: 'logarithmic',
                    title:{
                        text:'会议巢消息数量'
                    },
                    labels: {
                        formatter:function(){
                            return this.value
                        }
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#87898a'
                            }
                        },
                        depth: 25,
                        pointPadding: 0,
                        borderWidth: 0
                    }
                },
                series: [//数据列
                    {
                        name:'会议巢消息数量',
                        data: self.meetCounts
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: self.meetColors
              });
        self.meetLoading = true
        if(self.userLoading && self.messageLoading && self.meetLoading && self.workLoading && self.orgLoading && self.audioLoading && self.vedioLoading) {
          self.loading = false
        }
      },
      initChart4() { //组织巢
        let self = this
        var chart4 = new Highcharts.Chart({
          chart: {//图标配置
                    renderTo: 'chart4',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1,
                    options3d: {//3D配置
                        enabled: false,
                        alpha: 0,
                        beta: 0,
                        depth: 50,
                        viewDistance: 25
                    }
                },
                title: {//标题
                    text: '组织巢24小时消息数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    labels: {
                        format:'{value}',
                    },
                    categories: self.nestHourTimes
                },
                yAxis:{//y坐标轴
                    type: 'logarithmic',
                    title:{
                        text:'组织巢消息数量'
                    },
                    labels: {
                        formatter:function(){
                            return this.value
                        }
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#87898a'
                            }
                        },
                        depth: 25,
                        pointPadding: 0,
                        borderWidth: 0
                    }
                },
                series: [//数据列
                    {
                        name:'组织巢消息数量',
                        data: self.orgCounts
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: self.orgColors
              });
        self.orgLoading = true
        if(self.userLoading && self.messageLoading && self.meetLoading && self.workLoading && self.orgLoading && self.audioLoading && self.vedioLoading) {
          self.loading = false
        }
      },
      initChart5() { //工作巢
        let self = this
        var chart5 = new Highcharts.Chart({
          chart: {//图标配置
                    renderTo: 'chart5',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1,
                    options3d: {//3D配置
                        enabled: false,
                        alpha: 0,
                        beta: 0,
                        depth: 50,
                        viewDistance: 25
                    }
                },
                title: {//标题
                    text: '工作巢24小时消息数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    labels: {
                        format:'{value}',
                    },
                    categories: self.nestHourTimes
                },
                yAxis:{//y坐标轴
                    type: 'logarithmic',
                    title:{
                        text:'工作巢消息数量'
                    },
                    labels: {
                        formatter:function(){
                            return this.value
                        }
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#87898a'
                            }
                        },
                        depth: 25,
                        pointPadding: 0,
                        borderWidth: 0
                    }
                },
                series: [//数据列
                    {
                        name:'工作巢消息数量',
                        data: self.workCounts
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: self.workColors
              });
        self.workLoading = true
        if(self.userLoading && self.messageLoading && self.meetLoading && self.workLoading && self.orgLoading && self.audioLoading && self.vedioLoading) {
          self.loading = false
        }
      },
      initChart6() { //音频
        let self = this
        var chart6 = new Highcharts.Chart({
          chart: {//图标配置
                    renderTo: 'chart6',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1,
                    options3d: {//3D配置
                        enabled: false,
                        alpha: 0,
                        beta: 0,
                        depth: 50,
                        viewDistance: 25
                    }
                },
                title: {//标题
                    text: '24小时音频次数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    labels: {
                        format:'{value}',
                    },
                    categories: self.audioHourTimes
                },
                yAxis:{//y坐标轴
                    type: 'logarithmic',
                    title:{
                        text:'音频次数'
                    },
                    labels: {
                        formatter:function(){
                            return this.value
                        }
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#87898a'
                            }
                        },
                        depth: 25,
                        pointPadding: 0,
                        borderWidth: 0
                    }
                },
                series: [//数据列
                    {
                        name:'音频次数',
                        data: self.audioCounts
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: self.audioColors
              });
        self.audioLoading = true
        if(self.userLoading && self.messageLoading && self.meetLoading && self.workLoading && self.orgLoading && self.audioLoading && self.vedioLoading && self.audioLoading && self.vedioLoading && self.uploadLoading) {
          self.loading = false
        }
      },
      initChart7() { //视频
        let self = this
        var chart7 = new Highcharts.Chart({
          chart: {//图标配置
                    renderTo: 'chart7',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1,
                    options3d: {//3D配置
                        enabled: false,
                        alpha: 0,
                        beta: 0,
                        depth: 50,
                        viewDistance: 25
                    }
                },
                title: {//标题
                    text: '24小时视频次数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    labels: {
                        format:'{value}',
                    },
                    categories: self.vedioHourTimes
                },
                yAxis:{//y坐标轴
                    type: 'logarithmic',
                    title:{
                        text:'视频次数'
                    },
                    labels: {
                        formatter:function(){
                            return this.value
                        }
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#87898a'
                            }
                        },
                        depth: 25,
                        pointPadding: 0,
                        borderWidth: 0
                    }
                },
                series: [//数据列
                    {
                        name:'视频次数',
                        data: self.vedioCounts
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: self.vedioColors
              });
        self.vedioLoading = true
        if(self.userLoading && self.messageLoading && self.meetLoading && self.workLoading && self.orgLoading && self.audioLoading && self.vedioLoading && self.audioLoading && self.vedioLoading && self.uploadLoading) {
          self.loading = false
        }
      },
      initChart8() { //上传文件数
        let self = this
        var chart8 = new Highcharts.Chart({
          chart: {//图标配置
                    renderTo: 'chart8',
                    type: 'column',
                    plotBackgroundColor : "#ebeef0",
                    plotBorderWidth: 1,
                    options3d: {//3D配置
                        enabled: false,
                        alpha: 0,
                        beta: 0,
                        depth: 50,
                        viewDistance: 25
                    }
                },
                title: {//标题
                    text: '24小时上传文件数'
                },
                subtitle: {//副标题
                    text: ''
                },
                xAxis:{//x坐标轴
                    title:{
                        text:''
                    },
                    labels: {
                        format:'{value}',
                    },
                    categories: self.uploadHourTimes
                },
                yAxis:{//y坐标轴
                    type: 'logarithmic',
                    title:{
                        text:'上传文件数'
                    },
                    labels: {
                        formatter:function(){
                            return this.value
                        }
                    },
                    gridLineWidth: 2
                },
                plotOptions: {
                    column: {
                        dataLabels:{
                            enabled:true, // dataLabels设为true
                            style:{
                                color:'#87898a'
                            }
                        },
                        depth: 25,
                        pointPadding: 0,
                        borderWidth: 0
                    }
                },
                series: [//数据列
                    {
                        name:'上传文件数',
                        data: self.uploadCounts
                    }
                ],
                credits:{//右下角版权信息
                    enabled: false,
                },
                colors: self.uploadColors
              });
        self.uploadLoading = true
        if(self.userLoading && self.messageLoading && self.meetLoading && self.workLoading && self.orgLoading && self.audioLoading && self.vedioLoading && self.audioLoading && self.vedioLoading && self.uploadLoading) {
          self.loading = false
        }
      },
      getUserData(startTime, endTime) { //获取24小时登录用户数据
        let self = this
        self.$axios({
          url: self.userUrl,
          method: 'post',
          responseType: 'json',
          data: {
            account: self.account,
            encryptCode: self.encryptCode,
            password: self.password,
            appCode: self.appCode,
            clientIp: self.clientIp,
            startTime: startTime,
            endTime: endTime,
            enterpriseCode: self.compCode,
            type: 'new'
          }
        })
        .then(function(res) {
          if(res.data.status == 1) {
            self.userTimes = []
            self.userCounts = []
            self.successNums = []
            self.failNums = []
            let list = res.data.data.timeList
            list.forEach(function(item, index) {
              let times = item.time.split('--')[0].split(' ')[1]

              /*let str = item.time.substring
              item.time = item.time.substring(11, 16)*/
              let arr = times.split(':')
              if(arr[0] < 10){
                item.time = "0"+arr[0]+':00'
              } else {
                item.time = arr[0]+':00'
              }
              self.userTimes.push(item.time)
              self.userCounts.push(item.countNum)
              self.successNums.push(item.successNum)
              self.failNums.push(item.failNum)
            })
            let list1 = res.data.data.averageTime
            self.userTotal = list1.userTotal
            self.userCount = list1.userCount
            self.averageTime = Math.round(list1.averageTime)
            self.mobileAverage = self.toPercent(list1.mobileAverage)
            self.mobileAverage = self.mobileAverage === undefined ? '--' : self.mobileAverage
            self.messageTotal = list1.messageTotal
            let f = parseFloat(list1.averageMessage)
            f = Math.round(list1.averageMessage*100)/100;
            let s = f.toString(); 
            let rs = s.indexOf('.'); 
            if (rs < 0) { 
                rs = s.length; 
                s += '.'; 
            } 
            while (s.length <= rs + 2) { 
                s += '0'; 
            }
            self.averageMessage = s
          } else {
            self.loading = false
            self.$message.warning("网络异常")
          }

          console.log(self.userTimes, self.userCounts, self.successNums)

          self.$nextTick(() => {
            self.initChart1()
          })
        })
        .catch(function(res) {
          self.loading = false
          self.$message.warning("网络异常")
        })
      },
      getMessageData() {
        let self = this
        self.$axios({
          url: self.messageUrl + '?compCode=' + self.compCode + '&date=' + self.endTimeShow + '&type=new',
          method: 'get',
          responseType: 'json',
        })
        .then(function(res) {
          if(res.data.message == "success") {
            let list = res.data.data
            self.messageTime = []
            self.messageCount = []
            list.forEach(function(item, index) {
              let str = '';
              if(item.hour < 10){
                  str = '0'+item.hour+':00'
              }else{
                  str = item.hour+':00'
              }
              self.messageTime.push(str)
              self.messageCount.push(item.count)
            })
          } else {
            self.$message.warning("网络异常")
            self.loading = false
          }

          self.$nextTick(() => {
            self.initChart2()
          })
        })
        .catch(function(res) {
          self.loading = false
          self.$message.warning("网络异常")
        })
      },
      getNestDayData() { //获取威宁工作巢、组织巢、会议巢每天的消息总数
        let self = this
        self.$axios({
          url: self.nestDayUrl + '?compCode=' + self.compCode + '&date=' + self.endTimeShow + '&type=new',
          method: 'get',
          responseType: 'json'
        })
        .then(function(res) {
          console.log("success", res)
          if(res.data.message == "success") {
            let list = res.data.data
            self.orgCount = list.orgCount
            console.log("=========", self.orgCount)
            self.allCount = list.allCount
            self.workCount = list.workCount
            self.meetCount = list.meetCount
            console.log(list.orgCount, list.allCount, list.meetCount)
          }
        })
      },
      getNestHourData() {
        let self = this
        self.$axios({
          url: self.nestHourUrl + '?compCode=' + self.compCode + '&date=' + self.endTimeShow + '&type=new',
          method: 'get',
          responseType: 'json'
        })
        .then(function(res) {
          console.log("success", res)
          if(res.data.status == 200) {

            let list = res.data.data
            let workList = list.workList.reverse()
            let meetList = list.meetList.reverse()
            let orgList = list.orgList.reverse()

            self.orgCounts = []
            self.meetCounts = []
            self.workCounts = []

            workList.forEach(function(item, index) {
              self.workCounts.push(item.msg)
              let str = '';
              if(item.hour < 10){
                str = '0'+item.hour+':00'
              } else {
                str = item.hour+':00'
              }
              self.nestHourTimes.push(str)
            })

            meetList.forEach(function(item, index) {
              self.meetCounts.push(item.msg)
            })

            orgList.forEach(function(item, index) {
              self.orgCounts.push(item.msg)
            })
          } else {
            self.$message.warning("网络异常")
            self.loading = false
          }

          self.$nextTick(() => {
            self.initChart3()
            self.initChart4()
            self.initChart5()
          })
        })
        .catch(function(res) {
          self.loading = false
          self.$message.warning("网络异常")
        })
      },
      getAudioData() { //获取音频次数
        let self = this
        self.$axios({
          url: self.meetUrl + '?compCode=' + self.compCode + '&date=' + self.endTimeShow + '&type=1',
          method: 'get',
          responseType: 'json'
        })
        .then(function(res) {
          if(res.data.status == 200) {
            self.audioCount = res.data.data.count
            let list = res.data.data.list
            self.audioHourTimes = []
            self.audioCounts = []
            list.forEach(function(item, index) {
              let str = '';
              if(item.hour < 10){
                  str = '0'+item.hour+':00'
              }else{
                  str = item.hour+':00'
              }
              self.audioHourTimes.push(str)
              self.audioCounts.push(item.count)
            })
          } else {
            self.$message.warning("网络异常")
          }

          self.$nextTick(() => {
            self.initChart6()
          })
        })
        .catch(function(res) {
          self.loading = false
          self.$message.warning("网络异常")
        })
      },
      getVedioData() { //获取视频次数
        let self = this
        self.$axios({
          url: self.meetUrl + '?compCode=' + self.compCode + '&date=' + self.endTimeShow + '&type=2',
          method: 'get',
          responseType: 'json'
        })
        .then(function(res) {
          if(res.data.status == 200) {
            self.vedioCount = res.data.data.count
            let list = res.data.data.list
            self.vedioHourTimes = []
            self.vedioCounts = []
            list.forEach(function(item, index) {
              let str = '';
              if(item.hour < 10){
                  str = '0'+item.hour+':00'
              }else{
                  str = item.hour+':00'
              }
              self.vedioHourTimes.push(str)
              self.vedioCounts.push(item.count)
            })
          } else {
            self.loading = false
            self.$message.warning("网络异常")
          }

          self.$nextTick(() => {
            self.initChart7()
          })
        })
        .catch(function(res) {
          self.loading = false
          self.$message.warning("网络异常")
        })
      },
      getcountFilesData() { //获取文件上传数据
        let self = this
        self.$axios({
          url: self.uploadUrl + '?compCode=' + self.compCode + '&date=' + self.endTimeShow,
          method: 'get',
          responseType: 'json'
        })
        .then(function(res) {
          if(res.data.status == 200) {
            self.uploadOrgCount = res.data.data.orgList
            self.uploadMeetCount = res.data.data.meetList
            self.uploadWorkCount = res.data.data.workList
            self.uploadCounts = []
            self.uploadHourTimes = []
            let list = res.data.data.uploads24.reverse()
            list.forEach(function(item, index) {
              let str = '';
              if(item.hour < 10){
                  str = '0'+item.hour+':00'
              }else{
                  str = item.hour+':00'
              }
              self.uploadHourTimes.push(str)
              self.uploadCounts.push(item.upload)
            })
          } else {
            self.loading = false
            self.$message.warning("网络异常")
          }
          self.$nextTick(() => {
            self.initChart8()
          })
        })
        .catch(function(res) {
          self.loading = false
          self.$message.warning("网络异常")
        })
      },
      toPercent(number) {
        if(!number) return
        if(number == 0) return 0
        return (Math.round(number * 10000)/100).toFixed(2) + '%'
      },
      formatDate(nowDate) {  //当天的--
        return nowDate.getFullYear() + "-" + (nowDate.getMonth()+1) + '-' + nowDate.getDate()
      },
      formatDate1(d) { //年月日
        d = new Date(d);
        return d.getFullYear()+" 年 "+(d.getMonth()+1)+" 月 "+d.getDate() + "日";
        /*return nowDate.getFullYear() + " 年 " + (nowDate.getMonth()+1) + ' 月 ' + nowDate.getDate() + '日'*/
      },
      formatPreDate(nowDate) {  //前一天
        var preDate = new Date(nowDate.getTime() - 24*60*60*1000); //前一天
        return preDate.getFullYear() + "-" + (preDate.getMonth()+1) + '-' + preDate.getDate()
      },
      formatNextDate(nowDate) { //后一天
        var nextDate = new Date(nowDate.getTime() + 24*60*60*1000); //后一天
        return nextDate.getFullYear() + "-" + (nextDate.getMonth()+1) + '-' + nextDate.getDate()
      },
      getNextDay(d) { //获取后一天-- 
        let f = d.replace(/\-/g, "/")
        d = new Date(f);
        d = +d + 1000*60*60*24;
        d = new Date(d);
        return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
      },
      getPreDay(d) { //获取前一天--
        let f = d.replace(/\-/g, "/")
        d = new Date(f);
        d = +d - 1000*60*60*24;
        d = new Date(d);
        return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
      },
      loadPreData() { //点击向前数据
        let self = this
        self.endTimeShow = self.getPreDay(self.endTimeShow)
        self.startTimeShow = self.getPreDay(self.startTimeShow)
        let end = self.endTimeShow.replace(/\-/g, "/")
        self.titleDate = self.formatDate1(end)

        self.getUserData(self.startTimeShow, self.endTimeShow)
        self.getMessageData()
        self.getNestDayData()
        self.getNestHourData()
        self.getAudioData()
        self.getVedioData()
        self.getcountFilesData()
      },
      loadNextData() { //点击向后数据
        let self = this
        let nowDate = new Date()
        if(self.compareDate(self.getNextDay(self.endTimeShow), self.formatDate(nowDate)) == true) {
          self.$message.warning("无数据显示")
          return
        }
        self.endTimeShow = self.getNextDay(self.endTimeShow)
        self.startTimeShow = self.getNextDay(self.startTimeShow)
        let end = self.endTimeShow.replace(/\-/g, "/")
        self.titleDate = self.formatDate1(end)

        self.getUserData(self.startTimeShow, self.endTimeShow)
        self.getMessageData()
        self.getNestDayData()
        self.getNestHourData()
        self.getAudioData()
        self.getVedioData()
        self.getcountFilesData()
      },
      compareDate(d1, d2) { //比较日期大小
        let self = this
        return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
      }
    }
  }
</script>

<style scoped>
  .grid {
    display: flex;
    display-webkit: flex;
  }
  .box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .box1 {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }
  .g-container {
    height: 100%;
    overflow-y: scroll;
    background: #ebeef0;
  }  
  .m-title {
    height: 75px;
    line-height: 75px; 
    border: none;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
    background-image: linear-gradient(0, #eaeaea, #eaeaea 50%, transparent 50%);
    background-image: -webkit-linear-gradient(90deg, #eaeaea, #eaeaea 50%, transparent 50%);
    background: #ffffff;
    border-bottom: 1px solid #eaeaea;
  }
  .m-title span {
    font-size: 26px;
  }
  .m-date {
    width: 100%;
    height: 55px;
    line-height: 55px;
    background: #ffffff;
    border-bottom: 1px solid #eaeaea;
    position: relative;
  }
  .m-date div {
    position: absolute;
    /* width: 260px; */
    width: 270px;
    left: 50%;
    margin-left: -135px; 
  }
  .m-data {
    height: 90px;
    background: #ffffff;
    border-bottom: 1px solid #eaeaea;
    /* margin-bottom: 20px; */
    padding:23px 0;
    box-sizing:border-box;
    -moz-box-sizing: border-box; 
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box; 
    -ms-box-sizing: border-box;
  }
  .u-chart1, .u-chart2, .u-chart3, .u-chart4, .u-chart5, .u-chart6, .u-chart7, .u-chart8{
    width: 100%;
    background: #ffffff;
    height: 235px;
  }
  .u-chart1, .u-chart2, .u-chart3, .u-chart4, .u-chart5, .u-chart6, .u-chart7, .u-chart8{
    margin-bottom: 20px;
  }
  .grid-cell.u-11b {
    /* flex: 0 0 11.11%; */
    flex: 0 0 20%;
    border-right:1px solid #ebebeb;
    box-sizing:border-box;
    -moz-box-sizing: border-box; 
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box; 
    -ms-box-sizing: border-box;
    /*padding-top: 23px;*/
    /* border-right: 1px solid #eaeaea; */
  }
  .u-span {
    font-size: 13px;
    color: #a8a8a9;
    padding-top: 2px;
  }
  .iconfont {
    color: #a8a8a9;
    cursor: pointer;
    margin: 0 22px;
  }
</style>