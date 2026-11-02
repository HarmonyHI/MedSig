# MedSig · 医学影像脑肿瘤分割系统

一套面向脑部 MRI 的肿瘤分割与病例管理系统。医生上传影像后，后端用 3D 分割网络在切片上标出肿瘤区域，前端把影像、分割掩膜和病历信息放在同一个工作台里。

前后端分离：Vue 3 单页应用 + Django（Channels WebSocket）。

> 这是一个课程 / 学习性质的项目，**不具备任何临床可用性**。模型未做外部验证，界面与权限模型也只是演示级别，请不要用于真实诊断。

---

## 功能

**医生工作台**

- MRI 分割：上传影像，通过 WebSocket 流式推给后端，模型逐层推理，前端实时看到分割结果
- 影像管理、肿瘤记录管理（增删改查）
- 患者列表与病历查看
- 病例共享：把病例转给其他医生，附带对话

**管理员**

- 账号管理（管理员 / 医生 / 患者三类角色）
- 肿瘤类型字典维护

**患者**

- 查看自己的影像与诊断记录

---

## 技术栈

| 层 | 选型 |
|---|---|
| 前端 | Vue 3、Vue Router 4、Element Plus、Axios、socket.io-client |
| 后端 | Django 4.2、Django Channels（ASGI + WebSocket）、MySQL 8 |
| 分割 | PyTorch、DMFNet（3D 卷积 + 空间/通道注意力）、nibabel |
| 数据集 | BraTS 2018 脑肿瘤分割 |

---

## 目录结构

```
MedSig/
├── backend/                  Django 服务
│   ├── ClientMain/           配置、路由、视图、WebSocket consumer
│   ├── ClientMainModel/      数据模型（Account / Doctor / Patient / Tumor / TumorImage）
│   ├── data/                 数据加载、采样、变换
│   ├── models.py             DMFNet 网络定义
│   ├── train.py              训练入口
│   ├── predict.py            推理入口
│   ├── preprocess.py         BraTS 数据预处理
│   ├── config.py             路径与训练/推理参数
│   ├── requirements.txt
│   └── .env.example
└── frontend/                 Vue 3 单页应用
    ├── src/views/            登录、管理员、医生、患者各页面
    ├── src/router/           路由表
    └── package.json
```

---

## 快速开始

### 前置

- Python 3.10+
- Node.js 16+
- MySQL 8

### 1. 后端

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

PyTorch 建议按 [官方指引](https://pytorch.org/get-started/locally/) 单独装，以匹配你的 CUDA 版本：

```bash
# 例如在 macOS / 无显卡环境
pip install torch torchvision
```

建库：

```sql
CREATE DATABASE TumorSegDB DEFAULT CHARSET utf8mb4;
```

配置环境变量（口令不再写死在代码里，见 `.env.example`）：

```bash
export DB_NAME=TumorSegDB
export DB_USER=root
export DB_PASSWORD='你的 MySQL 口令'
export DB_HOST=localhost
export DB_PORT=3306
export DJANGO_SECRET_KEY="$(python -c 'from django.core.management.utils import get_random_secret_key as g; print(g())')"
```

初始化并启动：

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 8000
```

装了 Channels 之后 `runserver` 会自动走 ASGI，WebSocket 端点 `/ConnectPyTorch/` 随即可用。

### 2. 前端

```bash
cd frontend
npm install
npm run serve
```

默认起在 `http://localhost:8080`。后端地址目前硬编码为 `localhost:8000`，需要改的话有两个位置：

- `src/main.js` — `axios.defaults.baseURL`
- `src/views/doctor/MRI/MRIDivision.js` — 上传地址与 `ws://` 地址

---

## 分割模型

`backend/models.py` 里的 `DMFNet` 是主干，由 3D 卷积块、空洞卷积块和 `MFunit` / `DMFUnit` 组成，嵌了通道注意力与空间注意力。输入为 240×240×155 的多模态 MRI 体数据，做多类分割。

训练（权重默认落在 `data_dir/checkpoints/model_last.pth`）：

```bash
cd backend
python train.py --cfg model --batch_size 2 --gpu 0
```

推理：

```bash
python predict.py
```

路径与超参都集中在 `backend/config.py`，数据集目录约定为 `backend/data_dir/`（**仓库里不含**）：

```
backend/data_dir/
├── MICCAI_BraTS_2018_Data_Training/   训练集
├── Valid_resource_without_train/      验证集
├── checkpoints/                       模型权重
└── test_output_dir/                   推理输出
```

---

## 配置项

| 环境变量 | 说明 | 默认值 |
|---|---|---|
| `DB_NAME` | 数据库名 | `TumorSegDB` |
| `DB_USER` | 数据库用户 | `root` |
| `DB_PASSWORD` | 数据库口令 | 空 |
| `DB_HOST` | 数据库主机 | `localhost` |
| `DB_PORT` | 数据库端口 | `3306` |
| `DJANGO_SECRET_KEY` | Django 密钥 | 开发占位值 |

---

## 已知限制

这些是当前代码的真实状态，列出来是为了避免误用：

- **开发配置**：`DEBUG = True`、`CORS_ALLOW_ALL_ORIGINS = True`、CSRF 中间件被注释掉。上生产前必须全部收紧
- **口令强度**：用户密码以无盐 MD5 存储（`ClientMain/utils.py` 的 `encrypt`），只能算演示水平，真实场景请换 `make_password` / PBKDF2
- **不含数据与权重**：BraTS 数据集、`.pth` 检查点、推理产物都不在仓库里，需要自行准备
- **接口地址硬编码**：前端把后端写死为 `localhost:8000`，换机器要手动改
- **单机部署假设**：Channel Layer 用的是 `InMemoryChannelLayer`，多进程部署需要换成 Redis
- **无临床验证**：模型未在任何外部数据集上评估过，输出不可作为诊断依据

---

## License

MIT，见 [LICENSE](LICENSE)。
