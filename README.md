🔐 JScool — High/Extreme JavaScript Obfuscator Vesion 2.0

> Secure your code. Obfuscate with precision.

---

## 🌐 Select your language / Chọn ngôn ngữv

* 🇬🇧 [English](#-english)
* 🇻🇳 [Tiếng Việt](#-tiếng-việt)

---

# 🇬🇧 English

## Overview

**JScool** is a powerful CLI-based JavaScript obfuscator focused on **code protection**, not just visual complexity.

It applies multiple layers of transformation and runtime protection to make reverse engineering significantly harder.

---

## Features

* String encryption (RC4 + Base64)
* Identifier renaming (Unicode-based)
* Control flow flattening
* Anti-debug & anti-proxy protections
* Optional junk/dead code injection
* ...

---

## Installation

```bash
npm install -g tsx
```

---

## Usage

```bash
tsx jscool.mts
```

Then follow CLI prompts:

```text
Enter input JS file path: example.js
Add Anti-Hooking (native function integrity check)? [Y/N]:
Add Junk / Dead Code injection? [Y/N]:
Add Control Flow Flattening (switch / route obfuscation)? [Y/N]: 
```

---

## Output

```
example.obf.js
```

---

## Stars & Roadmap

Support the project by starring ⭐

```
150 |████████████████████████████████████████████████| 🎯
120 |██████████████████████████████████████          |
 90 |███████████████████████████                     |
 60 |██████████████████                              |
 30 |██████████                                      |
  0 |                                                |
```

### Goal

⭐ **150 Stars** → Release:

* JScool v2 (Enhanced Protection)
* Python Obfuscator version

---

## Disclaimer

This tool is intended for **legitimate code protection purposes only**.

---

# 🇻🇳 Tiếng Việt

## Giới thiệu

công cụ obfuscator javascript siêu mạnh 3636% bởi Trương Nhật Bảo Nam (ktn)
---

## Tính năng

* Mã hóa chuỗi (RC4 + Base64)
* Đổi tên biến bằng Unicode
* control flow
* Anti-Debug, Anti-Hooking & proxy
* Có thể thêm junk/dead code
* ...

---

## Cài đặt

```bash
npm install -g tsx
```

---

## Cách dùng

```bash
tsx jscool.mts
```

Sau đó nhập:

```text
Enter input JS file path: ./app.js
Add Anti-Hooking? [Y/N]
Add Junk Code? [Y/N]
```

---

## Output

```
obf.js
```

---

## Stars & Roadmap

Ủng hộ project bằng cách ⭐

```
150 |████████████████████████████████████████████████| 🎯
120 |██████████████████████████████████████          |
 90 |███████████████████████████                     |
 60 |██████████████████                              |
 30 |██████████                                      |
  0 |                                                |
```

### Mục tiêu

⭐ **150 Stars** → Ra mắt:

* JScool v3 (bảo mật nâng cao)
* Phiên bản Python Obfuscator >.<

---

## Lưu ý

Tool được tạo ra nhằm mục đích **bảo vệ mã nguồn hợp pháp**.

---

Code Before
```
function greetUser(name) {
  const message = "Hello, " + name + "!";
  console.log(message);
  return message;
}

greetUser("World");
```

Code After
```
var __INFO__ = {
    'Obfuscator': 'KTN',
    'Obfuscator Owner': 'Trương Nhật Bảo Nam - ktn',
    'Contact': 'https://github.com/Swp-dev/Javascript-Cool',
  };
  /** Generated: 2026-04-19T09:57:15.905Z | https://tanstack-start-app.kingktn.workers.dev/ */
  
;(function _푁る덭e9a73(){

var _朹4べぃそab8=["jcs6Azzzsw==","ksEkAzc="];
function _ビり302e4f(i){
  var _a=typeof atob==='function'?atob:function(x){return Buffer.from(x,'base64').toString('binary');};
  var _k="a798541db7cc3c67",_s=[],_j=0,_i,_r='',_d=_a(_朹4べぃそab8[i]);
  for(_i=0;_i<256;_i++)_s[_i]=_i;
  for(_i=0;_i<256;_i++){_j=(_j+_s[_i]+_k.charCodeAt(_i%_k.length))%256;var _t=_s[_i];_s[_i]=_s[_j];_s[_j]=_t;}
  var _x=0,_y=0;
  for(_i=0;_i<_d.length;_i++){_x=(_x+1)%256;_y=(_y+_s[_x])%256;var _t=_s[_x];_s[_x]=_s[_y];_s[_y]=_t;_r+=String.fromCharCode(_d.charCodeAt(_i)^_s[(_s[_x]+_s[_y])%256]);}
  return _r;
}


(function(){
  function _뽓쩒抧4そ(fn){
    try{
      var s=Function.prototype.toString.call(fn);
      if(!/native code/.test(s))throw 1;
    }catch(e){
      try{debugger;}catch(e2){}
    }
  }
  var _し0鋅9垎=[
    setTimeout,clearTimeout,setInterval,clearInterval,
    JSON.stringify,JSON.parse,
    Object.keys,Object.assign,Object.defineProperty,
    Array.prototype.map,Array.prototype.forEach,Array.prototype.filter,
    Function.prototype.toString,Function.prototype.call,Function.prototype.apply,
    eval,parseInt,parseFloat,decodeURIComponent,encodeURIComponent
  ];
  for(var _i=0;_i<_し0鋅9垎.length;_i++){_뽓쩒抧4そ(_し0鋅9垎[_i]);}
})();


(function(){
  if(typeof window==='undefined')return;
  function _ィ弝d87(){
    if(typeof performance==='undefined'||!performance.now)return;
    var _s=performance.now();debugger;var _d=performance.now()-_s;
    if(_d>100){
      try{if(document&&document.body)document.body.innerHTML='';}catch(e){}
    }
  }
  function _ヵ3ァe3(){
    var _th=160;
    if(window.outerWidth-window.innerWidth>_th||window.outerHeight-window.innerHeight>_th){
      try{debugger;}catch(e){}
    }
  }
  try{_ィ弝d87();}catch(e){}
  try{_ヵ3ァe3();}catch(e){}
})();


(function(){
  if(typeof window==='undefined'||typeof fetch==='undefined')return;
  var _ニe1e探=['https://www.google.com/favicon.ico','https://www.cloudflare.com/favicon.ico'];
  var _纬エ뜎ac=function(){
    var _t=Date.now();
    fetch(_ニe1e探[0],{mode:'no-cors',cache:'no-store'}).then(function(){
      var _d=Date.now()-_t;
      if(_d>3000){
        try{debugger;}catch(e){}
      }
    }).catch(function(){});
  };
  try{
    var _origOpen=XMLHttpRequest.prototype.open;
    var _origSend=XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open=function(){
      this.__jscool_ts=Date.now();
      return _origOpen.apply(this,arguments);
    };
    XMLHttpRequest.prototype.send=function(){
      var _self=this;
      this.addEventListener('load',function(){
        var _cert=_self.getResponseHeader&&_self.getResponseHeader('x-httptoolkit-injected');
        if(_cert){try{debugger;}catch(e){}}
      });
      return _origSend.apply(this,arguments);
    };
  }catch(e){}
  try{_纬エ뜎ac();}catch(e){}
})();


(function(){
  var _h=-1073923503;
  if(typeof _h!=='number'){try{debugger;}catch(e){}}
})();

if(8688<18962){var _レナ4a=null;}
[53,26,95].reverse();
void(677923426^910531213);
try{Object.freeze({a:772});}catch(e){}
[190,230,213,52,150].reverse();
void(732599979^243370012);
[164,103,227,64].reverse();
var _ク訐쀳7='083c2d9c4733'.split('').reverse().join('');
(function __ビcふ(n){if(n<=0)return 0;return n+__ビcふ(n-1);})(0);
var _쁆573=Math.floor(Math.random()*32103);
var _ぶ25ヴ=Math.floor(Math.random()*78016);
try{Object.freeze({a:467});}catch(e){}
var _はe38=Math.floor(Math.random()*3956);
(function __パ쫶模(n){if(n<=0)return 0;return n+__パ쫶模(n-1);})(5);
try{Object.freeze({a:450});}catch(e){}
if(9537<32472){var _ほ鴎귁f=null;}
void(871528037^981620251);
function _鿒4篔碶湆9쨠(_蚳69305ん){const _ユ벂ト1ぱばc=_ビり302e4f(0)+_蚳69305ん+"!";console.log(_ユ벂ト1ぱばc);return _ユ벂ト1ぱばc}(function __끹38(n){if(n<=0)return 0;return n+__끹38(n-1)})(0);(function(){try{throw new Error("63b3c7d8")}catch(e){}})();var _づみ렃に=Math.floor(Math.random()*58780);(function __をbだ(n){if(n<=0)return 0;return n+__をbだ(n-1)})(1);_鿒4篔碶湆9쨠(_ビり302e4f(1));try{Object.freeze({a:97})}catch(e){}[207,77,148].reverse();[7,249,98,200].reverse();var _임89ゎ="22f5daee01be".split("").reverse().join("");void(968971978^396211829);void(typeof _釚6쵊c==="undefined"?12:60);var _셦쏑2f=function(){return Array(16).join("5565")}();if(9170<57389){var _蘒る耧ぃ=null}(function(){try{throw new Error("a051a8e7")}catch(e){}})();var _ヴツ飹쩃=Math.floor(Math.random()*78329);
})();
```
**JScool — Keep your code safe.**

