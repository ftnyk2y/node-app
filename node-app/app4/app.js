//参考: 掌田津耶乃『Node.js超入門』2020年7月20日発行

//モジュール
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');
const myModule = require('./module');

//ファイルの読み込み
const indexPage = fs.readFileSync('index.ejs','utf8');
const loginPage = fs.readFileSync('login.ejs','utf8');

//メッセージの保存可能数
const maxNum = 20;
//データの保存用ファイル
const filename = 'data.txt';
//データ
let msgData;
readFromFile(filename);

//サーバ
let server = http.createServer(start);

server.listen(3000);
console.log('サーバ起動');

//サーバに渡す関数start
function start(request,response) {
  let parsedUrl = url.parse(request.url,true);
  //urlのパスによってルーティング
  switch (parsedUrl.pathname) {
    case '/':
      //処理をまとめた関数は後述
      responseIndex(request,response);
      break;

    case '/login':
      responseLogin(request,response);
      break;

    default:
      response.writeHead(200,{'Content-Type': 'text/plain'});
      response.end('ページが見つかりませんでした。');
      break;
  }
}

//loginページのアクセス処理
function responseLogin(request,response) {
  let content = ejs.render(loginPage,{});
  response.writeHead(200,{'Content-Type': 'text/html'});
  response.write(content);
  response.end();
}

//indexページのアクセス処理
function responseIndex(request,response) {
  //POSTアクセス時
  if (request.method == 'POST') {
    let body = '';

    //データ受信時
    request.on('data',function (data) {
      body += data;
    });

    //データ受信終了時
    request.on('end',function() {
      data = qs.parse(body);
      //現在時刻
      let strNow = myModule.makeTimeString(new Date());
      addData(data.id,data.msg,strNow,filename,request); //データの更新,関数は後述
      writeIndex(request,response); //indexページ作成,関数は後述
    });
  } else {
    writeIndex(request,response);
  }
}

//indexページの作成
function writeIndex(request,response) {
  let msg = 'メッセージを書いてください。';
  let content = ejs.render(indexPage,{
    title: 'Index',
    content: msg,
    data: msgData,
    filename: 'data_item',
  });
  response.writeHead(200,{'Content-Type': 'text/html'});
  response.write(content);
  response.end();
}

//テキストファイルのロード
function readFromFile(fname) {
  fs.readFile(fname,'utf8',(err,data) => {
    msgData = data.split('\n');
  })
}

//データの更新
function addData(id,msg,strNow,fname,request) {
  let obj = {'id': id,'msg': msg,'strNow': strNow};
  let objStr = JSON.stringify(obj);
  console.log('add data: ' + objStr);
  msgData.unshift(objStr);
  if (msgData.length > maxNum) {
    msgData.pop();
  }
  saveFile(fname);
}

//データを保存
function saveFile(fname) {
  let dataStr = msgData.join('\n');
  fs.writeFile(fname,dataStr,(err) => {
    if(err) {
      throw err;
    }
  });
}