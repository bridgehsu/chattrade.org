---
title: 功能全景
description: 从用户交易到平台运营，认识业务模块之间的关系。
---

<div class="doc-eyebrow">项目介绍 / TGEX KNOWLEDGE BASE</div>

# 功能全景

<div class="doc-lead">从用户交易到平台运营，认识业务模块之间的关系。</div>

## 核心业务

| 业务域 | 主要职责 | 工程对应 |
| --- | --- | --- |
| 用户 | 身份、登录、认证与用户关系 | coinex-user、coinex-user-relation |
| 账务 | 资产账户、余额与资金变动 | coinex-account |
| 现货 | 委托、现货撮合与行情 | coinex-entrust、coinex-match、coinex-market |
| 合约 | 合约委托、撮合与行情 | coinex-contract-entrust、coinex-contract-match、coinex-contract-market |
| 期权 | 周期、方向、订单与结算 | coinex-contract-option-* |
| 钱包 | 链上地址、转账与归集 | coinex-wallet |
| OTC | 广告委托、订单、商家与申诉 | coinex-otc |

## 支撑业务

商户相关能力由 coinex-partner、coinex-partner-admin 等模块承载。机器人、量化、活动、奖励、报表分别可以在 coinex-robot、coinex-quantize、coinex-activity、coinex-raward、coinex-report 中找到对应实现。

模块清单说明的是工程组织方式。一个用户动作往往需要多个模块共同完成，不能把某个目录理解为完整独立的业务闭环。
