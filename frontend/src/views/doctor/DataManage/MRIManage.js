import {
  afterAction,
  certDataPrepare,
  checkEmail,
  erasePack,
  getAge,
  loadFullPack,
  searchObjectFromList
} from "@/views/utils";
import axios from "axios";
import publicRes from "@/views/publicRes";

export default {
  name: "MRIManage",
  data() {
    return {
      TumorImageC:{logKey:'',logPwd:'',
        tumorName:'',TumorImageRemark:'',operateSID:'', doctorSID:''
      },
      TumorImageR:{logKey:'',logPwd:'',
        Key:'',Value:'',operateSID:''
      },
      TumorImageU:{logKey:'',logPwd:'',
        Value:'',SID:'',Key:'',operateSID:''
      },
      TumorImageD:{logKey:'',logPwd:'',operateSID:'',SID:'',
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
    getAge,
    batchSelection(rows) {
      for (let i = 0; i < rows.length; i++) {
        this.batchData.push(rows[i].SID)
      }
    },
    readyCreate() {
      this.createDialog = true;
    },
    async doCreate() {
      certDataPrepare(this.LoginUser, this.TumorImageR)
      if ((await axios.post(this.URLS['TumorImage']['C'], this.TumorImageC)).data.stat.includes('SUCCESS')) {
        this.$message('创建成功')
      } else {
        this.$message('创建失败')
      }
    },

    async readyDelete(row) {
      this.TumorImageD.SID = row.SID
      this.deleteEnsureDialog = true
    },
    async readyBatchDelete() {
      this.deleteBatchEnsureDialog = true
    },
    async doDelete() {
      certDataPrepare(this.LoginUser, this.TumorImageR)
      if ((await axios.post(this.URLS['TumorImage']['D'], this.TumorImageD)).data.stat.includes('SUCCESS')) {
        this.$message('删除成功')
      } else {
        this.$message('删除失败')
      }
    },
    async doBatchDelete() {
      certDataPrepare(this.LoginUser, this.TumorImageD)
      for (let i = 0; i < this.batchData.length; i++) {
        this.TumorImageD.SID = this.batchData[i]
        if (!(await axios.post(this.URLS['TumorImage']['R'], this.TumorImageR)).data.stat.includes('SUCCESS')) {
          this.$message('删除失败')
          return;
        }
      }
    },
    async doEdit() {
      certDataPrepare(this.LoginUser, this.TumorImageU)
      if ((await axios.post(this.URLS['TumorImage']['U'], this.TumorImageU)).data.stat.includes('SUCCESS')) {
        this.$message('更新成功')
      } else {
        this.$message('更新失败')
      }
    },
    async doSearch() {
      certDataPrepare(this.LoginUser, this.TumorImageR)
      this.TumorImageR.Key = 'SID'
      let answerA = (await axios.post(this.URLS['TumorImage']['R'], this.TumorImageR)).data.list
      this.TumorImageR.Key = 'tumorName'
      let answerB = (await axios.post(this.URLS['TumorImage']['R'], this.TumorImageR)).data.list
      this.dataArray = Array.from(new Set([...answerA, ...answerB]))
    },
  }
};
