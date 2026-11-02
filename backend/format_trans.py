import os
import imageio
import nibabel as nib
import numpy as np
import torchvision.transforms as transforms

import config
from config import web_out_dir


def turn_grey_to_colorful(gray_image):
    rgb_image = np.zeros((gray_image.shape[0], gray_image.shape[1], 3), dtype=np.uint8)
    rgb_image[:, :, :] = gray_image[:, :, np.newaxis]
    green_color = [0, 255, 0]
    red_color = [255, 0, 0]
    blue_color = [0, 0, 255]
    black_color = [0, 0, 0]
    rgb_image[(gray_image == 0)] = black_color
    rgb_image[(gray_image == 1)] = red_color
    rgb_image[(gray_image == 2)] = green_color
    rgb_image[(gray_image == 4)] = blue_color
    return rgb_image


def split_all(path):
    all_parts = []
    while True:
        path, folder = os.path.split(path)
        if folder:
            all_parts.append(folder)
        else:
            if path:
                all_parts.append(path)
            break
    return list(reversed(all_parts))


def mixer(a, b):
    a = np.dstack((a, a, a))
    a[b != 0] = b[b != 0]
    return a


def read_nii(ori_path, colorful=False):
    img = nib.load(ori_path)
    img_data = img.get_fdata()
    images = []
    for i in range(img_data.shape[2]):
        image = img_data[:, :, i]
        if colorful:
            image = turn_grey_to_colorful(image)
        else:
            image = (np.maximum(image, 0) / (image.max() + 1e-10)) * 255.0
            image = np.uint8(image)

        images.append(image)
    return images


def nii_to_gif(ori_path, colorful):
    goal_path = ori_path.replace('.nii.gz', '.gif')
    images = read_nii(ori_path, colorful=colorful)
    imageio.mimsave(goal_path, images, duration=0.03)


def nii_to_png(ori_path, colorful):
    if not config.trans_png:
        return
    images = read_nii(ori_path, colorful=colorful)
    for ii in range(images.__len__()):
        single_path = ori_path.replace('.nii.gz', '') + f'//{ii}.png'
        single_path = single_path.replace('\\', '//')
        if not os.path.exists(os.path.dirname(single_path)):
            os.makedirs(os.path.dirname(single_path))
        transforms.ToPILImage()(images[ii].squeeze()).save(single_path)


def deal_whole_folder(path):
    band_list = ['seg', 't1', 't1ce', 't2', 'flair']
    split_path_arr = split_all(path)
    for band in band_list:
        file_name = os.path.join(*split_path_arr, str(split_path_arr[-1] + f'_{band}.nii.gz'))
        nii_to_gif(file_name, colorful=(band == 'seg'))
        nii_to_png(file_name, colorful=(band == 'seg'))


def nii_to_mixed_gif(background_path, seg_path, flag):
    goal_path = background_path.replace('t1.nii.gz', f'mixed_{flag}.gif')
    back_images = read_nii(background_path, colorful=False)
    seg_images = read_nii(seg_path, colorful=True)
    mix_images = []
    for ii in range(back_images.__len__()):
        mix_images.append(mixer(back_images[ii], seg_images[ii]))
    imageio.mimsave(goal_path, mix_images, duration=0.03)


def nii_to_mixed_png(background_path, seg_path, flag):
    if not config.trans_png:
        return
    goal_path = os.path.dirname(background_path) + f'\\mixed_png_{flag}\\'
    if not os.path.exists(goal_path):
        os.makedirs(goal_path)
    back_images = read_nii(background_path, colorful=False)
    seg_images = read_nii(seg_path, colorful=True)
    mix_images = []
    for ii in range(back_images.__len__()):
        mix_images.append(mixer(back_images[ii], seg_images[ii]))
    for ii in range(mix_images.__len__()):
        single_path = goal_path + f'{ii}.png'
        single_path = single_path.replace('\\', '//')
        transforms.ToPILImage()(mix_images[ii].squeeze()).save(single_path)


def scan_file(dir_path, key_word=None, key_word2=None):
    file_paths = []
    for filename in os.listdir(dir_path):
        file_path = os.path.join(dir_path, filename)
        if os.path.isfile(file_path):
            file_paths.append(file_path)
    FileListB = []
    if key_word is not None:
        for filePath in file_paths:
            if key_word in filePath:
                FileListB.append(filePath)
    else:
        FileListB = file_paths
    if key_word2 is None:
        return FileListB
    else:
        FileListC = []
        for filePath in FileListB:
            if key_word2 in filePath:
                FileListC.append(filePath)
        return FileListC


def format_trans(consumer=None, mode='all'):
    if consumer is not None:
        userId = consumer.identification
    else:
        userId = None
    FileList = scan_file(web_out_dir, userId)
    seg_path = ''
    pred_path = ''
    t1_path = ''
    for filePath in FileList:
        if 'seg.nii.gz' in filePath:
            seg_path = filePath
        if 'pred.nii.gz' in filePath:
            pred_path = filePath
        if 't1.nii.gz' in filePath:
            t1_path = filePath
        if mode == 'all' or mode == 'ori':
            if 'nii.gz' in filePath:
                try:
                    nii_to_png(filePath, 'seg' in filePath or 'pred' in filePath)
                    nii_to_gif(filePath, 'seg' in filePath or 'pred' in filePath)
                except FileNotFoundError:
                    print(FileNotFoundError.strerror)
                    if consumer is not None:
                        consumer.send_message('FAILURE' + str(FileNotFoundError.strerror))
    if mode == 'pred':
        try:
            nii_to_png(pred_path, 'pred' in pred_path)
            nii_to_gif(pred_path, 'pred' in pred_path)
            nii_to_mixed_gif(t1_path, pred_path, 'pred')
            nii_to_mixed_png(t1_path, pred_path, 'pred')
        except FileNotFoundError:
            print(FileNotFoundError.strerror)
            if consumer is not None:
                consumer.send_message('FAILURE' + str(FileNotFoundError.strerror))
    if mode == 'seg':
        try:
            nii_to_png(seg_path, 'seg' in pred_path)
            nii_to_gif(seg_path, 'seg' in pred_path)
            nii_to_mixed_gif(t1_path, seg_path, 'seg')
            nii_to_mixed_png(t1_path, seg_path, 'seg')
        except FileNotFoundError:
            print(FileNotFoundError.strerror)
            if consumer is not None:
                consumer.send_message('FAILURE' + str(FileNotFoundError.strerror))


if __name__ == '__main__':
    format_trans()
