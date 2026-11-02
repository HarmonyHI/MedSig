import datetime
import json
from django.db import IntegrityError
from ClientMainModel.models import *
from .utils import *


def account_read(pack):
    if pack['Key'] == 'all' and pack['Value'] == 'all':
        return Account.objects.all()
    readItemKey = pack['Key']
    readItemValue = pack['Value']
    if readItemKey == 'userEmail':
        return Account.objects.filter(email__icontains=readItemValue)
    elif readItemKey == 'phone':
        if not readItemValue.isdigit():
            return Account.objects.filter(SID=-1)
        return Account.objects.filter(phone__icontains=readItemValue)
    elif readItemKey == 'userName':
        return Account.objects.filter(name__icontains=readItemValue)
    elif readItemKey == 'address':
        return Account.objects.filter(address__icontains=readItemValue)
    elif readItemKey == 'userSex':
        return Account.objects.filter(gender__icontains=readItemValue)
    elif readItemKey == 'userBirthday':
        return Account.objects.filter(birthday=readItemValue)
    elif readItemKey == 'rank':
        return Account.objects.filter(rank=readItemValue)
    elif readItemKey == 'SID':
        return Account.objects.filter(SID=readItemValue)
    elif readItemKey == 'createTime':
        return Account.objects.filter(createTime=readItemValue)
    return Account.objects.filter(SID=-1)


def doctor_create(pack):
    msg = pack_check(pack, 'DC')
    if msg != 'OK':
        return {'stat': msg, 'SID': -1}
    if pack['phone'] == '' and pack['userEmail'] == '':
        return {'stat': 'ACCOUNT_NULL', 'SID': -1}
    elif pack['phone'] != '' and pack['userEmail'] == '':
        stat = 'SUCCESS Phone'
    elif pack['phone'] == '' and pack['userEmail'] != '':
        stat = 'SUCCESS Email'
    else:
        stat = 'SUCCESS Phone'
    tmp = Doctor(
        email=pack['userEmail'],
        phone=pack['phone'],
        password=encrypt(pack['userPwd'], False),
        name=pack['userName'],
        address=pack['address'],
        gender=pack['userSex'],
        birthday=get_avail_birthdays(pack['userBirthday']),
        rank=pack['rank'],
        rankNum=pack['rankNum'],
        adminObject=admin_patient_read(
            {'Key': 'SID', 'Value': pack['operateSID'], 'operateSID': pack['operateSID']}).first(),
        userType='Doctor'
    )
    try:
        tmp.save()
    except IntegrityError as e:
        return {'stat': str(e), 'SID': tmp.SID}
    return {'stat': stat, 'SID': tmp.SID}


def doctor_delete(pack):
    msg = pack_check(pack, 'DD')
    if msg != 'OK':
        return {'stat': msg}
    deleteSID = pack['SID']
    (Doctor.objects.filter(SID=deleteSID) & Doctor.objects.filter(
        adminObject=admin_patient_read({'Key': 'SID', 'Value': pack['operateSID']}).first())).first().delete()
    return {'stat': 'SUCCESS'}


