import {
    afterAction,
    certDataPrepare,
    checkEditInfo,
    checkEditPwd,
    checkEmail,
    erasePack,
    loadFullPack
} from "@/views/utils";
import publicRes from "@/views/publicRes";
import axios from "axios";
import {
    regionData, codeToText } from 'element-china-area-data'
export default {
    name: 'DoctorView',
    data() {
        return {
            // ====================SEND PART============================
            dataPack:{
                LoginUser: {
                    logKey: '', logPwd: '', operateSID:'', userType:'', name:'', email:'',phone:'', address:'', gender:'', birthday:'', createTime:''},
                RegUser: {
                    confirmPwd: "", userEmail: '', phone: '', userPwd: "", userName: "", address: "", userSex: "", userBirthday: "", rank: 0,},
                djangoConnectTestPack: {
                    number: 12138, jsonPack: {str: "Hello small django"}},
                DoctorC:{logKey:'',logPwd:'',
                    userEmail:'',phone:'',userName:'',address:'',userSex:'',userBirthday:'',userPwd:'',rank:0,rankNum:0,operateSID:''},
                DoctorD:{logKey:'',logPwd:'',
                    userType:'',operateSID:'',SID:'',},
                DoctorU:{logKey:'',logPwd:'',
                    operateSID:'',SID:'',Key:'',Value:''},//Key是选项，选项分别为：‘userEmail','phone','userPwd','userName','address','userSex','userBirthday','rank','rankNum'
                DoctorR:{logKey:'',logPwd:'',operateSID:'',
                    Key:'',Value:'',},//Key是选项，选项分别为：'userEmail','phone','userPwd','userName','address','userSex','userBirthday','rank','rankNum','createTime','SID','adminSID'
                PatientAdminC:{logKey:'',logPwd:'',
                    userEmail:'',phone:'',userName:'',address:'',userSex:'',userBirthday:'',userPwd:'',operateSID:'',},
                PatientAdminD:{logKey:'',logPwd:'',operateSID:'',
                    SID:'',},
                PatientAdminU:{logKey:'',logPwd:'',operateSID:'',
                    SID:'',Key:'',Value:'',},//Key是选项，选项分别为：'userEmail','phone','userPwd','userName','address','userSex','userBirthday','rank','rankNum'
                PatientAdminR:{logKey:'',logPwd:'',operateSID:'',
                    Key:'',Value:'',},//Key是选项，选项分别为：'userEmail','phone','userName','address','userSex','userBirthday','createTime','SID'
                TumorImageC:{logKey:'',logPwd:'',
                    originalPicture:'',dividedPicture:'',dimension:'',tumorSID:'',operateSID:'',doctorSID:''
                },
                TumorImageD:{logKey:'',logPwd:'',operateSID:'',
                    SID:'',doctorSID:'',
                },
                TumorImageU:{logKey:'',logPwd:'',
                    SID:'',Key:'',doctorSID:'',operateSID:''//Key是选项，选项分别为：'originalPicture','dividedPicture','dimension','tumorSID','Value'
                },
                TumorImageR:{logKey:'',logPwd:'',operateSID:'',
                    Key:'',Value:''//Key是选项，选项分别为：'originalPicture','dividedPicture','dimension','tumorSID','SID','createTimeValue'
                },
                TumorC:{logKey:'',logPwd:'',
                    typeSID:'',malignant:false,position:'',size:'',doctorSID:'',patientSID:'',foundTime:'',removedTime:'',remark:'',operateSID:''
                },
                TumorD:{logKey:'',logPwd:'',
                    SID:'',operateSID:''
                },
                TumorU:{logKey:'',logPwd:'',
                    Value:'',SID:'',doctorSID:'',patientSID:'',operateSID:'',Key:''//Key是选项，选项分别为：'typeSID','malignant','position','size','foundTime','removedTime','remark','waitingTrans','transDoctorSID'
                },
                TumorR:{logKey:'',logPwd:'',
                    Key:'',Value:'',operateSID:'',doctorSID:'' //Key是选项，选项分别为：'typeSID','malignant','position','size','doctorSID','patientSID','foundTime','removedTime','remark','SID','createTime'
                },
                TumorTypeC:{logKey:'',logPwd:'',
                    tumorName:'',tumorTypeRemark:'',operateSID:'', doctorSID:''
                },
                TumorTypeD:{logKey:'',logPwd:'',operateSID:'',SID:'',
                },
                TumorTypeU:{logKey:'',logPwd:'',
                    Value:'',SID:'',Key:'',operateSID:''//Key是选项，选项分别为：'tumorName','tumorTypeRemark'
                },
                TumorTypeR:{logKey:'',logPwd:'',
                    Key:'',Value:'',operateSID:''//Key是选项，选项分别为：'SID','tumorName'
                },
                ChatDialogC:{logKey:'',logPwd:'',operateSID:'',
                    sendMessage:'',sendTime:'',sendAccountSID:'',recvMessage:'',recvTime:'',recvAccountSID:'',
                },
                ChatDialogD:{logKey:'',logPwd:'',operateSID:'',
                    SID:'',sendAccountSID:'',recvAccountSID:'',
                },
                ChatDialogR:{logKey:'',logPwd:'',operateSID:'',
                    Value:'',sendAccountSID:'',recvAccountSID:'',Key:'',//Key是选项，选项分别为：'sendMessage','recvMessage'
                },
                ChatDialogU:{logKey:'',logPwd:'',
                    Value:'',SID:'',Key:'',operateSID:''//Key是选项，选项分别为：'sendMessage','recvMessage'
                },
            },
            ansPack:{
                'doctor':[],
                'patient':[],
                'tumorType':[],
                'admin': [],
                'tumorImage':[],
                'tumor':[],
                'chatDialog':[]
            },
            // =====================RECEIVE PART======================================
            doctors: [],
            patients:[],
            tumorTypes:[],
            tumorImages:[],
            admins:[],
            tumors:[],
            chatDialogs:[],
            detailDisplayPack: {},
            adminDetailPack: {},
            // ======================PUBLIC RES PART=====================================
            URLS:publicRes.data().URLS,
            nameDict:publicRes.data().nameDict,
            loginFormRules: publicRes.data().loginFormRules,
            writableKey: publicRes.data().writableKey,
            readOnlyKey: publicRes.data().readOnlyKey,
            varToTypeDict: publicRes.data().varToTypeDict,
            // ====================UI CONTROL PART=======================================
            pressMyInfo: false,
            pressEditInfo: false,
            pressEditPwd: false,
            PageText: [
                '我的信息',
                '修改密码'
            ],
            updateDialog:false,
            updateDialogType:'',
            currentDialogObj:'doctor',
            oldPassword:'',
            repeatPassword:'',
            regionOptions: regionData,
            selectedRegionOptions: [],
            codeToText,
            detailAddress:'',
            // =======================================================================

        }
    },
    created() {
        let LoginUserOfSession = sessionStorage.getItem("info");
        if (LoginUserOfSession == null) {
            this.$router.push("/login");
        } else {
            this.dataPack.LoginUser = JSON.parse(LoginUserOfSession)
        }

    },
    methods: {
        readyDoctorU(item){
            this.currentDialogObj = 'doctor';
            this.getSendPackU()[this.currentDialogObj].Key = item
            // 这一句在复现到admin页面时是不同的，admin界面会选定有限范围的Key
            //本区域的改动是适配了不同Key自动对应的Value输入形式，新增变量updateDialogType，更新了update悬浮窗（使用v-if）
            this.readyUpdate({SID:this.dataPack.LoginUser.operateSID})
        },
        readyUpdate(row) {
            certDataPrepare(this.dataPack.LoginUser, this.getSendPackU()[this.currentDialogObj])
            this.getSendPackU()[this.currentDialogObj].SID = row.SID
            this.updateDialogType = this.varToTypeDict[this.getSendPackU()[this.currentDialogObj].Key]
            this.getSendPackU()[this.currentDialogObj].Value = null
            this.updateDialog = true;
        },
        getSendPackU(){
            return{
                'doctor':this.dataPack.DoctorU,
                'patient':this.dataPack.PatientAdminU,
                'tumorType':this.dataPack.TumorTypeU,
                'admin': this.dataPack.PatientAdminU,
                'tumorImage':this.dataPack.TumorImageU,
                'tumor':this.dataPack.TumorU,
            }
        },
        getSendPackR(){
            return {
                'doctor':this.dataPack.DoctorR,
                'patient':this.dataPack.PatientAdminR,
                'tumorType':this.dataPack.TumorTypeR,
                'admin': this.dataPack.PatientAdminR,
                'tumorImage':this.dataPack.TumorImageR,
                'tumor':this.dataPack.TumorR,
                'chatDialog':this.dataPack.ChatDialogR
            }
        },
        afterR() {
            this.searchDialog = false
        },
        afterC() {
            this.createDialog = false
        },
        afterU() {
            this.updateDialog = false
        },
        afterD() {
            this.deleteDialog = false
        },
        async doUpdate() {
            let sendPackU = {
                'doctor':this.dataPack.DoctorU,
                'patient':this.dataPack.PatientAdminU,
                'tumorType':this.dataPack.TumorTypeU,
                'admin':this.dataPack.PatientAdminU,
                'tumorImage':this.dataPack.TumorImageU,
                'tumor':this.dataPack.TumorU,
            };
            try {
                const rst = await axios.post(this.URLS[this.currentDialogObj]['U'], sendPackU[this.currentDialogObj]);
                this.updateDialog = afterAction(rst.data, this)
            } catch (error) {
                console.error('操作失败：', error);
            }
            if(this.currentDialogObj === 'doctor'){
                await this.refreshUser()
            }
        },
        async refreshUser() {
            let sendPackU = {
                'doctor':this.dataPack.DoctorU,
                'patient':this.dataPack.PatientAdminU,
                'tumorType':this.dataPack.TumorTypeU,
                'admin':this.dataPack.PatientAdminU,
                'tumorImage':this.dataPack.TumorImageU,
                'tumor':this.dataPack.TumorU,
            };
            let sendPackR = {
                'doctor':this.dataPack.DoctorR,
                'patient':this.dataPack.PatientAdminR,
                'tumorType':this.dataPack.TumorTypeR,
                'admin': this.dataPack.PatientAdminR,
                'tumorImage':this.dataPack.TumorImageR,
                'tumor':this.dataPack.TumorR,
                'chatDialog':this.dataPack.ChatDialogR
            }
            let is_logKey_as_email = checkEmail(this.dataPack.LoginUser.logKey)
            if(sendPackU[this.currentDialogObj].Key === 'userEmail'){
                if(is_logKey_as_email){
                    this.dataPack.LoginUser.logKey = sendPackU[this.currentDialogObj].Value
                }
                this.dataPack.LoginUser.email = sendPackU[this.currentDialogObj].Value
            }
            else if(sendPackU[this.currentDialogObj].Key === 'userName'){
                this.dataPack.LoginUser.name = sendPackU[this.currentDialogObj].Value
            }
            else if(sendPackU[this.currentDialogObj].Key === 'phone'){
                if(!is_logKey_as_email){
                    this.dataPack.LoginUser.logKey = sendPackU[this.currentDialogObj].Value
                }
                this.dataPack.LoginUser.phone = sendPackU[this.currentDialogObj].Value
            }
            else if(sendPackU[this.currentDialogObj].Key === 'userPwd'){
                this.dataPack.LoginUser.logPwd = sendPackU[this.currentDialogObj].Value
                this.dataPack.LoginUser = (await axios.post("log/", this.dataPack.LoginUser)).data
            }
            certDataPrepare(this.dataPack.LoginUser, sendPackR[this.currentDialogObj])
            sendPackR[this.currentDialogObj].Key = 'SID'
            sendPackR[this.currentDialogObj].Value = this.dataPack.LoginUser.operateSID
            loadFullPack((await axios.post(this.URLS[this.currentDialogObj]['R'], sendPackR[this.currentDialogObj])).data.list[0], this.dataPack.LoginUser)
            sessionStorage.removeItem("info");
            sessionStorage.setItem("info", JSON.stringify(this.dataPack.LoginUser));
        },
        async doUpdatePwd() {
            if ((this.getSendPackU()[this.currentDialogObj]).Value !== this.repeatPassword) {
                this.$message('两次输入密码不一致')
            } else {
                let currentUser = this.dataPack.LoginUser
                this.dataPack.LoginUser.logPwd = this.oldPassword
                this.dataPack.LoginUser = (await axios.post("log/", this.dataPack.LoginUser)).data
                if(this.dataPack.LoginUser.operateSID !== '-1'){
                    await this.doUpdate()
                }
                else{
                    this.$message('原密码错误')
                    this.dataPack.LoginUser = currentUser
                }
            }
        },
        async doUpdateAddress() {
            (this.getSendPackU()[this.currentDialogObj]).Value = (this.getSendPackU()[this.currentDialogObj]).Value +
                this.detailAddress
            await this.doUpdate()
            this.detailAddress = ''
        },
        exit() {
            sessionStorage.removeItem("info");
            this.dataPack.LoginUser = null;
            location.reload();
        },
    }
}
