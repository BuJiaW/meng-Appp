﻿<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline" :model="search">
      <el-form-item label="分类名称" size="mini">
        <el-input v-model="search.title"></el-input>
      </el-form-item>

      <el-form-item label="状态" size="mini" clearable>
        <el-select placeholder="请选择" v-model="search.status">
          <el-option value="未审核" clearable>未审核</el-option>
          <el-option value="审核通过" clearable>审核通过</el-option>
          <el-option value="已删除" clearable>已删除</el-option>
          <el-option value="已审核" clearable>已审核</el-option>
        </el-select>
      </el-form-item>

      <el-form-item size="mini">
        <el-button type="primary" @click="searchFind">查询</el-button>
        <el-button @click="search={}">重置</el-button>
        <el-button @click="openAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据渲染 -->
    <el-table :data="advDate" stripe style="width: 100%" border>
      <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
      <el-table-column prop="title" label="广告标题" width="180" align="center"></el-table-column>
      <el-table-column prop="imageUrl" label="广告图片" align="center">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.imageUrl"
            :preview-src-list="[scope.row.imageUrl]"
            style="width: 90px; height: 60px"
          />
        </template>
      </el-table-column>

      <el-table-column prop="advertUrl" label="广告链接" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | fliterStatus">{{scope.row.status ? '正常':'禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="delAdv(scope.row.id)">删除</el-button>
          <el-button type="success" size="mini" @click="editAdvList(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑 -->
    <edit
      :title="edit.title"
      :visible="edit.visible"
      :oldImageUrl="edit.oldImageUrl"
      :formData="edit.formData"
      :remoteClose="remoteClose"
      :editAdvList="editAdvList"
    ></edit>

     <!-- 分页器 -->
    <el-pagination
      @size-change="changeSize"
      @current-change="changePage"
      :current-page="page.current"
      :page-sizes="[10, 20, 30]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>
  </div>
</template>

<script>
import {
  getAdvList,
  editAdv,
  deleteAdv,
  sureEdit,
  addPic
} from "../../api/advert/index";

import Edit from "./edit"; //子组件

export default {
  // 组件名称
  name: "demo",
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: { Edit },
  // 组件状态值

  data() {
    return {
      search: {},
      advDate: [],
      page: {
        current: 1,
        size: 20,
        total:0
      },
      total: 0,
      advShow: false,
      form: {},

      // 子组件中引用
      edit: {
        title: "",
        visible: false,
        oldImageUrl: null, //修改前的照片url
        formData: {
          imageUrl: null // 不然上传新图片不可立刻预览
        }
      }
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //获取数据接口
    async getAdvDate() {
      let res = await getAdvList(this.search,this.page);
      this.advDate = res.data.records;
      this.page.total = res.data.total
    },
    //查询
    searchFind() {
      this.getAdvDate();
    },
    //删除
    async delAdv(id) {
      let res = await deleteAdv(id);
      if (res.code == 20000) {
        this.$message.success("删除成功");
        this.getAdvDate();
      } else {
        this.$message.error("删除失败");
      }
    },

    //打开新增窗口
    openAdd() {
      this.edit.visible = true;
      this.edit.title = "新增";
    },

    // 触发关闭弹出的新增修改子组件窗口
    remoteClose() {
      // 一定要加上这个，不然有时候表单输入不了值
      this.edit.formData = { imageUrl: null };
      this.edit.visible = false;
      this.getAdvDate(); //刷新
    },

    //编辑
    async editAdvList(id) {
      this.edit.visible = true;
      this.edit.title = '编辑'
      //获取初始状态
      let res = await editAdv(id);
      console.log(res);
      this.edit.formData = res.data;
      this.edit.oldImageUrl = res.data.imageUrl
    },

    async sure() {
      let res = await sureEdit(this.form);
      if (res.code == 20000) {
        this.$message.success("修改成功");
        this.advShow = false;
        this.getAdvDate();
      } else {
        this.$message.eror("修改失败");
      }
    },
    // 分页
    changeSize(page){
      this.page.size = page
      this.getAdvDate();
    },
    changePage(page){
      this.page.current = page
      this.getAdvDate();
    }
  },

  filters: {
    fliterStatus(status) {
      let type = { 0: "danger", 1: "success" };
      return type[status];
    }
  },

  // 以下是生命周期钩子 注：没用到的钩子请自行删除

  /**

   * 在实例初始化之后，组件属性计算之前，如data属性等

   */

  beforeCreate() {},

  /**

   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在

   */

  created() {},

  /**

   * 在挂载开始之前被调用：相关的 render 函数首次被调用。

   */

  beforeMount() {},

  /**

   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。

   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。

   */

  mounted() {
    this.getAdvDate();
  },

  /**

   * 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。

   * 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。

   */

  beforeUpdate() {},

  /**

   * 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

   * 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。

   */

  updated() {},

  /**

   * keep-alive 组件激活时调用。 仅针对keep-alive 组件有效

   */

  activated() {},

  /**

   * keep-alive 组件停用时调用。 仅针对keep-alive 组件有效

   */

  deactivated() {},

  /**

   * 实例销毁之前调用。在这一步，实例仍然完全可用。

   */

  beforeDestroy() {},

  /**

   * Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，

   * 所有的事件监听器会被移除，所有的子实例也会被销毁。

   */

  destroyed() {}
};
</script> 

<style scoped>
.app-container {
  padding:20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #000;

  border-radius: 6px;

  cursor: pointer;

  position: relative;

  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;

  color: #8c939d;

  width: 178px;

  height: 178px;

  line-height: 178px;

  text-align: center;

  border: 1px solid #000;
}

.avatar {
  width: 178px;

  height: 178px;

  display: block;
}
</style>
