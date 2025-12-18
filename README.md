# Timeleaf Web

Timeleaf Web is a web application for Timeleaf.

## 启动

```bash
npm i
npm run dev
```

浏览器打开：

- `http://localhost:5173/`

## 后端联调（timeleaf-api）

默认已在 `vite.config.ts` 配置代理：

- `/api` -> `http://127.0.0.1:8080`
- `/v3` -> `http://127.0.0.1:8080`
- `/swagger-ui` -> `http://127.0.0.1:8080`

后端 Swagger：

- `http://localhost:8080/swagger-ui.html`

## 目录结构

```
src/
  router/
  store/
  pages/
  components/
  models/
  utils/
  mock/
  api/
```

## 当前已实现

- 首页时间轴（mock）
- 年龄计算（基于 birthday + shootAt）
- 成长册列表/编辑页雏形（占位）