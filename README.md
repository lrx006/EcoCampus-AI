# 🌱 EcoCampus AI · 校园节能指挥官

> 智慧校园 · 绿色节能 · AI 赋能

基于 **Flask** 与 **scikit-learn** 的校园节能演示 Web 应用：提供能耗预测、环境模拟控制台、节能知识闯关与 AI 周报，采用 Glassmorphism 风格界面，适合课程展示与比赛演示。

---

## ✨ 功能特性

### 🤖 AI 能耗预测

- **线性回归模型**：基于时间（0–24 时）、室外温度、是否节假日，预测校园能耗。
- **REST API**：`POST /api/predict` 接收 JSON 参数，返回预测功率，供前端实时调用。
- **防抖与加载态**：滑块输入 200ms 防抖，请求期间仪表盘显示旋转加载图标，避免卡顿与重复请求。

### 📊 智能监控区

- **环境模拟控制台**：三个滑块调节「时间 / 温度 / 节假日」，实时更新数值显示。
- **实时能耗仪表盘**：Chart.js 半圆仪表盘，根据预测结果动态更新；能耗超过阈值时显示红色警告与脉冲动画。
- **情景预设**：一键应用「工作日白天」「夏季夜晚」「节假日」等情景，快速查看典型场景下的预测。
- **最近预测**：仪表盘下方展示最近 5 次预测记录（时间 / 温度 / 节假日 → 能耗），便于对比。
- **重置按钮**：一键恢复默认参数（12 时、20℃、非节假日）并刷新图表。

### 🎮 节能知识闯关

- **10 关题库**：电池回收、光照调节、空调设定、待机能耗、低碳出行、节约用水、纸张与打印、充电器习惯、楼梯与电梯、垃圾分类，每题含选项与正误解析。
- **卡片翻转**：题目与 AI 解析采用翻转卡片展示，答对显示环保值 +10 与鼓励语，答错显示知识点提示。
- **闯关完成**：展示总分（满分 100），并触发 **canvas-confetti** 五彩纸屑庆祝特效。

### 📄 生成节能周报

- **一键生成**：根据闯关得分请求 `POST /api/report`，弹窗展示评语。
- **DeepSeek 可选**：配置 `DEEPSEEK_API_KEY` 时，由 AI 生成战报式、带 Emoji 与行动指令的评语。
- **本地备用**：未配置或调用失败时，从 25+ 条预设环保评语中随机返回，保证可用性。
- **排版优化**：周报内容使用 `white-space: pre-wrap`，长文本自动换行、段落清晰。

### 💬 节能助手对话

- **无需 API Key**：纯规则匹配、完全本地运行，用户无需注册或配置任何 Key。
- **多意图多回复**：覆盖空调、关灯、电池回收、能耗预测、闯关、周报、成就、贴士、垃圾分类、用水、出行等，每类多条随机回复，对话自然。
- **REST API**：`POST /api/chat` 接收 `{ "message": "用户输入" }`，返回 `{ "reply": "助手回复" }`。

### 🏅 成就徽章与今日数据

- **成就徽章**：首次预测、闯关达人、满分达人、周报生成、探索者、环保粉丝等，完成对应行为后解锁展示。
- **今日数据**：首页展示今日预测次数、闯关最佳、周报生成次数、成就徽章数等，五列等分布局。

### 🎨 界面与交互

- **节能小贴士**：首页标题下方轮播展示节能小知识（约 5 秒切换），强化内容感。
- **导航平滑滚动**：点击导航「首页 / 节能数据 / 知识闯关 / 周报 / 助手」平滑滚动到对应区块，并随滚动高亮当前区块。
- **闯关最佳成绩**：本地保存并展示历史最佳得分，闯关结束页与开始页均可查看。
- **区块入场动画**：智能监控区、闯关区、周报区进入视口时轻微上移淡入，层次更清晰。
- **Glassmorphism 风格**：毛玻璃卡片、渐变背景、轻量科技感网格。
- **Bootstrap 5 + FontAwesome**：响应式布局与图标。
- **移动端适配**：控制台与闯关区在小屏下自适应，翻转卡片高度由内容撑开（Grid 布局）。

