<template>
  <div class="container">
    <div class="sm_box">
      <h2>
        病例数据转让
      </h2>
    </div>
    <div class="bg_box">
      <div class="searchContent">
        <h3>病例收件箱</h3>
        <el-table :data="tumorRecvList">
          <el-table-column type="selection" width="55"/>
          <el-table-column label="肿瘤SID" prop="ID"/>
          <el-table-column label="肿瘤类型" prop="tumorTypeObject"/>
          <el-table-column label="转让医师" prop="transDoctorObject"/>
          <el-table-column label="转让时间" prop="transTime"/>
          <el-table-column label="简述" prop="remark"/>
          <el-table-column label="患者姓名" prop="patient_name"/>
          <el-table-column label="患者年龄" prop="patient_age"/>
          <el-table-column label="患者SID" prop="patient_SID"/>
          <el-table-column label="患者手机" prop="patient_phone"/>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <router-link class="main_text" to="#" @click="readyReceive(scope.row)">接收&nbsp;</router-link>
              <router-link class="main_text" to="#" @click="readyRefuse(scope.row)">拒收</router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <h3>病例转交</h3>
        <el-form label-width="80px">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="患者姓名:">
                <el-input v-model="readTumorPlusPack.patient_userName" placeholder="全部选项留空查看所有" style="max-width: 218px"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="肿瘤类型:">
                <el-autocomplete
                    :fetch-suggestions="tumorTypeQuerySearch"
                    v-model="readTumorPlusPack.typeSID"
                    @select="tumorTypeHandleSelect"
                    :debounce="0"
                    clearable
                    placeholder="输入肿瘤名，选中SID上屏"
                    @clear="blurForBug()"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="简述:">
                <el-input v-model="readTumorPlusPack.remark" placeholder="" style="max-width: 218px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="年龄:">
                <el-slider v-model="readTumorPlusPack.patient_userBirthday" class="left_nbsp" range/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="患者手机/邮箱/SID:">
                <el-input v-model="readTumorPlusPack.patient_logKey" placeholder="" style="max-width: 218px"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发现时间:">
                <el-input v-model="readTumorPlusPack.foundTime" placeholder="" style="max-width: 218px"/>
              </el-form-item>
            </el-col>
          </el-row>


          <el-form-item>
            <el-button @click="doShareCaseSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="searchResult">
          <el-table :data="tumorTransList">
            <el-table-column type="selection" width="55"/>
            <el-table-column label="肿瘤编号" prop="ID" sortable></el-table-column>
            <el-table-column label="肿瘤类型" prop="typeObject_id"></el-table-column>
            <el-table-column label="患者姓名" prop="SID">
              <template #default="scope">
                {{ scope.row.userSex === 1 ? '男' : '女' }}
              </template>
            </el-table-column>
            <el-table-column label="诊断" prop="malignant" sortable/>
            <el-table-column label="患者SID" prop="patientObject_id"></el-table-column>
            <el-table-column label="肿瘤位置" prop="position"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <router-link class="main_text" to="#" @click="readyTumorTrans">转接</router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

  </div>
  <el-dialog v-model="transferWindow">
    <el-row>
      <el-autocomplete
          :fetch-suggestions="doctorQuerySearch"
          v-model="TumorTransPack.transDoctorSID"
          @select="doctorHandleSelect"
          :trigger-on-focus="false"
          :debounce="0"
          clearable
          placeholder="输入医生信息，选中SID上屏"
          @clear="blurForBug()"
      />
    </el-row>
    <el-row>
      <el-button @click="tumorTrans('apply', null)">提交</el-button>
    </el-row>
  </el-dialog>
  <el-dialog v-model="ensureAcceptWindow" :title="'确定接收吗'">
    <el-row>
      <el-button @click="tumorTrans('accept')" type="primary">确定</el-button>
      <el-button @click="this.ensureAcceptWindow = false" type="danger">取消</el-button>
    </el-row>
  </el-dialog>
  <el-dialog v-model="ensureRefuseWindow" :title="'确定拒收吗'">
    <el-row>
      <el-button @click="tumorTrans('refuse')" type="primary">确定</el-button>
      <el-button @click="this.ensureAcceptWindow = false" type="danger">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script src="./ShareCase.js" type="text/javascript">
</script>

<style>
@import url(../../../css/mycss.css);
</style>
