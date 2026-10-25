---
title: 技术栈
description: 按技术承担的职责理解系统，而不是只记住组件名称。
---

<div class="doc-eyebrow">项目介绍 / TGEX KNOWLEDGE BASE</div>

# 技术栈

<div class="doc-lead">按技术承担的职责理解系统，而不是只记住组件名称。</div>

## 已观察到的技术组成

工程以 Java、Maven、Spring Boot 2.x 和 Dubbo 为主要服务基础；数据访问使用 MyBatis。配置与基础设施中可见 Apollo、Redis、RocketMQ、Netty 和 Elasticsearch 相关组件。具体版本应以各独立服务的依赖清单为准。

## 各层职责

| 层次 | 解决的问题 |
| --- | --- |
| HTTP 接入 | 接收用户与后台请求，进行鉴权和参数检查 |
| Dubbo 服务 | 提供跨业务域的远程能力 |
| 业务与计算 | 订单规则、账户变动、撮合和结算 |
| MySQL / MyBatis | 业务记录与持久化数据访问 |
| Redis | 缓存、共享状态与业务辅助机制 |
| MQ / Netty | 异步事件传递与实时数据通信 |

## 选型与边界

远程调用、消息发送和数据库事务拥有不同的失败方式。不能因为服务都由 Spring 管理，就认为一次请求内的所有动作会一起回滚。架构设计必须明确事实记录、响应超时和后续恢复之间的关系。