---

## 🛠 技术栈

| 类别     | 技术 |
|----------|------|
| 后端     | Python 3、Flask、scikit-learn、pandas、numpy、requests |
| 前端     | HTML5、Bootstrap 5、JavaScript、Chart.js、FontAwesome、canvas-confetti |
| 样式     | CSS3（Glassmorphism、动画、响应式） |
| 对话     | 规则匹配引擎（无需 API Key，完全本地） |
| AI 可选  | DeepSeek API（节能周报文案生成，可选） |

---

## 📦 安装与运行

### 环境要求

- Python 3.9+
- 无数据库依赖，开箱即用

### 安装步骤

```bash
# 克隆或下载项目后进入项目目录
cd 2.12

# 创建虚拟环境（推荐）
python -m venv venv
# Windows
venv\Scripts\activate
# Linux / macOS
# source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 启动服务

```bash
python app.py
```

- 本地访问：<http://127.0.0.1:5000>
- 局域网访问：<http://你的本机IP:5000>（已绑定 `0.0.0.0`，便于演示）

### 可选：DeepSeek 周报

需要 AI 生成周报时，在运行前设置环境变量：

```bash
# Windows (PowerShell)
$env:DEEPSEEK_API_KEY="你的 API Key"

# Linux / macOS
export DEEPSEEK_API_KEY="你的 API Key"
```

未设置或 Key 无效时，将自动使用本地预设评语，无需改代码。

---

## 🌐 部署成网址

可以部署到云平台，获得公网可访问的网址（如 `https://xxx.onrender.com`）。

### 方式一：Render（推荐，有免费额度）

