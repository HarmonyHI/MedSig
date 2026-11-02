import logging
import os
import time
import nibabel as nib
import numpy as np
import torch.backends.cudnn as cudnn
import torch.nn.functional as F
from config import save_npy_dir, is_scoring, test_output, save_nii_dir, test_from_web_connect, web_out_dir

cudnn.benchmark = True


def dice_score(o, t, eps=1e-8):
    num = 2 * (o * t).sum() + eps  #
    den = o.sum() + t.sum() + eps  # eps
    # print(o.sum(),t.sum(),num,den)
    print('All_voxels:240*240*155 | numerator:{} | denominator:{} | pred_voxels:{} | GT_voxels:{}'.format(int(num),
                                                                                                          int(den),
                                                                                                          o.sum(),
                                                                                                          int(t.sum())))
    return num / den


def softmax_output_dice(output, target):
    ret = []

    # whole
    o = output > 0
    t = target > 0  # ce
    ret += dice_score(o, t),
    # core
    o = (output == 1) | (output == 3)
    t = (target == 1) | (target == 4)
    ret += dice_score(o, t),
    # active
    o = (output == 3)
    t = (target == 4)
    ret += dice_score(o, t),

    return ret


keys = 'whole', 'core', 'enhancing', 'loss'


def validate_softmax(
        valid_loader,
        model,
        cfg='',
        names=None,  # The names of the patients orderly!
        verbose=False,
        use_TTA=False,  # Test time augmentation, False as default!
        save_format=None,  # ['nii','npy'], use 'nii' as default. Its purpose is for submission.
        postprocess=False,  # when use postprocess, the score of dice_ET would be changed.
        cpu_only=False,
        consumer=None
):
    assert cfg is not None
    H, W, T = 240, 240, 155
    model.eval()
    runtimes = []
    vals = AverageMeter()
    for i, data in enumerate(valid_loader):
        if consumer is not None:
            consumer.send_message("testing..., iter", str(i))
        target_cpu = data[1][0, :H, :W, :T].numpy() if is_scoring else None
        # when validing, make sure that argument 'scoring' must be false, else it raise a error!

        if not cpu_only:
            data = [t.cuda(non_blocking=True) for t in data]
        x, target = data[:2]
        # compute output
        if not use_TTA:
            # torch.cuda.synchronize()
            start_time = time.time()
            logit = model(x)
            # torch.cuda.synchronize()
            elapsed_time = time.time() - start_time
            runtimes.append(elapsed_time)
            output = F.softmax(logit, dim=1)
        else:
            start_time = time.time()
            logit = F.softmax(model(x), 1)  # 000
            logit += F.softmax(model(x.flip(dims=(2,))).flip(dims=(2,)), 1)
            logit += F.softmax(model(x.flip(dims=(3,))).flip(dims=(3,)), 1)
            logit += F.softmax(model(x.flip(dims=(4,))).flip(dims=(4,)), 1)
            logit += F.softmax(model(x.flip(dims=(2, 3))).flip(dims=(2, 3)), 1)
            logit += F.softmax(model(x.flip(dims=(2, 4))).flip(dims=(2, 4)), 1)
            logit += F.softmax(model(x.flip(dims=(3, 4))).flip(dims=(3, 4)), 1)
            logit += F.softmax(model(x.flip(dims=(2, 3, 4))).flip(dims=(2, 3, 4)), 1)
            output = logit / 8.0  # mean
            elapsed_time = time.time() - start_time
            runtimes.append(elapsed_time)

        output = output[0, :, :H, :W, :T].cpu().numpy()
        output = output.argmax(0)  # (channels,height,width,depth)

        if postprocess:
            ET_voxels = (output == 3).sum()
            if ET_voxels < 500:
                output[np.where(output == 3)] = 1

        msg = 'Subject {}/{}, '.format(i + 1, len(valid_loader))
        name = str(i)
        if names:
            name = names[i]
            msg += '{:>20}, '.format(name)
        redirect_nii_dir = (web_out_dir if test_from_web_connect else save_nii_dir)
        if test_output:
            assert save_format in ['npy', 'nii']
            if save_format == 'npy':
                np.save(os.path.join(save_npy_dir, str(name + '_pred')), output)
            if save_format == 'nii':
                oname = os.path.join(redirect_nii_dir, name + '_pred.nii.gz')
                seg_img = np.zeros(shape=(H, W, T), dtype=np.uint8)
                seg_img[np.where(output == 1)] = 1
                seg_img[np.where(output == 2)] = 2
                seg_img[np.where(output == 3)] = 4
                if verbose:
                    print('病例:', name, '坏疽NET:', np.sum(seg_img == 1), ' | 浮肿ED:', np.sum(seg_img == 2),
                          ' | 全肿瘤WT:', np.sum((seg_img == 1) | (seg_img == 2) | (seg_img == 4)),
                          ' | TC肿瘤核心:', np.sum((seg_img == 1) | (seg_img == 4)), ' | ET增强:', np.sum(seg_img == 4))
                nii_dir = os.path.dirname(oname)
                if not os.path.isdir(nii_dir):
                    os.makedirs(nii_dir)
                nib.save(nib.Nifti1Image(seg_img, None), oname)
                print("病例", name, "已创建nii于", redirect_nii_dir)

        if is_scoring:
            scores = softmax_output_dice(output, target_cpu)
            vals.update(np.array(scores))
            msg += ', '.join(['{}: {:.4f}'.format(k, v) for k, v in zip(keys, scores)])

        logging.info(msg)

    if is_scoring:
        msg = 'Average scores:'
        msg += ', '.join(['{}: {:.4f}'.format(k, v) for k, v in zip(keys, vals.avg)])
        logging.info(msg)

    computational_runtime(runtimes)

    model.train()
    return vals.avg


def computational_runtime(runtimes):
    # remove the maximal value and minimal value
    runtimes = np.array(runtimes)
    maxvalue = np.max(runtimes)
    minvalue = np.min(runtimes)
    nums = runtimes.shape[0] - 2
    meanTime = (np.sum(runtimes) - maxvalue - minvalue) / nums
    fps = 1 / meanTime
    print('mean runtime:', meanTime, 'fps:', fps)


class AverageMeter(object):
    """Computes and stores the average and current value"""

    def __init__(self):
        self.reset()
        self.val = 0
        self.avg = 0
        self.sum = 0
        self.count = 0

    def reset(self):
        self.val = 0
        self.avg = 0
        self.sum = 0
        self.count = 0

    def update(self, val, n=1):
        self.val = val
        self.sum += val * n
        self.count += n
        self.avg = self.sum / self.count