def doctor_update(pack):
    msg = pack_check(pack, 'DU')
    if msg != 'OK':
        return {'stat': msg}
    editSID = pack['SID']
    editKey = pack['Key']
    editValue = pack['Value']
    if account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType == 'Doctor':
        goal = Doctor.objects.filter(SID=pack['operateSID'])
    elif account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType == 'Admin':
        goal = (Doctor.objects.filter(SID=editSID) & Doctor.objects.filter(
            adminObject=admin_patient_read(
                {'Key': 'SID', 'Value': pack['operateSID'], 'operateSID': pack['operateSID']}).first()))
    elif account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType == 'Patient':
        goal = Doctor.objects.filter(SID=editSID)
    else:
        return {'stat': 'FAIL'}
    if len(goal) == 0:
        return {'stat': 'FAIL'}
    if editKey == 'userEmail':
        goal.update(email=editValue)
    elif editKey == 'phone':
        goal.update(phone=editValue)
    elif editKey == 'userPwd':
        goal.update(password=encrypt(editValue, False))
    elif editKey == 'userName':
        goal.update(name=editValue)
    elif editKey == 'address':
        goal.update(address=editValue)
    elif editKey == 'userSex':
        goal.update(gender=editValue)
    elif editKey == 'userBirthday':
        goal.update(birthday=get_avail_birthdays(editValue))
    elif editKey == 'rank':
        if account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType == 'Patient':
            if not Patient.objects.fliter(SID=pack['operateSID']).get('has_remarked'):
                goal.update(rank=(goal.get('rankNum') * goal.get('rank') + editValue) / (goal.get('rankNum') + 1))
                goal.update(rankNum=(goal.get('rankNum') + 1))
                Patient.objects.fliter(SID=pack['operateSID']).update(has_remarked=True)
            else:
                return {'stat': 'DOUBLE REMARK FAIL'}
        else:
            return {'stat': 'NOT PATIENT FAIL'}
    return {'stat': 'SUCCESS'}


def doctor_read(pack, skipCheck=True):
    if not skipCheck:
        msg = pack_check(pack, 'DR')
        if msg != 'OK':
            return {'stat': msg}
    if pack['Key'] == 'all' and pack['Value'] == 'all':
        return Doctor.objects.all()
    readItemKey = pack['Key']
    readItemValue = pack['Value']
    if readItemKey == 'rank':
        return Doctor.objects.filter(rank__icontains=readItemValue)
    elif readItemKey == 'userEmail':
        return Doctor.objects.filter(email=readItemValue)
    elif readItemKey == 'phone':
        if not readItemValue.isdigit():
            return Doctor.objects.filter(SID=-1)
        return Doctor.objects.filter(phone=readItemValue)
    elif readItemKey == 'userName':
        return Doctor.objects.filter(name__icontains=readItemValue)
    elif readItemKey == 'address':
        return Doctor.objects.filter(address__icontains=readItemValue)
    elif readItemKey == 'userSex':
        return Doctor.objects.filter(gender__icontains=readItemValue)
    elif readItemKey == 'userBirthday':
        return Doctor.objects.filter(birthday=readItemValue)
    elif readItemKey == 'rank':
        return Doctor.objects.filter(rank=readItemValue)
    elif readItemKey == 'rankNum':
        return Doctor.objects.filter(rankNum=readItemValue)
    elif readItemKey == 'adminSID':
        return Doctor.objects.filter(adminObject=admin_patient_read({'Key': 'SID', 'Value': readItemValue}).first())
    elif readItemKey == 'SID':
        return Doctor.objects.filter(SID=readItemValue)
    elif readItemKey == 'createTime':
        return Doctor.objects.filter(createTime=readItemValue)
    return Doctor.objects.filter(SID=-1)


def admin_patient_create(pack, is_admin):
    if is_admin:
        tmp = Admin(
            email=pack['userEmail'],
            phone=pack['phone'],
            password=encrypt(pack['userPwd'], False),
            name=pack['userName'],
            address=pack['address'],
            gender=pack['userSex'],
            birthday=get_avail_birthdays(pack['userBirthday']),
            userType='Admin'
        )
    else:
        msg = pack_check(pack, 'PC')
        if msg != 'OK':
            return {'stat': msg}
        tmp = Patient(
            email=pack['userEmail'],
            phone=pack['phone'],
            password=encrypt(pack['userPwd'], False),
            name=pack['userName'],
            address=pack['address'],
            gender=pack['userSex'],
            birthday=get_avail_birthdays(pack['userBirthday']),
            userType='Patient'
        )
    try:
        tmp.save()
        if pack['userEmail'] != '':
            return {'stat': 'SUCCESS Email', 'SID': tmp.SID}
        else:
            return {'stat': 'SUCCESS Phone', 'SID': tmp.SID}
    except IntegrityError as e:
        return {'stat': str(e), 'SID': tmp.SID}


