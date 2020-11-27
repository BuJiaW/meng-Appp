<template>
  <el-dialog title="设置角色" :visible.sync="visible" :before-close="handleClose" width="60%">
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline" :model="search">
      <el-form-item label="角色名称:" size="mini">
        <el-input v-model="search.title"></el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="primary" @click="findOne" icon="el-icon-search">查询</el-button>
        <el-button @click="search={}">重置</el-button>
        <el-button type="success" icon="el-icon-circle-plus-outline" @click="userShow">设置角色</el-button>
      </el-form-item>
    </el-form>
    <!-- table表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" type="index" label="序号" width="100"></el-table-column>
      <el-table-column align="center" prop="name" label="角色名称"></el-table-column>
      <el-table-column align="center" prop="remark" label="备注"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[20, 40, 60]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>
  </el-dialog>
</template>

<script>
import { getList,setUser } from "../../api/user";
export default {
  // 组件参数 接收来自父组件的数据
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    close: Function,
    formData: Object
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      tableData: [],
      search: {}, //搜索
      page: {
        total: 0,
        current: 1,
        size: 20
      }
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //   关闭弹窗
    handleClose() {
      this.close();
    },
    // 渲染列表
    async list() {
      let res = await getList(this.search, this.page);
      this.tableData = res.data.records;
      this.page.total = res.data.total
      console.log(res);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 设置角色
    async userShow(id) {
        let res = await setUser(id)
        console.log(res)
        if(res.code == 20000){
            this.$message.success('设置角色成功')
            this.list()
            this.close()
        }else{
            this.$message.error('错误')
        }
    },
    // 查询
    findOne() {},
    // 分页
    //分页
    handleSizeChange(val) {
      this.page.size = val;
      this.list();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.list();
    },
    // 搜索
    findOne(){
        this.list()
        this.$message.success('搜索成功')
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
    this.list();
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
</style>
