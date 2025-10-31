# 安装与更新

## JetBrains

### 安装

1. 打开 JetBrains IDE 并使用 `Cmd + ,` 打开设置。
2. 在侧边栏找到并点击 **Plugins**，找到并点击右上角的 **Manage Plugin Repositories**，添加自定义的插件仓库链接 `https://idekit.sankuai.com/repository/plugins.xml`。

![JetBrains 插件安装](../../assets/jetbrains-install.png)

*按住 Tab 键查看详情*

3. 在插件市场搜索 CatPaw 并安装，之后会在插件页面找到 CatPaw 的图标。

### 登陆

点击右下角的 CatPaw 图标，在弹出的菜单中点击 "请登录"，跳转的浏览器窗口中显示 "登录成功"，说明成功完成登录。

### 更新

点击 IDEA 右下角的 CatPaw，弹出的菜单内的点击"检查更新"即可更新 CatPaw 至最新版本。

## CatPaw IDE

CatPaw IDE 是一款基于 VS Code 打造的 AI Native IDE，为美团开发者提供更智能、更高效、沉浸式的开发体验。

### 注意
使用 agent 功能时需要 power shell app 执行权限下载命令，遵循 Execution Policy，允许 agent 执行命令，如出现 RemoteSigned，即为有效权限。

```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