def admin_patient_delete(pack):
    msg = pack_check(pack, 'PD')
    if msg != 'OK':
        return {'stat': msg}
    deleteSID = pack['SID']
    Account.objects.filter(SID=deleteSID).delete()
    return {'stat': 'SUCCESS'}


def admin_patient_update(pack):
    msg = pack_check(pack, 'PU')
    if msg != 'OK':
        return {'stat': msg}
    editSID = pack['SID']
    editKey = pack['Key']
    editValue = pack['Value']
    if editKey == 'userEmail':
        Account.objects.filter(SID=editSID).update(email=editValue)
    elif editKey == 'phone':
        Account.objects.filter(SID=editSID).update(phone=editValue)
    elif editKey == 'userPwd':
        Account.objects.filter(SID=editSID).update(password=encrypt(editValue, False))
    elif editKey == 'userName':
        Account.objects.filter(SID=editSID).update(name=editValue)
    elif editKey == 'address':
        Account.objects.filter(SID=editSID).update(address=editValue)
    elif editKey == 'userSex':
        Account.objects.filter(SID=editSID).update(gender=editValue)
    elif editKey == 'userBirthday':
        Account.objects.filter(SID=editSID).update(birthday=get_avail_birthdays(editValue))
    return {'stat': 'SUCCESS'}


def admin_patient_read(pack, read_admin=True, logging=False):
    if logging:
        goal = (Admin if read_admin else Patient)
    else:
        userType = account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType
        if not read_admin:
            if userType == 'doctor':
                goal = Patient.objects.filter(doctorObject=Doctor.objects.filter(SID=pack['operateSID']))
            else:
                goal = Patient
        else:
            goal = Admin
    try:
        if pack['Key'] == 'all' and pack['Value'] == 'all':
            return goal.objects.all()
        readItemKey = pack['Key']
        readItemValue = pack['Value']
        if readItemKey == 'userEmail':
            return goal.objects.filter(email=readItemValue)
        elif readItemKey == 'phone':
            if not readItemValue.isdigit():
                return goal.objects.filter(SID=-1)
            return goal.objects.filter(phone=readItemValue)
        elif readItemKey == 'userName':
            return goal.objects.filter(name__icontains=readItemValue)
        elif readItemKey == 'address':
            return goal.objects.filter(address__icontains=readItemValue)
        elif readItemKey == 'userSex':
            return goal.objects.filter(gender__icontains=readItemValue)
        elif readItemKey == 'userBirthday':
            return goal.objects.filter(birthday=readItemValue)
        elif readItemKey == 'SID':
            return goal.objects.filter(SID=readItemValue)
        elif readItemKey == 'createTime':
            return goal.objects.filter(createTime=readItemValue)
        return {'stat': 'NOT FOUND'}
    except ValueError:
        return goal.objects.filter(SID='-1')


def tumor_image_create(pack):
    msg = pack_check(pack, 'IC')
    if msg != 'OK':
        return {'stat': msg, 'SID': '-1'}
    userType = account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType
    if userType == 'Admin':
        tumor_goal = tumor_read({'Key': 'SID', 'Value': pack['tumorSID'],
                                 'doctorSID': pack['doctorSID'], 'operateSID': pack['operateSID']}).first()
    else:
        tumor_goal = (tumor_read({'Key': 'SID', 'Value': pack['tumorSID'],
                                  'doctorSID': pack['doctorSID'], 'operateSID': pack['operateSID']}) &
                      tumor_read({'Key': 'doctorSID', 'Value': doctor_read({'Key': 'SID', 'Value': pack['doctorSID']}),
                                  'doctorSID': pack['doctorSID'], 'operateSID': pack['operateSID']})).first()
    tmp = TumorImage(
        originalPicture=pack['originalPicture'],
        dividedPicture=pack['dividedPicture'],
        dimension=pack['dimension'],
        tumorObject=tumor_goal
    )
    try:
        tmp.save()
    except IntegrityError as e:
        return {'stat': str(e), 'SID': tmp.SID}
    return {'stat': 'SUCCESS', 'SID': tmp.SID}


