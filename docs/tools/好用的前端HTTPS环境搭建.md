## 简单实用的前端HTTPS环境搭建

我就想搞个本地的 HTTPS 开发环境，网上一堆复制粘贴的博客，要么就是题不达意，要么就是看不懂在说什么。

本来想用 nginx 镜像做反向代理，但是操作了半天感觉自己是个憨憨，灵活性也不够。所以这里我给出一个自己搭建 Web HTTPS 测试环境的方案。

## 步骤

因为需要一个代理服务器做请求转发，最终选择了**Whistle**作为我的本地代理服务器。

运行：

```shell
# 安装：
$ yarn global add whistle
# 启动：
$ w2 start
```

访问：`http://localhost:8899`可以看到如下界面：

![image-20211009193446602](https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/image-20211009193446602.png)

点击上方HTTPS：

![image-20211009193644982](https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/image-20211009193644982.png)

点击二维码，下载根CA证书，双击此证书让系统添加并信任这个证书（windows 百度一下吧）。

![image-20211009194322585](https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/image-20211009194322585.png)

然后就可以愉快地使用whistle代理转发https了，那之前先建立一个SwitchyOmega环境：

![image-20211009194503659](https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/image-20211009194503659.png)

默认将所有的请求转发到whistle。

愉快地使用：

![image-20211009194736152](https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/image-20211009194736152.png)