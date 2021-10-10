## 复制可用的Docker脚本

记录一些复制即用的Docker服务脚本，可以写到.zshrc哦。

### MySQL

直接开启一个新的mysql服务：

```shell
#### 先拖镜像，M1记得指定平台，已有忽略 ####
docker pull --platform linux/amd64 mysql:5.7
#########################

#### 无配置文件先执行 ####
docker run --name=mysql -itd -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7

mkdir ~/mysql && mkdir ~/mysql/logs && mkdir ~/mysql/mysql_data

docker cp mysql:/etc/mysql ~/mysql/conf

docker rm -f mysql
#################################

#### 如果已经有配置文件，替换为自己的配置文件、日志、数据
docker run --name=mysql -itd -p 3306:3306 -v ~/mysql:/etc/mysql -v ~/mysql/logs:/logs -v ~/mysql/mysql_data:/mysql_data -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7

docker exec -it mysql /bin/bash
mysql -u root -p 123456
grant all privileges on *.*  to 'root'@'%';
flush privileges;

# mysql8+ 执行：
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
```



### Nginx

```shell
docker run --name mynginx -p 80:80 -d nginx:latest
docker cp mynginx:/etc/nginx/conf.d ~/nginx
docker cp mynginx:/etc/nginx/nginx.conf ~/nginx/nginx.conf
docker cp mynginx:/usr/share/nginx/html ~/nginx
docker cp mynginx:/var/log/nginx ~/nginx/log
docker rm -f mynginx

docker run --name ng-server -p 80:80 -p 443:443 \
-v ~/nginx/conf.d:/etc/nginx/conf.d \
-v ~/nginx/nginx.conf:/etc/nginx/nginx.conf \
-v ~/nginx/html:/usr/share/nginx/html \
-v ~/nginx/log:/var/log/nginx \
-d nginx
```



