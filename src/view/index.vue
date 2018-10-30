<template>
  <div style="height:100%;">
    <div class="g-left">
      <div class="g-logo" @click="toIndex">
        <img src="/static/images/logo.png">
        <span>云后台管理</span>
      </div>
      <div class="g-nav">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" class="el-tree"></el-tree>
      </div>
    </div>
    <div class="g-right">
      <router-view :breadcrumb="breadcrumb"></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      }
    }
  };
</script>
<style lang="scss" scoped>
    $letfWidth: 240px;

    .g-left {
      width: $letfWidth;
      height: 100%;
      background-color: #324157;
      position: absolute;
      top: 0;
      left: 0;
      padding-top: 100px;
      box-sizing: border-box;
      .g-logo, .g-nav {
        width: 100%;
      }
    .g-logo {
      height: 100px;
      position: absolute;
      left: 0;
      top: 0;
      display: -webkit-flex;
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
      span {
        color: #fff;
        font-size: 20px;
        margin-left: 10px;
      }
    }
    .g-nav {
      height: 100%;
      top: 100px;
      .el-tree {
      	background-color: #324157;
      	border: none;
      	color: #fff;
      }
    }
  }

  .g-right {
    width: 100%;
    height: 100%;
    background-image: url(/static/images/main-bg.jpg);
  }
</style>