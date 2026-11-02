import os
import sys
import time
import logging
import random
import torch
import torch.backends.cudnn as cudnn
import torch.optim
from torch.optim import Adam
from torch.utils.data import DataLoader
import numpy as np
from Loss import FusionLoss
import models
from data.datasets import BraTSDataset
from data.sampler import CycleSampler
from data.data_utils import init_fn
from config import *
from utils import Parser
from predict import AverageMeter
import setproctitle

sys.stderr = sys.stdout
cudnn.benchmark = True


def set_config(parser):
    # --gpu=0,1,2,3 --cfg=saved_model --batch_size=2
    parser.add_argument('-cfg', '--cfg', default='model', type=str,
                        help='Your detailed configuration of the network')
    parser.add_argument('-gpu', '--gpu', default='0', type=str,
                        help='Support one GPU & multiple GPUs.')
    parser.add_argument('-batch_size', '--batch_size', default=2, type=int,
                        help='Batch size')

    args = parser.parse_args()
    return args


def get_train_args_and_path():
    # parser = argparse.ArgumentParser()
    # args = set_config(parser)
    args = set_train_local_config()
    args = Parser(args.cfg).add_args(args)
    # args.net_params.device_ids= [int(x) for x in (args.gpu).split(',')]
    # args.resume = None
    return args


def config_train_environment(args):
    os.environ['CUDA_VISIBLE_DEVICES'] = args.gpu
    assert torch.cuda.is_available(), "Currently, we only support CUDA version"
    torch.manual_seed(args.seed)
    torch.cuda.manual_seed(args.seed)
    random.seed(args.seed)
    np.random.seed(args.seed)
    return args


def ready_train_models(args):
    model = models.DMFNet().cuda()
    optimizer = Adam(model.parameters(), **args.opt_params)
    if train_resume_model_file:
        if os.path.isfile(train_resume_model_file):
            print("=> loading checkpoint '{}'".format(train_resume_model_file))
            checkpoint = torch.load(train_resume_model_file)
            for key in list(checkpoint['state_dict'].keys()):
                if "module." in key:
                    new_key = key.replace("module.", "")
                    checkpoint['state_dict'][new_key] = checkpoint['state_dict'].pop(key)
            args.start_iter = checkpoint['iter']
            model.load_state_dict(checkpoint['state_dict'])
            optimizer.load_state_dict(checkpoint['optim_dict'])
            msg = ("=> loaded checkpoint '{}' (iter {})".format(train_resume_model_file, checkpoint['iter']))
        else:
            msg = "=> no checkpoint found at '{}'".format(train_resume_model_file)
    else:
        msg = '-------------- New training session ----------------'

    msg += '\n' + str(args)
    logging.info(msg)
    return model, optimizer, msg


def ready_train_dataloader(args):
    train_set = BraTSDataset(train_file_list, root=train_dir, transforms=args.train_transforms)
    num_iters = args.num_iters or (len(train_set) * args.num_epochs) // args.batch_size
    num_iters -= args.start_iter
    train_sampler = CycleSampler(len(train_set), num_iters * args.batch_size)
    train_loader = DataLoader(
        dataset=train_set,
        batch_size=args.batch_size,
        collate_fn=train_set.collate,
        sampler=train_sampler,
        num_workers=args.workers,
        pin_memory=True,
        worker_init_fn=init_fn)
    return train_loader, train_set, num_iters


def train_model():
    args = get_train_args_and_path()
    config_train_environment(args)
    model, optimizer, msg = ready_train_models(args)
    train_loader, train_set, num_iters = ready_train_dataloader(args)
    start = time.time()
    batch_nums = len(train_set) / float(args.batch_size)
    losses = AverageMeter()
    torch.set_grad_enabled(True)
    for i, data in enumerate(train_loader, args.start_iter):
        elapsed_bsize = int(i / batch_nums) + 1
        epoch = int((i + 1) / batch_nums)
        setproctitle.setproctitle("Epoch:{}/{}".format(elapsed_bsize, args.num_epochs))
        adjust_learning_rate(optimizer, epoch, args.num_epochs, args.opt_params.lr)
        data = [t.cuda(non_blocking=True) for t in data]
        x, target = data[:2]
        output = model(x)
        if not args.weight_type:
            args.weight_type = 'square'
        loss = FusionLoss(output, target)
        losses.update(loss.item(), target.numel())
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        if (i + 1) % train_save_iter_freq == 0:
            file_name = os.path.join(train_checkpoints_out_dir, 'model_iter_' + str(i + 1) + '.pth')
            torch.save({
                'iter': i, 'state_dict': model.state_dict(), 'optim_dict': optimizer.state_dict()}, file_name)
        msg = 'Iter {0:}, Epoch {1:.4f}/{2:}, Loss {3:.7f}'.format(i + 1, (i + 1) / batch_nums, args.num_epochs,
                                                                   losses.avg)
        logging.info(msg)
        losses.reset()
    i = num_iters + args.start_iter
    file_name = os.path.join(train_checkpoints_out_dir, f'model_last.pth')
    torch.save({
        'iter': i,
        'state_dict': model.state_dict(),
        'optim_dict': optimizer.state_dict(),
    },
        file_name)

    msg = 'total time: {:.4f} minutes'.format((time.time() - start) / 60)
    logging.info(msg)


def adjust_learning_rate(optimizer, epoch, MAX_EPOCHES, INIT_LR, power=0.9):
    for param_group in optimizer.param_groups:
        param_group['lr'] = round(INIT_LR * np.power(1 - epoch / MAX_EPOCHES, power), 8)


if __name__ == '__main__':
    train_model()
