export function say_hi_word() {
  return parseInt(Date().substring(16, 18)) >= 12 ? " 下午好" : " 上午好";
}
export function account_available(a, b, c, d) {
  if (a === "" || b === "") {
    return "输入不能为空";
  }
  if (a !== b) {
    return "两次输入密码不一致";
  }
  if (a.length < 8) {
    return "密码过短";
  }
  if (c === 0 && d === ''){
    return "请输入邮箱或手机号"
  }
  return "ACCEPT";
}
export function checkEditPwd(LoginUser){
    if(LoginUser.newPwd === '' || LoginUser.oldPwd === '' || LoginUser.rePwd === ''){
        this.$message("密码不能为空");
    }
    if(LoginUser.newPwd.length < 8 || LoginUser.oldPwd.length < 8 || LoginUser.rePwd.length < 8 ){
        this.$message("密码过短");
    }
    if (LoginUser.newPwd !== LoginUser.rePwd) {
        this.$message("两次密码输入不一致");
    }
    return 'SUCCESS'
}
export function getPhone(a) {
    const regex = /^1[3-9]\d{9}$/;
    if(regex.test(String(a))){
      return a;
    }
    else{
      return null;
    }
}
export function getEmail(a) {
    if(String(a).search(/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) !== -1){
      return a;
    }
    else{
      return null;
    }
}
export function checkEditInfo(LoginUser) {
    if(LoginUser.userName === ''){
        return "用户名不能为空";
    }
    if(!checkEmail(LoginUser.userEmail)){
        return"请输入正确的邮箱地址";
    }
    return 'SUCCESS';
}
export function checkEmail(str) {
  return str.search("@") !== -1 && str.search("@") !== str.length - 1;
}
export function syncFromSession(LoginUser){
    const gotUser = JSON.parse(sessionStorage.getItem("info"));
    LoginUser.userPwd = gotUser.userPwd
    LoginUser.standardId = gotUser.standardId
    LoginUser.userType = gotUser.userType
    LoginUser.logKey = gotUser.logKey
    return LoginUser
}
export function afterAction(info, msgWindow){
    if (typeof(info.stat)==='string'){
        if(info.stat.indexOf('SUCCESS')!==-1){
            msgWindow.$message('操作成功')
            return false
        }
        else {
            msgWindow.$message('操作失败' + info.stat)
            return true
        }
    }
    else{
        msgWindow.$message('操作失败，后端STAT空')
        return true
    }
}
export function erasePack(pack){
    for(let items in pack){
        if (typeof(pack[items]) === 'string'){
            pack[items] = ''
        }
        else{
            pack[items] = 0
        }
    }
    return pack
}
export function certDataPrepare(fromData, toData){
    toData.operateSID = fromData.operateSID;
    toData.logKey = fromData.logKey;
    toData.logPwd = fromData.logPwd
}
export function loadFullPack(fromData, toData){
    console.log(fromData)
    console.log("==========")
    console.log(toData)
    toData.name = fromData['name'];
    toData.phone = fromData['phone']
    toData.email = fromData['email']
    toData.address = fromData['address']
    toData.gender = fromData['gender']
    toData.createTime = fromData['createTime']
    toData.birthday = fromData['birthday']

}
export function formatDate(row) {
    return new Date(Date.parse(row.birthday)).toLocaleDateString();
}
export function getSID(ID){
    return ID.substring(0,12)
}
export function searchObjectFromList(objList, key, value){
    // data like these:[{'aa':1,'bb':2}{'aa':9,'bb':10}]
    // if key is 'aa',value is 9, then should return objList[1]
    for(let i = 0;i<objList.length;i++){
        if(objList[i][key] === value){
            return objList[i]
        }
    }
    return objList[0]
}
export function getAge(inputDate){
    let birthdays = new Date(inputDate.replace(/-/g, "/"))
    let d = new Date();
    return d.getFullYear() - birthdays.getFullYear() - (d.getMonth() <
    birthdays.getMonth() || (d.getMonth() === birthdays.getMonth() &&
        d.getDate() < birthdays.getDate()) ? 1 : 0)
}
