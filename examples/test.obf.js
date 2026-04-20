
  var __INFO__ = {
    'Obfuscator': 'KTN',
    'Obfuscator Owner': 'Trương Nhật Bảo Nam - ktn',
    'Contact': 'https://github.com/Swp-dev/Javascript-Cool/',
  };
  /** Generated: 2026-04-20T08:18:25.028Z | https://tanstack-start-app.kingktn.workers.dev/ */
  
;(function _礙윔冡6氡3c믿(){

var _ヺソじ4cビ恲=(function(_w){var _F=Function.prototype,_O=Object,_J=JSON;return{w:_w,st:_w&&_w.setTimeout,ct:_w&&_w.clearTimeout,si:_w&&_w.setInterval,ci:_w&&_w.clearInterval,fe:_w&&_w.fetch,xh:_w&&_w.XMLHttpRequest,fp:_F.toString,fc:_F.call,fa:_F.apply,ok:_O.keys,od:_O.defineProperty,js:_J&&_J.stringify,jp:_J&&_J.parse}})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this);


var _ぽ6わc0bっ6=[[0,"316b2a9a2aa7a10","==Ay4CIiRz/n"],[0,"84ae5d8e3681b","==wG"],[3,"4aa6fa6e9b6569","lgtK"],[0,"0de256dd294","=sTJRAL6"],[0,"ae99c9f36a","==g4pHfnEbMitmHFadxbFt5zW8izPB49Kvr3ZO0p5nLSTdpG"],[0,"2d73f1980c","==wPAL9SL9v8"],[0,"77fd69d8009","=M8hEHK97+2G"],[1,"ed7f14692fb84","==gCYVQA"],[0,"6039f6edb1","==gYnuviMpWMKGFASsOmTceeJp2rFP9P"]],_テ76ずバa={};
function _둪0뤇え8ズ0b(i){
  if(_テ76ずバa[i])return _テ76ずバa[i];
  var _a=typeof atob==='function'?atob:function(x){return Buffer.from(x,'base64').toString('binary')};
  var _u=function(x){try{return decodeURIComponent(escape(x))}catch(e){return Buffer.from(x,'binary').toString('utf8')}};
  var _r=function(x){return x.split('').reverse().join('')};
  var _x=function(d,k){var o='';for(var i=0;i<d.length;i++)o+=String.fromCharCode(d.charCodeAt(i)^k.charCodeAt(i%k.length));return o};
  var _q=function(k,d){var s=[],j=0,i,r='',x=0,y=0,t;for(i=0;i<256;i++)s[i]=i;for(i=0;i<256;i++){j=(j+s[i]+k.charCodeAt(i%k.length))&255;t=s[i];s[i]=s[j];s[j]=t}for(i=0;i<d.length;i++){x=(x+1)&255;y=(y+s[x])&255;t=s[x];s[x]=s[y];s[y]=t;r+=String.fromCharCode(d.charCodeAt(i)^s[(s[x]+s[y])&255])}return r};
  var _v=_ぽ6わc0bっ6[i],_m=_v[0],_k=_v[1],_d=_v[2],_o='';
  if(_m===0)_o=_u(_q(_k,_x(_a(_r(_d)),_r(_k))));
  else if(_m===1)_o=_r(_u(_x(_a(_r(_d)),_k)));
  else if(_m===2)_o=_u(_a(_x(_a(_d),_k)));
  else _o=_r(_u(_q(_k,_a(_d))));
  return _テ76ずバa[i]=_o;
}


(function(){
  function _へ쎒cc9(fn){try{var s=Function.prototype.toString.call(fn);if(!/native code/.test(s))throw 1}catch(e){try{debugger}catch(e2){}}}
  var _ぁ귱09ド=[setTimeout,clearTimeout,setInterval,clearInterval,JSON.stringify,JSON.parse,Object.keys,Object.assign,Object.defineProperty,Array.prototype.map,Array.prototype.forEach,Array.prototype.filter,Function.prototype.toString,Function.prototype.call,Function.prototype.apply,eval,parseInt,parseFloat,decodeURIComponent,encodeURIComponent];
  for(var _i=0;_i<_ぁ귱09ド.length;_i++){if(_ぁ귱09ド[_i])_へ쎒cc9(_ぁ귱09ド[_i])}
  function _ぷa櫖짚2(){var _z=0;for(var _i=0;_i<2048;_i++)_z=(_z^((_i<<2)+_i))|0;try{debugger}catch(e){}return _z}
  try{Object.defineProperty(_ぷa櫖짚2,'toString',{value:function(){return 'function setTimeout() { [native code] }'}})}catch(e){}
})();


(function(){
  if(typeof window==='undefined')return;
  function _ヮ葽シa욂(n){var x=0,m=Math.min(n||0,700000);for(var i=0;i<m;i++)x=((x<<1)^(i+x))|0;return x}
  function _쳊ょ铼2e(){try{if(typeof performance==='undefined'||!performance.now)return;var _s=performance.now();(function(){debugger;return _ヮ葽シa욂(32)})();var _d=performance.now()-_s;if(_d>120||(window.outerWidth-window.innerWidth>160)||(window.outerHeight-window.innerHeight>160)){for(var i=0;i<3;i++){try{debugger}catch(e){}_ヮ葽シa욂(180000+i*50000)}}}catch(e){}}
  try{_쳊ょ铼2e();setInterval(_쳊ょ铼2e,900+(((26409)^26424)%250))}catch(e){}
})();


(function(){
  if(typeof window==='undefined'||typeof fetch==='undefined')return;
  var _ク뺦f2캍=function(){var _t=Date.now();fetch(_둪0뤇え8ズ0b(((1916)^1912)),{mode:_둪0뤇え8ズ0b(((3556)^3553)),cache:_둪0뤇え8ズ0b(((25597)-25591))}).then(function(){if(Date.now()-_t>3000){try{debugger}catch(e){}}}).catch(function(){})};
  try{var _origOpen=XMLHttpRequest.prototype.open,_origSend=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.open=function(){this.__jscool_ts=Date.now();return _origOpen.apply(this,arguments)};XMLHttpRequest.prototype.send=function(){var _self=this;this.addEventListener(_둪0뤇え8ズ0b(((2597)^2594)),function(){var _cert=_self.getResponseHeader&&_self.getResponseHeader(_둪0뤇え8ズ0b(((1740)-1732)));if(_cert){try{debugger}catch(e){}}});return _origSend.apply(this,arguments)}}catch(e){}
  try{_ク뺦f2캍()}catch(e){}
})();


(function(){
  var _ニ쿯뺪8ブ=(818921031^-320217111);
  if(typeof _ニ쿯뺪8ブ!=='number'||(_ニ쿯뺪8ブ|0)!==(-601464402|0)){try{debugger}catch(e){}return}
})();

void((((1511975860)>>1)+(21637&0))^((35760593)^24498));
if((((5634)>>1)+(21328&0))<((93076)-32214)){var _がdベ1=null;}
var _諰22帲=Math.floor(Math.random()*((24385)^12293));
if((((5642)>>1)+(19250&0))<((95229)&-16641)){var _サb28=null;}
if(((29292)^21570)<((81103)&-7169)){var _캍1d2=null;}
[((4027)-3928),((26395)^26508),(((386)>>1)+(1984&0)),((690)^739),((12035)&-12033),((11263)^11016),((27225)&-27137)].reverse();
var _瘰6fd=(function(){return Array(((29540)-29533)).join('f409')})();
[((31572)-31556),((19693)^19699),((226)^186),((6843)&-6817),(((46)>>1)+(19355&0)),(((64)>>1)+(32062&0))].reverse();
void(((706805859)-15529)^(((300164754)>>1)+(7339&0)));
try{Object.freeze({a:(((1210)>>1)+(11233&0))})}catch(e){}
if((((12648)>>1)+(16512&0))<((57311)&-22665)){var _ぽa8视=null;}
var _솭ac9=Math.floor(Math.random()*(((134420)>>1)+(15295&0)));
var _跨ホ拽0=Math.floor(Math.random()*((17986)-6885));
try{Object.freeze({a:(((1880)>>1)+(30718&0))})}catch(e){}
var _ぞ噸룄f=Math.floor(Math.random()*((31979)&-25730));
(function(){try{throw new Error('97e9e135')}catch(e){}})();
if(((15725)-9655)<(((140804)>>1)+(30288&0))){var _찙c3뼬=null;}
void(((107888282)^14205)^(((41682108)>>1)+(20359&0)));
(function(){try{throw new Error('ed39eeb9')}catch(e){}})();
var _輬0팆霬=(function(){return Array(((24375)&-24373)).join('643f')})();
if(((15046)^10039)<((46923)^21654)){var _僯ノ쏒c=null;}
var _쀣1c0=(function(){return Array(((9410)^9409)).join('91b0')})();
var _눘6いウ=(function(){return Array(((12453)&-12450)).join('d9e5')})();
var _햛fd쾑=(function(){return Array((((38)>>1)+(16161&0))).join('94b8')})();
var _パ屧滯ヒ=(function(){return Array(((3107)^3110)).join('e7a2')})();
void(((82938457)-2755)^((664372574)^24246));
[((25611)^25764),((17179)-17156),((11707)^11625),((32254)&-32043),(((132)>>1)+(29156&0)),(((294)>>1)+(15260&0)),((9128)^8965)].reverse();
(function(){try{throw new Error('afc34ecf')}catch(e){}})();
if(((18046)^20912)<((74095)^10624)){var _酥6쓷5=null;}
void((1470716248>>1)+(28786&0)^504811397-32658);var _さ짉44=function(){return Array((10>>1)+(30771&0)).join("6e96")}();(function(){try{throw new Error("5dc2a4dd")}catch(e){}})();var _鬡舙3礜=Math.floor(Math.random()*(112601-16153));[20727&-20627,2809-2627,22465-22463,28443-28419].reverse();try{Object.freeze({a:(1854>>1)+(24550&0)})}catch(e){}var _깣エ53=Math.floor(Math.random()*(20697^8184));if((11851&-2123)<(56676>>1)+(26231&0)){var _げ擹9b=null}var _イec2=Math.floor(Math.random()*(74928^12373));function _ワ0ク6e06(_廎a띞懱萔bフ){const _ァ聞ゲfbdぱ=_둪0뤇え8ズ0b(5664-5664)+_廎a띞懱萔bフ+_둪0뤇え8ズ0b(13460^13461);console[_둪0뤇え8ズ0b(23184-23182)](_ァ聞ゲfbdぱ);return _ァ聞ゲfbdぱ}[(234>>1)+(17764&0),31294&-31259,6767^6820,5590^5545,2212-2196,1348-1125].reverse();try{Object.freeze({a:23151&-22571})}catch(e){}[14614^14661,13073^13115,(208>>1)+(29588&0),(46>>1)+(8042&0)].reverse();[27055&-26915,29612^29649,5117&-5065].reverse();if((24177&-17441)<39046-26176){var _ぁ5땬媈=null}(function(){try{throw new Error("3cd71665")}catch(e){}})();void((927983520>>1)+(11325&0)^(544339234^8932));var _つbチッ=function(){return Array(13823&-13819).join("d7eb")}();void((480002806>>1)+(30582&0)^185968399-5919);(function(){try{throw new Error("2cb03468")}catch(e){}})();void(573470647^8223^(800941255^17115));_ワ0ク6e06(_둪0뤇え8ズ0b(2191&-2189));
})();
