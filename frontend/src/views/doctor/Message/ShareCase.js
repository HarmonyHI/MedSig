import axios from "axios";
import {afterAction, certDataPrepare, erasePack, getAge} from "../../utils";

export default {
    name: 'ShareCase', data() {

        return {
            LoginUser: {
                logKey: '',
                logPwd: '',
                operateSID: '',
                userType: '',
                name: '',
                email: '',
                phone: '',
                address: '',
                gender: '',
                birthday: '',
                createTime: ''
            }, TumorTypeR: {
                logKey: '', logPwd: '', Key: '', Value: '', operateSID: ''//Key是选项，选项分别为：'SID','tumorName'
            }, DoctorR: {
                logKey: '', logPwd: '', operateSID: '', Key: '', Value: '',
            },//Key是选项，选项分别为：'userEmail','phone','userPwd','userName','address','userSex','userBirthday','rank','rankNum','createTime','SID','adminSID'

            readTumorPlusPack: {
                logKey: '',
                logPwd: '',
                operateSID: '',
                doctor_SID: '',
                patient_userName: '',
                patient_userBirthday: '',
                patient_logKey: '',
                typeSID: '',
                remark: '',
                foundTime: '',
                limit_stat: ''
            }, tumorRecvList:[
                {
                    ID: '12e9d83d-9f0',
                    tumorTypeObject: 'fa1d4674-0c8',
                    transDoctorObject: 'fb1e903b-a6c',
                    transTime: '2023-04-01 10:00:00',
                    remark: '无',
                    patient_name: 'Sarah',
                    patient_age: 45,
                    patient_SID: 'P0001',
                    patient_phone: '13800138000'
                },
                {
                    ID: 'fb1e903b-a6c',
                    tumorTypeObject:'542b956f-b42',
                    transDoctorObject:'587b2803-8b3',
                    transTime: '2023-03-30 15:30:00',
                    remark: 'Hurry',
                    patient_name: 'JackSong',
                    patient_age: 50,
                    patient_SID: 'P0002',
                    patient_phone: '13900139000'
                }
            ], tumorTransList: [],
            TumorTransPack: {
                logKey: '',
                logPwd: '',
                operateSID: '',
                SID: '',
                doctorSID: '',
                patientSID: '',
                transAction: '',
                transDoctorSID: ''//Key是选项，选项分别为：'typeSID','malignant','position','size','foundTime','removedTime','remark','waitingTrans','transDoctorSID'
            },
            transferWindow: false,
            inputValue: "",
            ensureAcceptWindow:false,
            ensureRefuseWindow:false
        }

    }, async created() {
        let LoginUserOfSession = sessionStorage.getItem("info");
        if (LoginUserOfSession == null) {
            this.$router.push("/login");
        } else {
            this.LoginUser = JSON.parse(LoginUserOfSession)
        }
        certDataPrepare(this.LoginUser, this.readTumorPlusPack)
        this.readTumorPlusPack.doctor_SID = this.LoginUser.operateSID
        this.readTumorPlusPack.limit_stat = 'recv'
        const rst = await axios.post('/ReadTumorPlus/', this.readTumorPlusPack);
        // this.tumorRecvList = rst.data.list;
        erasePack(this.readTumorPlusPack)
    }, methods: {
        async doShareCaseSearch() {
            certDataPrepare(this.LoginUser, this.readTumorPlusPack)
            this.readTumorPlusPack.doctor_SID = this.LoginUser.operateSID
            const rst = await axios.post('/ReadTumorPlus/', this.readTumorPlusPack);
            //提交searchPack，返回PatientList
            this.tumorTransList = rst.data.list;
            //     {"ID":"e8d1f290-d939-4853-80c9-a741da9603c0","SID":"e8d1f290-d93",
            //     "createTime":"2024-05-03 15:26:07","stuff_ptr_id":"e8d1f290-d939-4853-80c9-a741da9603c0",
            //     "typeObject_id":"bd33ab92-3a01-48fc-ab30-fe0696d884d2","malignant":true,"position":"前额叶43CM处",
            //     "size":"44.2mm*22.5mm*31mm","doctorObject_id":"24c05303-cebd-4ea7-ab62-bfc46ee382f4",
            //     "patientObject_id":"9fd871df-8787-4c71-a475-781b892da8d2","foundTime":"2024-04-30 16:00:00",
            //     "removedTime":"2024-05-01 16:00:00","remark":null,"has_remarked":false,"waitingTrans":false,
            //     "transDoctorObject_id":null,"transTime":null}
        }, readyTumorTrans(row) {
            this.transferWindow = true;
            this.TumorTransPack.SID = row.SID;
        }, async tumorTrans(req, row) {
            certDataPrepare(this.LoginUser, this.TumorTransPack)   //必要身份认证数据
            this.TumorTransPack.doctorSID = this.LoginUser.operateSID
            if (row != null) {
                this.TumorTransPack.SID = row.SID;
            }
            this.TumorTransPack.transAction = req
            const rst = await axios.post('/TransTumor/', this.TumorTransPack);
            afterAction(rst.data, this) //状态反馈
        }, async tumorTypeQuerySearch(queryString, cb) {
            certDataPrepare(this.LoginUser, this.TumorTypeR)
            this.TumorTypeR.Value = queryString
            this.TumorTypeR.Key = 'SID'
            const rst = await axios.post('/ReadTumorType/', this.TumorTypeR);
            this.TumorTypeR.Key = 'tumorName'
            const rst1 = await axios.post('/ReadTumorType/', this.TumorTypeR);
            let result1 = Array.from(new Set([...rst1.data.list, ...rst.data.list]))
            let apiResult = []
            for (let i = 0; i < result1.length; i++) {
                apiResult.push({value: result1[i].tumorName, SID: result1[i].SID})
            }
            setTimeout(() => {
                cb(apiResult);
            }, 500);
        }, tumorTypeHandleSelect(item) { // 参数
            this.readTumorPlusPack.typeSID = item.SID
            console.log("selected:", item.SID);
        }, async doctorQuerySearch(queryString, cb) {
            certDataPrepare(this.LoginUser, this.DoctorR)
            this.DoctorR.Value = queryString
            this.DoctorR.Key = 'userName'
            const rst = await axios.post('/ReadDoctor/', this.DoctorR);
            this.DoctorR.Key = 'userEmail'
            const rst1 = await axios.post('/ReadDoctor/', this.DoctorR);
            this.DoctorR.Key = 'phone'
            const rst2 = await axios.post('/ReadDoctor/', this.DoctorR);
            let result1 = Array.from(new Set([...rst.data.list, ...rst1.data.list, ...rst2.data.list]))
            let apiResult = []
            for (let i = 0; i < result1.length; i++) {
                apiResult.push({value: result1[i].name, SID: result1[i].SID})
                console.log({value: result1[i].name, SID: result1[i].SID})
            }
            setTimeout(() => {
                cb(apiResult);
            }, 500);
        }, doctorHandleSelect(item) { // 参数
            this.TumorTransPack.transDoctorSID = item.SID
            console.log("selected:", item.SID);
        }, blurForBug() {
            document.activeElement.blur()
        },
        readyReceive(row){
            this.ensureAcceptWindow = true
        },
        readyRefuse(row){
            this.ensureRefuseWindow = true
        }
    }
}