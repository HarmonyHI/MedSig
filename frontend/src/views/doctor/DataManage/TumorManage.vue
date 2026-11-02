<template>
	<div class="container">
    <div class="sm_box">
      <h2>
        肿瘤类型管理
      </h2>
    </div>
		<div class="searchContent">
			<el-form label-width="200px">
				<el-form-item label="肿瘤SID/名称:">
					<el-input placeholder="留空查看全部类型" v-model="this.TumorTypeR.Value" style="max-width: 218px"/>
				</el-form-item>
				<el-form-item>
					<el-button @click="doSearch">查询</el-button>
          <el-button @click="readyCreate">新增</el-button>
				</el-form-item>
			</el-form>
		</div>
    <div>
      <div class="searchResult">
        <div class="margin_box">
          <div id="btnContent">
            <el-button type="danger" @click="readyBatchDelete">批量删除</el-button>
          </div>
        </div>
        <el-table :data="dataArray" @selection-change="batchSelection">
          <el-table-column type="selection" width="55" />
          <el-table-column label="肿瘤名称" prop="tumorName" sortable></el-table-column>
          <el-table-column label="类型SID" prop="SID"/>
          <el-table-column label="肿瘤简述" prop="tumorTypeRemark"/>
					<el-table-column label="添加时间" prop="createTime" sortable/>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <router-link to="#"  class="main_text" @click="readyEdit(scope.row)">编辑&nbsp;</router-link>
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
      <el-input placeholder="肿瘤命名" v-model="this.TumorTypeC.tumorName" style="max-width: 218px"/>
      <el-input placeholder="肿瘤简述" v-model="this.TumorTypeC.tumorTypeRemark" style="max-width: 218px"/>
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
      <el-input placeholder="New Data" v-model="this.TumorTypeU.Value" style="max-width: 218px"/>
    </el-form-item>
    <el-form-item>
      <el-button @click="doEdit">修改</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>

<script type="text/javascript" src="./TumorManage.js"></script>

<style>
  @import url(../../../css/mycss.css);
</style>