def tumor_image_delete(pack):
    msg = pack_check(pack, 'ID')
    if msg != 'OK':
        return {'stat': msg}
    deleteSID = pack['SID']
    userType = account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType
    if userType == 'Admin':
        tumor_image_goal = (TumorImage.objects.filter(SID=deleteSID)
                            & TumorImage.objects.filter(
                    tumorObject=tumor_read({'Key': 'operateSID', 'Value': doctor_read(
                        {'Key': 'SID', 'Value': pack['operateSID']})}).first()))
    else:
        tumor_image_goal = TumorImage.objects.filter(SID=deleteSID)
    tumor_image_goal.delete()
    return {'stat': 'SUCCESS'}


def tumor_image_update(pack):
    msg = pack_check(pack, 'IU')
    if msg != 'OK':
        return {'stat': msg}
    editSID = pack['SID']
    editKey = pack['Key']
    editValue = pack['Value']
    tumor_image_goal = TumorImage.objects.filter(SID=editSID)
    if editKey == 'originalPicture':
        tumor_image_goal.update(originalPicture=editValue)
    elif editKey == 'dividedPicture':
        tumor_image_goal.update(dividedPicture=editValue)
    elif editKey == 'dimension':
        tumor_image_goal.update(dimension=editValue)
    elif editKey == 'tumorSID':
        tumor_image_goal.update(tumorObject=tumor_read({'Key': 'SID', 'Value': editValue}).first())
    return {'stat': 'SUCCESS'}


def tumor_image_read(pack):
    msg = pack_check(pack, 'IR')
    if msg != 'OK':
        return {'stat': msg}
    if pack['Key'] == all and pack['Value'] == 'all':
        return TumorImage.objects.all()
    readItemKey = pack['Key']
    readItemValue = pack['Value']
    if readItemKey == 'originalPicture':
        return TumorImage.objects.filter(originalPicture__icontains=readItemValue)
    elif readItemKey == 'dividedPicture':
        return TumorImage.objects.filter(dividedPicture__icontains=readItemValue)
    elif readItemKey == 'dimension':
        return TumorImage.objects.filter(dimension__icontains=readItemValue)
    elif readItemKey == 'tumorSID':
        return TumorImage.objects.filter(tumorObject=tumor_read({'Key': 'SID', 'Value': readItemValue,
                                                                 'operateSID': pack['operateSID']}).first())
    elif readItemKey == 'SID':
        return TumorImage.objects.filter(SID=readItemValue)
    elif readItemKey == 'createTime':
        return TumorImage.objects.filter(createTime=readItemValue)
    return TumorImage.objects.filter(SID=-1)


def tumor_create(pack):
    msg = pack_check(pack, 'TC')
    if msg != 'OK':
        return {'stat': msg}
    tmp = Tumor(
        typeObject=tumor_type_read({'Key': 'SID', 'Value': pack['typeSID']}).first(),
        malignant=pack['malignant'],
        position=pack['position'],
        size=pack['size'],
        doctorObject=doctor_read({'Key': 'SID', 'Value': pack['doctorSID']}).first(),
        patientObject=admin_patient_read({'Key': 'SID', 'Value': pack['patientSID'], 'operateSID': pack['operateSID']},
                                         False).first(),
        foundTime=pack['foundTime'],
        removedTime=pack['removedTime']
    )
    try:
        tmp.save()
    except IntegrityError as e:
        return {'stat': str(e), 'SID': tmp.SID}
    return {'stat': 'SUCCESS', 'SID': tmp.SID}


