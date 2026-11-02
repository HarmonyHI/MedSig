import * as utils from "@/views/utils";
import {certDataPrepare, erasePack, loadFullPack} from "@/views/utils";
import axios from "axios";
export default {
    name: "LoginRegView",
    computed: {
    },
    data() {
        return {
            dataPack:{
                LoginUser: {
                    logKey: '', logPwd: '', operateSID:'', userType:'', name:'', email:'',phone:'', address:'', gender:'', birthday:'', createTime:''},
                RegUser: {
                    confirmPwd: "", userEmail: '', phone: '', userPwd: "", userName: "", address: "", userSex: "", userBirthday: "", rank: 0,},
                ForgetUser: {
                    userPwd: "", userName: "",},
                djangoConnectTestPack: {
                    number: 12138, jsonPack: {str: "Hello small django"}},
                DoctorC:{logKey:'',logPwd:'',
                    userEmail:'',phone:'',userName:'',address:'',userSex:'',userBirthday:'',userPwd:'',rank:0,rankNum:0,operateSID:''},
                DoctorD:{logKey:'',logPwd:'',
                    userType:'',operateSID:'',SID:'',},
                DoctorU:{logKey:'',logPwd:'',
                    operateSID:'',SID:'',Key:'',Value:''},//Key是选项，选项分别为：‘userEmail','phone','userPwd','userName','address','userSex','userBirthday','rank','rankNum'
                DoctorR:{logKey:'',logPwd:'',
                    Key:'',Value:'',},//Key是选项，选项分别为：'userEmail','phone','userPwd','userName','address','userSex','userBirthday','rank','rankNum','createTime','SID','adminSID'
                PatientAdminC:{logKey:'',logPwd:'',
                    userEmail:'',phone:'',userName:'',address:'',userSex:'',userBirthday:'',userPwd:'',operateSID:'',},
                PatientAdminD:{logKey:'',logPwd:'',
                    SID:'',},
                PatientAdminU:{logKey:'',logPwd:'',
                    SID:'',Key:'',Value:'',},//Key是选项，选项分别为：'userEmail','phone','userPwd','userName','address','userSex','userBirthday','rank','rankNum'
                PatientAdminR:{logKey:'',logPwd:'',
                    Key:'',Value:'',},//Key是选项，选项分别为：'userEmail','phone','userName','address','userSex','userBirthday','createTime','SID'
                TumorImageC:{logKey:'',logPwd:'',
                    originalPicture:'',dividedPicture:'',dimension:'',tumorSID:'',operateSID:'',doctorSID:''
                },
                TumorImageD:{logKey:'',logPwd:'',
                    SID:'',doctorSID:'',
                },
                TumorImageU:{logKey:'',logPwd:'',
                    SID:'',Key:'',doctorSID:'',operateSID:''//Key是选项，选项分别为：'originalPicture','dividedPicture','dimension','tumorSID','Value'
                },
                TumorImageR:{logKey:'',logPwd:'',
                    Key:'',Value:''//Key是选项，选项分别为：'originalPicture','dividedPicture','dimension','tumorSID','SID','createTimeValue'
                },
                TumorC:{logKey:'',logPwd:'',
                    typeSID:'',malignant:'',position:'',size:'',doctorSID:'',patientSID:'',foundTime:'',removedTime:'',operateSID:''
                },
                TumorD:{logKey:'',logPwd:'',
                    SID:'',operateSID:''
                },
                TumorU:{logKey:'',logPwd:'',
                    Value:'',SID:'',doctorSID:'',patientSID:'',operateSID:'',Key:''//Key是选项，选项分别为：'typeSID','malignant','position','size','foundTime','removedTime','remark','waitingTrans','transDoctorSID'
                },
                TumorR:{logKey:'',logPwd:'',
                    Key:'',Value:'',operateSID:'' //Key是选项，选项分别为：'typeSID','malignant','position','size','doctorSID','patientSID','foundTime','removedTime','remark','SID','createTime'
                },
                TumorTypeC:{logKey:'',logPwd:'',
                    tumorName:'',tumorTypeRemark:'',operateSID:''
                },
                TumorTypeD:{logKey:'',logPwd:'',operateSID:'',SID:'',
                },
                TumorTypeU:{logKey:'',logPwd:'',
                    Value:'',SID:'',Key:'',operateSID:''//Key是选项，选项分别为：'tumorName','tumorTypeRemark'
                },
                TumorTypeR:{logKey:'',logPwd:'',
                    Key:'',Value:'',operateSID:''//Key是选项，选项分别为：'SID','tumorName'
                },
                ChatDialogC:{logKey:'',logPwd:'',
                    sendMessage:'',sendTime:'',sendAccountSID:'',recvMessage:'',recvTime:'',recvAccountSID:'',
                },
                ChatDialogD:{logKey:'',logPwd:'',
                    SID:'',sendAccountSID:'',recvAccountSID:'',
                },
                ChatDialogR:{logKey:'',logPwd:'',
                    Value:'',sendAccountSID:'',recvAccountSID:'',Key:'',//Key是选项，选项分别为：'sendMessage','sendTime','recvMessage','recvTime'
                },
            },
            gotSID: '',
            registerReturn: '',
            registerResultSUCCESS:false,
            registerWindow: false,
            registerOver: false,
            forgetPassword: false,
            updatePassword: false,
            forgetAccount: "",
            forgetNewPwd: "",
            findExistAccount: {
                userName: "",
            },
            checkCode: "",
            repeatPwd: "",
            lastSendTime: 0,
            acceptTreaty: false,
            accountAvailable: [],
            rewardMsg: [
                "JavaScript Stat: FAIL",
                "Socket: DISCONNECT",
                "Pytorch Stat: UNREACHABLE",
                "Vue Stat: NORMAL",
                "Django Stat: UNREACHABLE",
                "MySQL Stat: UNREACHABLE",
            ],
            path:"ws://localhost:8000/ConnectPyTorch/",
        };
    },
    created() {
        //==========================后端连通性测试===================================
        let LoginUserOfSession = sessionStorage.getItem("info");
        if (LoginUserOfSession != null) {
            this.dataPack.LoginUser = JSON.parse(LoginUserOfSession)
            this.$axios
                .post("securityCheck/", this.dataPack.LoginUser)
                .then((rst) => {
                    let info = rst.data;
                    if (info.stat === 'WELCOME_BACK') {
                        this.$message('欢迎回来！')
                        if (this.dataPack.LoginUser.userType === 'Doctor') {
                            this.$router.push("/doctor");
                        } else if (this.dataPack.LoginUser.userType === 'Patient') {
                            this.$router.push("/patient");
                        } else if (this.dataPack.LoginUser.userType === 'Admin') {
                            this.$router.push("/admin");
                        } else {
                            this.$router.push("/login");
                            this.$message(info.userType)
                        }
                    }
                })
        }
        this.$axios
            .post("hello/", this.dataPack.djangoConnectTestPack)
            .then((rst) => {
                this.rewardMsg[0] = "JavaScript Stat: NORMAL"
                if (rst.data.stat.charAt(1) === 'T') {
                    this.rewardMsg[2] = "Pytorch Stat: NORMAL"
                } else {
                    this.rewardMsg[2] = "Pytorch Stat: FAIL"
                }


                if (rst.data.stat.charAt(2) === 'T') {
                    this.rewardMsg[4] = "Django Stat: NORMAL"
                } else if (rst.data.stat.charAt(2) === 'J') {
                    this.rewardMsg[4] = "Django Stat: JSON FAIL"
                } else {
                    this.rewardMsg[4] = "Django Stat: FAIL"
                }


                if (rst.data.stat.charAt(3) === 'T') {
                    this.rewardMsg[5] = "MySQL Stat: NORMAL"
                } else {
                    this.rewardMsg[5] = "MySQL Stat: NORMAL"
                }
            })
            .catch((err) => {
                this.$message('后端连接失败：' + err);
                console.log(err);
            });
    },
    mounted () {
        this.init()
    },
    methods: {
        //==========================登录模块===================================
        doLogin() {
            if (this.dataPack.LoginUser.logKey === "") {
                this.$message("用户名不能为空");
                return;
            }
            if (this.dataPack.LoginUser.logPwd === "") {
                this.$message("密码不能为空");
                return;
            }
            this.$axios
                .post("log/", this.dataPack.LoginUser)
                .then(async (rst) => {
                    let info = rst.data;
                    if (info.stat.includes('SUCCESS')) {
                        this.dataPack.LoginUser = info;
                        if(this.dataPack.LoginUser.userType === 'Admin'){
                            certDataPrepare(this.dataPack.LoginUser, this.dataPack.PatientAdminR)
                            this.dataPack.PatientAdminR.Key = 'SID'
                            this.dataPack.PatientAdminR.Value = this.dataPack.LoginUser.operateSID
                            loadFullPack((await axios.post('/ReadAdmin/', this.dataPack.PatientAdminR)).data.list[0],this.dataPack.LoginUser)
                        }
                        else if(this.dataPack.LoginUser.userType === 'Patient'){
                            certDataPrepare(this.dataPack.LoginUser, this.dataPack.PatientAdminR)
                            this.dataPack.PatientAdminR.Key = 'SID'
                            this.dataPack.PatientAdminR.Value = this.dataPack.LoginUser.operateSID
                            loadFullPack((await axios.post('/ReadPatient/', this.dataPack.PatientAdminR)).data.list[0],this.dataPack.LoginUser)
                        }
                        else if(this.dataPack.LoginUser.userType === 'Doctor'){
                            certDataPrepare(this.dataPack.LoginUser, this.dataPack.DoctorR)
                            this.dataPack.DoctorR.Key = 'SID'
                            this.dataPack.DoctorR.Value = this.dataPack.LoginUser.operateSID
                            loadFullPack((await axios.post('/ReadDoctor/', this.dataPack.DoctorR)).data.list[0],this.dataPack.LoginUser)
                        }
                        else{
                            this.$message(this.dataPack.LoginUser.userType)
                        }
                        this.$message(JSON.stringify(this.dataPack.LoginUser))
                        sessionStorage.setItem("info", JSON.stringify(this.dataPack.LoginUser));
                        if (info.userType === 'Doctor') {
                            this.$router.push("/doctor");
                        } else if (info.userType === 'Patient') {
                            this.$router.push("/patient");
                        } else if (info.userType === 'Admin') {
                            this.$router.push("/admin");
                        } else {
                            this.$router.push("/login");
                            this.$message(info.userType)
                        }
                    } else if (info.stat === 'PASSWORD_WRONG') {
                        this.$message("密码输入有误！");
                    } else if (info.stat === 'NO_THIS_ACCOUNT') {
                        this.$message("账号不存在！");
                    } else {
                        this.$message("ERROR！" + info.stat);
                    }
                })
                .catch((err) => {
                    this.$message(err.toString());
                    console.log(err);
                });
        },
        //==========================注册模块===================================
        readyRegister(){
            this.dataPack.RegUser.userBirthday = '2002-06-17'
            this.registerWindow = true
        },
        afterRegisterSUCCESS() {
            erasePack(this.dataPack.RegUser)
            this.acceptTreaty = false;
            this.registerOver = false;
        },
        afterRegisterFail() {
            erasePack(this.dataPack.RegUser)
            this.acceptTreaty = false;
            this.registerOver = false;
            this.registerWindow = true
        },
        doRegister() {
            if (!this.acceptTreaty) {
                this.$message("请阅读并同意用户协议");
                return;
            }
            this.dataPack.RegUser.phone = utils.getPhone(this.dataPack.RegUser.userName)
            this.dataPack.RegUser.userEmail = utils.getEmail(this.dataPack.RegUser.userName)
            const msg = utils.account_available(
                this.dataPack.RegUser.userPwd, this.dataPack.RegUser.confirmPwd, this.dataPack.RegUser.phone, this.dataPack.RegUser.userEmail
            );
            if (msg === 'ACCEPT') {
                this.$axios.post("register/", this.dataPack.RegUser)
                    .then(rst => {
                        let resJson = rst.data;
                        this.$message(resJson.stat)
                        if(resJson.stat.includes('SUCCESS')){
                            if (resJson.stat === 'SUCCESS Phone') {
                                this.registerResultSUCCESS = true;
                                this.registerReturn = "手机用户注册医师成功，SID:"+resJson.SID
                                this.registerWindow = false;
                                this.registerOver = true;
                            }
                            else if (resJson.stat === 'SUCCESS Email') {
                                this.registerReturn = "邮箱用户注册医师成功，SID:"+resJson.SID
                                this.registerWindow = false;
                                this.registerResultSUCCESS = true;
                                this.registerOver = true;
                            }
                        }
                        else{
                            if (resJson.stat === 'Duplicate') {
                                this.registerReturn = "手机或邮箱已存在"
                                this.registerWindow = false;
                                this.registerOver = true;
                            }
                            else{
                                this.registerReturn = resJson.stat
                                this.registerWindow = false;
                                this.registerOver = true;
                            }
                        }
                    }).catch(err => {
                    this.$message("SystemError " + err.toString());
                    console.log(err);
                })
            } else {
                this.$message("SystemError ");
                this.$message(msg.toString());
            }
        },
        //==========================忘记模块===================================
        doForgetCheck() {
            if (this.forgetAccount === "") {
                this.$message("用户名不能为空");
            } else {
                this.dataPack.ForgetUser.userName = this.forgetAccount;
                if (this.checkCode === "0000") {
                    this.forgetPassword = false;
                    this.updatePassword = true;
                } else {
                    this.$message("验证码错误");
                }
            }
        },
        doForgetSendCode() {
            if (this.forgetAccount === "") {
                this.$message("用户名不能为空");
            } else {
                if (Date.now() - this.lastSendTime < 60000) {
                    this.$message(
                        "发送过于频繁，请" +
                        parseInt(
                            ((60000 - (Date.now() - this.lastSendTime)) / 1000).toString()
                        ) +
                        "秒后再试"
                    );
                    return;
                }
                this.findExistAccount.userName = this.forgetAccount;
                this.$axios
                    .post("searchDoctor/", this.findExistAccount)
                    .then((rst) => {
                        this.accountAvailable = parseInt(rst.data.data[0]["haveUser"]);
                    })
                    .catch((err) => {
                        this.$message("查询用户列表失败" + err.toString());
                        console.log(err);
                    });
                if (this.accountAvailable === 0) {
                    this.$message("用户不存在，请先注册");
                } else if (this.accountAvailable === 1) {
                    //发送验证码API
                    this.$message("验证码已发送");
                    this.lastSendTime = Date.now();
                }
            }
        },
        afterForgetFail() {
            this.forgetPassword = false;
            this.forgetAccount = "";
            this.checkCode = "";
        },
        doForget() {
            const info = utils.account_available(this.forgetNewPwd, this.repeatPwd);
            if (info === 'ACCEPT') {
                this.dataPack.ForgetUser.userPwd = this.forgetNewPwd;
                this.$axios
                    .post("resetPassword/", this.dataPack.ForgetUser)
                    .then(() => {
                        this.$message("重置密码成功");
                        this.afterForget();
                    })
                    .catch((err) => {
                        this.$message("请求失败 " + err.toString());
                    });
                this.forgetPassword = false;
            } else {
                this.$message(info.toString());
            }
        },
        afterForget() {
            this.forgetNewPwd = '';
            this.repeatPwd = '';
            this.updatePassword = false;
        },
        newMsg(recvStr){
            this.rewardMsg[1] = recvStr
        },
        init: function () {
            if(typeof(WebSocket) === "undefined"){
                this.newMsg("browser error of socket")
            }
            else{
                this.socket = new WebSocket(this.path)
                this.socket.onopen = this.open
                this.socket.onmessage = this.getMessage
            }
        },
        getMessage: function (event) {
            this.newMsg(JSON.parse(event.data)['message'])
        },
    },

};
