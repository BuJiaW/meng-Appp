<template>   
  <el-dialog :title="title" :visible.sync="visible" :before-close="handleClose" width="600px">  
    <el-form
      status-icon
      ref="formData"
      :model="formData"
      label-width="100px"
      label-position="right"
      style="width: 500px;"
      :rules="rules"
    >
      <el-form-item label="广告图片:" prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          accept="image/*"
          action
          :show-file-list="false"
          :http-request="uploadMainImg"
        >
          <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="广告标题:" prop="title">
        <el-input v-model="formData.title" />
      </el-form-item>
      <el-form-item label="广告链接:" prop="advertUrl">
        <el-input v-model="formData.advertUrl" />
      </el-form-item>
      <el-form-item label="跳转方式:" prop="advertTarget">
        <el-select v-model="formData.advertTarget" clearable style="width: 185px">
          <el-option label="新窗口打开" value="_blank"></el-option>
          <el-option label="当前窗口打开" value="_self"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告位置:" prop="position">
        <el-input v-model="formData.position" />
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <el-input-number style="width: 300px;" v-model="formData.sort" :min="1" :max="10000" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">取消</el-button>
      <el-button size="mini" type="primary" @click="submitForm('formData')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addImage, deleteImage, add, update } from "../../api/advert";

export default {
  // 组件参数 接收来自父组件的数据
  props: {
    visible: {
      //弹出隐藏
      type: Boolean,
      default: false
    },
    title: {
      // 标题
      type: String,
      default: ""
    },
    formData: {
      // 表单数据
      type: Object,
      default: {}
    },
    oldImageUrl: String, // 修改前的照片url
    remoteClose: Function, // 用于关闭窗口
    editAdvList: Function //点击修改
  },

  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      rules: {
        // 校验规则
        title: [{ required: true, message: "请输入广告标题", trigger: "blur" }],
        advertUrl: [
          { required: true, message: "请输入广告链接", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        position: [
          { required: true, message: "请输入广告位置", trigger: "blur" }
        ],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
      }
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 关闭弹窗
    handleClose(done) {
      // 表单清空
      this.$refs["formData"].resetFields();
      // this.visible // 错误的，因为它是父组件传递过来的，子组件不能直接改
      // 因为 visible 是父组件的属性，所以要让父组件去改变值
      this.remoteClose();
    },

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 校验通过，提交表单数据
          this.submitData();
        } else {
          return false;
        }
      });
    },
    // 上传主图
    async uploadMainImg(file) {
      // 封装表单对象
      const data = new FormData();
      data.append("file", file.file);
      // 发送请求上传
      let res = await addImage(data);
      if (res.code == 20000) {
        this.formData.imageUrl = res.data;
        this.$message.success("上传成功");
      } else {
        this.$message.error("上传失败");
      }
    },
    async deleteImg() {
      if (
        this.formData.imageUrl &&
        this.formData.imageUrl !== this.oldImageUrl
      ) {
        //console.log('删除', this.formData.imageUrl, this.oldImageUrl)
        // 删除
        let res = await deleteImage(this.formData.imageUrl);
      }
    },

    // 添加
    async submitData() {
      let response = null;
      // 有id为修改，没有则是新增
      if (this.formData.id) {
        response = await update(this.formData);
      } else {
        response = await add(this.formData);
      }
    
      if (response.code === 20000) {
        this.$message.success(response.message);
        // 关闭窗口
        this.handleClose();
      } else {
        this.$message.error("保存失败");
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
.avatar-uploader .el-upload {
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
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
