import uuid
from django.db import models


class Stuff(models.Model):
    ID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    SID = models.CharField(max_length=30, blank=False, unique=True, null=False)
    createTime = models.DateTimeField(auto_now_add=True)
    objects = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.SID = str(self.ID)[0:12]


class Account(Stuff):
    email = models.CharField(max_length=30, unique=True, blank=True, null=True)
    phone = models.BigIntegerField(unique=True, blank=True, null=True, default=0)
    password = models.CharField(max_length=64, null=False, blank=False)
    name = models.CharField(max_length=64)
    address = models.CharField(max_length=128, null=True, blank=True)
    gender = models.CharField(max_length=5)
    birthday = models.DateTimeField()
    userType = models.CharField(max_length=32)


class Patient(Account):
    pass


class Admin(Account):
    pass


class Doctor(Account):
    rank = models.FloatField(default=0)
    rankNum = models.IntegerField(default=0)
    adminObject = models.ForeignKey(Admin, related_name='adminObject', on_delete=models.CASCADE)


class TumorType(Stuff):
    tumorName = models.CharField(max_length=64)
    tumorTypeRemark = models.CharField(max_length=1024)


class Tumor(Stuff):
    typeObject = models.ForeignKey(TumorType, on_delete=models.CASCADE)
    malignant = models.BooleanField()
    position = models.CharField(max_length=64)
    size = models.CharField(max_length=64)
    doctorObject = models.ForeignKey(Doctor, related_name='doctorObject',
                                     on_delete=models.CASCADE, null=False, blank=False)
    patientObject = models.ForeignKey(Patient, related_name='patientObject',
                                      on_delete=models.CASCADE, null=False, blank=False)
    foundTime = models.DateTimeField()
    removedTime = models.DateTimeField()
    remark = models.CharField(default=None, max_length=1024, null=True)
    has_remarked = models.BooleanField(default=False)
    waitingTrans = models.BooleanField(default=False)
    transDoctorObject = models.ForeignKey(Doctor, on_delete=models.CASCADE, default=None, null=True)
    transTime = models.DateTimeField(default=None, null=True)


class TumorImage(Stuff):
    originalPicture = models.FileField(upload_to='original_pictures')
    dividedPicture = models.FileField(upload_to='divided_pictures')
    dimension = models.CharField(max_length=64)
    tumorObject = models.ForeignKey(Tumor, on_delete=models.CASCADE)


class ChatDialog(Stuff):
    sendMessage = models.CharField(max_length=1024, blank=True, null=True)
    sendTime = models.DateTimeField(auto_now_add=True)
    sendAccountObject = models.ForeignKey(Account, related_name='sendAccountObject', on_delete=models.CASCADE)
    recvMessage = models.CharField(max_length=1024, blank=True, null=True)
    recvTime = models.DateTimeField(auto_now=True)
    recvAccountObject = models.ForeignKey(Account, related_name='recvAccountObject', on_delete=models.CASCADE)


