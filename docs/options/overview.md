---
title: 业务概述与版本说明
description: 工程内存在多个期权实现，阅读时必须先确认使用哪套规则。
---

<div class="doc-eyebrow">期权手册 / TGEX KNOWLEDGE BASE</div>

# 业务概述与版本说明

<div class="doc-lead">工程内存在多个期权实现，阅读时必须先确认使用哪套规则。</div>

## 产品与版本 {#versions}

| 工程 | 已确认的结构 |
| --- | --- |
| coinex-contract-option-new-cxex | 订单、涨跌平结果与交割状态相关定义 |
| coinex-contract-option-new-new | 独立期权实现及对应行情模块 |
| coinex-contract-option-touch | 触碰相关字段、周期高低价和结算逻辑 |
| coinex-contract-option-market-* | 各版本配套行情模块 |

这些目录不是同一产品的简单开关。当前生产启用关系尚未核对，因此本文以共有业务流程讲解，并对结果规则保留版本边界。

## 系统架构 {#architecture}

<Flow :steps='["产品与周期配置","用户下单","记录订单规则及参考价","行情与周期处理","结果判定","订单及资产结算"]' />

本工程不能直接按传统标准期权的行权模型描述。首先需要确定方向类、周期类或触碰类的真实业务定义。
