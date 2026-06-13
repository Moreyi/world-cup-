# Football Match Research Dashboard

[English](#english) | [中文](#中文)

A browser-based, multi-factor pre-match research tool for the 2026 World Cup.
Built on real Elo ratings and a transparent factor stack, with English/Chinese
display and Monte Carlo simulation. No build step, no backend.

Live: [worldcup.renrenrenai.cn](https://worldcup.renrenrenai.cn/)

---

## English

### What it does

It estimates win/draw/loss probabilities and tournament outcomes for the 2026
World Cup by layering several real-world factors on top of base Elo, then
running a Monte Carlo simulation. English is the default language; a header
toggle switches the whole UI to Chinese (your choice is remembered).

### Multi-factor model

Probabilities are built by layering these on top of base Elo (displayed Elo is
never overwritten — factors only adjust the probability inputs):

1. **Base Elo** — real eloratings.net values, plus **dynamic Elo** that updates
   from finished results (K=60) so completed games change the odds.
2. **Club / star form** and **policy / external-environment** adjustments.
3. **Market fusion** — blends the model with vig-free bookmaker odds.
4. **Altitude** — Mexico City (2,240m) and Guadalajara (1,566m) give
   acclimatized teams an edge.
5. **Officiating** — a strict card climate widens upset/draw variance.
6. **Climate / heat-stress** — venue heat × humidity × kickoff time × roof gives
   heat-adapted teams an edge under real stress.

### Features

- Win/draw/loss probabilities and a predicted score for every match
- Real 72-match group calendar with venues, kickoff times, and live refresh
- Monte Carlo simulation of the group stage + 32-team knockout
- Dark-horse radar — high-upset matches flagged; a flagship tournament
  dark-horse pick
- Parlay tool — combine picks into a confidence parlay with theoretical odds
  (entertainment/research only)
- Free post-match reports — once a match ends, the prediction-vs-result report
  is shown for free
- Forecast-trend analysis across model stages, editable team ratings, history
  panel (2002–2022), and per-match tactical/coach context
- English-first UI with a one-click Chinese toggle
- Runs entirely in the browser — no build step, no backend

### Usage

Open `index.html`, or serve the folder with any static server:

```bash
python3 -m http.server 8000
npm test   # run the model/factor test suite
```

### Data & accuracy

- Groups verified against public standings (2026-06-12); Elo from
  eloratings.net (2026-06-12). Elo drifts as matches play — ratings are
  editable in the page.
- Finished match results are source-checked before being recorded; per-match
  post-mortems compare model vs market vs actual (with a running Brier score)
  to calibrate the model over the tournament. See `docs/`.
- Not a profit model. Predictions are estimates for entertainment and research
  only — not betting, investment, or financial advice. No affiliation with any
  competition organizer.

---

## 中文

### 这是什么

一个浏览器端、多因子的 2026 世界杯赛前研究工具：在真实 Elo 评分上叠加多个现实
因子,再做蒙特卡洛模拟,给出胜平负概率和赛事走向。**默认英文**,头部一键切换中文
(选择会被记住)。

### 多因子模型

概率在基础 Elo 之上层层叠加(显示的 Elo 不会被改写,因子只调整概率输入):

1. **基础 Elo** — eloratings.net 真实评分,叠加**动态 Elo**(完赛后按 K=60 自更新,
   已结束比赛会改变后续概率)。
2. **俱乐部/球星状态** 和 **政策/外部环境** 修正。
3. **市场赔率融合** — 模型与去水后的博彩盘口加权融合。
4. **海拔** — 墨西哥城(2,240m)、瓜达拉哈拉(1,566m)给适应的球队加成。
5. **裁判判罚** — 判罚趋严会抬升爆冷/平局方差。
6. **气候热应激** — 场地气温 × 湿度 × 开球时间 × 顶棚,给耐热球队在高热下加成。

### 功能

- 每场比赛的胜平负概率 + 预测比分
- 真实 72 场小组赛日程(含场馆、开球时间、实时刷新)
- 小组赛 + 32 强淘汰赛蒙特卡洛模拟
- 黑马雷达 — 高爆冷场次醒目标记 + 一个招牌级年度黑马预测
- 预测串工具 — 把多场组合成"信心串",给理论赔率(仅娱乐/研究)
- 赛后报告免费 — 比赛一结束,预测 vs 实际的报告免费展示
- 模型分阶段走势分析、可编辑球队评分、历史面板(2002–2022)、逐场战术/教练背景
- 英文为主,一键切换中文
- 纯浏览器运行,无构建步骤、无后端

### 使用

直接打开 `index.html`,或用任意静态服务器托管本目录:

```bash
python3 -m http.server 8000
npm test   # 运行模型/因子测试套件
```

### 数据与准确性

- 分组对照公开积分榜核验(2026-06-12);Elo 取自 eloratings.net(2026-06-12)。
  Elo 随比赛漂移,页面里评分可直接编辑。
- 已结束赛果先核对信源再录入;逐场赛后复盘对比 模型 vs 市场 vs 实际(带累计
  Brier 分),在赛事过程中持续校准模型。详见 `docs/`。
- 这不是收益模型。预测是娱乐与数据研究用途的估计,不构成任何投注、投资或财务
  建议,与任何赛事组织无隶属关系。
