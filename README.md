<p align="center">
<img src="examples/jscool.jpg" width="400">
</p>

<h1 align="center">Javascript Cool</h1>

<p align="center">
Advanced JavaScript Obfuscator for protecting source code (Open-Source).
</p>

<p align="center">

![stars](https://img.shields.io/github/stars/Swp-dev/Javascript-Cool?logo=github)
</p>


🔐 JScool — High/Extreme JavaScript Obfuscator Vesion 5.0

> Secure your code. Obfuscate with precision.

---

## 🌐 Select your language / Chọn ngôn ngữ

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
* AST Transformation
* Identifier renaming (Unicode-based)
* Control flow flattening
* VM Protection
* Anti-Proxy / Network Detection
* Anti-Hook / Anti-Tamper / Anti -Debug
* Self-Defending / Integrity Check
* Optional junk/dead code injection
* ...

---

## Installation (optional)

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

* String encryption (RC4 + Base64)
* AST Transformation
* Identifier renaming (Unicode-based)
* Control flow flattening
* VM Protection
* Anti-Proxy / Network Detection
* Anti-Hook / Anti-Tamper / Anti -Debug
* Self-Defending / Integrity Check
* Optional junk/dead code injection
* ...

---

## Cài đặt (không bắt buộc)

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
    'Contact': 'https://github.com/Swp-dev/Javascript-Cool/'
  };
  /** Generated: 2026-05-16T05:28:03.333Z | https://tanstack-start-app.kingktn.workers.dev/ */
  
