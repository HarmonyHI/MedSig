export default {
    data() {
        return {
            URLS:{
                'admin':{
                    'C':'/CreateAdmin/',
                    'R':'/ReadAdmin/',
                    'U':'/UpdateAdmin/',
                    'D':'/DeleteAdmin/'
                },
                'doctor':{
                    'C':'/CreateDoctor/',
                    'R':'/ReadDoctor/',
                    'U':'/UpdateDoctor/',
                    'D':'/DeleteDoctor/'
                },
                'patient':{
                    'C':'/CreatePatient/',
                    'R':'/ReadPatient/',
                    'U':'/UpdatePatient/',
                    'D':'/DeletePatient/'
                },
                'tumorImage':{
                    'C':'/CreateTumorImage/',
                    'R':'/ReadTumorImage/',
                    'U':'/UpdateTumorImage/',
                    'D':'/DeleteTumorImage/'
                },
                'tumor':{
                    'C':'/CreateTumor/',
                    'R':'/ReadTumor/',
                    'U':'/UpdateTumor/',
                    'D':'/DeleteTumor/'
                },
                'tumorType':{
                    'C':'/CreateTumorType/',
                    'R':'/ReadTumorType/',
                    'U':'/UpdateTumorType/',
                    'D':'/DeleteTumorType/'
                },
                'chatDialog':{
                    'C':'/CreateChatDialog/',
                    'R':'/ReadChatDialog/',
                    'U':'/UpdateChatDialog/',
                    'D':'/DeleteChatDialog/'
                },
            },
            nameDict:{'doctor':'医生', 'patient':'病人', 'tumorType':'肿瘤类型', 'admin':'管理员', 0:'女', 1:'男',8:'未选',
                'tumor':'肿瘤病例', 'tumorImage':'MRI扫描图像', 'chatDialog':'就诊对话'},
            loginFormRules: {
                userEmail: [
                    {required: true, message: "请输入用户名称", trigger: "blur"},
                    {min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur"},
                ],
                userPwd: [
                    {required: true, message: "请输入密码", trigger: "blur"},
                    {
                        min: 6,
                        max: 10,
                        message: "长度在 6 到 10 个字符",
                        trigger: "blur",
                    },
                ],
            },
            writableKey: {
                'doctor':[
                    {keyName: 'userEmail', keyNickName: '邮箱'},
                    {keyName: 'phone', keyNickName: '电话'},
                    {keyName: 'userName', keyNickName: '用户名'},
                    {keyName: 'address', keyNickName: '住址'},
                    {keyName: 'userSex', keyNickName: '性别'},
                    {keyName: 'birthday', keyNickName: '出生日期'},
                ],
                'patient':[
                    {keyName: 'userEmail', keyNickName: '邮箱'},
                    {keyName: 'phone', keyNickName: '电话'},
                    {keyName: 'userName', keyNickName: '用户名'},
                    {keyName: 'address', keyNickName: '住址'},
                    {keyName: 'userSex', keyNickName: '性别'},
                    {keyName: 'birthday', keyNickName: '出生日期'},
                ],
                'tumorType':[
                    {keyName: 'tumorName', keyNickName: '肿瘤名称'},
                    {keyName: 'tumorTypeRemark', keyNickName: '肿瘤评价'},
                ],
                'tumorImage':[
                    {keyName:'originalPicture', keyNickName: '原始MRI图像组'},
                    {keyName:'dividedPicture', keyNickName: '分割MRI图像组'},
                    {keyName:'dimension', keyNickName: 'MRI图像维度数'},
                    {keyName:'tumorSID', keyNickName: '关联肿瘤SID'},
                ],
                'admin':[
                    {keyName: 'userEmail', keyNickName: '邮箱'},
                    {keyName: 'phone', keyNickName: '电话'},
                    {keyName: 'userName', keyNickName: '用户名'},
                    {keyName: 'address', keyNickName: '住址'},
                    {keyName: 'userSex', keyNickName: '性别'},
                    {keyName: 'birthday', keyNickName: '出生日期'},
                ],
                'tumor':[
                    {keyName: 'typeSID',keyNickName: '肿瘤类型SID'},
                    {keyName: 'malignant',keyNickName: '是否恶性'},
                    {keyName: 'position',keyNickName: '位置'},
                    {keyName: 'size',keyNickName: '肿瘤尺寸'},
                    {keyName: 'doctorSID',keyNickName: '诊断医生SID'},
                    {keyName: 'patientSID',keyNickName: '患者SID'},
                    {keyName: 'foundTime',keyNickName: '发现时间'},
                    {keyName: 'removedTime',keyNickName: '切除时间'},
                    {keyName: 'remark',keyNickName: '病情描述'},
                    {keyName: 'SID',keyNickName: '肿瘤SID'},
                ],
                'chatDialog':[
                    {keyName: 'sendTime',keyNickName: '消息发送时间'},
                    {keyName: 'recvTime',keyNickName: '消息接收时间'},
                    {keyName: 'sendMessage',keyNickName: '消息发送内容'},
                    {keyName: 'recvMessage',keyNickName: '消息接收内容'},
                ]
            },
            readOnlyKey: {
                'doctor':[
                    {keyName: 'rank', keyNickName: '评分'},
                    {keyName: 'rankNum', keyNickName: '患者数量'},
                    {keyName: 'SID', keyNickName: 'SID'},
                    {keyName: 'createTime', keyNickName: '创建时间'},
                ],
                'patient':[
                    {keyName: 'SID', keyNickName: 'SID'},
                    {keyName: 'createTime', keyNickName: '创建时间'},
                ],
                'tumorType':[
                    {keyName: 'SID', keyNickName: 'SID'},
                    {keyName: 'createTime', keyNickName: '创建时间'},
                    {keyName: 'all', keyNickName: '所有肿瘤'},
                ],
                'admin':[

                ],
                'tumorImage':[
                    {keyName: 'SID', keyNickName: 'SID'},
                    {keyName: 'createTime', keyNickName: '创建时间'},
                ],
                'tumor':[
                    {keyName: 'createTime',keyNickName: '添加时间'},
                ],
                'chatDialog':[
                    {keyName: 'sendAccountSID',keyNickName: '消息发送方'},
                    {keyName: 'recvAccountSID',keyNickName: '消息接受方'},
                ]
            },
            varToTypeDict:{
                'userName':'value',
                'userSex':'sexChoose',
                'userBirthday':'dateInput',
                'userPwd':'passwordInput',
                'userEmail':'value',
                'address':'address',
                'phone':'phone'
            }

        }
    }
}