def tumor_delete(pack):
    msg = pack_check(pack, 'TD')
    if msg != 'OK':
        return {'stat': msg}
    deleteSID = pack['SID']
    tumor_goal = (Tumor.objects.filter(doctorObject=doctor_read({'Key': 'SID', 'Value': pack['doctorSID']}).first()) &
                  Tumor.objects.filter(SID=deleteSID))
    tumor_goal.delete()
    return {'stat': 'SUCCESS'}


def tumor_update(pack):
    msg = pack_check(pack, 'TU')
    if msg != 'OK':
        return {'stat': msg}
    editSID = pack['SID']
    editKey = pack['Key']
    editValue = pack['Value']
    userType = account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType
    tumor_goal = ((Tumor.objects.filter(doctorObject=doctor_read({'Key': 'SID', 'Value': pack['doctorSID']}).first()) |
                   Tumor.objects.filter(patientObject=doctor_read({'Key': 'SID', 'Value': pack['patientSID']}).first()))
                  & Tumor.objects.filter(SID=editSID))
    if userType == 'Admin':
        tumor_goal = Tumor.objects.filter(SID=editSID)
    if editKey == 'typeSID':
        tumor_goal.update(
            typeObject=tumor_type_read({'Key': 'SID', 'Value': editValue}).first())
    elif editKey == 'malignant':
        tumor_goal.update(malignant=editValue)
    elif editKey == 'position':
        tumor_goal.update(position=editValue)
    elif editKey == 'size':
        tumor_goal.update(size=editValue)
    elif editKey == 'doctorSID':
        tumor_goal.update(
            doctorObject=doctor_read({'Key': 'SID', 'Value': editValue}).first())
    elif editKey == 'patientSID':
        tumor_goal.update(
            patientObject=admin_patient_read({'Key': 'SID', 'Value': editValue}, False).first())
    elif editKey == 'foundTime':
        tumor_goal.update(foundTime=editValue)
    elif editKey == 'removedTime':
        tumor_goal.update(removedTime=editValue)
    elif editKey == 'remark':
        tumor_goal.update(remark=editValue)
    return {'stat': 'SUCCESS'}


def tumor_trans(pack):
    userType = account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType
    tumor_goal = ((Tumor.objects.filter(doctorObject=doctor_read({'Key': 'SID', 'Value': pack['doctorSID']}).first()) |
                   Tumor.objects.filter(patientObject=doctor_read({'Key': 'SID', 'Value': pack['patientSID']}).first()))
                  & Tumor.objects.filter(SID=pack['SID']))
    if userType == 'admin':
        tumor_goal = Tumor.objects.filter(SID=pack['SID'])
    if pack['transAction'] == 'apply':
        tumor_goal.update(waitingTrans=True)
        tumor_goal.update(transDoctorObject=pack['transDoctorSID'])
        tumor_goal.update(transTime=datetime.datetime.now())
    elif pack['transAction'] == 'accept' and userType != 'patient':
        tumor_goal.update(waitingTrans=False)
        tumor_goal.update(doctorObject=tumor_goal.first().transDoctorObject)
        tumor_goal.update(transDoctorObject=None)
    elif pack['transAction'] == 'refuse' and userType != 'patient':
        tumor_goal.update(waitingTrans=False)
    else:
        return {'stat': 'FAILURE'}
    return {'stat': 'SUCCESS'}


