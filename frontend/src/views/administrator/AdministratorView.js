import {
    afterAction,
    certDataPrepare,
    checkEmail,
    erasePack,
    getSID,
    loadFullPack,
    searchObjectFromList
} from "@/views/utils";
import axios from "axios";
import publicRes from "@/views/publicRes";
import {
    regionData, codeToText } from 'element-china-area-data'
export default {
    name: "AdministratorView",
    data() {
        return {
            // ====================SEND PART============================
            dataPack:{
                LoginUser: {
                    logKey: '', logPwd: '', operateSID:'', userType:'', name:'', email:'',phone:'', address:'', gender:'', birthday:'', createTime:''},
                RegUser: {
                    confirmPwd: "", userEmail: '', phone: '', userPwd: "", userName: "", address: "", userSex: "", userBirthday: "", rank: 0,},
                ForgetUser: {
                    userPwd: "", userName: "",operateSID:'',},
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
            // ====================UI CONTROL PART=======================================
            exitAdminSystemDialogVisible: false,
            infoDialogVisible: false,
            createDialog: false,
            updateDialog: false,
            searchDialog: false,
            deleteDialog: false,
            searchAnsDialog: false,
            searchAnsDetailDialog: false,
            adminInfoDialog:false,
            currentDialogObj:'',

            addressWindow:false,
            regionOptions: regionData,
            selectedRegionOptions: [],
            codeToText,
            detailAddress:'',
            hahaha:''
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
    methods:{
        async doTempInfo(currentDialogObj) {
            let sendPackR = this.getSendPackR()
            erasePack(sendPackR['admin'])
            certDataPrepare(this.dataPack.LoginUser, sendPackR[currentDialogObj])
            sendPackR[currentDialogObj].Key = 'SID'
            sendPackR[currentDialogObj].Value = getSID(this.detailDisplayPack.adminObject_id)
            const rst = await axios.post(this.URLS[currentDialogObj]['R'],
                sendPackR[currentDialogObj]);
            this.adminDetailPack = rst.data.list[0];
            this.adminInfoDialog = true
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
            certDataPrepare(this.dataPack.LoginUser, sendPackR[this.currentDialogObj])
            sendPackR[this.currentDialogObj].Key = 'SID'
            sendPackR[this.currentDialogObj].Value = this.dataPack.LoginUser.operateSID
            loadFullPack((await axios.post(this.URLS[this.currentDialogObj]['R'], sendPackR[this.currentDialogObj])).data.list[0], this.dataPack.LoginUser)
            sessionStorage.removeItem("info");
            sessionStorage.setItem("info", JSON.stringify(this.dataPack.LoginUser));
        },
        async doRead() {
            let sendPackR = {
                'doctor':this.dataPack.DoctorR,
                'patient':this.dataPack.PatientAdminR,
                'tumorType':this.dataPack.TumorTypeR,
                'admin': this.dataPack.PatientAdminR,
                'tumorImage':this.dataPack.TumorImageR,
                'tumor':this.dataPack.TumorR,
                'chatDialog':this.dataPack.ChatDialogR
            }

            if(this.currentDialogObj === 'doctor'){
                try {
                    const rst = await axios.post(this.URLS[this.currentDialogObj]['R'], sendPackR[this.currentDialogObj]);
                    this.ansPack[this.currentDialogObj] = rst.data.list;
                    for (let i = 0; i < this.ansPack[this.currentDialogObj].length; i++) {
                        this.ansPack[this.currentDialogObj][i]['adminObject_id'] = this.ansPack[this.currentDialogObj][i]['adminObject_id'].substring(0, 12)
                        certDataPrepare(this.dataPack.LoginUser, this.dataPack.PatientAdminR)
                        this.dataPack.PatientAdminR.Key = 'SID'
                        this.dataPack.PatientAdminR.Value = this.ansPack[this.currentDialogObj][i]['adminObject_id'].substring(0, 12)
                        this.ansPack[this.currentDialogObj][i]['adminName'] = (await axios.post('/ReadAdmin/', this.dataPack.PatientAdminR)).data.list[0]['name']
                        this.ansPack[this.currentDialogObj][i]['isMine'] = (this.ansPack[this.currentDialogObj][i]['adminObject_id'] === this.dataPack.LoginUser.operateSID)
                    }
                    this.searchDialog = afterAction(rst.data, this)
                } catch (error) {
                    console.error('操作失败：', error);
                }
            }
            else{
                try {
                    if(this.currentDialogObj === 'tumorType'){
                        if(sendPackR[this.currentDialogObj].Key === 'all'){
                            sendPackR[this.currentDialogObj].Value = 'all'
                        }
                    }
                    const rst = await axios.post(this.URLS[this.currentDialogObj]['R'], sendPackR[this.currentDialogObj]);
                    this.ansPack[this.currentDialogObj] = rst.data.list;
                    for(let i = 0; i<this.ansPack[this.currentDialogObj].length; i++){
                        this.ansPack[this.currentDialogObj][i]['isMine'] = true
                    }
                    this.searchDialog = afterAction(rst.data, this)
                } catch (error) {
                    console.error('操作失败：', error);
                }
            }
            this.searchAnsDialog = true
        },
        async doCreate() {
            let sendPackC = {
                'doctor':this.dataPack.DoctorC,
                'patient':this.dataPack.PatientAdminC,
                'tumorType':this.dataPack.TumorTypeC,
                'admin': this.dataPack.PatientAdminC,
                'tumorImage':this.dataPack.TumorImageC,
                'tumor':this.dataPack.TumorC,
                'chatDialog':this.dataPack.ChatDialogC
            };
            try {
                const rst = await axios.post(this.URLS[this.currentDialogObj]['C'], sendPackC[this.currentDialogObj]);
                this.createDialog = afterAction(rst.data, this)
            } catch (error) {
                console.error('操作失败：', error);
            }
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
            if(this.currentDialogObj === 'admin'){
                await this.refreshUser()
            }
        },
        async doDelete() {
            let sendPackD = {
                'doctor':this.dataPack.DoctorD,
                'patient':this.dataPack.PatientAdminD,
                'tumorType':this.dataPack.TumorTypeD,
                'admin': this.dataPack.PatientAdminD,
                'tumorImage':this.dataPack.TumorImageD,
                'tumor':this.dataPack.TumorD,
                'chatDialog':this.dataPack.ChatDialogD
            };
            try {
                const rst = await axios.post(this.URLS[this.currentDialogObj]['D'], sendPackD[this.currentDialogObj]);
                this.deleteDialog = afterAction(rst.data, this)
            } catch (error) {
                console.error('操作失败：', error);
            }
        },
        async doDetail(row) {
            let sendPackR = {
                'doctor':this.dataPack.DoctorR,
                'patient':this.dataPack.PatientAdminR,
                'tumorType':this.dataPack.TumorTypeR,
                'admin': this.dataPack.PatientAdminR,
                'tumorImage':this.dataPack.TumorImageR,
                'tumor':this.dataPack.TumorR,
                'chatDialog':this.dataPack.ChatDialogR
            }
            erasePack(sendPackR[this.currentDialogObj])
            certDataPrepare(this.dataPack.LoginUser,sendPackR[this.currentDialogObj])
            sendPackR[this.currentDialogObj].Key = 'SID'
            sendPackR[this.currentDialogObj].Value = row.SID
            this.detailDisplayPack = searchObjectFromList(this.ansPack[this.currentDialogObj],'SID',row.SID)
            this.searchAnsDetailDialog = true
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
        readyUpdate(row) {
            erasePack(this.getSendPackU()[this.currentDialogObj])
            certDataPrepare(this.dataPack.LoginUser, this.getSendPackU()[this.currentDialogObj])
            this.getSendPackU()[this.currentDialogObj].SID = row.SID
            this.updateDialog = true;
        },
        readyDelete(goal) {
            let sendPackD = {
                'doctor':this.dataPack.DoctorD,
                'patient':this.dataPack.PatientAdminD,
                'tumorType':this.dataPack.TumorTypeD,
                'admin': this.dataPack.PatientAdminD,
                'tumorImage':this.dataPack.TumorImageD,
                'tumor':this.dataPack.TumorD,
            };
            erasePack(sendPackD[this.currentDialogObj])
            certDataPrepare(this.dataPack.LoginUser, sendPackD[this.currentDialogObj])
            sendPackD[this.currentDialogObj].SID = goal.SID
            this.deleteDialog = true;
        },
        readyAdminU(){
            this.currentDialogObj = 'admin';
            this.readyUpdate({SID:this.dataPack.LoginUser.operateSID})
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
        readyDoctorC() {
            this.currentDialogObj = 'doctor'
            erasePack(this.dataPack.DoctorC)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.DoctorC)
            this.dataPack.DoctorC.userBirthday = '2002-06-17'
            this.createDialog = true
        },
        readyDoctorR() {
            this.currentDialogObj = 'doctor'
            erasePack(this.dataPack.DoctorR)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.DoctorR)
            this.searchDialog = true
        },
        readyPatientC() {
            this.currentDialogObj = 'patient'
            erasePack(this.dataPack.PatientAdminC)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.PatientAdminC)
            this.dataPack.PatientAdminC.userBirthday = '2002-06-17'
            this.createDialog = true
        },
        readyPatientR() {
            this.currentDialogObj = 'patient'
            erasePack(this.dataPack.PatientAdminR)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.PatientAdminR)
            this.searchDialog = true
        },
        readyTumorTypeC() {
            this.currentDialogObj = 'tumorType'
            erasePack(this.dataPack.TumorTypeC)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.TumorTypeC)
            this.createDialog = true
        },
        readyTumorTypeR() {
            this.currentDialogObj = 'tumorType'
            erasePack(this.dataPack.TumorTypeR)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.TumorTypeR)
            this.searchDialog = true
        },
        readyTumorImageC() {
            this.currentDialogObj = 'tumorImage'
            erasePack(this.dataPack.TumorImageC)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.TumorImageC)
            this.createDialog = true
        },
        readyTumorImageR() {
            this.currentDialogObj = 'tumorImage'
            erasePack(this.dataPack.TumorImageR)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.TumorImageR)
            this.searchDialog = true
        },
        readyTumorC() {
            this.currentDialogObj = 'tumor'
            erasePack(this.dataPack.TumorC)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.TumorC)
            this.createDialog = true
        },
        readyTumorR() {
            this.currentDialogObj = 'tumor'
            erasePack(this.dataPack.TumorR)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.TumorR)
            this.searchDialog = true
        },
        readyChatDialogC() {
            this.currentDialogObj = 'chatDialog'
            erasePack(this.dataPack.ChatDialogC)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.ChatDialogC)
            this.createDialog = true
        },
        readyChatDialogR() {
            this.currentDialogObj = 'chatDialog'
            erasePack(this.dataPack.ChatDialogR)
            certDataPrepare(this.dataPack.LoginUser, this.dataPack.ChatDialogR)
            this.searchDialog = true
        },
        exit() {
            sessionStorage.removeItem("info");
            this.dataPack.LoginUser = null;
            location.reload();
        },
    }
};
