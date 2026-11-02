<template>
  <div class="absoluteTop">
    <div class="relativeLeft">
      <div class="innerPadding">
        <h2 class="lighterFont">多维脑肿瘤MRI分割平台</h2>
        <h3>医师端</h3>
      </div>
    </div>
    <div class="relativeRight">
      <el-link @click="this.pressMyInfo = true" class="personal_text">
        {{ this.dataPack.LoginUser.name }}
      </el-link>
      <router-link class="personal_text" to="#" @click="exit">&nbsp;退出</router-link>
    </div>
  </div>
  <div class="page">
    <div class="pageTop">
    </div>
    <div class="pageCenter">
      <div class="routerView">
        <router-view/>
      </div>
    </div>
    <div class="pageBottom">
      <div class="pageBottomChild">
        2024 powered by elementUI + DJANGO <br>
        Designed by 202001021107 He Chao HarmonyHI
      </div>
    </div>
  </div>
  <div class="absoluteCenterBottom">
    <el-menu class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" @click="this.$router.push('/doctor/MRI/MRIDivision')">
        <el-icon>
          <edit/>
        </el-icon>
        MRI分割推理
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <el-icon>
            <User/>
          </el-icon>
          消息推送
        </template>
        <el-menu-item index="2-1" @click="this.$router.push('/doctor/Message/ShareCase')">病例共享</el-menu-item>
        <el-menu-item index="2-2" @click="this.$router.push('/doctor/Message/PatientMessage')">病人消息</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon>
            <User/>
          </el-icon>
          数据管理
        </template>
        <el-menu-item index="3-1" @click="this.$router.push('/doctor/DataManage/MRIManage')">MRI与肿瘤病例管理</el-menu-item>
        <el-menu-item index="3-2" @click="this.$router.push('/doctor/DataManage/TumorManage')">肿瘤类型管理</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="4" @click="this.$router.push('/doctor/PatientList/PatientManage')">
        <el-icon>
          <edit/>
        </el-icon>
        患者列表
      </el-menu-item>
    </el-menu>
  </div>
  <el-dialog v-model="this.pressMyInfo" style="padding: 20px;backdrop-filter: blur(20px);border-radius: 30px;" title="我的信息" width="500px">
    <el-form label-width="120px">
      <el-form-item label="用户名:">
        <el-link @click="readyDoctorU('userName')">
          {{ dataPack.LoginUser.name }}
        </el-link>
      </el-form-item>
      <el-form-item label="用户类型:">
          {{ dataPack.LoginUser.userType }}
      </el-form-item>
      <el-form-item label="SID:">
        {{ dataPack.LoginUser.operateSID }}
      </el-form-item>
      <el-form-item label="手机号码:">
        <el-link @click="readyDoctorU('phone')">
        {{ dataPack.LoginUser.phone }}
        </el-link>
      </el-form-item>
      <el-form-item label="邮箱:">
        <el-link @click="readyDoctorU('userEmail')">
        {{ dataPack.LoginUser.email }}
        </el-link>
      </el-form-item>
      <el-form-item label="住址:">
        <el-link @click="readyDoctorU('address')">
          {{codeToText[dataPack.LoginUser.address.substring(0,2)]}}
          {{codeToText[dataPack.LoginUser.address.substring(3,7)]}}
          {{codeToText[dataPack.LoginUser.address.substring(8,14)] }}
          {{dataPack.LoginUser.address.substring(14)}}

<!--          {{dataPack.LoginUser.address}}-->
        </el-link>
      </el-form-item>
      <el-form-item label="性别:">
        <el-link @click="readyDoctorU('userSex')">
        {{ nameDict[dataPack.LoginUser.gender] }}
        </el-link>
      </el-form-item>
      <el-form-item label="注册时间:">
        {{ dataPack.LoginUser.createTime }}
      </el-form-item>
      <el-form-item label="出生日期:">
        <el-link @click="readyDoctorU('userBirthday')">
        {{ dataPack.LoginUser.birthday }}
        </el-link>
      </el-form-item>
      <el-form-item>
        <el-button @click="readyDoctorU('userPwd')">
          修改密码
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="updateDialog" :title="this.nameDict[this.currentDialogObj]+'信息编辑'">
    <el-form ref="queryDoctorFormRef" label-width="80px">
      <el-form-item label="选择性别" prop="Value" v-if="this.updateDialogType === 'sexChoose'" >
        <el-select v-model="(getSendPackU()[this.currentDialogObj]).Value" placeholder="请选择">
          <el-option label="女" value='0'/>
          <el-option label="男" value='1'/>
          <el-option label="未选" value='8'/>
        </el-select>
      </el-form-item>
      <el-form-item label="选择日期" prop="Value" v-if="this.updateDialogType === 'dateInput'" >
        <el-date-picker v-model="(getSendPackU()[this.currentDialogObj]).Value" placeholder="请选择"/>
      </el-form-item>
      <el-form-item label="原密码" prop="Value" v-if="this.updateDialogType === 'passwordInput'" >
        <el-input
            show-password
            placeholder="密码长度8-16位，支持中英文字符"
            v-model="oldPassword"
        ></el-input>
      </el-form-item>
      <el-form-item label="输入新密码" prop="Value" v-if="this.updateDialogType === 'passwordInput'" >
        <el-input
            show-password
            placeholder="密码长度8-16位，支持中英文字符"
            v-model="(getSendPackU()[this.currentDialogObj]).Value"
        ></el-input>
      </el-form-item>
      <el-form-item label="重复新密码" prop="Value" v-if="this.updateDialogType === 'passwordInput'" >
        <el-input
            show-password
            placeholder="密码长度8-16位，支持中英文字符"
            v-model="repeatPassword"
        ></el-input>
      </el-form-item>
      <el-form-item label="请输入" prop="Value" v-if="this.updateDialogType === 'value'">
        <el-input v-model="(getSendPackU()[this.currentDialogObj]).Value"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="Value" v-if="this.updateDialogType === 'phone'">
        <el-input v-model="(getSendPackU()[this.currentDialogObj]).Value"></el-input>
      </el-form-item>
      <el-form-item label="地址" v-if="this.updateDialogType === 'address'">
        <el-row :gutter="5">
          <el-col :span="14">
            <el-cascader
                :options="regionOptions"
                v-model="(getSendPackU()[this.currentDialogObj]).Value" style="width: 100%"/>
          </el-col>
          <el-col :span="9">
            <el-input v-model="detailAddress" style="width: 100%"/>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="afterU">取消</el-button>
        <el-button type="primary" @click="doUpdatePwd" v-if="this.updateDialogType === 'passwordInput'">重置密码</el-button>
        <el-button type="primary" @click="doUpdateAddress" v-else-if="this.updateDialogType === 'address'">更新地址</el-button>
        <el-button type="primary" @click="doUpdate" v-else>保存</el-button>
      </span>
  </el-dialog>
</template>
<script src="./DoctorView.js" type="text/javascript"/>
<style>
@import url(../../css/mycss.css);
@import url(../../css/MainView.css);
</style>