def tumor_read(pack):
    if (pack['Key'] == 'all' and pack['Value'] == 'all' and
            account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType == 'admin'):
        return Tumor.objects.all()
    readItemKey = pack['Key']
    readItemValue = pack['Value']
    userType = account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType
    if userType == 'Admin':
        tumor_goal = Tumor.objects.all()
    elif userType == 'Doctor':
        tumor_goal = Tumor.objects.filter(doctorObject=doctor_read(
            {'Key': 'SID', 'Value': pack['operateSID'], 'operateSID': pack['operateSID']}).first())
    elif userType == 'Patient':
        tumor_goal = Tumor.objects.filter(patientObject=admin_patient_read(
            {'Key': 'SID', 'Value': pack['operateSID'], 'operateSID': pack['operateSID']}).first())
    else:
        return {'stat': 'NOT FOUND'}
    if readItemKey == 'typeSID':
        return tumor_goal & Tumor.objects.filter(
            typeObject=tumor_type_read({'Key': 'SID', 'Value': readItemValue}).first())
    elif readItemKey == 'malignant':
        return tumor_goal & Tumor.objects.filter(malignant=readItemValue)
    elif readItemKey == 'position':
        return tumor_goal & Tumor.objects.filter(position__icontains=readItemValue)
    elif readItemKey == 'size':
        return tumor_goal & Tumor.objects.filter(size__icontains=readItemValue)
    elif readItemKey == 'doctorSID':
        return tumor_goal & Tumor.objects.filter(
            doctorObject=doctor_read({'Key': 'SID', 'Value': readItemValue}).first())
    elif readItemKey == 'patientSID':
        return tumor_goal & Tumor.objects.filter(
            patientObject=admin_patient_read({'Key': 'SID', 'Value': readItemValue, 'operateSID': pack['operateSID']},
                                             False).first())
    elif readItemKey == 'foundTime':
        return tumor_goal & Tumor.objects.filter(foundTime=readItemValue)
    elif readItemKey == 'removedTime':
        return tumor_goal & Tumor.objects.filter(removedTime=readItemValue)
    elif readItemKey == 'remark':
        return tumor_goal & Tumor.objects.filter(remark__icontains=readItemValue)
    elif readItemKey == 'SID':
        return tumor_goal & Tumor.objects.filter(SID=readItemValue)
    elif readItemKey == 'createTime':
        return tumor_goal & Tumor.objects.filter(createTime=readItemValue)
    return {'stat': 'NOT FOUND'}


def tumor_read_plus(pack):
    if pack['limit_stat'] == 'recv':
        return Tumor.objects.filter(transDoctorObject=doctor_read(
            {'Key': 'SID', 'Value': pack['operateSID'], 'operateSID': pack['operateSID']}).first())
    goalPatient = admin_patient_read({'Key': 'all', 'Value': 'all',
                                      'operateSID': pack['operateSID']}, read_admin=False)
    if pack['patient_userName'] != '':
        goalPatient = admin_patient_read({'Key': 'userName', 'Value': pack['patient_userName'],
                                          'operateSID': pack['operateSID']}, read_admin=False)
    if pack['patient_logKey'] != '':
        goalPatient = goalPatient & (admin_patient_read({'Key': 'userEmail', 'Value': pack['patient_logKey'],
                                                         'operateSID': pack['operateSID']},
                                                        read_admin=False) | admin_patient_read(
            {'Key': 'phone', 'Value': pack['patient_logKey'], 'operateSID': pack['operateSID']}, read_admin=False))
    # if pack['patient_userBirthday'] != '':
    #     goalPatient = goalPatient & admin_patient_read({'Key': 'userBirthday', 'Value': pack['patient_userBirthday'],
    #                                                     'operateSID': pack['operateSID']}, read_admin=False)  # 待完善

    goalTumor = tumor_read({'Key': 'doctorSID', 'Value': pack['operateSID'], 'operateSID': pack['operateSID'],
                            'doctorSID': pack['operateSID']})
    goalTumor = goalTumor & Tumor.objects.filter(patientObject__in=goalPatient)
    if pack['typeSID'] != '':
        goalTumor = goalTumor & tumor_read(
            {'Key': 'typeSID', 'Value': pack['typeSID'], 'operateSID': pack['operateSID']})
    if pack['remark'] != '':
        goalTumor = goalTumor & tumor_read(
            {'Key': 'typeSID', 'Value': pack['remark'], 'operateSID': pack['operateSID']})
    if pack['foundTime'] != '':
        goalTumor = goalTumor & tumor_read(
            {'Key': 'typeSID', 'Value': pack['foundTime'], 'operateSID': pack['operateSID']})
    return goalTumor


