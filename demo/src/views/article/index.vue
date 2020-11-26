<template>
  <div class="app-container">
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="文章标题:">
        <el-input v-model="search.title"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="search.status" placeholder="请选择">
          <el-option label="未审核" :value="1"></el-option>
          <el-option label="审核通过" :value="2"></el-option>
          <el-option label="审核已通过" :value="2"></el-option>
          <el-option label="删除" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="info" @click="search={}">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 渲染表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column prop="title" align="center" label="文章标题"></el-table-column>
      <el-table-column prop="viewCount" align="center" label="浏览数"></el-table-column>
      <el-table-column prop="thumhup" align="center" label="点赞数"></el-table-column>
      <el-table-column align="center" label="是否公开">
        <template slot-scope="scope">
          <el-tag :type="scope.row.ispublic | filterIspublic">{{ scope.row.ispublic?'不公开':'公开' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status|filterStatus">{{ scope.row.status|filterSize }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" align="center" label="最后更新时间"></el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.status!=0"
            type="danger"
            @click="handleDelete(scope.row.id)"
          >删除</el-button>
          <el-button size="mini" @click="findOne(scope.row.id)" type="primary">查看</el-button>
          <el-button size="mini" @click="shenhe" v-if="scope.row.status==1" type="success">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看 -->
    <el-dialog :title="isAudit?title.a:title.b" :visible.sync="dialogFormVisible" width="70%">
      <!-- status-icon 当表单校验不通过时, 输入框右侧有个 x 小图标 -->
      <el-form ref="formData" :model="formData" label-width="100px" labelposition="right">
        <el-form-item label="标题:">
          <el-input v-model="formData.title" readonly />
        </el-form-item>
        <el-form-item label="标签:">
          <el-cascader
            disabled
            style="display: block"
            v-model="formData.labelIds"
            :options="labelOptions"
            :props="{ multiple: true, emitPath: false, children: 'labelList', value: 'id',label: 'name'}"
          />
        </el-form-item>
        <el-form-item label="主图:">
          <img
            :src="formData.imageUrl"
            class="avatar"
            style="width:178px; heigth:178px;display:block"
          />
        </el-form-item>

        <el-form-item label="是否公开:">
          <el-radio-group v-model="formData.ispublic" disabled>
            <el-radio :label="0">不公开</el-radio>
            <el-radio :label="1">公开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="简介:">
          <el-input v-model="formData.summary" type="textarea" :autosize="{ minRows:2 }" readonly />
        </el-form-item>
        <el-form-item label="内容:">
          <mavon-editor ref="md" v-model="formData.mdContent" :editable="false" />
        </el-form-item>
        <el-form-item align="center" v-if="isAudit">
          <el-button @click="auditSuccess()" type="primary">审核通过</el-button>
          <el-button @click="auditFail()" type="danger">审核不通过</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 引入编辑器
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";

import {
  articleList,
  deleteArticle,
  findArticle,
  findList,
  auditSuccess,  //审核通过
  auditFail     //审核不通过
} from "../../api/article";
export default {
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: { mavonEditor },
  // 组件状态值
  data() {
    return {
      tableData: [],
      search: {}, //搜索
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      //   查看
      dialogFormVisible: false,
      formData: {},
      labelOptions: [], //标签组
      search:{},
      isAudit:false,
      title:{
        b:'文章管理',
        a:'审核文章'
      }
    };
  },
  filters: {
    filterIspublic(status) {
      return status == 0 ? "danger" : "success";
    },
    //状态
    filterStatus(status) {
      let type = { 0: "danger", 1: "", 2: "success", 3: "danger" };
      return type[status];
    },
    filterSize(status) {
      let type = { 0: "已删除", 1: "未审核", 2: "审核通过", 3: "审核未通过" };
      return type[status];
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    async getList() {
      let res = await articleList(this.search, this.page);
      this.tableData = res.data.records;
    },
    // 删除
    async handleDelete(id) {
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let result = await deleteArticle(id);
        console.log(result);
        if (result.code == 20000) {
          this.$message.success("删除成功");
          this.getList();
        } else {
          this.$message.error("删除失败");
        }
      });
    },

    // 查询
    onSubmit(){
        this.getList()
        this.$message.success('查询成功')
    },

    //---------------------------------------------
    // 查看
    async findOne(id) {
      this.dialogFormVisible = true;
      let res = await findArticle(id);
      this.formData = res.data;
      let result = await findList();
      this.labelOptions = result.data;
    },
    shenhe(){
        this.isAudit=true
        this.dialogFormVisible=true
        
    },
    // 审核通过
    auditSuccess(id) {
        this.$confirm('确认审核通过吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(async () => {
        // 确认
        let res = await auditSuccess(id)
        this.$message.success('审核通过提交成功')
        this.formData={}
        // 关闭窗口
        this.dialogFormVisible = false
        }).catch(() => {
        // 取消删除，不理会
        })
    },
    // 审核不通过
    auditFail (id) {
    this.$confirm('确认审核不通过吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
    }).then(async () => {
    // 确认
    let res = await auditFail(id)
    console.log(res)
    //提示信息
    this.$message.success('审核不通过提交成功')
    this.dialogFormVisible = false
    // 关闭窗口
    }).catch(() => {
    // 取消删除，不理会
    })
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
    this.getList();
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
