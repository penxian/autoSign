## 夸克网盘自动签到

### 设置全局环境变量cookie
1. settings点击之后左边菜单的Security-> secrets and variables->actions
2. 在下面点击New repository secret
3. name 填写 `COOKIE`, secret填写获取的cookie

### 本地调试
新增一个文件.env
内容是
```text
COOKIE='xxxx'
```
运行命令
```bash
node --env-file .env .\index.mjs
```

### 获取cookie方式
COOKIE获取方法：[Alist获取夸克网盘cookie](https://alist.nn.ci/zh/guide/drivers/quark.html)
