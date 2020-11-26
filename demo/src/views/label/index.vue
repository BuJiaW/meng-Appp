<template>
  <div class="app-container">
      <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="标签名称:">
        <el-input v-model="search.name"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="search.css" placeholder="请选择" filterable clearable>
          <el-option v-for="(it,ind) in search" :key="ind" :label="it.name" :value="it.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="list()">查询</el-button>
        <el-button type="info" @click="search={}">重置</el-button>
        <el-button type="danger" @click="handleEdit">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 渲染表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="180"></el-table-column>
      <el-table-column prop="name" align="center" label="标签名称"></el-table-column>
      <el-table-column prop="categoryName" align="center" label="分类名称"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑+添加 -->
    <el-dialog :title="form.id?'编辑':'添加'" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="标题名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-select placeholder="武磊" v-model="form.class" filterable clearable>
            <el-option v-for="(it,ind) in form.newForm" :key="ind" :label="it.name" :value="it.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="form.id? editSure('form') :addSure('form')">确 定</el-button>
      </div>
    </el-dialog>

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
  labelList,
  deleteList,
  updateList,
  updateCategory,
  editList,
  addList
} from "../../api/label";
export default {
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      tableData: [],
      search: {},
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      dialogFormVisible: false,
      form: {},
      newForm:{},

      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        categoryName: [
          { required: true, message: "请输入状态", trigger: "blur" }
        ]
      }
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //   渲染接口
    async list() {
      let res = await labelList(this.search, this.page);
      this.tableData = res.data.records;
      this.page.total = res.data.total;
    },
    // 删除
    async handleDelete(id) {
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let result = await deleteList(id);
        if (result.code == 20000) {
          this.$message.success("删除成功");
          this.list();
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    // 添加
    addSure(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.dialogFormVisible = true;
          let res = await addList(this.form);
          console.log(res)
          if (res.code == 20000) {
            this.$message.success(res.message);
            this.dialogFormVisible = false;
            this.list();
          } else {
            this.$message.error(res.message);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑
    async handleEdit(id) {
      this.dialogFormVisible = true;
      let res = await updateList(id);
      let result = await updateCategory(id);

      let obj = {
          name:res.data.name,
          newForm:result.data
      }
      this.form = obj
    },
    async editSure(){
        let res = await editList(this.form)
        if(res.code == 20000){
            this.$message.success(res.message)
            this.dialogFormVisible = false
            this.list()
        }
    },

    // 查询列表
    async searchList(id){
        let res = await updateCategory(id);
        console.log(res)
        this.search = res.data
    },

    // 分页
    changeSize(val) {
      this.page.size = val;
      this.list();
    },
    changePage(val) {
      this.page.current = val;
      this.list();
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
    this.searchList()
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
  padding: 20px;
}
</style>
