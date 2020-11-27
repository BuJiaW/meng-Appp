<template>
  <div>
    <!-- 编辑+添加 -->
    <el-dialog :title="title" :visible.sync="visible" :before-close="handleClose" width="30%">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addList, editList } from "../../api/role";
export default {
  // 组件参数 接收来自父组件的数据
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: "",
    formData: Object,
    close: Function
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      rules: {
        name: [{ required: true, message: "分类名称不能为空", trigger: "blur" }]
      }
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //   关闭弹窗方法
    handleClose() {
      this.$refs["formData"].resetFields();
      this.close();
    },
    submit() {
        console.log(this.formData.id)
      if (this.formData.id) {
        this.updated();
      } else {
        this.add();
      }
    },
    // 添加
    add() {
      this.$refs["formData"].validate(async valid => {
        if (valid) {
          const result = await addList(this.formData);
          console.log(result);
          if (result.code == 20000) {
            this.handleClose();
            this.$message({
              type: "success",
              message: "新增成功"
            });
          } else {
            this.$message({
              type: "success",
              message: "新增失败"
            });
          }
        }
      });
    },
    // 修改
    updated() {
      this.$refs["formData"].validate(async valid => {
        if (valid) {
          const result = await editList(this.formData);
          console.log(result);
          if (result.code == 20000) {
            this.handleClose()
            this.$message.success('修改成功');
            this.formData.id = ''
          } else {
            this.$message({
              type: "success",
              message: "修改失败"
            });
          }
        }
      });
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
  mounted() {},
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
