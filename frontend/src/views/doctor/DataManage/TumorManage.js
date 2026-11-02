import {certDataPrepare} from "@/views/utils";
import axios from "axios";
import publicRes from "@/views/publicRes";

export default {
  name: "TumorManage",
  data() {
    return {
      TumorTypeC:{logKey:'',logPwd:'',
        tumorName:'',tumorTypeRemark:'',operateSID:'', doctorSID:''
      },
      TumorTypeR:{logKey:'',logPwd:'',
        Key:'',Value:'',operateSID:''//Key是选项，选项分别为：'SID','tumorName'
      },
      TumorTypeU:{logKey:'',logPwd:'',
        Value:'',SID:'',Key:'',operateSID:''//Key是选项，选项分别为：'tumorName','tumorTypeRemark'
      },
      TumorTypeD:{logKey:'',logPwd:'',operateSID:'',SID:'',
      },
      dataArray:[],
      URLS:publicRes.data().URLS,
      // ============================UI CONTROL====================================
      createDialog:false,
      deleteEnsureDialog:false,
      deleteBatchEnsureDialog:false,
      editDialog:false,
      batchData:[]
    };
  },
  created() {
    let LoginUserOfSession = sessionStorage.getItem("info");
    if (LoginUserOfSession == null) {
      this.$router.push("/login");
    } else {
      this.LoginUser = JSON.parse(LoginUserOfSession)
    }
  },
  methods: {
    batchSelection(rows) {
      for (let i = 0; i < rows.length; i++) {
        this.batchData.push(rows[i].SID)
      }
    },
    readyCreate() {
      this.createDialog = true;
    },
    async doCreate() {
      certDataPrepare(this.LoginUser, this.TumorTypeR)
      if ((await axios.post(this.URLS['tumorType']['C'], this.TumorTypeC)).data.stat.includes('SUCCESS')) {
        this.$message('创建成功')
      } else {
        this.$message('创建失败')
      }
    },

    async readyDelete(row) {
      this.TumorTypeD.SID = row.SID
      this.deleteEnsureDialog = true
    },
    async readyBatchDelete() {
      this.deleteBatchEnsureDialog = true
    },
    async doDelete() {
      certDataPrepare(this.LoginUser, this.TumorTypeR)
      if ((await axios.post(this.URLS['tumorType']['D'], this.TumorTypeD)).data.stat.includes('SUCCESS')) {
        this.$message('删除成功')
      } else {
        this.$message('删除失败')
      }
    },
    async doBatchDelete() {
      certDataPrepare(this.LoginUser, this.TumorTypeD)
      for (let i = 0; i < this.batchData.length; i++) {
        this.TumorTypeD.SID = this.batchData[i]
        if (!(await axios.post(this.URLS['tumorType']['R'], this.TumorTypeR)).data.stat.includes('SUCCESS')) {
          this.$message('删除失败')
          return;
        }
      }
    },
    readyEdit(row) {
      this.editDialog = true
      this.TumorTypeU.SID = row.SID
      this.TumorTypeU.Key = 'tumorName'
    },
    async doEdit() {
      certDataPrepare(this.LoginUser, this.TumorTypeU)
      if ((await axios.post(this.URLS['tumorType']['U'], this.TumorTypeU)).data.stat.includes('SUCCESS')) {
        this.$message('更新成功')
      } else {
        this.$message('更新失败')
      }
    },
    async doSearch() {
      certDataPrepare(this.LoginUser, this.TumorTypeR)
      this.TumorTypeR.Key = 'SID'
      let answerA = (await axios.post(this.URLS['tumorType']['R'], this.TumorTypeR)).data.list
      this.TumorTypeR.Key = 'tumorName'
      let answerB = (await axios.post(this.URLS['tumorType']['R'], this.TumorTypeR)).data.list
      this.dataArray = Array.from(new Set([...answerA, ...answerB]))
    },
  },
};
