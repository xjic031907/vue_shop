<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getuserlist">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="adddialogvisiable=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showeditdialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeuserbyid(scope.row.id)"
            ></el-button>
            <el-tooltip placement="top" effect="dark" content="分配角色" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryinfo.pagesize"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="adddialogvisiable" width="50%" @close="addDialogClose">
      <!-- :model:数据对象   :rules:验证规则 -->
      <el-form
        ref="addFormRef"
        label-width="70px"
        class="demo-ruleForm"
        :model="addForm"
        :rules="addFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editdialogvisible" width="50%" @close="editdialogclosed">
      <el-form :model="editform" :rules="editformrule" ref="editformref" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="edituserinfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,

      adddialogvisiable: false, //添加表单可见度
      editdialogvisible: false, //修改表单可见度
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度在3-10之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "密码长度在6-15之间", trigger: "blur" }
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机", trigger: "blur" }]
      },
      editform: {},
      editformrule: {
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getuserlist();
  },
  methods: {
    //获取用户列表
    async getuserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryinfo
      });
      if (res.meta.status != 200) return this.$message.error("获取失败!");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize;
      this.getuserlist();
    },
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getuserlist();
    },
    //更新用户状态
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新失败!");
      }
      this.$message.success("更新状态成功");
    },

    //监听添加表单关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },

    //添加用户按钮操作
    addUser() {
      //预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status != 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        //隐藏添加表单
        this.adddialogvisiable = false;
        this.getuserlist();
      });
    },

    //展示编辑表单
    async showeditdialog(id) {
      const { data: res } = await this.$http.get(`users/` + id);
      if (res.meta.status != 200) return this.$message.error("查询失败");

      this.editform = res.data;
      this.editdialogvisible = true;
    },
    //监听编辑表单关闭
    editdialogclosed() {
      this.$refs.editformref.resetFields();
    },

    //提交编辑信息
    edituserinfo() {
      this.$refs.editformref.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editform.id,
          {
            email: this.editform.email,
            mobile: this.editform.mobile
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改失败");
        }
        //隐藏编辑表单
        this.editdialogvisible = false;
        //刷新数据列表
        this.getuserlist();
        //提示修改完成
        this.$message.success("修改成功");
      });
    },

    async removeuserbyid(id) {
      const result = await this.$confirm("确定删除用户吗？", "提示", {
        confirmButtonText: "确定",
        coancelButtonText: "取消",
        type: "warning"
      }).catch(err => {
        return err;
      });

      if(result!='confirm'){
        return this.$message.info('取消删除操作')
      }

      const {data:res}=await this.$http.delete('users/'+id)
      if (res.meta.status != 200) {
          return this.$message.error("删除失败");
        }
        this.$message.success('删除成功')
        this.getuserlist()
    }
  }
};
</script>

<style lang="less" scoped>
</style>