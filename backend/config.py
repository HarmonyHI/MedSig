import argparse
test_from_web_connect = True
web_out_dir = '.\\data_dir\\Connect_valid\\'
web_valid_dir = '.\\data_dir\\Connect_valid'
trans_png = False

utils_log_file = './data_dir/log/utils_log.txt'
utils_config_file = './data_dir/utils_config.yaml'

preprocess_train_dir = '.\\data_dir\\MICCAI_BraTS_2018_Data_Training'
preprocess_train_file = '.\\data_dir\\MICCAI_BraTS_2018_Data_Training\\all.txt'

preprocess_valid_dir = '.\\data_dir\\Valid_resource_without_train'
preprocess_valid_file = '.\\data_dir\\Valid_resource_without_train\\valid_list.txt'

test_load_file = './data_dir/checkpoints/model_last.pth'
test_dir = '.\\data_dir\\Valid_resource_without_train'
test_file_list = '.\\data_dir\\Valid_resource_without_train\\valid.txt'

test_output = True
save_npy_dir = './data_dir/test_output_dir'
save_png_dir = './data_dir/test_output_dir'
save_nii_dir = './data_dir/test_output_dir'

train_dir = '.\\data_dir\\MICCAI_BraTS_2018_Data_Training'
train_file_list = '.\\data_dir\\MICCAI_BraTS_2018_Data_Training\\all.txt'
train_resume_model_file = './data_dir/checkpoints/model_last.pth'
train_checkpoints_out_dir = './data_dir'
train_save_iter_freq = 1000
is_scoring = False
abl = True


def set_test_local_config():
    args = argparse.Namespace()
    args.cfg = 'model'
    args.mode = 1
    args.gpu = '0'
    args.is_out = True
    args.verbose = True
    args.use_TTA = True
    args.postprocess = True
    args.save_format = 'nii'
    args.snapshot = True
    return args


def set_train_local_config():
    args = argparse.Namespace()
    args.cfg = 'model'
    args.gpu = '0'
    args.batch_size = 2
    return args
