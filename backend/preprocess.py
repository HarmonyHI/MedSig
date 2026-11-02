import pickle
import os
import numpy as np
import nibabel as nib
from config import preprocess_train_dir, preprocess_valid_file, preprocess_train_file, preprocess_valid_dir
from utils import Parser

args = Parser()
modalities = ('flair', 't1ce', 't1', 't2')


def nib_load(file_name):
    if not os.path.exists(file_name):
        return np.array([1])

    proxy = nib.load(file_name)
    data = proxy.get_data()
    proxy.uncache()
    return data


def normalize(image, mask=None):
    assert len(image.shape) == 3  # shape is [H,W,D]
    assert image[0, 0, 0] == 0  # check the background is zero
    if mask is not None:
        mask = (image > 0)  # The bg is zero

    mean = image[mask].mean()
    std = image[mask].std()
    image = image.astype(dtype=np.float32)
    image[mask] = (image[mask] - mean) / std
    return image


def savepkl(data, path):
    with open(path, 'wb') as f:
        pickle.dump(data, f)


def process_f32(path):
    """ Set all Voxels that are outside of the brain mask to 0"""
    label = np.array(nib_load(path + 'seg.nii.gz'), dtype='uint8', order='C')
    images = np.stack([
        np.array(nib_load(path + modal + '.nii.gz'), dtype='float32', order='C')
        for modal in modalities], -1)
    mask = images.sum(-1) > 0

    for k in range(4):
        x = images[..., k]  #
        y = x[mask]  #

        lower = np.percentile(y, 0.2)  # 算分位数
        upper = np.percentile(y, 99.8)

        x[mask & (x < lower)] = lower
        x[mask & (x > upper)] = upper

        y = x[mask]

        x -= y.mean()
        x /= y.std()

        images[..., k] = x

    output = path + 'data_f32.pkl'
    print("saving:", output)
    savepkl(data=(images, label), path=output)


def doit(root, file_list):
    subjects = open(file_list).read().splitlines()
    names = [sub.split('\\')[-1] for sub in subjects]
    paths = [os.path.join(root, sub, name + '_') for sub, name in zip(subjects, names)]
    for path in paths:
        process_f32(path)


if __name__ == '__main__':
    doit(preprocess_train_dir, preprocess_train_file)
    doit(preprocess_valid_dir, preprocess_valid_file)
