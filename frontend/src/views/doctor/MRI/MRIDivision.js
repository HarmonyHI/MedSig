export default {
    name: 'MRIDivision',
    data() {
        return {
            networkIdentify:{
                logKey:'',logPwd:'',operateSID:'',
            },
            TumorImageC:{logKey:'',logPwd:'',
                originalPicture:'',dividedPicture:'',dimension:'',tumorSID:'',operateSID:'',doctorSID:''
            },
            imageUrl:"http://localhost:8000/CreateTumorImage/",
            path:"ws://localhost:8000/ConnectPyTorch/",

            socket:"",
            reader: new FileReader(),
            imagesData:{'t1':'','t1ce':'','t2':'','flair':'','seg':'','mixed':''},
            fileName:'',
            defaultInput:require('@/assets/DefaultInput.png'),
            defaultOutput:require('@/assets/DefaultOutput.png'),
            dataSetValid:{'t1':false,'t1ce':false,'t2':false,'flair':false},
            fileToBandDict:{'t1ce.nii.gz':'t1ce', 't1.nii.gz':'t1',
                't2.nii.gz':'t2','flair.nii.gz':'flair',},
            modelOutputMessage:'',

            searchKey:'',
            editKeyList:['train_save_iter_freq', 'cfg','mode','gpu','is_out','verbose','use_TTA','postprocess','save_format'],
            editValueList:['','','','','','','','',''],
            chooseKeyList:['TestMode1','TestMode2','TestMode3'],
            chooseValueList:{'TestMode1':false,'TestMode2':true,'TestMode3':false},

        }
    },
    created() {
        let LoginUserOfSession = sessionStorage.getItem("info");
        if (LoginUserOfSession == null) {
            this.$router.push("/login");
        } else {
            this.LoginUser = JSON.parse(LoginUserOfSession)
        }
        this.imagesData['t1'] = this.defaultInput
        this.imagesData['t2'] = this.defaultInput
        this.imagesData['t1ce'] = this.defaultInput
        this.imagesData['flair'] = this.defaultInput
        this.imagesData['pred'] = this.defaultOutput
        this.imagesData['mixed_pred'] = this.defaultOutput
        this.imagesData['demo'] = this.defaultOutput
        this.reader.onload = (e) => {
            let sendPack = {
                'fileName':this.fileName,
                'fileData':new Uint8Array(e.target.result)
            }
            this.send('sendFile', JSON.stringify(sendPack))
        };
        this.reader.onerror = ()=>{
            this.newMsg("上传错误")
        }
    },
    destroyed () {
    },
    mounted () {
        this.init()
    },
    methods: {
        newMsg(myStr, popMsg=false){
            this.modelOutputMessage = "模型输出日志：" + myStr
            if(popMsg){
                this.$message(myStr)
            }
        },
        send: function (message, data=null) {
            this.socket.send(JSON.stringify({'message':message, 'data': data}))
        },
        sendFile(file, fileName){
            this.fileName = fileName
            this.reader.readAsArrayBuffer(file.raw);
        },
        whetherAllReady(){
            let count = 0;
            for (let key of Object.keys(this.dataSetValid)) {
                if (this.dataSetValid[key] === true) {
                    count++;
                }
            }
            return count;
        },
        getBandFromName(inputName){
            for (let key in this.fileToBandDict) {
                if (this.fileToBandDict.hasOwnProperty(key) && inputName.includes(key)) {
                    return this.fileToBandDict[key];
                }
            }
            return undefined;
        },
        readySendFile(file) {
            let band = this.getBandFromName(file.name)
            if(band === undefined){
                this.newMsg("无效文件:"+file.name, true)
                return
            }
            if(!this.dataSetValid[band]){
                this.sendFile(file, band)
                this.newMsg("正在上传:"+band)
            }
            else{
                this.newMsg("已经存在文件"+file.name+"，原文件已被覆盖")
            }
        },
        handleRemove(file){
            let sendPack = {
                'fileName':file.name,
            }
            this.send('removeFile', JSON.stringify(sendPack))
        },
        doValid(){
            this.send('startTest')
            this.newMsg("正在分割...")
        },
        search(){

        },
        clearInput(){

        },
        querySearch(){

        },

        upLoadToDB(){

        },
        init: function () {
            if(typeof(WebSocket) === "undefined"){
                this.newMsg("browser error of socket")
            }
            else{
                this.socket = new WebSocket(this.path)
                this.socket.onopen = this.open
                this.socket.onerror = this.error
                this.socket.onmessage = this.getMessage
                this.socket.onclose = this.close
            }
        },
        open: function () {
            this.newMsg("socket握手成功")
        },
        error: function () {
            this.newMsg("握手错误")
        },
        getMessage: function (event) {
            if('message' in JSON.parse(event.data)){
                let msg = JSON.parse(event.data)['message']
                if(msg.includes('SUCCESS')||msg.includes('Msg')){
                    msg = msg.replace('SUCCESS', '')
                    if(msg.includes('get_pred_image')){
                        this.imagesData[JSON.parse(event.data)['filename']] = "data:image/gif;base64," + JSON.parse(event.data)['data']
                        this.newMsg("分割图像已回传")
                    }
                    else if(msg.includes('get_ori_image')){
                        this.imagesData[JSON.parse(event.data)['filename']] = "data:image/gif;base64," + JSON.parse(event.data)['data']
                        this.newMsg("原始图像已回传")
                    }
                    else if(msg.includes('startTest')){
                        this.newMsg("分割成功，等待图像回传")
                        this.send('get_pred_image')
                    }
                    else if(msg.includes('sendFile')){
                        let band = msg.replace('sendFile', '')
                        this.dataSetValid[band] = true
                        let nums = this.whetherAllReady()
                        this.newMsg("当前已上传:"+nums.toString()+"")
                        if(this.whetherAllReady()===4){
                            this.send('readyTest')
                            this.send('get_ori_image')
                            this.newMsg("数据包就绪，正在加载数据集与原始动态图...")
                        }
                    }
                    else if(msg.includes('removeFile')){
                        let fileName = msg.replace('removeFile', '')
                        this.newMsg("文件:"+fileName+"已删除")
                    }
                    else{
                        this.newMsg("socket握手成功")
                    }
                }
                else if (msg.includes('FAILURE')){
                    this.newMsg("错误："+msg.replace("FAILURE",""))
                }
                else if (msg.includes('UNKNOWN')){
                    this.newMsg("指令已发送，但服务器未执行："+msg.replace("UNKNOWN",""))
                }
                else {
                    this.newMsg("收到未知指令："+msg.replace("UNKNOWN",""))
                }
            }
            else{
                this.newMsg("Websocket收到未知数据"+event.data)
            }

        },

        close: function () {
            this.newMsg("socket已关闭")
        },
    }
}