;(async function _い尧dc0418(){

var _뉃d76ゖヵイ2=[[1,"a6a9c9ea7bd8dd9",("==QLc9"+"QVOoRQ")],[1,"f3726847719b2a0","==wR"],[2,"331e5194d61f78",("UXQ"+"ICw"+"==")],[0,"98b8239a3b32",("=oeE"+"HLdC")],[2,"3270c38a6",("UnplAAB7dVd6SgsEVFBQTT"+"sECkRtAhtfdAx4RVBkCQ5q"+"YDtGagAORS9eVAtURA8K")],[2,"9ff188bcd7dcbb7947",("WwteRW"+"EKWxoH"+"QFle")],[3,"d0d13573dca8",("dEXdcr"+"kps+g=")],[1,"0cf419614e204de9",("==AW"+"JIAV")],[2,"ec4ca6c0941",("ACAFDAV+MUddcwg"+"TAXMXEVIgAUlWXB"+"UPbVAzWjlxBAk=")]],_べぱa1摌ヂ={};
(function(arr,n){if(!n)return;var x=function(){return arr.push(arr.shift())};while(n-- >0)x()})(_뉃d76ゖヵイ2,7);
function _婗4fが0炬0ホ(i){
  var _펶쇿汞쯅8=7;
  var _len=_뉃d76ゖヵイ2.length;
  var _i=((((i|0)-_펶쇿汞쯅8)%_len)+_len)%_len;
  if(_べぱa1摌ヂ[_i])return _べぱa1摌ヂ[_i];
  var _hasAtob=(typeof atob==='function');
  var _hasBuf=(typeof Buffer!=='undefined'&&Buffer&&typeof Buffer.from==='function');
  var _a=_hasAtob?atob:(_hasBuf?function(x){return Buffer.from(x,'base64').toString('binary')}:function(x){return x});
  var _u=function(x){try{return decodeURIComponent(escape(x))}catch(e){return _hasBuf?Buffer.from(x,'binary').toString('utf8'):x}};
  var _r=function(x){return x.split('').reverse().join('')};
  var _x=function(d,k){var o='';for(var i=0;i<d.length;i++)o+=String.fromCharCode(d.charCodeAt(i)^k.charCodeAt(i%k.length));return o};
  var _q=function(k,d){var s=[],j=0,i,r='',x=0,y=0,t;for(i=0;i<256;i++)s[i]=i;for(i=0;i<256;i++){j=(j+s[i]+k.charCodeAt(i%k.length))&255;t=s[i];s[i]=s[j];s[j]=t}for(i=0;i<d.length;i++){x=(x+1)&255;y=(y+s[x])&255;t=s[x];s[x]=s[y];s[y]=t;r+=String.fromCharCode(d.charCodeAt(i)^s[(s[x]+s[y])&255])}return r};
  var _v=_뉃d76ゖヵイ2[_i],_m=_v[0],_k=_v[1],_d=_v[2],_o='';
  if(_m===0)_o=_u(_q(_k,_x(_a(_r(_d)),_r(_k))));
  else if(_m===1)_o=_r(_u(_x(_a(_r(_d)),_k)));
  else if(_m===2)_o=_u(_a(_x(_a(_d),_k)));
  else _o=_r(_u(_q(_k,_a(_d))));
  return _べぱa1摌ヂ[_i]=_o;
}


(function(){
  var _嬀78ebを=[209,109,103,168,9,76,74,118,228,190,244,163,35,0,35,4,35,8,35,12,35,15,154,4,5,6,85,7,8,234,82,247];
  var _ねた2講=0,_か테4e=0,_묽48ぴ=0;
  var _ざや9쬗6=null,_덫bb훗솿=null;
  var _プの97=typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:typeof self!=='undefined'?self:null;
  var _ぺチ쒪お=typeof console!=='undefined'?console:{log:function(){},warn:function(){},error:function(){}};

  var _ペ을か짩=(function(){try{var _ua=(typeof navigator!=='undefined'&&navigator.userAgent)||'';return /Mobi|Android|iPhone|iPad|iPod|Touch|Tablet/i.test(_ua)||(typeof navigator!=='undefined'&&(navigator.maxTouchPoints|0)>1)}catch(e){return false}})();

  var _쏋カ0ク麝=(function(){try{return Function.prototype.toString}catch(e){return null}})();
  var _ピ목b1=function(m){var lim=Math.min(m|0,100000);if(_ペ을か짩)lim=Math.min(lim,8000);var x=0;for(var i=0;i<lim;i++)x=((x<<1)^(i+x))|0;return x};
  var _ヂ릪攈켢=function(fn){
    if(!fn)return;
    try{

      var s='';
      if(_쏋カ0ク麝){s=_쏋カ0ク麝.call(fn)}else{s=Function.prototype.toString.call(fn)}
      if(s.indexOf('[native code]')<0)throw 1;

      if(fn.toString&&fn.toString!==Function.prototype.toString&&typeof fn.toString==='function'){
        var s2=_쏋カ0ク麝?_쏋カ0ク麝.call(fn.toString):Function.prototype.toString.call(fn.toString);
        if(s2.indexOf('[native code]')<0)throw 2;
      }
    }catch(e){try{debugger}catch(e2){}}
  };
  var _緪골e낖튵=[
    typeof setTimeout!=='undefined'?setTimeout:null,
    typeof clearTimeout!=='undefined'?clearTimeout:null,
    typeof setInterval!=='undefined'?setInterval:null,
    typeof clearInterval!=='undefined'?clearInterval:null,
    typeof JSON!=='undefined'?JSON.stringify:null,
    typeof JSON!=='undefined'?JSON.parse:null,
    typeof Object!=='undefined'?Object.keys:null,
    typeof Object!=='undefined'?Object.assign:null,
    typeof Object!=='undefined'?Object.defineProperty:null,
    typeof Array!=='undefined'?Array.prototype.map:null,
    typeof Array!=='undefined'?Array.prototype.forEach:null,
    typeof Array!=='undefined'?Array.prototype.filter:null,
    typeof Function!=='undefined'?Function.prototype.toString:null,
    typeof Function!=='undefined'?Function.prototype.call:null,
    typeof Function!=='undefined'?Function.prototype.apply:null,
    typeof eval!=='undefined'?eval:null,
    typeof parseInt!=='undefined'?parseInt:null,
    typeof parseFloat!=='undefined'?parseFloat:null,
    typeof decodeURIComponent!=='undefined'?decodeURIComponent:null,
    typeof encodeURIComponent!=='undefined'?encodeURIComponent:null
  ];
  var _バcログ2あ=function(){
    var _쓹醄ぅゴ=0;
    while(_쓹醄ぅゴ<_嬀78ebを.length){
      var _op=_嬀78ebを[_쓹醄ぅゴ++];

      if(_op===75){}
      else if(_op===103){if(_プの97===null||typeof window==='undefined')return;}
      else if(_op===68){if(typeof document==='undefined')return;}
      else if(_op===9){try{debugger}catch(e){}}
      else if(_op===168){try{_ねた2講=typeof performance!=='undefined'&&performance.now?performance.now():Date.now()}catch(e){}}
      else if(_op===76){
        try{
          var _d=(typeof performance!=='undefined'&&performance.now?performance.now():Date.now())-_ねた2講;
          if(_d>(_ペ을か짩?500:120)){for(var _qi=0;_qi<3;_qi++){try{debugger}catch(e){}_ピ목b1(_ペ을か짩?6000:60000+_qi*30000)}}
        }catch(e){}
      }
      else if(_op===74){_ピ목b1(32)}
      else if(_op===190){try{_ピ목b1(_ペ을か짩?((Math.random()*256)|0):((Math.random()*2048)|0)+256)}catch(e){}}
      else if(_op===118){
        try{
          if(_プの97&&((_プの97.outerWidth-_プの97.innerWidth)>160||(_プの97.outerHeight-_プの97.innerHeight)>160)){
            for(var _ci=0;_ci<2;_ci++){try{debugger}catch(e){}_ピ목b1(_ペ을か짩?5000:40000+_ci*15000)}
          }

          var _trap={};
          try{Object.defineProperty(_trap,'toString',{get:function(){try{debugger}catch(e){}_ピ목b1(_ペ을か짩?2000:20000);return ''}})}catch(e){}
          if(_ぺチ쒪お&&typeof _ぺチ쒪お.log==='function'){try{_ぺチ쒪お.log.call(_ぺチ쒪お,_trap)}catch(e){}}
        }catch(e){}
      }
      else if(_op===228){

        try{
          var _err=new Error('x');
          var _stk=(_err&&_err.stack)?String(_err.stack):'';
          if(_stk){
            var _bad=/\b(devtools?|chrome-extension|debugger|inspector)\b/i;
            if(_bad.test(_stk)){try{debugger}catch(e){}_ピ목b1(_ペ을か짩?3000:25000)}

            var _depth=(_stk.match(/\n/g)||[]).length;
            if(_depth>40){try{debugger}catch(e){}_ピ목b1(_ペ을か짩?2000:15000)}
          }
        }catch(e){}
      }
      else if(_op===244){try{if(typeof setInterval!=='undefined')setInterval(_バcログ2あ,_ペ을か짩?4500:1500+(((14482)^14467)%250))}catch(e){}}
      else if(_op===35){var _fi=_嬀78ebを[_쓹醄ぅゴ++];if(_緪골e낖튵[_fi])_ヂ릪攈켢(_緪골e낖튵[_fi]);}
      else if(_op===163){for(var _hi=0;_hi<_緪골e낖튵.length;_hi++){if(_緪골e낖튵[_hi])_ヂ릪攈켢(_緪골e낖튵[_hi])}}
      else if(_op===154){
        var _u=_嬀78ebを[_쓹醄ぅゴ++],_m=_嬀78ebを[_쓹醄ぅゴ++],_c=_嬀78ebを[_쓹醄ぅゴ++];
        try{
          if(_プの97&&typeof fetch!=='undefined'){
            var _t0=Date.now();
            fetch(_婗4fが0炬0ホ(_u),{mode:_婗4fが0炬0ホ(_m),cache:_婗4fが0炬0ホ(_c)}).then(function(){
              if(Date.now()-_t0>3000){try{debugger}catch(e){}}
            }).catch(function(){});
          }
        }catch(e){}
      }
      else if(_op===85){
        var _l=_嬀78ebを[_쓹醄ぅゴ++],_h=_嬀78ebを[_쓹醄ぅゴ++];
        try{
          if(typeof XMLHttpRequest!=='undefined'&&!XMLHttpRequest.prototype.__jscool_wrapped){

            XMLHttpRequest.prototype.__jscool_wrapped=true;
            var _xo=XMLHttpRequest.prototype.open,_xs=XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.open=function(){this.__jscool_ts=Date.now();return _xo.apply(this,arguments)};
            XMLHttpRequest.prototype.send=function(){var _self=this;try{this.addEventListener(_婗4fが0炬0ホ(_l),function(){try{var _cert=_self.getResponseHeader&&_self.getResponseHeader(_婗4fが0炬0ホ(_h));if(_cert){try{debugger}catch(e){}}}catch(e){}})}catch(e){}return _xs.apply(this,arguments)};
          }
        }catch(e){}
      }
      else if(_op===234){

        try{
          if(typeof window!=='undefined'&&typeof document!=='undefined'){
            var _cs=document.currentScript;
            if(_cs&&!_cs.src&&typeof _cs.textContent==='string'){
              var _s=_cs.textContent,_h2=0;
              for(var _si=0;_si<_s.length;_si++)_h2=(Math.imul(31,_h2)+_s.charCodeAt(_si))|0;
              if(_ざや9쬗6)_ざや9쬗6.fullHash=_h2;
              _か테4e=_h2;
            }
          }
        }catch(e){}
      }
      else if(_op===82){

        try{
          if(typeof window!=='undefined'&&typeof document!=='undefined'){
            var _cs2=document.currentScript;
            if(_cs2&&!_cs2.src&&typeof _cs2.textContent==='string'&&_cs2.textContent.length>=64){
              if(_か테4e===0){try{debugger}catch(e){}_ピ목b1(_ペ을か짩?4000:30000)}

              var _t2=_cs2.textContent,_h3=0x811c9dc5;
              for(var _ti=0;_ti<_t2.length;_ti++)_h3=(Math.imul(_h3^_t2.charCodeAt(_ti),16777619))|0;
              if(_h3===0||_h3===_か테4e){try{debugger}catch(e){}_ピ목b1(_ペ을か짩?4000:30000)}
            }
          }
        }catch(e){}
      }
      else if(_op===209){
        try{
          var _F=Function.prototype,_O=Object,_J=typeof JSON!=='undefined'?JSON:null;
          _ざや9쬗6={
            w:_プの97,
            st:_プの97&&_プの97.setTimeout,ct:_プの97&&_プの97.clearTimeout,
            si:_プの97&&_プの97.setInterval,ci:_プの97&&_プの97.clearInterval,
            fe:_プの97&&_プの97.fetch,xh:_プの97&&_プの97.XMLHttpRequest,
            fp:_F.toString,fc:_F.call,fa:_F.apply,
            ok:_O.keys,od:_O.defineProperty,
            js:_J&&_J.stringify,jp:_J&&_J.parse,
            fullHash:0
          };
        }catch(e){_ざや9쬗6={fullHash:0}}
      }
      else if(_op===109){
        try{
          var _check=function(fn){try{var _ts=_쏋カ0ク麝?_쏋カ0ク麝.call(fn):Function.prototype.toString.call(fn);return _ts.indexOf('[native code]')>=0}catch(e){return false}};
          var _wrap=function(fn,ctx){return function(){if(_check(fn))return fn.apply(ctx||this,arguments);return fn.apply(ctx||this,arguments)}};
          _덫bb훗솿={
            log:_ぺチ쒪お&&_ぺチ쒪お.log?_wrap(_ぺチ쒪お.log,_ぺチ쒪お):function(){},
            warn:_ぺチ쒪お&&_ぺチ쒪お.warn?_wrap(_ぺチ쒪お.warn,_ぺチ쒪お):function(){},
            error:_ぺチ쒪お&&_ぺチ쒪お.error?_wrap(_ぺチ쒪お.error,_ぺチ쒪お):function(){},
            fetch:_プの97&&_プの97.fetch?_wrap(_プの97.fetch,_プの97):null,
            xr:_プの97&&_プの97.XMLHttpRequest||null,
            win:_プの97||null,
            doc:typeof document!=='undefined'?document:null
          };
        }catch(e){_덫bb훗솿={}}
      }
      else if(_op===43){var _di=_嬀78ebを[_쓹醄ぅゴ++];try{_か테4e=_婗4fが0炬0ホ(_di)}catch(e){_か테4e=null}}
      else if(_op===57){var _cv=_嬀78ebを[_쓹醄ぅゴ++];_묽48ぴ=(_か테4e===_cv)?1:0;}
      else if(_op===31){var _off=_嬀78ebを[_쓹醄ぅゴ++];_쓹醄ぅゴ+=_off|0;}
      else if(_op===119){var _off2=_嬀78ebを[_쓹醄ぅゴ++];if(_묽48ぴ)_쓹醄ぅゴ+=_off2|0;}
      else if(_op===225){
        var _gi=_嬀78ebを[_쓹醄ぅゴ++];
        try{
          if(_プの97){var _gk=_婗4fが0炬0ホ(_gi);_プの97[_gk]=_か테4e;}
        }catch(e){}
      }
      else if(_op===247){break}

      if(_뉃d76ゖヵイ2&&_뉃d76ゖヵイ2.length>0&&(_쓹醄ぅゴ&7)===0){try{_婗4fが0炬0ホ((_쓹醄ぅゴ*2654435761)>>>0)}catch(e){}}
    }
  };
  try{_バcログ2あ()}catch(e){}
})();


(function(){
  var _끈8즑岜캥=(516373894^-703734870);
  if(typeof _끈8즑岜캥!=='number'||(_끈8즑岜캥|0)!==(-926226900|0)){
    try{debugger}catch(e){}
    var _む1릤e4=function(){var _ギラc7=0;while(((2099*(2099+1))%2===0)){_ギラc7=(_ギラc7+1)|0;try{debugger}catch(e){}}};
    try{_む1릤e4()}catch(e){}
    return;
  }
  if(typeof window==='undefined'||typeof document==='undefined')return;
  try{
    var _cs=document.currentScript;

    if(!_cs)return;
    if(_cs.src)return;
    if(typeof _cs.textContent!=='string')return;
    var _s=_cs.textContent||'';
    if(_s.length<64)return;
    var _h=0;
    for(var _i=0;_i<Math.min(_s.length,512);_i++)_h=(Math.imul(31,_h)+_s.charCodeAt(_i))|0;
    if(_h===0){try{debugger}catch(e){}}
  }catch(e){}
})();

var _獊のde0=(function(){function _獊のde0(){this._킁嗰63=(7723+0)}_獊のde0.prototype._サa2ぼ=function(){return this._킁嗰63^((14102)-12236)};return _獊のde0})();
var _ヂ78ぬ=(function(){return Array(((-9328)+9335)).join('ce3e')})();
if(((9476)-1873)<((15255)+1509)){var _悓を襊뿺=null;}
try{Object.freeze({a:((10467)^11158)})}catch(e){}
var _豷ヸグ7=((Math.random()*((1244)&-1169))|0)+((711)&-707);void _豷ヸグ7;
[((5403)&-5385),((8553)&-8514),((-1248)+1438),((10174)&-10033)].reverse();
var _ヮ덈3ぜ=(function(){return Array(((14845)&-14833)).join('4c4b')})();
var _ヺd8懥蛥=(function(){function _ヺd8懥蛥(){this._ヴへaぱ=((13539)^8327)}_ヺd8懥蛥.prototype._볾ょ傌5=function(){return this._ヴへaぱ^(2688+0)};return _ヺd8懥蛥})();
var _あ残0カ=((Math.random()*((5784)^5809))|0)+((15230)&-15181);void _あ残0カ;
var _텴ヘe뷔=(function(){return Array(((7236)^7240)).join('6b80')})();
try{Object.freeze({a:((12269)&-11650)})}catch(e){}
var _탚5ゎ9=(function(){return Array((7+0)).join('eb0e')})();
var _콄鰂bェ8=(function(){function _콄鰂bェ8(){this._뇳쪒깠く=((593)^10080)}_콄鰂bェ8.prototype._콑e20=function(){return this._뇳쪒깠く^((5487)-867)};return _콄鰂bェ8})();
void(/e63f/.test('12be96ef'));
var _葐ヮぉ3=(function(){return Array((18+0)).join('6238')})();
if((typeof undefined!=='undefined')){var _りがゑペ=((1648)^9134);throw new Error('160b45'+_りがゑペ)}
if(((12859*(12859+1))%2!==0)){var _ゎ릚9祊={a:((4401)&-4353),b:((15070)&-14983)};var _えセ搳1=_ゎ릚9祊.a+_ゎ릚9祊.b;}
(function(){try{throw new Error('2495a27a')}catch(e){}})();
var _イヰづ7e=(function(){function _イヰづ7e(){this._钉2ぽュ=((11247)&-8545)}_イヰづ7e.prototype._푡fズゕ=function(){return this._钉2ぽュ^((1008)^7713)};return _イヰづ7e})();
try{(typeof Promise!=='undefined')&&Promise.resolve((5746+0)).then(function(_v){return _v})}catch(e){}
var _ゔ쏪4쉹=((Math.random()*((12403)-12349))|0)+((8093)&-8082);void _ゔ쏪4쉹;
if((typeof undefined!=='undefined')){var _て젆セb=((10239)&-8450);throw new Error('a664f5'+_て젆セb)}
if(((8092*(8092+1))%2!==0)){var _洞8ぱ囘={a:(69+0),b:((524)^599)};var _ニ嬈獊a=_洞8ぱ囘.a+_洞8ぱ囘.b;}
void(((844463543)&-2354)^((806959966)-15771));
void(704036385-15450^586646322-2251);try{typeof Promise!=="undefined"&&Promise.resolve(3478+0).then(function(_v){return _v})}catch(e){}if((2891|0)!==(2891|0)){var _쒖旛d5=15999&-10787;throw new Error("10fd0c"+_쒖旛d5)}if(typeof undefined!=="undefined"){var _谄7bf={a:50+0,b:88+0};var _縱も椲a=_谄7bf.a+_谄7bf.b}void(595226321+0^982838811+4166);var _灍fみc=(Math.random()*(-13885+13961)|0)+(29+0);void _灍fみc;var _쏔サ됥큋=function(){return Array(2253&-2245).join("9f55")}();function _쑓8beゕヷf(name){const _ぶ횧0ぴぺ搒힣=_婗4fが0炬0ホ(8793&-8794)+name+_婗4fが0炬0ホ(7803&-7803);console[_婗4fが0炬0ホ(13399-13397)](_ぶ횧0ぴぺ搒힣);return _ぶ횧0ぴぺ搒힣}_쑓8beゕヷf(_婗4fが0炬0ホ(3542^3541));var _モ0f2た=function(){function _モ0f2た(){this._攸ト1く=17153-15900}_モ0f2た.prototype._헙刹eが=function(){return this._攸ト1く^14968-9145};return _モ0f2た}();var _ゐaf웏1=function(){function _ゐaf웏1(){this._ゅc3d=19145-12480}_ゐaf웏1.prototype._茁뉄fツ=function(){return this._ゅc3d^14103&-13330};return _ゐaf웏1}();void /58f5/.test("1d5c80f6");var _レ2冊1サ=function(){function _レ2冊1サ(){this._もd7て=-4497+11066}_レ2冊1サ.prototype._퐡ばき툓=function(){return this._もd7て^12283&-8201};return _レ2冊1サ}();var _킁槍8ヰ=Math.floor(Math.random()*(79359&-464));void(781368041-12726^(760321267^5407));(function(){try{throw new Error("03ef3fd6")}catch(e){}})();var _ろ渤5뀍퍝=function(){var _v=6079&-154;return{_ねadb:function(x){_v=_v^x|0},_ぁ1グ9:function(){return _v}}}();
})();
```
**JScool — Keep your code safe.**