1. 将项目推送到 **GitHub**。
2. 打开 [render.com](https://render.com)，注册并登录，点击 **New → Web Service**。
3. 连接你的 GitHub 仓库，选择本项目所在仓库。
4. 配置：
   - **Build Command**：`pip install -r requirements.txt`
   - **Start Command**：`python app.py`
   - **Environment**：如需 AI 周报，添加变量 `DEEPSEEK_API_KEY`（可选）。
5. 点击 **Create Web Service**，等待构建完成即可获得一个网址。

### 方式二：Railway

1. 打开 [railway.app](https://railway.app)，用 GitHub 登录。
2. **New Project → Deploy from GitHub repo**，选本项目仓库。
3. 自动识别为 Python 后，用默认的 `pip install -r requirements.txt` 和 `python app.py` 即可。
4. 在 **Settings → Networking** 里生成公网域名。

### 方式四：Netlify（静态站 + Serverless 函数）

Netlify **不能直接跑 Flask**，需要把后端改成 **Netlify Functions**（无状态接口），前端在构建时生成静态站并注入接口地址。本项目已写好该方案，按下面步骤即可部署成网址。

1. **本地先跑一次构建**（可选，用于检查）：
   ```bash
   python build_netlify.py
   ```
   会在项目根目录生成 `public/`（含 `index.html` 和 `static/`）。

2. **部署到 Netlify**：
   - 将项目推到 **GitHub**。
   - 打开 [netlify.com](https://www.netlify.com) → **Add new site → Import an existing project**，连接该仓库。
   - **Build command** 填：`python build_netlify.py`  
   - **Publish directory** 填：`public`  
   - **Functions directory** 填：`netlify/functions`（若界面有单独配置）。
   - 在 **Site settings → Environment variables** 中如需 AI 周报，可添加 `DEEPSEEK_API_KEY`（可选）。
   - 部署完成后会得到 `https://xxx.netlify.app` 这类网址。

3. **说明**：
   - 前端会请求 `/.netlify/functions/predict`、`/.netlify/functions/report`、`/.netlify/functions/chat`，由构建脚本自动注入，无需改前端代码。
   - 节能助手对话在 Netlify 使用精简版回复库（`netlify/functions/lib/chat.py`）；完整版在 `app.py`，可自行复制过去。

### 方式三：PythonAnywhere（免费版可长期挂站）

1. 注册 [pythonanywhere.com](https://www.pythonanywhere.com)。
2. **Dashboard → Web** 添加新 Web App，选 **Flask**、Python 版本。
3. 上传项目或从 GitHub **Clone**，在虚拟环境里执行 `pip install -r requirements.txt`。
4. 在 **WSGI 配置文件**里指向你的 `app`（如 `project_home/2.12/app.py` 的 `app`）。
5. **Reload** 后使用站点提供的域名（如 `xxx.pythonanywhere.com`）访问。

### 说明

- 应用已支持从环境变量 **PORT** 读取端口（云平台会自动注入），本机未设置时默认 5000。
- 生产环境建议设置 `FLASK_DEBUG=false` 或不在云上开启 debug。

---

## 📁 项目结构

```
2.12/
├── app.py                 # Flask 入口：路由、/api/predict、/api/report、/api/chat、DeepSeek 可选
├── model.py               # 能耗预测：虚拟数据集、EnergyPredictor 线性回归
├── requirements.txt       # Python 依赖
├── README.md              # 项目说明（本文件）
├── 程序详细说明.md        # 作品框架设计、核心功能模块、任务与工具支持（方案文档）
├── static/
│   ├── css/
│   │   └── style.css      # 全局样式、Glassmorphism、响应式、动画、对话区样式
│   └── js/
│       ├── main.js        # 智能监控：滑块、防抖、Fetch、仪表盘、加载态、情景预设、最近预测、重置
│       ├── quiz.js        # 知识闯关：10 关逻辑、翻转卡片、得分、最佳成绩（localStorage）、confetti
│       ├── report.js      # 周报：请求 /api/report、弹窗展示
│       ├── chat.js        # 节能助手：请求 /api/chat、消息气泡、发送与加载态
│       ├── stats.js       # 今日数据与成就：统计展示、徽章解锁逻辑
│       ├── ui.js          # 界面增强：小贴士轮播、平滑滚动、导航区块高亮
│       └── app.js         # 预留脚本
└── templates/
    └── index.html         # 单页：导航、监控区、闯关区、周报、成就、贴士、节能助手、Modal、脚本引用
```

| 文件 / 目录        | 说明 |
|--------------------|------|
| `app.py`           | 主入口，含 `if __name__ == "__main__"`，可直接 `python app.py` 或右键运行。 |
| `model.py`         | `EnergyPredictor` 训练与 `predict(hour, temp, is_holiday)`。 |
| `static/css/style.css` | 含 `.report-content { white-space: pre-wrap; }` 等周报与全局样式。 |
| `static/js/main.js`    | 仪表盘、防抖、加载图标、重置。 |
| `static/js/quiz.js`   | 闯关流程与 `showEnd()` 内 confetti 撒花逻辑。 |
| `static/js/chat.js`   | 节能助手：发送消息、展示回复、防重复发送与焦点管理。 |
| `static/js/stats.js` | 今日数据更新与成就徽章解锁状态。 |
| `templates/index.html`| 引入 Bootstrap、Chart.js、canvas-confetti、FontAwesome 及本站 JS/CSS。 |
| `程序详细说明.md`    | 作品框架设计、核心功能模块、技术实现与任务工具表（方案文档）。 |

---

## 🔌 API 简要说明

| 方法 | 路径           | 说明 |
|------|----------------|------|
| GET  | `/`            | 首页，渲染单页应用。 |
| POST | `/api/predict` | 能耗预测。Body: `{ "hour": 0–24, "temp": number, "is_holiday": 0\|1 }`，返回 `{ "power": number }`。 |
| POST | `/api/report`  | 节能周报。Body 可选: `{ "score": 0–100 }`，返回 `{ "report": "文本", "score": number }`。 |
| POST | `/api/chat`    | 节能助手对话。Body: `{ "message": "用户输入" }`，返回 `{ "reply": "助手回复" }`（规则匹配，无需 API Key）。 |

---

## 📜 许可与用途

本项目为 **演示 / 教学 / 比赛** 用途，模型使用虚拟数据训练，仅供体验与展示。  
若需商用或二次开发，请根据实际情况替换数据源与合规要求。

---

**EcoCampus AI** — 让校园更绿，从一次预测与一次闯关开始。 🌍
