import copy
import logging
import os
import random
from ast import literal_eval
from fractions import Fraction
from os.path import dirname, exists

import torch
import yaml
from torch import nn

from config import utils_log_file, utils_config_file


def str2bool(v):
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise ValueError('Unsupported value encountered.')


class AttrDict(dict):
    def __getattr__(self, name):
        if name in self.__dict__:
            return self.__dict__[name]
        elif name in self:
            return self[name]
        elif name.startswith('__'):
            raise AttributeError(name)
        else:
            self[name] = AttrDict()
            return self[name]

    def __setattr__(self, name, value):
        if name in self.__dict__:
            self.__dict__[name] = value
        else:
            self[name] = value

    def __str__(self):
        return yaml.dump(self.strip(), default_flow_style=False)

    def merge(self, other):
        if not isinstance(other, AttrDict):
            other = AttrDict.cast(other)

        for k, v in other.items():
            v = copy.deepcopy(v)
            if k not in self or not isinstance(v, dict):
                self[k] = v
                continue
            AttrDict.__dict__['merge'](self[k], v)

    def strip(self):
        if not isinstance(self, dict):
            if isinstance(self, list) or isinstance(self, tuple):
                self = str(tuple(self))
            return self
        return {k: AttrDict.__dict__['strip'](v) for k, v in self.items()}

    @staticmethod
    def cast(d):
        if not isinstance(d, dict):
            return d
        return AttrDict({k: AttrDict.cast(v) for k, v in d.items()})


class Identity(nn.Module):
    def forward(self, ipt):
        if isinstance(self, Identity):
            pass
        return ipt


def parse(d):
    # parse string as tuple, list or fraction
    if not isinstance(d, dict):
        if isinstance(d, str):
            try:
                d = literal_eval(d)
            except:
                try:
                    d = float(Fraction(d))
                except:
                    pass
        return d
    return AttrDict({k: parse(v) for k, v in d.items()})


def load(fname):
    with open(fname, 'r') as f:
        ret = parse(yaml.safe_load(f))
    return ret


def setup():
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s %(message)s', filename=utils_log_file)
    console = logging.StreamHandler()
    console.setLevel(logging.INFO)
    console.setFormatter(logging.Formatter('%(asctime)s %(message)s'))
    logging.getLogger('').addHandler(console)


class Parser(AttrDict):
    def __init__(self, cfg_name=''):
        self.add_cfg('PATH')
        if cfg_name:
            self.add_cfg(cfg_name)
            folder_path = dirname(utils_log_file)
            if not exists(folder_path):
                os.makedirs(folder_path)
            if not os.path.isfile(utils_log_file):
                file = open(utils_log_file, "w")
                file.close()
            setup()

    def add_args(self, args):
        self.merge(vars(args))
        return self

    def add_cfg(self, cfg, args=None, update=False):
        if os.path.isfile(cfg):
            fname = cfg
            cfg = os.path.splitext(os.path.basename(cfg))[0]
        else:
            fname = utils_config_file

        self.merge(load(fname))
        self['name'] = cfg

        if args is not None:
            self.add_args(args)

        if cfg and args and update:
            self.save_cfg(fname)

        return self

    def save_cfg(self, fname):
        with open(fname, 'w') as f:
            yaml.dump(self.strip(), f, default_flow_style=False)

    # def getdir(self):
    #     if 'name' not in self:
    #         self['name'] = 'testing'
    #
    #     checkpoint_dir = os.path.join(self.ckpt_dir, self.name)
    #     return checkpoint_dir

    # def makedir(self):
    #     checkpoint_dir = self.getdir()
    #     if not os.path.exists(checkpoint_dir):
    #         os.makedirs(checkpoint_dir)
    #     fname = os.path.join(checkpoint_dir, 'cfg.yaml')
    #     self.save_cfg(fname)
    #
    #     return checkpoint_dir
