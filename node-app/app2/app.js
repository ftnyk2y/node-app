//モジュール
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

//ファイルのロード
const indexPage = fs.readFileSync('index.ejs','utf8');
const googlePage = fs.readFileSync('google.ejs','utf8');
const styleCss = fs.readFileSync('style.css','utf8');

//サーバ
let server = http.createServer(start);

server.listen(3000);
console.log('サーバ起動');

//サーバに渡す関数start
function start(request,response) {
  //urlをパースして使える形にする
  let parsedUrl = url.parse(request.url);
  //urlのパスごとにページをルーティングする
  switch (parsedUrl.pathname) {
    case '/':
      let content1 = ejs.render(indexPage,{
        title: 'Index',
        content: 'ここはIndexページです'
      });
      response.writeHead(200,{'Content-Type': 'text/html'});
      response.write(content1);
      response.end();
      break;

    case '/google':
      let content2 = ejs.render(googlePage,{
        title: 'google',
        content: 'ここからgoogle検索に飛びます',
        url1: 'https://www.google.co.jp/',
      });
      response.writeHead(200,{'Content-Type': 'text/html'});
      response.write(content2);
      response.end();
      break;

    default:
      response.writeHead(200,{'Content-Type': 'text/plain'});
      response.end('ページがありません');
      break;
  }
}
