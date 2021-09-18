# github-page部署

## 部署原理：

将单页面项目或静态资源打包到gh-pages分支，则可以通过 https://username.github.io/project 访问静态资源。可以用来部署项目文档、技术博客、客户端渲染的前端项目等。

## 使用github-action自动部署github

### 为项目申请 Token：

![image-20210919000211680](https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/image-20210919000211680.png)

记得给token一个workflow权限：

![image-20210919000915385](https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/image-20210919000915385.png)

成功拿到了个人的验证token，我们需要适用这个token给予github action操控访问repo的权限。

### 给仓库配置环境变量

粘贴生成的公钥至项目的Secrets，配置仓库的secrets环境变量：

![image-20210919001641995](https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/image-20210919001641995.png)

这里命名为ACCESS_TOKEN，此命名影响后面配置github action的action环境变量。

### 编写github action：

1. 运行: 

   ```shell
   $ mkdir .github/workflows & vim .github/workflows/deploy.yml
   ```

2. 以一个 cra 项目为例，粘贴以下面为例的 action：

   ```yaml
   name: new-blog
   
   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]
   
   jobs:
     build:
       runs-on: ${{ matrix.os }} # runs a test on Ubuntu, Windows and macOS
   
       strategy:
         matrix:
           node: [15]
           os: [ubuntu-latest]
   
       steps:
       - uses: actions/checkout@v1
       - name: Use Node.js 15.x
         uses: actions/setup-node@v1
         with:
           node-version: 15.x
   
       - name: yarn install, build
         run: |
           yarn
           yarn build
       - name: Deploy Site
         uses: NickSchimek/deploy_jamstack_action@v1
         with:
            build-dir: dist
            github-token: ${{ secrets.ACCESS_TOKEN }}
            github-actor: ${{ github.actor }}
            github-repo: kilicmu/new-blog
   
         env:
           CI: true
   ```

3. 直接push main分支代码，查看登录github查看repo的github action运行结果即可。

![image-20210919002432643](https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/image-20210919002432643.png)

![image-20210919002454390](https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/image-20210919002454390.png)

就酱~

水了一篇博客，开森。
