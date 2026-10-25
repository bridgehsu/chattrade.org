---
title: 业务概述与系统架构
description: 合约交易的核心是持仓、保证金和风险控制。
---

<div class="doc-eyebrow">合约手册 / TGEX KNOWLEDGE BASE</div>

# 业务概述与系统架构

<div class="doc-lead">合约交易的核心是持仓、保证金和风险控制。</div>

## 产品与术语 {#basics}

开多表达价格上涨方向的持仓，开空表达下跌方向的持仓，平仓终止已有敞口。杠杆影响保证金需求，但不改变同等名义敞口的市场价格波动。

工程的交易模式枚举中可见开多、开空、平多、平空。是否提供某种合约、结算币或保证金模式，应按当前启用产品确认。

## 模块架构 {#architecture}

合约委托、撮合和行情分别可在 coinex-contract-entrust、coinex-contract-match、coinex-contract-market 中找到对应模块。与现货相比，成交后需要处理持仓和保证金，而不是只交换两种资产。

<Flow :steps='["合约委托","交易与风险校验","撮合成交","持仓及保证金更新","盈亏 / 风险 / 行情刷新"]' />
