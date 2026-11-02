from django.urls import path
from . import views, consumer

urlpatterns = [
    path("hello/", views.hello, name="hello"),
    path("log/", views.log_view, name="log"),
    path("register/", views.create_admin_view, name="register"),
    path("securityCheck/", views.security_check_view, name="securityCheck"),
    path("resetPassword/", views.reset_password_view, name="resetPassword"),

    path("CreateAdmin/", views.create_admin_view, name="CreateAdmin"),
    path('ReadAdmin/', views.read_admin_view, name="ReadAdmin"),
    path("UpdateAdmin/", views.update_admin_view, name="UpdateAdmin"),
    path("DeleteAdmin/", views.delete_admin_view, name="DeleteAdmin"),
    path('CreatePatient/', views.create_patient_view, name="CreatePatient"),
    path('ReadPatient/', views.read_patient_view, name="ReadPatient"),
    path('UpdatePatient/', views.update_patient_view, name="UpdatePatient"),
    path('DeletePatient/', views.delete_patient_view, name="DeletePatient"),

    path("CreateDoctor/", views.create_doctor_view, name="CreateDoctor"),
    path('ReadDoctor/', views.read_doctor_view, name="ReadDoctor"),
    path("UpdateDoctor/", views.update_doctor_view, name="UpdateDoctor"),
    path("DeleteDoctor/", views.delete_doctor_view, name="DeleteDoctor"),

    path("CreateTumorImage/", views.create_tumor_image_view, name="CreateTumorImage"),
    path('ReadTumorImage/', views.read_tumor_image_view, name="ReadTumorImage"),
    path("UpdateTumorImage/", views.update_tumor_image_view, name="UpdateTumorImage"),
    path("DeleteTumorImage/", views.delete_tumor_image_view, name="DeleteTumorImage"),

    path("CreateTumor/", views.create_tumor_view, name="CreateTumor"),
    path('ReadTumor/', views.read_tumor_view, name="ReadTumor"),
    path("ReadTumorPlus/", views.read_tumor_plus_view, name="ReadTumorPlus"),
    path("UpdateTumor/", views.update_tumor_view, name="UpdateTumor"),
    path("DeleteTumor/", views.delete_tumor_view, name="DeleteTumor"),
    path("TransTumor/", views.trans_tumor_view, name="TransTumor"),

    path("CreateTumorType/", views.create_tumor_type_view, name="CreateTumorType"),
    path('ReadTumorType/', views.read_tumor_type_view, name="ReadTumorType"),
    path("UpdateTumorType/", views.update_tumor_type_view, name="UpdateTumorType"),
    path("DeleteTumorType/", views.delete_tumor_type_view, name="DeleteTumorType"),

    path("CreateChatDialog/", views.create_chat_dialog_view, name="CreateChatDialog"),
    path('ReadChatDialog/', views.read_chat_dialog_view, name="ReadChatDialog"),
    path("UpdateChatDialog/", views.update_chat_dialog_view, name="UpdateChatDialog"),
    path("DeleteChatDialog/", views.delete_chat_dialog_view, name="DeleteChatDialog"),

]
websocket_urlpatterns = [
    path('ConnectPyTorch/', consumer.ConnectToPytorch.as_asgi()),
]
