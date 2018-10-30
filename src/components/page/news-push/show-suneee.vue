<template>
  <div class="g-container" v-loading="loading" element-loading-text="页面加载中">
    <div class="box m-title"><span>象翌集团用户登录使用情况</span></div>
    <div class="m-date">
      <div>
        <span class="iconfont" @click="loadPreData()">&#xea5e;</span>{{titleDate}}
        <span class="iconfont" @click="loadNextData()">&#xe600;</span>
      </div>
    </div>
    <div class="grid m-data">
      <div class="grid-cell u-16b">
        <div class="box"><b>{{userTotal}} 个</b></div>
        <div class="box u-span">总用户</div>
      </div>
      <div class="grid-cell u-16b">
        <div class="box"><b>{{userCount}} 个</b></div>
        <div class="box u-span">活跃用户</div>
      </div>
      <div class="grid-cell u-16b">
        <div class="box"><b>{{messageTotal}} 条</b></div>
        <div class="box u-span">消息总数</div>
      </div>
      <div class="grid-cell u-16b">
        <div class="box"><b>{{averageMessage}} 条</b></div>
        <div class="box u-span">人均消息数</div>
      </div>
      <div class="grid-cell u-16b">
        <div class="box"><b>{{averageTime}} 分钟</b></div>
        <div class="box u-span">平均在线时长</div>
      </div>
      <div class="grid-cell u-16b" style="border:none;">
        <div class="box"><b>{{mobileAverage}}</b></div>
        <div class="box u-span">手机登录占比</div>
      </div>
    </div>
    <div class="box">
      <div id="chart1" class="u-chart1"></div>
    </div>
    <div class="box">
      <div id="chart2" class="u-chart2"></div>
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
        compCode: 'SUNEEE',
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
        if(self.userLoading == true && self.messageLoading == true) {
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
        if(self.userLoading == true && self.messageLoading == true) {
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
            type: 'old'
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
          url: self.messageUrl + '?compCode=' + self.compCode + '&date=' + self.endTimeShow + '&type=old',
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
    margin-bottom: 20px;
    padding:23px 0;
    box-sizing:border-box;
    -moz-box-sizing: border-box; 
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box; 
    -ms-box-sizing: border-box;
  }
  .u-chart1, .u-chart2 {
    width: 100%;
    background: #ffffff;
    height: 235px;
  }
  .u-chart1 {
    margin-bottom: 20px;
  }
  .grid-cell.u-16b {
    flex: 0 0 16.66%;
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