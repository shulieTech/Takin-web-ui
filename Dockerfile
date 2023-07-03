FROM nginx:1.20.1
# 与宿主机同步时区
RUN cd / && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# 初始化工作空间
WORKDIR /usr/local/nginx/
# 拷贝包
COPY build /usr/local/nginx/dist
