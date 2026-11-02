import axios from "axios";
import {afterAction, certDataPrepare, loadFullPack} from "@/views/utils";
import publicRes from "@/views/publicRes";

export default {
    name: 'PatientManage',
    data(){
        return{
            PatientAdminC:{logKey:'',logPwd:'',
                userEmail:'',phone:'',userName:'',address:'',userSex:'',userBirthday:'',userPwd:'',operateSID:'',},
            PatientAdminD:{logKey:'',logPwd:'',operateSID:'',
                SID:'',},
            PatientAdminU:{logKey:'',logPwd:'',operateSID:'',
                SID:'',Key:'',Value:'',},//Key是选项，选项分别为：'userEmail','phone','userPwd','userName','address','userSex','userBirthday','rank','rankNum'
            PatientAdminR:{logKey:'',logPwd:'',operateSID:'',
                Key:'',Value:'',},//Key是选项，选项分别为：'userEmail','phone','userName','address','userSex','userBirthday','createTime','SID'
            dataArray:[],
            URLS:publicRes.data().URLS,
            // ============================UI CONTROL====================================
            createDialog:false,
            deleteEnsureDialog:false,
            deleteBatchEnsureDialog:false,
            editDialog:false,
            batchData:[]
        }

    },
    created() {
        let LoginUserOfSession = sessionStorage.getItem("info");
        if (LoginUserOfSession == null) {
            this.$router.push("/login");
        } else {
            this.LoginUser = JSON.parse(LoginUserOfSession)
        }
    },
    methods:{
        batchSelection(rows) {
            for (let i = 0; i < rows.length; i++) {
                this.batchData.push(rows[i].SID)
            }
        },
        readyCreate() {
            this.createDialog = true;
        },
        async doCreate() {
            certDataPrepare(this.LoginUser, this.PatientAdminR)
            if ((await axios.post(this.URLS['PatientAdmin']['C'], this.PatientAdminC)).data.stat.includes('SUCCESS')) {
                this.$message('创建成功')
            } else {
                this.$message('创建失败')
            }
        },

        async readyDelete(row) {
            this.PatientAdminD.SID = row.SID
            this.deleteEnsureDialog = true
        },
        async readyBatchDelete() {
            this.deleteBatchEnsureDialog = true
        },
        async doDelete() {
            certDataPrepare(this.LoginUser, this.PatientAdminR)
            if ((await axios.post(this.URLS['PatientAdmin']['D'], this.PatientAdminD)).data.stat.includes('SUCCESS')) {
                this.$message('删除成功')
            } else {
                this.$message('删除失败')
            }
        },
        async doBatchDelete() {
            certDataPrepare(this.LoginUser, this.PatientAdminD)
            for (let i = 0; i < this.batchData.length; i++) {
                this.PatientAdminD.SID = this.batchData[i]
                if (!(await axios.post(this.URLS['PatientAdmin']['R'], this.PatientAdminR)).data.stat.includes('SUCCESS')) {
                    this.$message('删除失败')
                    return;
                }
            }
        },
        readyEdit(row) {
            this.editDialog = true
            this.PatientAdminU.SID = row.SID
        },
        async doEdit() {
            certDataPrepare(this.LoginUser, this.PatientAdminU)
            if ((await axios.post(this.URLS['PatientAdmin']['U'], this.PatientAdminU)).data.stat.includes('SUCCESS')) {
                this.$message('更新成功')
            } else {
                this.$message('更新失败')
            }
        },
        async doSearch() {
            certDataPrepare(this.LoginUser, this.PatientAdminR)
            this.PatientAdminR.Key = 'SID'
            let answerA = (await axios.post(this.URLS['PatientAdmin']['R'], this.PatientAdminR)).data.list
            let answerB = (await axios.post(this.URLS['PatientAdmin']['R'], this.PatientAdminR)).data.list
            this.dataArray = Array.from(new Set([...answerA, ...answerB]))
        },
    }
}