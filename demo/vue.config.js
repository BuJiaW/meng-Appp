module.exports = {
  publicPath: "./",
  // 检测语法错误
  lintOnSave: false,
  devServer: {
    port: 8888,
    open: true,
    https: false,
    host: "localhost",

    proxy: {
      //代理
      [process.env.VUE_APP_SERVER_API]: {
        target: process.env.VUE_APP_SERVER_URL, // 要访问的跨域的域名
        ws: true, // 如果要代理websockets
        changeOrigin: true, // 开启代理
        pathRewrite: {
          // 路径重写
          ["^" + process.env.VUE_APP_SERVER_API]: "" // 使用 `/api` 代替 `target` 要访问的跨域的域名
        }
      }
    }
  }
};
