//モジュールのインポート
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

//ファイルの読み込み
const indexPage = fs.readFileSync('index.ejs','utf8');
const orderPage = fs.readFileSync('order.ejs','utf8');

//サーバ
let server = http.createServer(start);

server.listen(3000);
console.log('サーバ起動');

//サーバに渡すstart関数
function start(request,response) {
  //urlをパースして使いやすい形にする
  let parsedUrl = url.parse(request.url,true) //クエリパラメータも操作対象に？

  //urlのパスごとの処理
  switch (parsedUrl.pathname) {
    //アクセス処理をまとめた関数は後述
    case '/':
      responseIndex(request,response);
      break;

    case '/order':
      responseOrder(request,response);
      break;

    default:
      response.writeHead(200,{'Content-Type': 'text/plain'});
      response.end('ページが見つかりませんでした。');
      break;
  }
}

//indexページのアクセス処理
function responseIndex(request,response) {
  let msg = 'Indexページです。ご注文をどうぞ。'
  let content = ejs.render(indexPage,{
    title: 'Index',
    content: msg,
  });
  response.writeHead(200,{'Content-Type': 'text/html'});
  response.write(content);
  response.end();
}

//orderページのアクセス処理
function responseOrder(request,response) {
  let msg = 'orderページです。'

  //POSTアクセス時
  if (request.method == 'POST') {
    let body = '';

    //データ受信時
    request.on('data',(data) => {
      body += data;
    });

    //データ受信終了時
    request.on('end',() => {
      let postData = qs.parse(body); //bodyのパース
      msg += postData.msg + 'の注文を承りました。来年のクリスマスまでお待ちください。';
      let content = ejs.render(orderPage,{
        title: 'order',
        content: msg,
      });
      response.writeHead(200,{'Content-Type': 'text/html'});
      response.write(content);
      response.end();
    });

    //GETアクセス時
  }　else {
    let msg = 'ページが見つかりませんでした。';
    let content = ejs.render(orderPage,{
      title: 'order',
      content: msg,
    });
    response.writeHead(200,{'Content-Type': 'text/html'});
    response.write(content);
    response.end();
  }
}