def tumor_type_create(pack):
    msg = pack_check(pack, 'EC')
    if msg != 'OK':
        return {'stat': msg}
    tmp = TumorType(
        tumorName=pack['tumorName'],
        tumorTypeRemark=pack['tumorTypeRemark']
    )
    try:
        tmp.save()
    except IntegrityError as e:
        return {'stat': str(e), 'SID': tmp.SID}
    return {'stat': 'SUCCESS', 'SID': tmp.SID}


def tumor_type_delete(pack):
    msg = pack_check(pack, 'ED')
    if msg != 'OK':
        return {'stat': msg}
    deleteSID = pack['SID']
    TumorType.objects.filter(SID=deleteSID).delete()
    return {'stat': 'SUCCESS'}


def tumor_type_update(pack):
    msg = pack_check(pack, 'EU')
    if msg != 'OK':
        return {'stat': msg}
    editSID = pack['SID']
    editKey = pack['Key']
    editValue = pack['Value']
    if editKey == 'tumorName':
        TumorType.objects.filter(SID=editSID).update(tumorName=editValue)
    elif editKey == 'tumorTypeRemark':
        TumorType.objects.filter(SID=editSID).update(tumorTypeRemark=editValue)
    return {'stat': 'SUCCESS'}


def tumor_type_read(pack):
    if pack['Key'] == 'all' and pack['Value'] == 'all':
        return TumorType.objects.all()
    readItemKey = pack['Key']
    readItemValue = pack['Value']
    if readItemKey == 'SID':
        return TumorType.objects.filter(SID=readItemValue)
    elif readItemKey == 'tumorName':
        return TumorType.objects.filter(tumorName__icontains=readItemValue)
    else:
        raise Exception('Fail')


def chat_dialog_read(pack):
    readItemKey = pack['Key']
    readItemValue = pack['Value']
    chat_goal = ChatDialog.objects.filter(
        sendAccountObject=account_read(
            {'Key': 'SID', 'Value': pack['sendAccountSID']}).first()) | ChatDialog.objects.filter(
        recvAccountObject=account_read({'Key': 'SID', 'Value': pack['recvAccountSID']}).first())
    userType = account_read({'Key': 'SID', 'Value': pack['operateSID']}).first().userType
    if userType == 'Admin':
        chat_goal = ChatDialog.objects.all()
    if pack['Key'] == 'all' and pack['Value'] == 'all':
        return chat_goal
    if readItemKey == 'sendMessage':
        return chat_goal & ChatDialog.objects.filter(sendMessage__icontains=readItemValue)
    elif readItemKey == 'sendTime':
        return chat_goal & ChatDialog.objects.filter(sendTime=readItemValue)
    elif readItemKey == 'recvMessage':
        return chat_goal & ChatDialog.objects.filter(recvMessage__icontains=readItemValue)
    elif readItemKey == 'recvTime':
        return chat_goal & ChatDialog.objects.filter(recvTime=readItemValue)
    else:
        return chat_goal


def chat_dialog_delete(pack):
    goal = ((ChatDialog.objects.filter(recvAccountObject=Account.objects.filter(SID=pack['recvAccountSID']).first()) |
             ChatDialog.objects.filter(sendAccountObject=Account.objects.filter(SID=pack['sendAccountSID']).first())) &
            ChatDialog.objects.filter(SID=pack['SID']))

    goal.delete()
    return {'stat': 'SUCCESS'}


