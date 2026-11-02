<template>

  <div class="loginScreen">
    <div class="loginContent">
      <h2 class="loginBlockH2" style="margin-left: 40px; font-family: 'MiSans Thin', serif">脑肿瘤图像分割系统</h2>
      <el-form label-width="120px" size="large">
        <el-row>
          <el-col :span="23">
            <el-form-item class="loginItemWhite" label="账号:">
              <el-input placeholder="用户名或邮箱" class="transparent-input" v-model="dataPack.LoginUser.logKey"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="19">
            <el-form-item class="loginItemWhite" label="密码:">
              <el-input show-password placeholder="请输入密码" class="transparent-input" v-model="dataPack.LoginUser.logPwd"/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" color="green" style="color: #028102" @click="doLogin">登录</el-button>
          </el-col>
        </el-row>

      </el-form>
      <el-form label-width="120px" size="large">
        <hr style="margin-left: 40px; margin-bottom:15px; max-width: 100%; ">
        <h3 class="loginBlockH3">{{rewardMsg[0]}}</h3>
        <h3 class="loginBlockH3">{{rewardMsg[2]}}</h3>
        <h3 class="loginBlockH3">{{rewardMsg[3]}}</h3>
        <h3 class="loginBlockH3">{{rewardMsg[4]}}</h3>
        <h3 class="loginBlockH3">{{rewardMsg[5]}}</h3>
        <el-form-item/>
        <el-form-item>
          <div class="loginBottom">
            {{rewardMsg[1]}}
          </div>
        </el-form-item>
        <el-form-item>
          <div class="loginBottom">
            <router-link to="#" @click="this.forgetPassword = true"
            >忘记密码</router-link
            >
            <router-link to="#" @click="this.registerWindow = true"
            >管理员注册</router-link
            >
          </div>
        </el-form-item>

      </el-form>
    </div>

  </div>
  <div class="pageBottomChild">
    2024 powered by elementUI + DJANGO <br>
    Designed by 202001021107 He Chao HarmonyHI
  </div>
    <el-dialog v-model="this.forgetPassword" @close="afterForgetFail" title="忘记密码" width=450px>
        <div id="editContent" style="max-width: 350px; margin-left: 25px">
            <el-form label-width="80px">
        <el-form-item label="登录名:">
            <el-input v-model="this.forgetAccount"></el-input>
        </el-form-item>
        <el-form-item label="验证码:">
            <el-input v-model="this.checkCode" style="max-width: 130px"></el-input>
            <el-button style="margin-left: 35px" @click="doForgetSendCode">发送验证码</el-button>
        </el-form-item>
            </el-form>
        </div>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="this.forgetPassword = false">取消</el-button>
        <el-button type="primary" @click="doForgetCheck" color="green"> 确定 </el-button>
      </span>
        </template>
    </el-dialog>
    <el-dialog v-model="registerOver">
        <el-result
                icon="success"
                title="注册成功"
                @close="afterRegisterSUCCESS"
                v-if=registerResultSUCCESS
                :subTitle=this.registerReturn
        />
        <el-result
            icon="error"
            title="注册失败"
            @close="afterRegisterFail"
            v-if=!registerResultSUCCESS
            :subTitle=this.registerReturn
        />
    </el-dialog>
    <el-dialog v-model="this.registerWindow" @open="readyRegister" title="管理员注册" width=600px>
        <el-form label-width="120px" size="large" style="max-width: 500px">
            <el-form-item class="loginItem" label="账号:">
                <el-input placeholder="账号/邮箱" v-model="dataPack.RegUser.userName"></el-input>
            </el-form-item>
            <el-form-item class="loginItem" label="密码:">
                <el-input
                        show-password
                        placeholder="登录密码"
                        v-model="dataPack.RegUser.userPwd"
                ></el-input>
            </el-form-item>
            <el-form-item class="loginItem" label="确认密码:">
                <el-input
                        show-password
                        placeholder="确认密码"
                        v-model="dataPack.RegUser.confirmPwd"
                ></el-input>
            </el-form-item>

            <el-form-item>
                <el-checkbox v-model="acceptTreaty" style="margin-bottom: 14px">
                    我已阅读并同意
                    <el-link style="margin-left: 1px;margin-bottom: 2px" :underline="false" target="_blank" href="https://www.npc.gov.cn/npc/c30834/201901/ffad2d4ae4da4585a041abf66e74753c.shtml">
                        《用户协议》
                    </el-link>
                </el-checkbox>
                <el-button type="primary" style="width: 170px;margin-left: 70px; color: #028102" @click="doRegister" color="green">注册</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
  <el-dialog v-model="this.updatePassword" title="设置新密码" width="30%">
    <div id="editContent" style="max-width: 350px; margin-left: 25px">
      <el-form label-width="80px">
        <el-form-item label="新密码:">
          <el-input v-model="this.forgetNewPwd" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码:">
          <el-input v-model="this.repeatPwd" show-password></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="afterForget">取消</el-button>
        <el-button type="primary" @click="doForget" color="green"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script type="text/javascript" src="./LoginRegView.js"></script>
<style>
@import url(../css/mycss.css);
@import url(../css/LoginView.css);

</style>
