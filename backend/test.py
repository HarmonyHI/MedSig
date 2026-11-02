import logging
import os
import random

import numpy as np
import torch
import torch.backends.cudnn as cudnn
import torch.optim
from torch.utils.data import DataLoader

import models
from config import test_load_file, test_dir, set_test_local_config, \
    test_from_web_connect, test_file_list, web_out_dir
from data.datasets import BraTSDataset, SingleBraTS
from utils import str2bool, Parser
from predict import validate_softmax

cudnn.benchmark = True


def set_config(parser):
    # # --mode=1 --is_out=True --verbose=True --use_TTA=True --postprocess=True
    # # --snapshot=True --cfg=saved_model --gpu=0
    parser.add_argument('-cfg', '--cfg', default='saved_model', type=str,
                        help='Your detailed configuration of the network')

    parser.add_argument('-mode', '--mode', default=1, type=int, choices=[0, 1, 2],
                        help='0 for cross-validation on the training set; '
                             '1 for validating on the validation set; '
                             '2 for testing on the testing set.')

    parser.add_argument('-gpu', '--gpu', default='0', type=str)

    parser.add_argument('-is_out', '--is_out', default=True, type=str2bool,
                        help='If ture, output the .nii file')

    parser.add_argument('-verbose', '--verbose', default=True, type=str2bool,
                        help='If True, print more infomation of the debuging output')

    parser.add_argument('-use_TTA', '--use_TTA', default=True, type=str2bool,
                        help='It is a postprocess approach.')

    parser.add_argument('-postprocess', '--postprocess', default=True, type=str2bool,
                        help='Another postprocess approach.')

    parser.add_argument('-save_format', '--save_format', default='nii', choices=['nii', 'npy'], type=str,
                        help='[nii] for submission; [npy] for models ensemble')

    parser.add_argument('-snapshot', '--snapshot', default=False, type=str2bool,
                        help='If True, saving the snopshot figure of all samples.')

    args = parser.parse_args()
    return args


def get_test_args_and_path(consumer=None):
    # parser = argparse.ArgumentParser()
    # args = set_config(parser)
    args = set_test_local_config()
    args = Parser().add_args(args)
    args.gpu = str(args.gpu)
    if consumer is not None:
        consumer.send_message("get_test_args_and_path SUCCESS")
    return args


def config_test_environment(args, consumer=None):
    os.environ['CUDA_VISIBLE_DEVICES'] = args.gpu
    assert torch.cuda.is_available(), "Only support CUDA version"
    torch.manual_seed(args.seed)
    torch.cuda.manual_seed(args.seed)
    random.seed(args.seed)
    np.random.seed(args.seed)
    if consumer is not None:
        consumer.send_message("config_test_environment SUCCESS")


def ready_test_model(args, consumer=None):
    Network = getattr(models, args.net)  #
    model = Network(**args.net_params)
    model = torch.nn.DataParallel(model).cuda()
    assert os.path.isfile(test_load_file), "no checkpoint found at {}".format(test_load_file)
    print("=> loading checkpoint '{}'".format(test_load_file))
    checkpoint = torch.load(test_load_file)
    args.start_iter = checkpoint['iter']
    model.load_state_dict(checkpoint['state_dict'])
    msg = ("=> loaded checkpoint '{}' (iter {})".format(test_load_file, checkpoint['iter']))
    print("=> loaded checkpoint '{}' (iter {})".format(test_load_file, checkpoint['iter']))
    msg += '\n' + str(args)
    logging.info(msg)
    if consumer is not None:
        consumer.send_message("ready_test_model SUCCESS")
    return model, msg


def ready_test_dataloader(args=None, msg=None, WebUserId=None, consumer=None):
    if test_from_web_connect:
        valid_set = SingleBraTS(web_out_dir, name=WebUserId)
    else:
        valid_set = BraTSDataset(test_file_list, root=test_dir, transforms=args.test_transforms)
    valid_loader = DataLoader(
        valid_set,
        batch_size=1,
        shuffle=False,
        collate_fn=valid_set.collate,
        num_workers=8,
        pin_memory=True)
    logging.info('-' * 50)
    logging.info(msg)
    if consumer is not None:
        consumer.send_message("ready_test_dataloader SUCCESS")
    return valid_loader, valid_set


def test(valid_loader, model, args, valid_set, consumer=None):
    with torch.no_grad():
        validate_softmax(
            valid_loader,
            model,
            cfg=args.cfg,
            save_format=args.save_format,
            names=valid_set.names,
            verbose=args.verbose,
            use_TTA=args.use_TTA,
            postprocess=args.postprocess,
            cpu_only=False,
            consumer=consumer
        )


def test_model():
    args = get_test_args_and_path()
    config_test_environment(args)
    model, msg = ready_test_model(args)
    valid_loader, valid_set = ready_test_dataloader(args, msg)
    test(valid_loader, model, args, valid_set)


if __name__ == '__main__':
    test_model()