def chat_dialog_update(pack):
    msg = pack_check(pack, 'EU')
    if msg != 'OK':
        return {'stat': msg}
    editSID = pack['SID']
    editKey = pack['Key']
    editValue = pack['Value']
    if editKey == 'recvMessage':
        ChatDialog.objects.filter(SID=editSID).update(recvMessage=editValue)
    return {'stat': 'SUCCESS'}


def chat_dialog_create(pack):
    tmp = ChatDialog(
        sendMessage=pack['sendMessage'],
        sendTime=pack['sendTime'],
        sendAccountObject=account_read({'Key': 'SID', 'Value': pack['sendAccountSID']}).first(),
        recvMessage=pack['recvMessage'],
        recvTime=pack['recvTime'],
        recvAccountObject=account_read({'Key': 'SID', 'Value': pack['recvAccountSID']}).first(),
    )
    try:
        tmp.save()
    except IntegrityError as e:
        return {'stat': str(e), 'SID': tmp.SID}
    return {'stat': 'SUCCESS', 'SID': tmp.SID}


def security_defense(req, allowListOrder):
    print('Security defense', json.loads(req.body))
    userTypeList = ['Admin', 'Doctor', 'Patient']
    allowTypeList = []
    for allowIndices in allowListOrder:
        allowTypeList.append(userTypeList[allowIndices])
    if log_check(json.loads(req.body), True)['stat'] == 'LOGIN_SUCCESS':
        if Account.objects.filter(SID=json.loads(req.body)['operateSID']).first().userType in allowTypeList:
            return True
    return False


def log_check(pack, encrypted):
    selectUser = (doctor_read({'Key': 'userEmail', 'Value': pack['logKey']}, True) |
                  doctor_read({'Key': 'phone', 'Value': pack['logKey']}, True) |
                  doctor_read({'Key': 'SID', 'Value': pack['logKey']}, True))
    if not selectUser.exists():
        selectUser = (admin_patient_read({'Key': 'userEmail', 'Value': pack['logKey']}, True, True) |
                      admin_patient_read({'Key': 'phone', 'Value': pack['logKey']}, True, True) |
                      admin_patient_read({'Key': 'SID', 'Value': pack['logKey']}, True, True))
        if not selectUser.exists():
            selectUser = (admin_patient_read({'Key': 'userEmail', 'Value': pack['logKey']}, False, True) |
                          admin_patient_read({'Key': 'phone', 'Value': pack['logKey']}, False, True) |
                          admin_patient_read({'Key': 'SID', 'Value': pack['logKey']}, False, True))
            if not selectUser.exists():
                return {'stat': 'NO_THIS_ACCOUNT', 'operateSID': '-1', 'userPwd': '-1', 'userType': '-1'}

    userType = selectUser.values_list('userType')[0][0]
    if encrypt(pack['logPwd'], encrypted) == selectUser.values_list('password')[0][0]:
        return {'stat': 'LOGIN_SUCCESS', 'operateSID': selectUser.values_list('SID')[0][0],
                'logPwd': encrypt(pack['logPwd'], encrypted), 'userType': userType, 'logKey': pack['logKey']}
    else:
        return {'stat': 'PASSWORD_WRONG', 'operateSID': '-1', 'logPwd': '-1', 'userType': userType}


def forget_password(pack):
    goal = Account.objects.filter(phone__icontains=pack['userName']) | Account.objects.filter(
        email__icontains=pack['userName'])
    goal.update(password=encrypt(pack['userPwd'], False))
    return {'stat': 'SUCCESS'}


def say_hello(pack):
    stat_str = ['T', 'T', 'T', 'T']
    try:
        if not pack['number'] == 12138 and pack['jsonPack']['str'] == 'Hello small django':
            stat_str[2] = 'J'
    except LookupError:
        stat_str[2] = 'F'
    try:
        Doctor.objects.all()
    except AttributeError:
        stat_str[3] = 'F'
    try:
        import torch
    except LookupError:
        stat_str[1] = 'F'
    return {'stat': ''.join(stat_str)}
