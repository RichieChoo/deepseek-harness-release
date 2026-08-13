# DeepSeek Harness for macOS

DeepSeek Harness 的非官方 macOS 桌面发行版，为 Apple Silicon Mac 提供开箱即用的 DMG 安装包。

> 上游项目：[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
>
> DSH 由 DeepSeek AI 开源和维护。本仓库只负责 Electron 桌面封装与 macOS 构建，不修改 DSH
> 的核心功能，也不是 DeepSeek AI 官方发行版。

## 为什么做这个项目

DeepSeek Harness（`dsh`）目前主要通过 npm 分发，官方推荐使用下面的命令启动 Web UI：

```sh
npx @deepseek-ai/dsh web
```

这种方式适合开发者，但普通 macOS 用户需要预先安装合适版本的 Node.js，并通过终端完成安装和
启动。上游仓库目前也没有提供可直接下载的 macOS DMG Release。

本项目用于补上这个分发缺口：

- 将上游发布的 `@deepseek-ai/dsh` npm 包和运行时一起打包，用户无需安装 Node.js；
- 使用 Electron 启动 DSH Web 服务，并在原生桌面窗口中打开；
- 只监听随机的 `127.0.0.1` 本地端口，不向局域网暴露服务；
- 为 Apple Silicon（`arm64`）生成可安装的 DMG；
- 通过 GitHub Actions 自动构建 Release，并提供 SHA-256 校验文件。

如果你要了解 DSH 的能力、配置、插件系统或参与其开发，请以
[DeepSeek Harness 官方仓库](https://github.com/deepseek-ai/deepseek-harness) 的文档为准。

## 下载与使用

前往本仓库的 [Releases](https://github.com/RichieChoo/deepseek-harness-release/releases) 下载最新的
`DeepSeek-Harness-*-mac-arm64.dmg`，打开后将应用拖入 `Applications`。

当前 Release 没有 Apple Developer ID 签名与公证，因为这两项能力需要付费加入 Apple Developer
Program。macOS 可能因此提示“应用已损坏”或“无法验证开发者”。请按下面的免费临时方案处理。

### 免费临时打开方法

安全起见，只从本仓库的 Releases 下载，并先使用 Release 附带的 `SHA256SUMS.txt` 核对 DMG：

```sh
cd ~/Downloads
shasum -a 256 DeepSeek-Harness-*-mac-arm64.dmg
```

确认输出与 `SHA256SUMS.txt` 一致后，将应用拖入 `Applications`，再打开“终端”执行：

```sh
xattr -dr com.apple.quarantine "/Applications/DeepSeek Harness.app"
open "/Applications/DeepSeek Harness.app"
```

该命令只移除这个应用的下载隔离标记，不会关闭系统级 Gatekeeper。不要对不可信应用使用，也不要
使用 `spctl --master-disable` 等全局关闭安全检查的做法。以后每次下载安装新的未公证版本，都可能
需要重新执行一次 `xattr`。

应用数据保存在 macOS 标准的 Application Support 目录下，即 `DeepSeek Harness/dsh`。

## 系统要求

- Apple Silicon Mac（`arm64`）
- macOS 11 或更高版本

从源码构建还需要 Node.js 22.19+ 和 npm。

## 本地开发

```sh
npm install
npm start
```

## 构建 DMG

```sh
npm ci
npm test
npm run dist:mac
```

产物位于 `dist/DeepSeek-Harness-<version>-mac-arm64.dmg`。

DSH 的用户 Profile 会通过符号链接解析随包插件，而 Node.js ESM 无法沿符号链接进入 ASAR，
因此本项目有意关闭 ASAR。依赖仍随应用完整存放在 `.app/Contents/Resources/app` 内。

应用图标来自上游 DeepSeek Harness 的官方 favicon，并固定到创建本封装时使用的源码版本。

## 发布

推送 `v*` 版本标签后，GitHub Actions 会在 Apple Silicon runner 上构建 DMG，并将 DMG 与
SHA-256 校验文件上传到 GitHub Release。

`package.json` 中的 `@deepseek-ai/dsh` 使用精确版本，以保证每个桌面版本都可以重复构建。

### 为什么没有 Apple 签名与公证

Apple 允许使用免费 Apple Account 和 Xcode 开发、在自己的设备上测试应用；但面向其他用户分发
时，Developer ID 和 Notary Service 只对 Apple Developer Program 会员开放。该计划目前为每年
99 美元或当地等值价格，符合条件的非营利、教育和政府机构可以申请费用减免。

本项目目前选择免费发布未公证 DMG，并提供 SHA-256 校验和及上面的单应用绕过方法。免费证书、
自签名证书或 ad-hoc 签名都不会被其他 Mac 的 Gatekeeper 信任，无法达到正式公证的效果。

如果未来获得 Developer ID，再启用正式签名与公证即可让用户直接双击打开，无需执行 `xattr`。

## 许可证与声明

本项目采用 MIT License。DeepSeek Harness 及其第三方依赖遵循各自的许可证，详见
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

本项目与 DeepSeek AI 没有隶属或官方合作关系。DeepSeek Harness 当前仍处于 developer preview，
可能包含不兼容更新。
