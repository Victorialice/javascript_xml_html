sudo /usr/local/apache2/bin/httpd

yamaha.com.cn:   /website/yamaha-app/dev/site/app/mobilesite/
scp -r  root@yamaha.com.cn:/website/yamaha-app/dev/site/app/mobilesite/ /home/bob/workspace/kembo/doc/yamaha/m.yamaha.com.cn/

scp -r  root@yamaha.com.cn:/usr/local/tomcat/apache-tomcat-6.0.20/webapps_yamaha/ROOT/export/sites/default/mobile /home/bob/workspace/kembo/doc/yamaha/m.yamaha.com.cn/

cp -r /home/bob/workspace/kembo/doc/yamaha/m.yamaha.com.cn/mobilesite/ /usr/local/apache2/htdocs/

http://localhost/mobilesite/

cd /usr/local/apache2/htdocs/mobilesite    git
