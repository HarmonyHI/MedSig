<template>
  <!--  ready CR 定类型-->
  <div class="containerBig">
    <div class="containerSmall">
      <div class="container">
        <el-button type="primary" @click="exitAdminSystemDialogVisible = true">退出</el-button>
        <el-button type="primary" @click="readyDoctorC">添加医生</el-button>
        <el-button type="primary" @click="readyDoctorR">查询医生</el-button>
        <el-button type="primary" @click="readyPatientC">添加病人</el-button>
        <el-button type="primary" @click="readyPatientR">查询病人</el-button>
        <el-button type="primary" @click="readyTumorTypeC">添加肿瘤类型</el-button>
        <el-button type="primary" @click="readyTumorTypeR">查询肿瘤类型</el-button>
        <el-button type="primary" @click="readyTumorC">添加病例</el-button>
        <el-button type="primary" @click="readyTumorR">查询病例</el-button>
        <el-button type="primary" @click="readyChatDialogC">添加医患对话</el-button>
        <el-button type="primary" @click="readyChatDialogR">查询医患对话</el-button>
        <el-button type="primary" @click="readyTumorImageC">添加MRI扫描图像</el-button>
        <el-button type="primary" @click="readyTumorImageR">查询MRI扫描图像</el-button>
        <el-link @click="infoDialogVisible = true">编辑管理员信息:{{ dataPack.LoginUser.name }}</el-link>

      </div>
    </div>

    <el-dialog v-model="deleteDialog" :title="'删除'+this.nameDict[this.currentDialogObj]" @close="afterD">
      确定删除吗
      <el-button type="primary" @click="afterD">取消</el-button>
      <el-button type="danger" @click="doDelete">删除</el-button>
    </el-dialog>
    <el-dialog v-model="searchDialog" :title="'搜索'+this.nameDict[this.currentDialogObj]" @close="afterR">
      <el-form ref="queryDoctorFormRef" :model="doctors" label-width="80px">
        <el-form-item label="选项">
          <el-select v-model="getSendPackR()[this.currentDialogObj].Key">
            <el-option
                v-for="item in readOnlyKey[this.currentDialogObj].concat(writableKey[this.currentDialogObj])"
                :key="item.keyName"
                :label="item.keyNickName"
                :value="item.keyName"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="getSendPackR()[this.currentDialogObj].Key !== 'all'" label="请输入" prop="Value">
          <el-input v-model="getSendPackR()[this.currentDialogObj].Value"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doRead">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="searchAnsDialog" :title="'搜索结果'+this.nameDict[this.currentDialogObj]">
      <el-table v-if="currentDialogObj==='doctor'" :data="this.ansPack[this.currentDialogObj]" height="400px" stripe style="width: 100%">
        <el-table-column align="center" type="selection" width="55"/>
        <el-table-column label="用户名" prop="name" width="100"></el-table-column>
        <el-table-column label="SID" prop="SID" width="130"></el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button size="small" @click="doDetail(scope.row)">详情</el-button>
            <el-button :disabled="!scope.row.isMine" size="small" @click="readyUpdate(scope.row)">编辑</el-button>
            <el-button :disabled="!scope.row.isMine" size="small" type="danger" @click="readyDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-else-if="currentDialogObj==='patient'" :data="this.ansPack[this.currentDialogObj]" height="400px" stripe style="width: 100%">
        <el-table-column align="center" type="selection" width="55"/>
        <el-table-column label="用户名" prop="name" width="100"></el-table-column>
        <el-table-column label="SID" prop="SID" width="130"></el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button size="small" @click="doDetail(scope.row)">详情</el-button>
            <el-button :disabled="!scope.row.isMine" size="small" @click="readyUpdate(scope.row)">编辑</el-button>
            <el-button :disabled="!scope.row.isMine" size="small" type="danger" @click="readyDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-else-if="currentDialogObj==='tumorType'" :data="this.ansPack[this.currentDialogObj]" height="400px" stripe style="width: 100%">
        <el-table-column align="center" type="selection" width="55"/>
        <el-table-column label="肿瘤名称" prop="tumorName" width="100"></el-table-column>
        <el-table-column label="SID" prop="SID" width="130"></el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button size="small" @click="doDetail(scope.row)">详情</el-button>
            <el-button :disabled="!scope.row.isMine" size="small" @click="readyUpdate(scope.row)">编辑</el-button>
            <el-button :disabled="!scope.row.isMine" size="small" type="danger" @click="readyDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-else :data="this.ansPack[this.currentDialogObj]" height="400px" stripe style="width: 100%">
        <el-table-column label="SID" prop="SID" width="130"></el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button size="small" @click="doDetail(scope.row)">详情</el-button>
            <el-button :disabled="!scope.row.isMine" size="small" @click="readyUpdate(scope.row)">编辑</el-button>
            <el-button :disabled="!scope.row.isMine" size="small" type="danger" @click="readyDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog v-model="createDialog" :title="'添加'+this.nameDict[this.currentDialogObj]" @close="afterC">
      <el-form v-if="this.currentDialogObj==='doctor'" ref="loginFormRef" class="login_from">
        <el-form-item clearable label="用户邮箱">
          <el-input v-model="dataPack.DoctorC.userEmail"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="dataPack.DoctorC.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="dataPack.DoctorC.userName"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="dataPack.DoctorC.address"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="dataPack.DoctorC.userSex" placeholder="请选择">
            <el-option label="女" value='0'/>
            <el-option label="男" value='1'/>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="dataPack.DoctorC.userBirthday" placeholder="选择日期" style="width: 100%;"
                          type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="密码" prop="passwordRules">
          <el-input v-model="dataPack.DoctorC.userPwd" clearable show-password/>
        </el-form-item>
      </el-form>
      <el-form v-if="this.currentDialogObj==='patient'">
        <el-form-item clearable label="患者邮箱">
          <el-input v-model="dataPack.PatientAdminC.userEmail"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="dataPack.PatientAdminC.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="dataPack.PatientAdminC.userName"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="dataPack.PatientAdminC.address"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="dataPack.PatientAdminC.userSex" placeholder="请选择">
            <el-option label="女" value='0'/>
            <el-option label="男" value='1'/>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="dataPack.PatientAdminC.userBirthday" placeholder="选择日期" style="width: 100%;"
                          type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="密码" prop="passwordRules">
          <el-input v-model="dataPack.PatientAdminC.userPwd" clearable show-password/>
        </el-form-item>
      </el-form>
      <el-form v-if="currentDialogObj==='tumorType'">
        <el-form-item label="肿瘤名称">
          <el-input v-model="dataPack.TumorTypeC.tumorName"></el-input>
        </el-form-item>
        <el-form-item label="肿瘤描述">
          <el-input v-model="dataPack.TumorTypeC.tumorTypeRemark"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="currentDialogObj==='tumorImage'">
        <el-form-item label="原始MRI图像组">
          <el-input v-model="dataPack.TumorImageC.originalPicture"></el-input>
        </el-form-item>
        <el-form-item label="分割MRI图像组">
          <el-input v-model="dataPack.TumorImageC.dividedPicture"></el-input>
        </el-form-item>
        <el-form-item label="MRI图像维度数">
        <el-input v-model="dataPack.TumorImageC.dimension"></el-input>
      </el-form-item>
        <el-form-item label="关联肿瘤SID">
        <el-input v-model="dataPack.TumorImageC.tumorSID"></el-input>
      </el-form-item>
        <el-form-item label="医生SID（可选）">
          <el-input v-model="dataPack.TumorImageC.doctorSID"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="currentDialogObj==='tumor'">
        <el-form-item label="肿瘤类型SID">
          <el-input v-model="dataPack.TumorC.typeSID"></el-input>
        </el-form-item>
        <el-form-item label="是否恶性">
          <el-checkbox v-model="dataPack.TumorC.malignant"/>
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="dataPack.TumorC.position"></el-input>
        </el-form-item>
        <el-form-item label="肿瘤尺寸">
          <el-input v-model="dataPack.TumorC.size"></el-input>
        </el-form-item>
        <el-form-item label="诊断医生SID">
          <el-input v-model="dataPack.TumorC.doctorSID"></el-input>
        </el-form-item>
        <el-form-item label="患者SID">
          <el-input v-model="dataPack.TumorC.patientSID"></el-input>
        </el-form-item>
        <el-form-item label="发现时间">
          <el-date-picker v-model="dataPack.TumorC.foundTime"/>
        </el-form-item>
        <el-form-item label="切除时间">
          <el-date-picker v-model="dataPack.TumorC.removedTime"/>
        </el-form-item>
        <el-form-item label="病情描述">
          <el-input v-model="dataPack.TumorC.remark"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="currentDialogObj==='chatDialog'">
        <el-form-item label="消息发送时间">
          <el-date-picker v-model="dataPack.ChatDialogC.sendTime"/>
        </el-form-item>
        <el-form-item label="消息接收时间">
          <el-date-picker v-model="dataPack.ChatDialogC.recvTime"/>
        </el-form-item>
        <el-form-item label="消息发送内容">
          <el-input v-model="dataPack.ChatDialogC.sendMessage"></el-input>
        </el-form-item>
        <el-form-item label="消息接收内容">
          <el-input v-model="dataPack.ChatDialogC.recvMessage"></el-input>
        </el-form-item>
        <el-form-item label="消息发送方">
          <el-input v-model="dataPack.ChatDialogC.sendAccountSID"></el-input>
        </el-form-item>
        <el-form-item label="消息接收方">
          <el-input v-model="dataPack.ChatDialogC.recvAccountSID"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="afterC">取消</el-button>
        <el-button type="primary" @click="doCreate">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog v-model="updateDialog" :title="'编辑'+this.nameDict[this.currentDialogObj]" @close="afterU">
      <el-form ref="queryDoctorFormRef" label-width="80px">
        <el-form-item label="选项">
          <el-select v-model="(getSendPackU()[this.currentDialogObj]).Key">
            <el-option
                v-for="item in writableKey[this.currentDialogObj]"
                :key="item.keyName"
                :label="item.keyNickName"
                :value="item.keyName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="性别选定" prop="Value" v-if="(getSendPackR()[this.currentDialogObj]).Key === 'userSex'" >
          <el-select v-model="(getSendPackU()[this.currentDialogObj]).Value" placeholder="请选择">
            <el-option label="女" value='0'/>
            <el-option label="男" value='1'/>
          </el-select>
        </el-form-item>
        <el-form-item label="请输入" prop="Value" v-else>
          <el-input v-model="(getSendPackU()[this.currentDialogObj]).Value"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="afterU">取消</el-button>
        <el-button type="primary" @click="doUpdate">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog v-model="searchAnsDetailDialog" :title="'详情'+this.nameDict[this.currentDialogObj]" width="500px">
      <el-form label-width="120px">
        <el-form-item v-if="currentDialogObj==='doctor'||currentDialogObj==='admin'||currentDialogObj==='patient'" label="用户名:">
          {{ detailDisplayPack.name }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='doctor'||currentDialogObj==='admin'||currentDialogObj==='patient'" label="用户类型:">
          {{ detailDisplayPack.userType }}
        </el-form-item>
        <el-form-item label="SID:">
          {{ detailDisplayPack.SID }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='doctor'||currentDialogObj==='admin'||currentDialogObj==='patient'" label="手机号码:">
          {{ detailDisplayPack.phone }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='doctor'||currentDialogObj==='admin'||currentDialogObj==='patient'" label="邮箱:">
          {{ detailDisplayPack.email }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='doctor'||currentDialogObj==='admin'||currentDialogObj==='patient'" label="住址:">
          {{ detailDisplayPack.address }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='doctor'||currentDialogObj==='admin'||currentDialogObj==='patient'" label="性别:">
          {{ nameDict[detailDisplayPack.gender] }}
        </el-form-item>
        <el-form-item label="注册时间:">
          {{ detailDisplayPack.createTime }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='doctor'||currentDialogObj==='admin'||currentDialogObj==='patient'" label="出生日期:">
          {{ detailDisplayPack.birthday }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='doctor'" label="上级管理SID:">
          <el-link @click="doTempInfo('admin')">
            {{ detailDisplayPack.adminObject_id }}
          </el-link>
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='doctor'" label="接诊平均评分:">
          {{ detailDisplayPack.rank }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='doctor'" label="接诊数量:">
          {{ detailDisplayPack.rankNum }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='tumorType'" label="肿瘤名称:">
          {{ detailDisplayPack.tumorName }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='tumorType'" label="肿瘤简介:">
          {{ detailDisplayPack.tumorTypeRemark }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='tumor'" label="肿瘤类型:">
          {{ detailDisplayPack.typeObject_id }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='tumor'" label="是否恶性:">
          {{ detailDisplayPack.malignant }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='tumor'" label="位置:">
          {{ detailDisplayPack.position }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='tumor'" label="肿瘤尺寸:">
          {{ detailDisplayPack.size }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='tumor'" label="诊断医生SID:">
          {{ detailDisplayPack.doctorObject_id }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='tumor'" label="患者SID:">
          {{ detailDisplayPack.patientObject_id }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='tumor'" label="发现时间:">
          {{ detailDisplayPack.foundTime }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='tumor'" label="切除时间:">
          {{ detailDisplayPack.removedTime }}
        </el-form-item>
        <el-form-item v-if="currentDialogObj==='tumor'" label="病情描述:">
          {{ detailDisplayPack.remark }}
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="adminInfoDialog" :title="'管理员详情'">
      <el-form label-width="120px">
        <el-form-item label="用户名:">
          {{ adminDetailPack.name }}
        </el-form-item>
        <el-form-item label="用户类型:">
          {{ adminDetailPack.userType }}
        </el-form-item>
        <el-form-item label="手机号码:">
          {{ adminDetailPack.phone }}
        </el-form-item>
        <el-form-item label="邮箱:">
          {{ adminDetailPack.email }}
        </el-form-item>
        <el-form-item label="住址:">
          {{ adminDetailPack.address }}
        </el-form-item>
        <el-form-item label="性别:">
          {{ nameDict[adminDetailPack.gender] }}
        </el-form-item>
        <el-form-item label="注册时间:">
          {{ adminDetailPack.createTime }}
        </el-form-item>
        <el-form-item label="出生日期:">
          {{ adminDetailPack.birthday }}
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="exitAdminSystemDialogVisible" title="退出">
      确定退出吗
      <el-button type="primary" @click="exitAdminSystemDialogVisible = false">取消</el-button>
      <el-button type="danger" @click="exit">确定</el-button>
    </el-dialog>
    <el-dialog v-model="infoDialogVisible" title="我的"
               style="padding: 20px;backdrop-filter: blur(20px);border-radius: 30px;" width="500px">
      <el-form label-width="120px">
        <el-form-item label="用户名:">
          {{ dataPack.LoginUser.name }}
        </el-form-item>
        <el-form-item label="用户类型:">
          {{ dataPack.LoginUser.userType }}
        </el-form-item>
        <el-form-item label="SID:">
          {{ dataPack.LoginUser.operateSID }}
        </el-form-item>
        <el-form-item label="手机号码:">
          {{ dataPack.LoginUser.phone }}
        </el-form-item>
        <el-form-item label="邮箱:">
          {{ dataPack.LoginUser.email }}
        </el-form-item>
        <el-form-item label="住址:">
          <p @click="addressWindow = true">{{ dataPack.LoginUser.address }}</p>
        </el-form-item>
        <el-form-item label="性别:">
          {{ nameDict[dataPack.LoginUser.gender] }}
        </el-form-item>
        <el-form-item label="注册时间:">
          {{ dataPack.LoginUser.createTime }}
        </el-form-item>
        <el-form-item label="出生日期:">
          {{ dataPack.LoginUser.birthday }}
        </el-form-item>
        <el-form-item>
          <el-button @click="readyAdminU">更新信息</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <el-dialog v-model="addressWindow">
      <el-form ref="queryDoctorFormRef" label-width="80px">
        <el-form-item label="地址">
          <el-row :gutter="5">
            <el-col :span="14">
              <el-cascader
                  :options="regionOptions"
                  v-model="hahaha" style="width: 100%"/>
            </el-col>
            <el-col :span="9">
              <el-input v-model="detailAddress" style="width: 100%"/>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="afterU">取消</el-button>
        <el-button type="primary" >更新地址</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script src="./AdministratorView.js" type="text/javascript">
</script>
<style>
@import url(../../css/Admin.css);
</style>