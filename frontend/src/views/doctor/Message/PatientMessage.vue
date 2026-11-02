<template>
  <div class="container">
    <div class="sm_box">
      <h2>
        病人消息
      </h2>
    </div>
    <div class="searchContent">
      <el-form label-width="120px">
        <el-form-item>
          <div>
            <div class="lineStyleChild">
              <el-input placeholder="病人姓名/SID/手机号/邮箱:" class="lineStyleChild" v-model="searchValue"></el-input>
            </div>
            <div class="lineStyleChild">
              <el-button type="primary" @click="doSearch" class="lineStyleChild">查询</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="margin_box">
      <div class="searchResult">
        <el-table border stripe :data="patientMessageList" @selection-change="batchSelection" style="min-width: 700px">
          <el-table-column type="selection" width="55" />
          <el-table-column label="病人姓名" prop="userName"></el-table-column>
          <el-table-column label="消息内容" prop="sendMessage"></el-table-column>
          <el-table-column label="发送时间" prop="sendTime"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <router-link to="#"  class="main_text" @click="sendBackMessage(scope.row)">回复&nbsp;</router-link>
              <router-link to="#" class="main_text" @click="readyDelete(scope.row)">删除</router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <el-dialog v-model="createDialog" :title="'添加'">
    <el-form label-width="200px">
      <el-form-item label="新增对话:">
        <el-input placeholder="收信用户" v-model="this.ChatDialogC.recvAccountSID" style="max-width: 218px"/>
        <el-input placeholder="发信内容" v-model="this.ChatDialogC.sendMessage" style="max-width: 218px"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="doCreate">新增</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="deleteEnsureDialog" :title="'确认删除'">
    <el-form-item>
      <el-button @click="doDelete">删除</el-button>
    </el-form-item>
  </el-dialog>
  <el-dialog v-model="deleteBatchEnsureDialog" :title="'确认批量删除'">
    <el-form-item>
      <el-button @click="doBatchDelete">删除</el-button>
    </el-form-item>
  </el-dialog>
  <el-dialog v-model="editDialog" :title="'回信'">
    <el-form label-width="200px">
      <el-form-item label="回信内容:">
        <el-input placeholder="New Data" v-model="this.ChatDialogU.Value" style="max-width: 218px"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="doEdit">回复</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/javascript" src="./PatientMessage.js"></script>

<style>
@import url(../../../css/mycss.css);
</style>