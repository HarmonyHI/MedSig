import asyncio
import base64
import datetime
import fnmatch
import json
import os
import shutil
import time
import uuid
from threading import Thread

from channels.generic.websocket import WebsocketConsumer
from format_trans import format_trans, scan_file
from test import get_test_args_and_path, config_test_environment, ready_test_model, ready_test_dataloader, test


class ConnectToPytorch(WebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.identification = uuid.uuid4().hex[0:12]
        self.valid_set = None
        self.is_scoring = None
        self.out_dir = None
        self.valid_loader = None
        self.model = None
        self.msg = None
        self.arg = None
        self.path = None
        self.currentThread = None
        self.connectTestThread = None
        self.data_root_path = "E:\\Project_Python\\TumorSegSystem\\data_dir\\Connect_valid\\"

    def connect(self):
        if not os.path.exists(self.data_root_path):
            os.makedirs(self.data_root_path)
        self.accept()
        returnJson = {
            'message': 'SocketMsg:' + str(datetime.datetime.now())[:-7:],
        }
        self.send(json.dumps(returnJson))

    def receive(self, text_data=None, bytes_data=None):
        pack = json.loads(text_data)
        message = pack['message']
        try:
            data = json.loads(pack['data'])
        except TypeError as e:
            data = None
        if message == 'readyTest':
            self.arg = get_test_args_and_path(self)
            config_test_environment(self.arg, self)
            self.model, self.msg = ready_test_model(self.arg, self)
            self.valid_loader, self.valid_set = (
                ready_test_dataloader(self.arg, self.msg, self.identification, self))
            self.send_message(message + ' SUCCESS')
        elif message == 'startTest':
            try:
                test(self.valid_loader, self.model, self.arg, self.valid_set),
                self.send_message(message + ' SUCCESS')
            except AttributeError as e:
                self.send_message(str(e) + ' FAILURE数据未完整上传？')
            except ValueError as e:
                self.send_message(str(e) + ' FAILURE数据不合法？')
        elif message == 'get_ori_image':
            format_trans(self, mode='ori')
            bands = ["t1", "t1ce", "t2", "flair"]
            for band in bands:
                image_path = self.data_root_path + f"\\{self.identification}_" + band + ".gif"
                try:
                    with open(image_path, 'rb') as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                        returnJson = {
                            'message': message + 'SUCCESS',
                            'data': encoded_string,
                            'filename': band,
                        }
                        self.send(json.dumps(returnJson))
                except FileNotFoundError:
                    print("FAILURE未获取到分割结果" + image_path)
                    self.send_message("FAILURE未获取到分割结果" + image_path)
        elif message == 'get_pred_image':
            format_trans(self, mode='pred')
            bands = ["pred", "mixed_pred"]
            for band in bands:
                image_path = self.data_root_path + f"\\{self.identification}_" + band + ".gif"
                try:
                    with open(image_path, 'rb') as image_file:
                        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                        returnJson = {
                            'message': message + 'SUCCESS',
                            'data': encoded_string,
                            'filename': band,
                        }
                        self.send(json.dumps(returnJson))
                except FileNotFoundError:
                    self.send_message("FAILURE未获取到分割结果" + image_path)
        elif message == 'sendFile':
            fileName = data['fileName']
            fileData = data['fileData']
            file_bytes = bytearray()
            for key, value in fileData.items():
                index = int(key)
                byte_value = value.to_bytes(1, byteorder='big')
                file_bytes.insert(index, byte_value[0])

            path = self.data_root_path + f"\\{self.identification}_{fileName}.nii.gz"
            with open(path, 'wb') as f:
                f.write(file_bytes)
            self.send_message(message + fileName + 'SUCCESS')
        elif message == 'removeFile':
            fileName = data['fileName']
            removeList = scan_file(self.data_root_path, key_word=fileName, key_word2=self.identification)
            for element in removeList:
                os.remove(element)
                self.send_message(message + element + 'SUCCESS')
        else:
            self.send_message(message + 'UNKNOWN')

    def send_message(self, message):
        self.send(text_data=json.dumps({
            'message': message,
        }))

    def remove_items_with_pattern(self):
        items = os.listdir(self.data_root_path)
        for item in items:
            item_path = os.path.join(self.data_root_path, item)
            if self.identification in item:
                if os.path.isdir(item_path):
                    shutil.rmtree(item_path)
                elif os.path.isfile(item_path):
                    os.remove(item_path)

    def disconnect(self, code):
        self.remove_items_with_pattern()
