<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline" :model="search">
      <el-form-item label="用户名:" size="mini">
        <el-input v-model="search.title"></el-input>
      </el-form-item>
      <el-form-item label="手机号:" size="mini" clearable>
        <el-input v-model="search.mobile"></el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="primary" @click="findeUser" icon="el-icon-search">查询</el-button>
        <el-button @click="search={}">重置</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="userShow = true">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 渲染页面 -->
    <el-table :data="userData" stripe style="width: 100%" border>
      <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
      <el-table-column align="center" prop="username" label="用户名" width="140"></el-table-column>
      <el-table-column align="center" prop="nickName" label="昵称" width="100"></el-table-column>
      <el-table-column align="center" prop="mobile" label="手机号" width="120"></el-table-column>
      <el-table-column align="center" prop="email" label="邮箱" width="100"></el-table-column>
      <el-table-column align="center" prop="isAccountNonExpired" label="账号过期" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isAccountNonExpired | filterAccount"
          >{{scope.row.isAccountNonExpired?'正常':'过期'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isAccountNonLocked" label="账号锁定" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isAccountNonLocked | filterLock"
          >{{scope.row.isAccountNonLocked?'正常':'锁定'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isCredentialsNonExpired" label="密码过期" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isCredentialsNonExpired | filterPass"
          >{{scope.row.isCredentialsNonExpired?'正常':'过期'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isEnabled" label="是否可用" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnabled | filterEnabled">{{scope.row.isEnabled?'可用':'已删除'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="操作">
        <!-- 是否可用的时候才显示按钮 -->
        <template slot-scope="scope" v-if="scope.row.isEnabled == 1">
          <el-button type="success" size="mini" @click="editUser(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="delUser">删除</el-button>
          <el-button type="primary" @click="open" size="mini">设置角色</el-button>
          <el-button type="primary" @click="dialogFormVisible=true" size="mini">密码修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[20, 40, 60]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    ></el-pagination>

    <!-- 编辑 -->
    <el-dialog :title="form.id?'编辑':'新增'" :visible.sync="userShow" width="400px">
      <el-form :model="form">
        <el-form-item label="用户名:" label-width="80px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称:" label-width="80px">
          <el-input v-model="form.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" label-width="80px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" label-width="80px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号过期:" label-width="80px">
          <el-radio-group size="medium" v-model="form.isAccountNonExpired">
            <el-radio border :label="0">已过期</el-radio>
            <el-radio border :label="1">未过期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码过期:" label-width="80px">
          <el-radio-group size="medium" v-model="form.isCredentialsNonExpired">
            <el-radio border :label="0">已过期</el-radio>
            <el-radio border :label="1">未过期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号锁定:" label-width="80px">
          <el-radio-group size="medium" v-model="form.isAccountNonLocked">
            <el-radio border :label="0">已过期</el-radio>
            <el-radio border :label="1">未过期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="userShow = false">取 消</el-button>
          <el-button type="primary" @click="form.id?userList():userAdd()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="30%">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="密码:" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 子组件 设置角色 -->
    <users :visible="edit.visible" :close="close" />
  </div>
</template>

<script>
import users from './users'
import {
  getUserList,
  deleteUser,
  editUser,
  editUserList,
  UserAdd,
  Password
} from "@/api/user";
export default {
  // 组件名称
  name: "demo",
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: {users},
  // 组件状态值
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      search: {},
      userData: [],
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      //显示框
      userShow: false,
      //
      form: {},

      // --------------------修改密码
      dialogFormVisible: false,
      ruleForm: {
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },

      // 封装组件
      edit:{
        visible:false,
        formData:{}
      }
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    async getUserDate() {
      let res = await getUserList(this.search);
      this.userData = res.data.records;
      this.total = res.data.total;
    },
    //分页
    handleSizeChange(val) {
      this.page.size = val;
      this.getUserDate();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getUserDate();
    },
    //查询
    findeUser() {
      this.getUserDate();
    },
    //删除
    async delUser(id) {
      this.$confirm("确认删除此条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await deleteUser(id);
          console.log(res);
          if (res.code == 20000) {
            this.$message.success("删除成功");
            this.getUserDate();
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //编辑
    async editUser(id) {
      this.userShow = true;
      //用id获取当前行的内容
      let res = await editUser(id);
      console.log(res);
      //将获取的当前行的内容放入弹框中
      this.form = res.data;
    },
    async userList() {
      let res = await editUserList();
      console.log(res);
      if (res.code == 20000) {
        this.$message.success("修改成功");
        this.getUserDate();
        this.userShow = false;
        this.form = {};
      } else {
        this.$message.error("修改失败");
      }
    },
    //添加
    async userAdd() {
      let res = await UserAdd();
      console.log(res);
      if (res.code == 20000) {
        this.$message.success("新增成功");
        this.userShow = false;
      } else {
        this.$message.error("新增失败");
      }
    },
    // 修改密码
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await Password(this.ruleForm);
          if(res.code == 20000){
            this.$message.success(res.message)
            this.dialogFormVisible = false
            this.getUserDate()
          }
        } else {
          return false;
        }
      });
    },
    
    // 分组件打开弹窗
    open(){
      this.edit.visible = true
    },
    // 关闭
    close(){
      this.edit.visible = false
      this.getUserDate()
    }
  },
  //过滤器
  filters: {
    //账号过期
    filterAccount(status) {
      let type = { 1: "success", 0: "danger" };
      return type[status];
    },
    //账号锁定
    filterLock(status) {
      let type = { 1: "success", 0: "danger" };
      return type[status];
    },
    //密码过期
    filterPass(status) {
      let type = { 1: "success", 0: "danger" };
      return type[status];
    },
    //是否可用
    filterEnabled(status) {
      let type = { 1: "success", 0: "danger" };
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
    this.getUserDate();
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
  padding:0 20px;
}
</style>

