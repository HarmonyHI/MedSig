import traceback

from django.http import JsonResponse
from django.utils.crypto import md5
from django.utils.timezone import now


def get_avail_birthdays(birthday):
    return str(now().replace(year=int(birthday[0:4]), month=int(birthday[5:7]), day=int(birthday[8:10])))


def get_current_line():
    stack = traceback.extract_stack()
    fileName, line, _, _ = stack[-2]
    return f"{fileName}:{line}"


def encrypt(myStr, encrypted):
    if not encrypted:
        return str(md5(myStr.encode()).hexdigest())
    return myStr


def connect_with_vue(obj):
    if not type(obj) is dict:
        tmp_list = []
        for doc in list(obj):
            doc = dict(vars(doc).items())
            for idx in ('birthday', 'createTime', 'foundTime', 'removedTime', 'transTime', 'sendTime', 'recvTime'):
                try:
                    doc[idx] = str(doc[idx].strftime('%Y-%m-%d %H:%M:%S'))
                except KeyError:
                    pass
                except AttributeError:
                    pass
            del doc['_state']
            tmp_list.append(doc)
        tmp_dict = {'list': tmp_list, 'stat': 'SUCCESS'}
        return JsonResponse(tmp_dict)
    else:
        return JsonResponse(obj)


def pack_check(pack, typ):
    required_fields = {
        'DC': ['logKey', 'logPwd', 'userEmail', 'phone', 'userName', 'address', 'userSex', 'userBirthday', 'userPwd',
               'operateSID'],
        'DR': ['logKey', 'logPwd', 'Key', 'Value'],
        'DU': ['logKey', 'logPwd', 'operateSID', 'SID', 'Key', 'Value'],
        'DD': ['logKey', 'logPwd', 'SID'],
        'PC': ['logKey', 'logPwd', 'userEmail', 'phone', 'userName', 'address', 'userSex', 'userBirthday', 'userPwd',
               'operateSID'],
        'PR': ['logKey', 'logPwd', 'Key', 'Value'],
        'PU': ['logKey', 'logPwd', 'SID', 'Key', 'Value'],
        'PD': ['logKey', 'logPwd', 'SID'],
        'IC': ['logKey', 'logPwd', 'originalPicture', 'dividedPicture', 'dimension', 'tumorSID', 'operateSID',],
        # 'doctorSID'
        'IR': ['logKey', 'logPwd', 'Key', 'Value'],
        'IU': ['logKey', 'logPwd', 'SID', 'Key', 'Value', 'operateSID'],
        'ID': ['logKey', 'logPwd', 'SID', 'doctorSID'],

        'TC': ['logKey', 'logPwd', 'typeSID', 'malignant', 'position', 'size', 'doctorSID', 'patientSID', 'foundTime',
               'removedTime', 'operateSID'],
        'TR': ['logKey', 'logPwd', 'Key', 'Value'],  # , 'doctorSID', 'patientSID' is needed except admin
        'TU': ['logKey', 'logPwd', 'SID', 'Key', 'Value', 'operateSID'],
        'TD': ['logKey', 'logPwd', 'SID', 'operateSID'],

        'EC': ['logKey', 'logPwd', 'tumorName', 'tumorTypeRemark', 'operateSID'],
        'ER': ['Key', 'Value'],
        'EU': ['logKey', 'logPwd', 'SID', 'Key', 'Value', 'operateSID'],
        'ED': ['logKey', 'logPwd', 'SID', 'operateSID'],
    }
    if typ in required_fields:
        for field in required_fields[typ]:
            if field not in pack.keys() or pack[field] == '' or pack[field] == 0:
                return f'{field} NULL'
        return 'OK'
    else:
        return 'Invalid type'


def model_read(pack, model_class):
    if pack['Key'] == '' and pack['Value'] == '':
        return model_class.objects.all()

    readItemKey = pack['Key']
    readItemValue = pack['Value']

    filter_mapping = {
        'userEmail': 'email',
        'phone': 'phone',
        'userName': 'name',
        'address': 'address',
        'userSex': 'gender',
        'userBirthday': 'birthday',
        'rank': 'rank',
        'SID': 'SID',
        'createTime': 'createTime'
    }

    if readItemKey in filter_mapping:
        return model_class.objects.filter(**{filter_mapping[readItemKey]: readItemValue})
    else:
        return {'stat': 'NOT FOUND'}
