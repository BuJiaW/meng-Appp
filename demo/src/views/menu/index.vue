<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline" :model="search">
      <el-form-item label="标签名称">
        <el-input size="mini" v-model="search.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
        <el-button @click="search={}" size="mini">重置</el-button>
        <el-button size="mini" type="primary" @click="menuShow = true">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="menuData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column align="center" type="index" label="序号" width="100px"></el-table-column>
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="url" label="请求地址"></el-table-column>
      <el-table-column align="center" prop="code" label="权限标识"></el-table-column>
      <el-table-column align="center" prop="address" label="类型">
        <template slot-scope="scope">
          <p v-if="(scope.row.type == 1)">目录</p>
          <p v-if="(scope.row.type == 2)">菜单</p>
          <p v-if="(scope.row.type == 3)">按钮</p>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center"></el-table-column>
      <el-table-column label="操作" width="250px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addMenuRit">新增</el-button>
          <el-button type="success" size="mini">编辑</el-button>
          <el-button type="danger" size="mini" @click="delMenu(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增 -->
    <el-dialog title="新增" :visible.sync="menuShow" width="500px">
      <el-form :model="form">
        <el-form-item label="类型" label-width="80px">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio :label="3" v-if="form.parentId !== 0">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" label-width="80px" prop="code">
          <el-input v-model="form.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="请求地址" label-width="80px" prop="url" v-if="form.type !=3">
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" label-width="80px" prop="icon" v-if="form.type !=3">
          <el-input v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="80px" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" label-width="80px" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
        <el-button size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="addMenuList ">确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getMenu, delteMenu, addMenu } from "../../api/menu";
export default {
  // 组件名称
  name: "demo",
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      menuData: [],
      search: {},
      menuShow: false,
      form: {}
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //获取菜单列表
    async getMenuList() {
      let res = await getMenu();
      console.log(res);
      this.menuData = res.data;
    },
    //查询
    onSubmit() {
      this.getMenuList();
    },
    //删除
   delMenu(id) {
       this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
         let res = await delteMenu(id);
        if (res.code == 20000) {
          this.$message.success("删除成功");
          this.getMenuList()
        } else {
          this.$message.error("删除失败");
        }
      });
     
    
      
    },
    //头部新增
    async addMenuList() {
      let res = await addMenu(this.form);
      console.log(res);
      if (res.code == 20000) {
        this.$message.success("新增成功");
        this.menuShow = false;
        this.getMenuList();
      } else {
        this.$message.error("新增失败");
      }
    },
    //右侧新增
    async addMenuRit() {
      this.menuShow = true;
      let res = await addMenu(this.form);
      if (res.code == 20000) {
        this.menuShow = false;
        this.$message.success("新增成功");
      }
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
    this.getMenuList();
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
  padding: 0 20px;
}
</style>

