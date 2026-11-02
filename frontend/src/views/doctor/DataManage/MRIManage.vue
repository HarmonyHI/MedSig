<template>
	<div class="container">
    <div class="sm_box">
      <h2>
        MRI图像与肿瘤病例管理
      </h2>
    </div>
    <div>
      <el-form label-width="80px">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="患者姓名:">
              <el-input v-model="TumorImageR.patient_userName" placeholder="" style="max-width: 218px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="肿瘤类型:">
              <el-input v-model="TumorImageR.typeSID" placeholder="" style="max-width: 218px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="简述:">
              <el-input v-model="TumorImageR.remark" placeholder="" style="max-width: 218px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="年龄:">
              <el-slider v-model="TumorImageR.patient_userBirthday" class="left_nbsp" range/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="患者手机/邮箱/SID:">
              <el-input v-model="TumorImageR.patient_logKey" placeholder="" style="max-width: 218px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发现时间:">
              <el-input v-model="TumorImageR.foundTime" placeholder="" style="max-width: 218px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button @click="doSearch">查询</el-button>
          <el-button @click="readyCreate">新增肿瘤</el-button>
          <el-button type="danger" @click="readyBatchDelete">批量删除</el-button>

        </el-form-item>
      </el-form>

      <div class="searchResult">
        <el-table :data="dataArray" @selection-change="batchSelection">
          <el-table-column type="selection" width="55" />
          <el-table-column label="SID" prop="SID" sortable></el-table-column>
          <el-table-column label="肿瘤类型" prop="name"></el-table-column>
          <el-table-column label="患者">
            <template #default="scope">
              {{scope.row.userSex===1?'男':'女'}}
            </template>
          </el-table-column>
          <el-table-column label="负责医师" sortable>
            <template #default="scope">
              {{getAge(scope.row.userBirthday)}}
            </template>
          </el-table-column>
          <el-table-column label="肿瘤位置" prop="WName"></el-table-column>
          <el-table-column label="肿瘤尺寸" prop="userEmail"></el-table-column>
          <el-table-column label="添加时间" prop="userEmail"></el-table-column>
          <el-table-column label="是否恶性" prop="userEmail"></el-table-column>
          <el-table-column label="存在时间" prop="userEmail"></el-table-column>
          <el-table-column label="MRI列表" prop="userEmail"></el-table-column>

          <el-table-column label="移除时间" prop="userEmail"></el-table-column>
          <el-table-column label="病情简述" prop="userEmail"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <router-link to="#" class="main_text" @click="readyDelete(scope.row)">删除</router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
	</div>
  <el-dialog v-model="createDialog" :title="'添加'">
    <el-form label-width="200px">
      <el-form-item label="新增肿瘤SID/名称:">
        <el-input placeholder="肿瘤命名" v-model="this.TumorImageC.tumorName" style="max-width: 218px"/>
        <el-input placeholder="肿瘤简述" v-model="this.TumorImageC.TumorImageRemark" style="max-width: 218px"/>
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
  <el-dialog v-model="editDialog" :title="'编辑'">
    <el-form label-width="200px">
      <el-form-item label="肿瘤SID/名称:">
        <el-input placeholder="New Data" v-model="this.TumorImageU.Value" style="max-width: 218px"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="doEdit">修改</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/javascript" src="./MRIManage.js"></script>

<style>
@import url(../../../css/mycss.css);
</style>