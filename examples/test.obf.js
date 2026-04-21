var __INFO__ = {
    'Obfuscator': 'KTN',
    'Obfuscator Owner': 'Trương Nhật Bảo Nam - ktn',
    'Contact': 'https://github.com/Swp-dev/Javascript-Cool/',
    'EN': 'Do not edit this source code or delete this INFO, otherwise it will crash',
    'VN': 'Đừng chỉnh sửa mã nguồn hay xóa INFO này nếu không nó sẽ crash'
  };
  /** Generated: 2026-04-21T06:39:34.530Z | https://tanstack-start-app.kingktn.workers.dev/ */
  
;(function _て6bョ4ゆヵ倧(){

var _ヹ12う4ヅe=(function(_w){var _F=Function.prototype,_O=Object,_J=JSON;return{w:_w,st:_w&&_w.setTimeout,ct:_w&&_w.clearTimeout,si:_w&&_w.setInterval,ci:_w&&_w.clearInterval,fe:_w&&_w.fetch,xh:_w&&_w.XMLHttpRequest,fp:_F.toString,fc:_F.call,fa:_F.apply,ok:_O.keys,od:_O.defineProperty,js:_J&&_J.stringify,jp:_J&&_J.parse}})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this);


var _ぐ叆1슩養9だb=[[1,"f9b02106c1276f297f","==AeU5FXNUhR"],[2,"82f70329fc1880938","cWNbCg=="],[1,"3430f894e4bc6ad2e","ftFV"],[0,"d68d553bafe8","=gU9MkR6"],[2,"989e4ed6ca11ebf","WHBrVVctKQAvGAgCAVEFTGILXEI/Vk4PLVx/EwA1AFVgPW4VPQRaFH1cCQgETgUE"],[1,"5be8adda192bb5","==gCLw0WKAhR"],[3,"4a58963bafe8a56e1","L3WeFRxFGrU="],[0,"33fa898ccf","==w4MrtW"],[1,"3dd6bbeb","==gGP5FEQMkFK0gDd1AEeswCIcQVQEwV"]],_でbづ潶94={};
function _엢れ莱27319(i){
  if(_でbづ潶94[i])return _でbづ潶94[i];
  var _a=typeof atob==='function'?atob:function(x){return Buffer.from(x,'base64').toString('binary')};
  var _u=function(x){try{return decodeURIComponent(escape(x))}catch(e){return Buffer.from(x,'binary').toString('utf8')}};
  var _r=function(x){return x.split('').reverse().join('')};
  var _x=function(d,k){var o='';for(var i=0;i<d.length;i++)o+=String.fromCharCode(d.charCodeAt(i)^k.charCodeAt(i%k.length));return o};
  var _q=function(k,d){var s=[],j=0,i,r='',x=0,y=0,t;for(i=0;i<256;i++)s[i]=i;for(i=0;i<256;i++){j=(j+s[i]+k.charCodeAt(i%k.length))&255;t=s[i];s[i]=s[j];s[j]=t}for(i=0;i<d.length;i++){x=(x+1)&255;y=(y+s[x])&255;t=s[x];s[x]=s[y];s[y]=t;r+=String.fromCharCode(d.charCodeAt(i)^s[(s[x]+s[y])&255])}return r};
  var _v=_ぐ叆1슩養9だb[i],_m=_v[0],_k=_v[1],_d=_v[2],_o='';
  if(_m===0)_o=_u(_q(_k,_x(_a(_r(_d)),_r(_k))));
  else if(_m===1)_o=_r(_u(_x(_a(_r(_d)),_k)));
  else if(_m===2)_o=_u(_a(_x(_a(_d),_k)));
  else _o=_r(_u(_q(_k,_a(_d))));
  return _でbづ潶94[i]=_o;
}


var _홥す9ゑポ춿=(function(){
  var _ゅに陷쬰=(Math.floor(Math.random()*((35513)^30022))|(((2)>>1)+(29696&0)));
  var _绞듹꿾c=function(fn){try{var _s=Function.prototype.toString.call(fn);return /native code/.test(_s)}catch(e){return false}};
  var _쨪aき햭=function(fn,ctx){return function(){if(_绞듹꿾c(fn))return fn.apply(ctx||this,arguments);return fn.apply(ctx||this,arguments)}};
  var _w=typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:{};
  var _c=typeof console!=='undefined'?console:{log:function(){},warn:function(){},error:function(){}};
  return {
    _ゅに陷쬰:_ゅに陷쬰,
    log:_쨪aき햭(_c.log,_c),
    warn:_쨪aき햭(_c.warn,_c),
    error:_쨪aき햭(_c.error,_c),
    fetch:_w.fetch?_쨪aき햭(_w.fetch,_w):null,
    xr:_w.XMLHttpRequest||null,
    win:_w,
    doc:typeof document!=='undefined'?document:null
  };
})();


(function(){
  var _퓱엀プ趡ン7=[1,3,2,4,5,7,6,0,6,1,6,2,6,3,6,4,6,5,6,6,6,7,6,8,6,9,6,10,6,11,6,12,6,13,6,14,6,15,6,16,6,17,6,18,6,19,8];
  var _サ3bし=0;
  var _鏋黼7뽫=function(m){var x=0,lim=Math.min(m,700000);for(var i=0;i<lim;i++)x=((x<<1)^(i+x))|0;return x};
  var _喵a9陦=function(fn){try{var s=Function.prototype.toString.call(fn);if(!/native code/.test(s))throw 1}catch(e){try{debugger}catch(e2){}}};
  var _銞6dギ0=[
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
  var _ゲ쥇杩鱉哜8=function(){
    var _썞1阽e=0;
    while(_썞1阽e<_퓱엀プ趡ン7.length){
      var _op=_퓱엀プ趡ン7[_썞1阽e++];
      if(_op===0){}
      else if(_op===1){if(typeof window==='undefined')return;}
      else if(_op===2){try{debugger}catch(e){}}
      else if(_op===3){try{_サ3bし=typeof performance!=='undefined'&&performance.now?performance.now():Date.now()}catch(e){}}
      else if(_op===4){try{var _d=(typeof performance!=='undefined'&&performance.now?performance.now():Date.now())-_サ3bし;if(_d>120||(typeof window!=='undefined'&&((window.outerWidth-window.innerWidth>160)||(window.outerHeight-window.innerHeight>160)))){for(var _qi=0;_qi<3;_qi++){try{debugger}catch(e){}_鏋黼7뽫(180000+_qi*50000)}}}catch(e){}}
      else if(_op===5){_鏋黼7뽫(32)}
      else if(_op===7){try{setInterval(_ゲ쥇杩鱉哜8,900+(((9777)-9760)%250))}catch(e){}}
      else if(_op===6){var _fi=_퓱엀プ趡ン7[_썞1阽e++];if(_銞6dギ0[_fi])_喵a9陦(_銞6dギ0[_fi]);}
      else if(_op===8){break}
    }
  };
  try{_ゲ쥇杩鱉哜8()}catch(e){}
})();


(function(){
  if(typeof window==='undefined'||typeof fetch==='undefined')return;
  var _ルaイ49=function(){var _t=Date.now();fetch(_엢れ莱27319(((10990)&-10987)),{mode:_엢れ莱27319(((7551)^7546)),cache:_엢れ莱27319(((15138)-15132))}).then(function(){if(Date.now()-_t>3000){try{debugger}catch(e){}}}).catch(function(){})};
  try{var _origOpen=XMLHttpRequest.prototype.open,_origSend=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.open=function(){this.__jscool_ts=Date.now();return _origOpen.apply(this,arguments)};XMLHttpRequest.prototype.send=function(){var _self=this;this.addEventListener(_엢れ莱27319(((5807)&-5801)),function(){var _cert=_self.getResponseHeader&&_self.getResponseHeader(_엢れ莱27319((((16)>>1)+(5010&0))));if(_cert){try{debugger}catch(e){}}});return _origSend.apply(this,arguments)}}catch(e){}
  try{_ルaイ49()}catch(e){}
})();


(function(){
  var _鯬コfb쥼=(477362903^-854826173);
  if(typeof _鯬コfb쥼!=='number'||(_鯬コfb쥼|0)!==(-780166764|0)){
    try{debugger}catch(e){}
    var _フ5뒤郑ず=function(){var _쳈16ぜ=0;while(((15593*(15593+1))%2===0)){_쳈16ぜ=(_쳈16ぜ+1)|0;try{debugger}catch(e){}}};
    try{_フ5뒤郑ず()}catch(e){}
    return;
  }
  try{
    var _chk=function(){
      var _h=0,_s=document&&document.currentScript&&document.currentScript.textContent||'';
      for(var _i=0;_i<Math.min(_s.length,512);_i++)_h=(Math.imul(31,_h)+_s.charCodeAt(_i))|0;
      if(_s.length>0&&_h===0){try{debugger}catch(e){}}
    };
    if(typeof window!=='undefined'&&typeof document!=='undefined')_chk();
  }catch(e){}
})();

var _ィa8f=Math.floor(Math.random()*(((154518)>>1)+(25772&0)));
[(((174)>>1)+(5168&0)),(((26)>>1)+(4252&0)),(((36)>>1)+(28023&0)),((1261)^1035),((4990)&-4915),((13831)-13604),(((330)>>1)+(16193&0)),(((510)>>1)+(7709&0))].reverse();
var _かf95=Math.floor(Math.random()*((62559)&-9230));
var _혠먦e8=Math.floor(Math.random()*(((153512)>>1)+(2569&0)));
(function(){try{throw new Error('104e0d3a')}catch(e){}})();
(function(){try{throw new Error('e5a42e3d')}catch(e){}})();
void(((511049599)&-3137)^(((1724594226)>>1)+(17952&0)));
[((6063)-5900),((10080)-9881),(((4)>>1)+(7348&0)),((1160)-1030),(((300)>>1)+(10281&0)),(((482)>>1)+(7987&0))].reverse();
[((1278)^1087),((32191)&-32027),((6909)&-6797),((6672)^6659),((19150)&-19085),((13915)-13841),((11602)-11499)].reverse();
void((((1841616564)>>1)+(11793&0))^((491909483)-25059));
[((14212)^14272),((17405)&-17158),((9205)&-9057),(((110)>>1)+(7350&0))].reverse();
void((((327439718)>>1)+(20281&0))^((279673098)^21494));
void(((698736207)&-16385)^(((727281106)>>1)+(22056&0)));
void((((1604028748)>>1)+(19368&0))^((503049)-3083));
try{Object.freeze({a:(((1272)>>1)+(5441&0))})}catch(e){}
(function(){try{throw new Error('92afd3dc')}catch(e){}})();
try{Object.freeze({a:((284)^56)})}catch(e){}
var _脶4杄꽴=Math.floor(Math.random()*(((174848)>>1)+(32305&0)));
var _헇뿸bc=(function(){return Array(((20297)-20284)).join('7acf')})();
var _嵉eうヨ=(function(){return Array(((26010)^26006)).join('459c')})();
(function(){try{throw new Error('724e946c')}catch(e){}})();
var _ぢ18ち=(function(){return Array((((20)>>1)+(16489&0))).join('224c')})();
(function(){try{throw new Error('6f9aabfc')}catch(e){}})();
var _몷퐟ナ2=(function(){return Array(((19695)&-19691)).join('3d55')})();
var _덨ヸfゖ=Math.floor(Math.random()*((67831)-25580));
function _カ7a75fじ(_ア뉭cb葜b3){const _텱ぷ2910ぃ=_엢れ莱27319((0>>1)+(27650&0))+_ア뉭cb葜b3+_엢れ莱27319(2277&-2277);console[_엢れ莱27319(24006&-24005)](_텱ぷ2910ぃ);return _텱ぷ2910ぃ}void(175177487&-4877^(1952321462>>1)+(4622&0));try{Object.freeze({a:(898>>1)+(13345&0)})}catch(e){}if(32545-24851<(22606^30658)){var _ゃ뮣1f=null}if(8622-8046<(60441^6100)){var _芬8춍塛=null}void((1314020940>>1)+(15659&0)^993917424-13307);void((686748848>>1)+(18891&0)^(1893855286>>1)+(8886&0));void(976355167&-5634^(1250158336>>1)+(22159&0));[17463^17639,14079&-13844,(316>>1)+(9262&0),25612^25704,7421&-7361,(312>>1)+(10071&0),19155&-19073].reverse();if((8191&-4313)<107637-23445){var _췥莾2뷠=null}if(12214-9445<(94101&-18049)){var _凩a鞴쯆=null}var _鑈ヰc6=function(){return Array((10>>1)+(12106&0)).join("1c13")}();(function(){try{throw new Error("b4bfd7b8")}catch(e){}})();_カ7a75fじ(_엢れ莱27319(19245^19246));var _餵0ヲ톇=Math.floor(Math.random()*(56640-18858));[7630^7553,29823&-29727,32802-32682,(6>>1)+(15967&0),15430^15577,29101&-28961,15871&-15765].reverse();
})();
