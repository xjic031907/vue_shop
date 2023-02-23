<template>
  <div>
    <el-container class="home_container">
      <!-- 头部 -->
      <el-header>
        <div>
          <img src="../assets/heima.png" alt="logo" />
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 主体 -->
      <el-container class="home_left">
        <!-- 侧边栏 -->
        <el-aside :width="iscollapse?'64px':'200px'">
          <div class="toggle_button" @click="toggle">{{ iscollapse?'>':'<' }}</div>
          <!-- 菜单区域 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF"
            unique-opened
            :collapse="iscollapse"
            :collapse-transition="false"
            router
            :default-active="activepath"
          >
            <!-- #1 -->
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconobj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- #1-1 -->
              <el-menu-item
                :index="'/'+subitem.path"
                v-for="subitem in item.children"
                :key="subitem.id"
                @click="savenav(subitem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subitem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主要内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconobj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      iscollapse: false,
      activepath:''
    };
  },
  created() {
    this.getMenulist();
    this.activepath=window.sessionStorage.getItem('activepath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenulist() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
    },
    toggle() {
      this.iscollapse = !this.iscollapse;
    },
    savenav(path){
      window.sessionStorage.setItem('activepath',path)
      this.activepath=path
    }
  }
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 1.2rem;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 1rem;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home_container {
  height: 100vh;
}
.iconfont {
  margin-right: 10px;
}
.toggle_button {
  background-color: #484f62;
  font-size: 1.2rem;
  color: #fff;
  text-align: right;
  line-height: 2rem;
  padding-right: 26px;
  cursor: pointer;
}
</style>>