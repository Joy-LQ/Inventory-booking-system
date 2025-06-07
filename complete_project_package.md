# 房产检查预约系统

一个优雅的房产检查预约管理系统，支持客户在线预约和后台管理。

## ✨ 功能特性

- 🏠 **客户预约系统**：直观的预约流程，支持日期时间选择
- 📱 **响应式设计**：完美适配手机和桌面端
- 🎨 **美丽界面**：渐变配色和毛玻璃效果
- 📅 **智能调度**：防止时间冲突，已确认预约自动屏蔽
- 🔧 **后台管理**：订单管理、日历视图、系统设置
- 📊 **数据统计**：实时显示预约状态统计

## 🚀 快速开始

### 在线体验
访问：[https://your-domain.vercel.app](https://your-domain.vercel.app)

### 本地运行
1. 克隆仓库：
```bash
git clone https://github.com/yourusername/property-booking-system.git
cd property-booking-system
```

2. 打开 `index.html` 即可使用

## 💻 技术栈

- **前端**：纯HTML + CSS + JavaScript
- **样式**：Tailwind CSS
- **部署**：Vercel
- **数据**：内存存储（演示版）

## 📱 使用说明

### 客户端功能
1. **填写基本信息**：姓名、联系方式、地址等
2. **选择服务类型**：期中检查、期末检查、实地看房、连线看房
3. **选择预约时间**：可视化日期时间选择
4. **获得订单号**：INV-JOYA-XXX 格式

### 后台管理
- **登录密码**：`admin123`
- **订单管理**：查看、确认、取消预约
- **日历视图**：直观显示预约分布
- **系统设置**：自定义欢迎语和提示信息

## 🔧 配置

### 环境变量（生产环境）
```env
# 将来如需数据库连接
DATABASE_URL=your_database_url
EMAIL_API_KEY=your_email_api_key
```

### Vercel配置
项目已包含 `vercel.json` 配置文件，支持一键部署。

## 📁 项目结构

```
property-booking-system/
├── index.html          # 主应用文件
├── README.md           # 项目说明
├── package.json        # 项目配置
├── vercel.json         # Vercel部署配置
└── .gitignore          # Git忽略文件
```

## 🎯 部署到Vercel

### 方法一：GitHub连接
1. Fork此仓库到你的GitHub
2. 在Vercel中连接GitHub仓库
3. 选择项目并部署

### 方法二：Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 方法三：拖放部署
直接将项目文件夹拖放到 [Vercel部署页面](https://vercel.com/new)

## 🔄 后续开发

### 数据库集成
推荐使用：
- **Vercel Postgres**：免费版足够使用
- **PlanetScale**：MySQL兼容
- **Supabase**：开源替代方案

### 邮件服务
推荐使用：
- **Resend**：现代邮件API
- **SendGrid**：传统可靠选择

### 身份验证
推荐使用：
- **Vercel Auth**：简单集成
- **Auth0**：企业级方案

## 📊 性能优化

- 静态文件，加载速度极快
- 响应式图片优化
- 压缩CSS/JS资源
- CDN全球分发

## 🛠 自定义配置

### 修改配色方案
在 `index.html` 的 `<style>` 部分修改CSS变量：

```css
:root {
  --primary-color: #1e3a8a;
  --secondary-color: #f59e0b;
  --background-gradient: linear-gradient(135deg, #1e3a8a 0%, #f59e0b 100%);
}
```

### 修改时间段
在JavaScript部分修改 `timeSlots` 数组：

```javascript
const timeSlots = ['09:00-10:30', '10:30-12:00', '14:00-15:30'];
```

### 修改工作日
在 `generateAvailableDates()` 函数中修改：

```javascript
// 当前：周一到周五 (1-5)
if (date.getDay() >= 1 && date.getDay() <= 5) {
  // 改为周一到周六 (1-6)
  // if (date.getDay() >= 1 && date.getDay() <= 6) {
}
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

### 开发规范
- 使用语义化提交信息
- 确保代码格式化
- 添加适当的注释

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👥 作者

- **设计开发**：傅时晏 (Claude)
- **产品需求**：林乔 (Joy)

## 🙏 致谢

感谢以下技术和服务：
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Vercel](https://vercel.com/) - 部署平台
- [GitHub](https://github.com/) - 代码托管

---

**快速部署链接**：[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/property-booking-system)

如有问题，请联系：[your-email@example.com](mailto:your-email@example.com)