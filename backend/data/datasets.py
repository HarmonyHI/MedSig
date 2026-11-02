import os
import torch
from torch.utils.data import Dataset

from format_trans import scan_file
from preprocess import nib_load
from .rand import Uniform
from .transforms import Rot90, Flip, Identity, Compose
from .transforms import GaussianBlur, Noise, Normalize, RandSelect
from .transforms import RandCrop, CenterCrop, Pad, RandCrop3D, RandomRotion, RandomFlip, RandomIntensityChange
from .transforms import NumpyType
from .data_utils import pkload

import numpy as np


def fix_paths_bug(ipt):
    for i in range(ipt.__len__()):
        ipt[i] = ipt[i].replace(r'\\', '\\')
        ipt[i] = ipt[i].replace('\\', '\\=')
        group = ipt[i].split('\\')
        del (group[-2])
        ans_path = ''.join(group)
        ans_path = ans_path.replace("=", r'\\')
        ipt[i] = ans_path
    return ipt


class SingleBraTS(Dataset):
    def __init__(self, path, name):
        self.path_dict = {}
        self.modalities = ('flair', 't1ce', 't1', 't2')
        items = scan_file(path, name)
        for item_path in items:
            for key in self.modalities:
                if (key + '.nii.gz') in item_path:
                    self.path_dict[key] = item_path
        self.transforms = eval(
            "Compose([Pad((0, 0, 0, 5, 0)),NumpyType((np.float32, np.int64)),])" or 'Identity()')
        self.names = [name]

    def __getitem__(self, index):
        label = np.array(nib_load(''), dtype='uint8', order='C')
        images = np.stack([
            np.array(nib_load(self.path_dict[modal]), dtype='float32', order='C')
            for modal in self.modalities], -1)
        mask = images.sum(-1) > 0
        for k in range(4):
            x = images[..., k]
            y = x[mask]
            lower = np.percentile(y, 0.2)
            upper = np.percentile(y, 99.8)
            x[mask & (x < lower)] = lower
            x[mask & (x > upper)] = upper
            y = x[mask]
            x -= y.mean()
            x /= y.std()
            images[..., k] = x
        x = images
        y = label
        x, y = x[None, ...], y[None, ...]
        x, y = self.transforms([x, y])
        x = np.ascontiguousarray(x.transpose(0, 4, 1, 2, 3))  # [Bsize,channels,Height,Width,Depth]
        y = np.ascontiguousarray(y)
        x, y = torch.from_numpy(x), torch.from_numpy(y)
        return x, y

    def __len__(self):
        return len(self.names)

    def collate(self, batch):
        return [torch.cat(v) for v in zip(*batch)]


class BraTSDataset(Dataset):
    def __init__(self, list_file, root='', transforms=''):
        paths, names = [], []
        with open(list_file) as f:
            for line in f:
                line = line.strip()
                name = line.split('/')[-1]
                names.append(name)
                path = os.path.join(root, line, name + '_')
                paths.append(path)
        self.names = names
        for i in range(paths.__len__()):
            if paths[i].count('HGG') > 1 or paths[i].count('LGG') > 1:
                paths = fix_paths_bug(paths)
                break
        self.paths = paths
        self.transforms = eval(transforms or 'Identity()')

    def __getitem__(self, index):
        path = self.paths[index]
        goal_path = path + 'data_f32.pkl'
        x, y = pkload(goal_path)
        # nhwtc
        x, y = x[None, ...], y[None, ...]
        x, y = self.transforms([x, y])
        x = np.ascontiguousarray(x.transpose(0, 4, 1, 2, 3))  # [Bsize,channels,Height,Width,Depth]
        y = np.ascontiguousarray(y)
        x, y = torch.from_numpy(x), torch.from_numpy(y)
        return x, y

    def __len__(self):
        return len(self.names)

    def collate(self, batch):
        return [torch.cat(v) for v in zip(*batch)]
