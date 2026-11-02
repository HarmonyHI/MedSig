<template>
  <div class="container">
    <div class="sm_box">
      <h2>
        患者列表
      </h2>
    </div>
    <div class="searchContent">
      <el-form label-width="200px">
        <el-form-item label="患者SID/名称:">
          <el-input placeholder="" v-model="PatientAdminR.userName" style="max-width: 218px"/>
        </el-form-item>
          <el-form-item label="年龄:">
            <el-slider class="left_nbsp" v-model="PatientAdminR.birthday" range/>
          </el-form-item>
        <el-form-item>
          <el-button @click="doSearch">查询</el-button>
          <el-button @click="doCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="searchResult">
        <div class="margin_box">
          <div id="btnContent">
            <el-button type="danger" @click="doBatchDelete">批量删除</el-button>
          </div>
        </div>
        <el-table :data="dataArray">
          <el-table-column type="selection" width="55" />
          <el-table-column label="用户SID" prop="userID" sortable></el-table-column>
          <el-table-column label="邮箱" prop="userID" sortable></el-table-column>
          <el-table-column label="手机" prop="userID" sortable></el-table-column>
          <el-table-column label="用户名" prop="userID" sortable></el-table-column>
          <el-table-column label="住址" prop="userID" sortable></el-table-column>
          <el-table-column label="性别" prop="userID" sortable></el-table-column>
          <el-table-column label="年龄" prop="userID" sortable></el-table-column>
        </el-table>
      </div>
    </div>
  </div>

</template>
<script type="text/javascript" src="./PatientManage.js"></script>

<style>
@import url(../../../css/mycss.css);
</style>
