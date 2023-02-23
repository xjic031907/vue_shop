<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="pic_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 表单 -->
      <el-form class="form" :model="form" :rules="loginrules" ref="loginformref">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="form.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetloginform">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
      loginrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3-10个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6-15个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetloginform() {
      this.$refs.loginformref.resetFields();
    },
    login() {
      this.$refs.loginformref.validate(async val => {
        if (!val) return;
        const { data: res } = await this.$http.post("login", this.form);
        if (res.meta.status != 200) return Message.error("登陆失败");
        Message.success("登陆成功");
        // 登陆成功后保存token,并跳转
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(58, 86, 120);
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: aliceblue;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
.pic_box {
  height: 130px;
  width: 130px;
  border: solid 1px #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: aliceblue;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
</style>
