import {certDataPrepare} from "@/views/utils";
import axios from "axios";
import publicRes from "@/views/publicRes";

export default {
    name: 'PatientMessage',
    data() {
        return{
            LoginUser: {
                logKey: '', logPwd: '', operateSID:'', userType:'', name:'', email:'',phone:'', address:'', gender:'', birthday:'', createTime:''},
            searchValue:'',
            patientMessageList:[
                {'userName':'JackMa','sendMessage':'此次调价涉及到的多为热门线路，其中有3条线路以杭州为起点或终点。','sendTime':'2021-01-07'},
                {'userName':'Robin','sendMessage':'四条高铁线路调价为何三条涉及杭州','sendTime':'2023-07-11'},
                {'userName':'Sarah','sendMessage':'目的是通过灵活实施高铁票价市场化机制','sendTime':'2024-01-14'},
                {'userName':'Jane','sendMessage':'全面提升客运服务质量','sendTime':'2024-02-23'},

            ],
            dataArray:[],
            URLS:publicRes.data().URLS,
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
        async doCreate() {
            certDataPrepare(this.LoginUser, this.ChatDialogR)
            if ((await axios.post(this.URLS['ChatDialog']['C'], this.ChatDialogC)).data.stat.includes('SUCCESS')) {
                this.$message('创建成功')
            } else {
                this.$message('创建失败')
            }
        },

        async readyDelete(row) {
            this.ChatDialogD.SID = row.SID
            this.deleteEnsureDialog = true
        },
        async readyBatchDelete() {
            this.deleteBatchEnsureDialog = true
        },
        async doDelete() {
            certDataPrepare(this.LoginUser, this.ChatDialogR)
            if ((await axios.post(this.URLS['ChatDialog']['D'], this.ChatDialogD)).data.stat.includes('SUCCESS')) {
                this.$message('删除成功')
            } else {
                this.$message('删除失败')
            }
        },
        async doBatchDelete() {
            certDataPrepare(this.LoginUser, this.ChatDialogD)
            for (let i = 0; i < this.batchData.length; i++) {
                this.ChatDialogD.SID = this.batchData[i]
                if (!(await axios.post(this.URLS['ChatDialog']['R'], this.ChatDialogR)).data.stat.includes('SUCCESS')) {
                    this.$message('删除失败')
                    return;
                }
            }
        },
        readyEdit(row) {
            this.editDialog = true
            this.ChatDialogU.SID = row.SID
        },
        async doEdit() {
            certDataPrepare(this.LoginUser, this.ChatDialogU)
            if ((await axios.post(this.URLS['ChatDialog']['U'], this.ChatDialogU)).data.stat.includes('SUCCESS')) {
                this.$message('更新成功')
            } else {
                this.$message('更新失败')
            }
        },
        async doSearch() {
            certDataPrepare(this.LoginUser, this.ChatDialogR)
            this.ChatDialogR.Key = 'SID'
            let answerA = (await axios.post(this.URLS['ChatDialog']['R'], this.ChatDialogR)).data.list
            let answerB = (await axios.post(this.URLS['ChatDialog']['R'], this.ChatDialogR)).data.list
            this.dataArray = Array.from(new Set([...answerA, ...answerB]))
        },
        sendBackMessage(row){
            this.readyEdit(row)
        },
    }
}
