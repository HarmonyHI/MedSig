import os
import sys
from .service import *
from .settings import USER_AVATAR_ROOT

sys.path.append("..")


def hello(req):
    return JsonResponse(say_hello(json.loads(req.body)))


def create_admin_view(req):
    return JsonResponse(admin_patient_create(json.loads(req.body), True))


def delete_admin_view(req):
    if security_defense(req, [0]):
        return JsonResponse(admin_patient_delete(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def update_admin_view(req):
    if security_defense(req, [0]):
        return JsonResponse(admin_patient_update(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def read_admin_view(req):
    if security_defense(req, [0, 1]):
        return connect_with_vue(admin_patient_read(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def create_patient_view(req):
    if security_defense(req, [0, 1, 2]):
        return JsonResponse(admin_patient_create(json.loads(req.body), False))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def delete_patient_view(req):
    if security_defense(req, [0, 1, 2]):
        return JsonResponse(admin_patient_delete(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def update_patient_view(req):
    if security_defense(req, [0, 1, 2]):
        return JsonResponse(admin_patient_update(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def read_patient_view(req):
    if security_defense(req, [0, 1, 2]):
        return connect_with_vue(admin_patient_read(json.loads(req.body), False))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def create_doctor_view(req):
    if security_defense(req, [0]):
        return JsonResponse(doctor_create(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def delete_doctor_view(req):
    if security_defense(req, [0]):
        return JsonResponse(doctor_delete(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def update_doctor_view(req):
    if security_defense(req, [0, 1]):
        return JsonResponse(doctor_update(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def read_doctor_view(req):
    if security_defense(req, [0, 1, 2]):
        return connect_with_vue(doctor_read(json.loads(req.body), False))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def create_tumor_view(req):
    if security_defense(req, [0, 1]):
        return JsonResponse(tumor_create(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def delete_tumor_view(req):
    if security_defense(req, [0, 1]):
        return JsonResponse(tumor_delete(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def trans_tumor_view(req):
    if security_defense(req, [0, 1]):
        return JsonResponse(tumor_trans(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def update_tumor_view(req):
    if security_defense(req, [0, 1]):
        return JsonResponse(tumor_update(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def read_tumor_view(req):
    if security_defense(req, [0, 1, 2]):
        return connect_with_vue(tumor_read(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def read_tumor_plus_view(req):
    if security_defense(req, [0, 1, 2]):
        return connect_with_vue(tumor_read_plus(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def create_tumor_image_view(req):
    if security_defense(req, [0, 1]):
        file = req.FILES.get('file')
        try:
            file_path = os.path.join(USER_AVATAR_ROOT, file.name)
            with open(file_path, 'wb+') as f:
                f.write(file.read())
                f.close()
        except Exception as e:
            return JsonResponse({'stat': 'ADD_FAIL', 'file': '', 'code': 1, 'msg': str(e)})
        pack = tumor_image_create(json.loads(req.body))
        pack['file'] = file.name
        pack['code'] = 0
        pack['msg'] = "图片上传成功！"
        return JsonResponse(pack)
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def delete_tumor_image_view(req):
    if security_defense(req, [0, 1]):
        return JsonResponse(tumor_image_delete(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def update_tumor_image_view(req):
    if security_defense(req, [0, 1]):
        return JsonResponse(tumor_image_update(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def read_tumor_image_view(req):
    if security_defense(req, [0, 1, 2]):
        return connect_with_vue(tumor_image_read(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def create_tumor_type_view(req):
    if security_defense(req, [0]):
        return JsonResponse(tumor_type_create(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def delete_tumor_type_view(req):
    if security_defense(req, [0]):
        return JsonResponse(tumor_type_delete(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def update_tumor_type_view(req):
    if security_defense(req, [0, 1]):
        return JsonResponse(tumor_type_update(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def read_tumor_type_view(req):
    if security_defense(req, [0, 1, 2]):
        return connect_with_vue(tumor_type_read(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def create_chat_dialog_view(req):
    if security_defense(req, [0, 1, 2]):
        return JsonResponse(chat_dialog_create(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def delete_chat_dialog_view(req):
    if security_defense(req, [0, 1, 2]):
        return JsonResponse(chat_dialog_delete(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def update_chat_dialog_view(req):
    if security_defense(req, [0, 1, 2]):
        return JsonResponse(chat_dialog_update(json.loads(req.body)))
    return JsonResponse({'stat': 'UNSUPPORTED', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def read_chat_dialog_view(req):
    if security_defense(req, [0, 1, 2]):
        return connect_with_vue(chat_dialog_read(json.loads(req.body)))
    return JsonResponse({'stat': 'LOGOUT_STATE', 'SID': '-1', 'userPwd': '-1', 'userType': '-1'})


def security_check_view(req):
    if security_defense(req, [0, 1, 2]):
        return JsonResponse({'stat': 'WELCOME_BACK'})
    else:
        return JsonResponse({'stat': 'NO CERT'})


def reset_password_view(req):
    return connect_with_vue(forget_password(json.loads(req.body)))


def log_view(req):
    return JsonResponse(log_check(json.loads(req.body), False))
