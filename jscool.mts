#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { parse } from "@babel/parser";
import _traverseModule from "@babel/traverse";
import _generateModule from "@babel/generator";
import * as t from "@babel/types";

const traverse: typeof _traverseModule = (_traverseModule as any).default ?? _traverseModule;
const generate: typeof _generateModule = (_generateModule as any).default ?? _generateModule;

const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const MAGENTA = "\x1b[35m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

function printBanner() {
  console.log(
    `${CYAN}${BOLD}
     ██╗███████╗ ██████╗ ██████╗  ██████╗ ██╗     
     ██║██╔════╝██╔════╝██╔═══██╗██╔═══██╗██║     
     ██║███████╗██║     ██║   ██║██║   ██║██║     
██   ██║╚════██║██║     ██║   ██║██║   ██║██║     
╚█████╔╝███████║╚██████╗╚██████╔╝╚██████╔╝███████╗
 ╚════╝ ╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝
${RESET}${YELLOW}   JavaScript Obfuscator — King KTN ${RESET}
${DIM}   Anti-Hook | Anti-Debug | Anti-Proxy | AST Transform${RESET}
${DIM}   ─────────────────────────────────────────────────${RESET}`
  );
}

let _rl: readline.Interface | null = null;
const _lineQueue: string[] = [];
const _lineWaiters: Array<(line: string) => void> = [];

function initRl() {
  if (_rl) return;
  _rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
  _rl.on("line", (line: string) => {
    if (_lineWaiters.length > 0) _lineWaiters.shift()!(line);
    else _lineQueue.push(line);
  });
}

function closeRl() {
  if (_rl) {
    _rl.close();
    _rl = null;
  }
}

function readLine(): Promise<string> {
  initRl();
  if (_lineQueue.length > 0) return Promise.resolve(_lineQueue.shift()!);
  return new Promise((resolve) => _lineWaiters.push(resolve));
}

async function prompt(question: string): Promise<string> {
  process.stdout.write(question);
  const line = await readLine();
  return (line ?? "").trim();
}

async function askYN(question: string): Promise<boolean> {
  const ans = (await prompt(`${YELLOW}${question} [Y/N]: ${RESET}`)).toLowerCase();
  return ans === "y" || ans === "yes";
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomHex(len: number): string {
  return [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
}

const CJK_RANGES = [
  [0x4e00, 0x9fff],
  [0x3041, 0x3096],
  [0x30a1, 0x30fa],
  [0xac00, 0xd7a3],
];

function randomCJK(): string {
  const range = CJK_RANGES[randomInt(0, CJK_RANGES.length - 1)];
  return String.fromCharCode(randomInt(range[0], range[1]));
}

function randomIdent(len = 6): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    const prefix = randomCJK();
    let result = prefix;
    for (let i = 1; i < len; i++) result += Math.random() > 0.5 ? randomCJK() : randomHex(1);
    const ident = "_" + result;
    if (t.isValidIdentifier(ident)) return ident;
  }
  return "_x" + randomHex(Math.max(4, len));
}

function reverse(str: string): string {
  return str.split("").reverse().join("");
}

function xorBuffer(data: Buffer, key: string): Buffer {
  const out = Buffer.allocUnsafe(data.length);
  for (let i = 0; i < data.length; i++) out[i] = data[i] ^ key.charCodeAt(i % key.length);
  return out;
}

function rc4Buffer(key: string, data: Buffer): Buffer {
  const s: number[] = [];
  for (let i = 0; i < 256; i++) s[i] = i;
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) & 255;
    [s[i], s[j]] = [s[j], s[i]];
  }
  let x = 0;
  let y = 0;
  const out = Buffer.allocUnsafe(data.length);
  for (let k = 0; k < data.length; k++) {
    x = (x + 1) & 255;
    y = (y + s[x]) & 255;
    [s[x], s[y]] = [s[y], s[x]];
    out[k] = data[k] ^ s[(s[x] + s[y]) & 255];
  }
  return out;
}

type EncodedString = [number, string, string];

interface StringArrayState {
  arrName: string;
  decoderName: string;
  strings: EncodedString[];
  indexMap: Map<string, number>;
}

function encodeString(input: string): EncodedString {
  const key = randomHex(randomInt(8, 18));
  const mode = randomInt(0, 3);
  const raw = Buffer.from(input, "utf8");
  if (mode === 0) return [mode, key, reverse(xorBuffer(rc4Buffer(key, raw), reverse(key)).toString("base64"))];
  if (mode === 1) return [mode, key, reverse(xorBuffer(Buffer.from(reverse(input), "utf8"), key).toString("base64"))];
  if (mode === 2) return [mode, key, xorBuffer(Buffer.from(raw.toString("base64"), "utf8"), key).toString("base64")];
  return [mode, key, rc4Buffer(key, Buffer.from(reverse(input), "utf8")).toString("base64")];
}

function buildStringArray(strings: string[]): StringArrayState {
  const arrName = randomIdent(8);
  const decoderName = randomIdent(8);
  const indexMap = new Map<string, number>();
  const encoded: EncodedString[] = [];
  strings.forEach((s) => {
    if (indexMap.has(s)) return;
    indexMap.set(s, encoded.length);
    encoded.push(encodeString(s));
  });
  return { arrName, decoderName, strings: encoded, indexMap };
}

function emitStringArrayPreamble(state: StringArrayState): string {
  const arr = JSON.stringify(state.strings);
  const cacheN = randomIdent(6);
  const arrN = state.arrName;
  const decN = state.decoderName;
  return `
var ${arrN}=${arr},${cacheN}={};
function ${decN}(i){
  if(${cacheN}[i])return ${cacheN}[i];
  var _a=typeof atob==='function'?atob:function(x){return Buffer.from(x,'base64').toString('binary')};
  var _u=function(x){try{return decodeURIComponent(escape(x))}catch(e){return Buffer.from(x,'binary').toString('utf8')}};
  var _r=function(x){return x.split('').reverse().join('')};
  var _x=function(d,k){var o='';for(var i=0;i<d.length;i++)o+=String.fromCharCode(d.charCodeAt(i)^k.charCodeAt(i%k.length));return o};
  var _q=function(k,d){var s=[],j=0,i,r='',x=0,y=0,t;for(i=0;i<256;i++)s[i]=i;for(i=0;i<256;i++){j=(j+s[i]+k.charCodeAt(i%k.length))&255;t=s[i];s[i]=s[j];s[j]=t}for(i=0;i<d.length;i++){x=(x+1)&255;y=(y+s[x])&255;t=s[x];s[x]=s[y];s[y]=t;r+=String.fromCharCode(d.charCodeAt(i)^s[(s[x]+s[y])&255])}return r};
  var _v=${arrN}[i],_m=_v[0],_k=_v[1],_d=_v[2],_o='';
  if(_m===0)_o=_u(_q(_k,_x(_a(_r(_d)),_r(_k))));
  else if(_m===1)_o=_r(_u(_x(_a(_r(_d)),_k)));
  else if(_m===2)_o=_u(_a(_x(_a(_d),_k)));
  else _o=_r(_u(_q(_k,_a(_d))));
  return ${cacheN}[i]=_o;
}
`;
}

function obfuscateNumberValue(value: number): string {
  if (!Number.isFinite(value) || Math.floor(value) !== value || Math.abs(value) > 0x7fffffff) return String(value);
  const k = randomInt(17, 0x7fff);
  const mode = randomInt(0, 3);
  if (mode === 0) return `((${value ^ k})^${k})`;
  if (mode === 1) return `((${value + k})-${k})`;
  if (mode === 2) return `(((${value << 1})>>1)+(${k}&0))`;
  return `((${value | k})&${value | ~k})`;
}

function markObf(node: t.Node): t.Node {
  (node as any).__jscool_obf = true;
  traverse(t.file(t.program([t.expressionStatement(node as t.Expression)])) as any, {
    enter(p: any) {
      p.node.__jscool_obf = true;
    },
  });
  return node;
}

function parseExpression(src: string): t.Expression {
  return markObf((parse(src, { sourceType: "script" }).program.body[0] as t.ExpressionStatement).expression) as t.Expression;
}

function decoderCall(state: StringArrayState, value: string): t.CallExpression {
  const idx = state.indexMap.get(value) ?? 0;
  return t.callExpression(t.identifier(state.decoderName), [parseExpression(obfuscateNumberValue(idx))]);
}

function canReplaceStringLiteral(nodePath: any): boolean {
  const parent = nodePath.parent;
  if (t.isDirectiveLiteral(nodePath.node)) return false;
  if (t.isObjectProperty(parent) && parent.key === nodePath.node && !parent.computed) return false;
  if (t.isObjectMethod(parent) && parent.key === nodePath.node && !parent.computed) return false;
  if (t.isImportDeclaration(parent) || t.isExportAllDeclaration(parent) || t.isExportNamedDeclaration(parent)) return false;
  return true;
}

function canReplaceNumberLiteral(nodePath: any): boolean {
  const parent = nodePath.parent;
  if ((nodePath.node as any).__jscool_obf) return false;
  if (nodePath.findParent((p: any) => p.node?.__jscool_obf)) return false;
  if (t.isObjectProperty(parent) && parent.key === nodePath.node && !parent.computed) return false;
  if (t.isMemberExpression(parent) && parent.property === nodePath.node && !parent.computed) return false;
  if (t.isImportDeclaration(parent) || t.isExportNamedDeclaration(parent)) return false;
  return true;
}

function canApplyControlFlowFlattening(statements: t.Statement[]): boolean {
  return statements.length >= 3 && !statements.some((stmt) => {
    if (t.isVariableDeclaration(stmt)) return stmt.kind !== "var";
    if (t.isBreakStatement(stmt) || t.isContinueStatement(stmt)) return true;
    if (t.isLabeledStatement(stmt) || t.isFunctionDeclaration(stmt) || t.isClassDeclaration(stmt)) return true;
    return t.isDeclaration(stmt);
  });
}

function applyControlFlowFlattening(statements: t.Statement[]): t.Statement[] {
  if (!canApplyControlFlowFlattening(statements)) return statements;
  const routeVar = randomIdent(6);
  const indexVar = randomIdent(6);
  const labels = statements.map((_, i) => String(i));
  for (let i = labels.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [labels[i], labels[j]] = [labels[j], labels[i]];
  }
  const caseIndexes = statements.map((_, i) => i);
  for (let i = caseIndexes.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [caseIndexes[i], caseIndexes[j]] = [caseIndexes[j], caseIndexes[i]];
  }
  const cases = caseIndexes.map((idx) => t.switchCase(t.stringLiteral(labels[idx]), [statements[idx], t.continueStatement()]));
  const route = labels.join("|");
  const cffBody = t.blockStatement([
    t.switchStatement(t.memberExpression(t.identifier(routeVar), t.updateExpression("++", t.identifier(indexVar)), true), cases),
    t.breakStatement(),
  ]);
  (cffBody as any).__jscool_cff = true;
  const whileNode = t.whileStatement(t.booleanLiteral(true), cffBody);
  (whileNode as any).__jscool_cff = true;
  return [
    t.variableDeclaration("var", [
      t.variableDeclarator(t.identifier(routeVar), t.callExpression(t.memberExpression(t.stringLiteral(route), t.identifier("split")), [t.stringLiteral("|")])),
      t.variableDeclarator(t.identifier(indexVar), parseExpression(obfuscateNumberValue(0))),
    ]),
    whileNode,
  ];
}

function collectObjectPropertyKeys(node: t.ObjectExpression, collected: string[]): void {
  node.properties.forEach((prop) => {
    if (!t.isObjectProperty(prop) || prop.computed) return;
    if (t.isIdentifier(prop.key) && !shouldSkipIdentifier(prop.key.name)) collected.push(prop.key.name);
    if (t.isStringLiteral(prop.key) && prop.key.value.length > 0 && !shouldSkipIdentifier(prop.key.value)) collected.push(prop.key.value);
  });
}

function obfuscateObjectProperties(node: t.ObjectExpression, state: StringArrayState): void {
  node.properties.forEach((prop) => {
    if (!t.isObjectProperty(prop) || prop.computed) return;
    let keyName: string | null = null;
    if (t.isIdentifier(prop.key) && !shouldSkipIdentifier(prop.key.name)) keyName = prop.key.name;
    if (t.isStringLiteral(prop.key) && prop.key.value.length > 0 && !shouldSkipIdentifier(prop.key.value)) keyName = prop.key.value;
    if (!keyName || !state.indexMap.has(keyName)) return;
    prop.key = decoderCall(state, keyName);
    prop.computed = true;
    prop.shorthand = false;
  });
}

function templateToExpression(node: t.TemplateLiteral, state: StringArrayState): t.Expression {
  const parts: t.Expression[] = [];
  node.quasis.forEach((quasi, i) => {
    const text = quasi.value.cooked ?? quasi.value.raw;
    if (text) parts.push(decoderCall(state, text));
    if (node.expressions[i]) parts.push(node.expressions[i] as t.Expression);
  });
  if (parts.length === 0) return t.stringLiteral("");
  return parts.reduce((left, right) => t.binaryExpression("+", left, right));
}

function shouldSkipIdentifier(name: string): boolean {
  return ["undefined", "NaN", "Infinity", "arguments", "this", "super", "constructor", "prototype", "__proto__", "exports", "module", "require", "process", "global", "globalThis", "window", "document", "console", "Math", "JSON", "Object", "Array", "Function", "String", "Number", "Boolean", "RegExp", "Error", "Promise", "Symbol", "Map", "Set", "Date", "parseInt", "parseFloat", "isNaN", "isFinite", "eval", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "fetch", "XMLHttpRequest", "performance", "navigator", "location", "history", "atob", "btoa", "encodeURIComponent", "decodeURIComponent", "Buffer"].includes(name);
}

function parseAst(code: string): any {
  try {
    return parse(code, {
      sourceType: "unambiguous",
      allowReturnOutsideFunction: true,
      allowImportExportEverywhere: true,
      errorRecovery: true,
      plugins: ["jsx", "typescript"],
    });
  } catch {
    return parse(code, {
      sourceType: "script",
      allowReturnOutsideFunction: true,
      errorRecovery: true,
      plugins: ["jsx"],
    });
  }
}

const JUNK_OPS = [
  () => `var ${randomIdent(4)}=Math.floor(Math.random()*${obfuscateNumberValue(randomInt(1000, 99999))});`,
  () => `void(${obfuscateNumberValue(randomInt(0, 1e9))}^${obfuscateNumberValue(randomInt(0, 1e9))});`,
  () => `(function(){try{throw new Error('${randomHex(8)}')}catch(e){}})();`,
  () => `var ${randomIdent(4)}=(function(){return Array(${obfuscateNumberValue(randomInt(2, 20))}).join('${randomHex(4)}')})();`,
  () => `if(${obfuscateNumberValue(randomInt(0, 9999))}<${obfuscateNumberValue(randomInt(10000, 99999))}){var ${randomIdent(4)}=null;}`,
  () => `[${Array.from({ length: randomInt(3, 8) }, () => obfuscateNumberValue(randomInt(0, 255))).join(",")}].reverse();`,
  () => `try{Object.freeze({a:${obfuscateNumberValue(randomInt(1, 999))}})}catch(e){}`,
];

function genJunkCode(count: number): string {
  return Array.from({ length: count }, () => JUNK_OPS[randomInt(0, JUNK_OPS.length - 1)]()).join("\n");
}

function buildNativeShadowBlock(): string {
  const n = randomIdent(7);
  return `
var ${n}=(function(_w){var _F=Function.prototype,_O=Object,_J=JSON;return{w:_w,st:_w&&_w.setTimeout,ct:_w&&_w.clearTimeout,si:_w&&_w.setInterval,ci:_w&&_w.clearInterval,fe:_w&&_w.fetch,xh:_w&&_w.XMLHttpRequest,fp:_F.toString,fc:_F.call,fa:_F.apply,ok:_O.keys,od:_O.defineProperty,js:_J&&_J.stringify,jp:_J&&_J.parse}})(typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:this);
`;
}

function buildAntiHookBlock(): string {
  const fnN = randomIdent(5);
  const listN = randomIdent(5);
  const trapN = randomIdent(5);
  return `
(function(){
  function ${fnN}(fn){try{var s=Function.prototype.toString.call(fn);if(!/native code/.test(s))throw 1}catch(e){try{debugger}catch(e2){}}}
  var ${listN}=[setTimeout,clearTimeout,setInterval,clearInterval,JSON.stringify,JSON.parse,Object.keys,Object.assign,Object.defineProperty,Array.prototype.map,Array.prototype.forEach,Array.prototype.filter,Function.prototype.toString,Function.prototype.call,Function.prototype.apply,eval,parseInt,parseFloat,decodeURIComponent,encodeURIComponent];
  for(var _i=0;_i<${listN}.length;_i++){if(${listN}[_i])${fnN}(${listN}[_i])}
  function ${trapN}(){var _z=0;for(var _i=0;_i<2048;_i++)_z=(_z^((_i<<2)+_i))|0;try{debugger}catch(e){}return _z}
  try{Object.defineProperty(${trapN},'toString',{value:function(){return 'function setTimeout() { [native code] }'}})}catch(e){}
})();
`;
}

function buildAntiDebugBlock(): string {
  const timingN = randomIdent(5);
  const burnN = randomIdent(5);
  return `
(function(){
  if(typeof window==='undefined')return;
  function ${burnN}(n){var x=0,m=Math.min(n||0,700000);for(var i=0;i<m;i++)x=((x<<1)^(i+x))|0;return x}
  function ${timingN}(){try{if(typeof performance==='undefined'||!performance.now)return;var _s=performance.now();(function(){debugger;return ${burnN}(32)})();var _d=performance.now()-_s;if(_d>120||(window.outerWidth-window.innerWidth>160)||(window.outerHeight-window.innerHeight>160)){for(var i=0;i<3;i++){try{debugger}catch(e){}${burnN}(180000+i*50000)}}}catch(e){}}
  try{${timingN}();setInterval(${timingN},900+(${obfuscateNumberValue(17)}%250))}catch(e){}
})();
`;
}

function buildAntiProxyBlock(state: StringArrayState): string {
  const chkN = randomIdent(5);
  const google = state.indexMap.get("https://www.google.com/favicon.ico") ?? 0;
  const mode = state.indexMap.get("no-cors") ?? 0;
  const cache = state.indexMap.get("no-store") ?? 0;
  const load = state.indexMap.get("load") ?? 0;
  const header = state.indexMap.get("x-httptoolkit-injected") ?? 0;
  return `
(function(){
  if(typeof window==='undefined'||typeof fetch==='undefined')return;
  var ${chkN}=function(){var _t=Date.now();fetch(${state.decoderName}(${obfuscateNumberValue(google)}),{mode:${state.decoderName}(${obfuscateNumberValue(mode)}),cache:${state.decoderName}(${obfuscateNumberValue(cache)})}).then(function(){if(Date.now()-_t>3000){try{debugger}catch(e){}}}).catch(function(){})};
  try{var _origOpen=XMLHttpRequest.prototype.open,_origSend=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.open=function(){this.__jscool_ts=Date.now();return _origOpen.apply(this,arguments)};XMLHttpRequest.prototype.send=function(){var _self=this;this.addEventListener(${state.decoderName}(${obfuscateNumberValue(load)}),function(){var _cert=_self.getResponseHeader&&_self.getResponseHeader(${state.decoderName}(${obfuscateNumberValue(header)}));if(_cert){try{debugger}catch(e){}}});return _origSend.apply(this,arguments)}}catch(e){}
  try{${chkN}()}catch(e){}
})();
`;
}

function simpleHash(code: string): number {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (Math.imul(31, h) + code.charCodeAt(i)) | 0;
  return h;
}

function buildSelfDefendBlock(codeHash: number): string {
  const a = randomInt(100000, 999999999);
  const b = codeHash ^ a;
  const guard = randomIdent(5);
  return `
(function(){
  var ${guard}=(${a}^${b});
  if(typeof ${guard}!=='number'||(${guard}|0)!==(${codeHash}|0)){try{debugger}catch(e){}return}
})();
`;
}

function transformAST(
  code: string,
  addJunk: boolean,
  addCFF: boolean,
  saState: StringArrayState,
  collectStrings: boolean
): { transformedCode: string; collectedStrings: string[] } {
  const collected: string[] = [];
  const ast = parseAst(code);
  const identMap = new Map<string, string>();

  traverse(ast, {
    StringLiteral: {
      enter(nodePath: any) {
        const val: string = nodePath.node.value;
        if (collectStrings && val.length > 0 && canReplaceStringLiteral(nodePath)) collected.push(val);
      },
      exit(nodePath: any) {
        const val: string = nodePath.node.value;
        if (!collectStrings && saState.indexMap.has(val) && canReplaceStringLiteral(nodePath)) nodePath.replaceWith(decoderCall(saState, val));
      },
    },

    TemplateLiteral: {
      enter(nodePath: any) {
        if (!collectStrings || t.isTaggedTemplateExpression(nodePath.parent)) return;
        nodePath.node.quasis.forEach((q: t.TemplateElement) => {
          const val = q.value.cooked ?? q.value.raw;
          if (val) collected.push(val);
        });
      },
      exit(nodePath: any) {
        if (collectStrings || t.isTaggedTemplateExpression(nodePath.parent)) return;
        nodePath.replaceWith(templateToExpression(nodePath.node, saState));
      },
    },

    MemberExpression: {
      enter(nodePath: any) {
        if (!collectStrings) return;
        if (!nodePath.node.computed && t.isIdentifier(nodePath.node.property) && !t.isPrivateName(nodePath.node.property)) collected.push(nodePath.node.property.name);
      },
      exit(nodePath: any) {
        if (collectStrings) return;
        if (!nodePath.node.computed && t.isIdentifier(nodePath.node.property) && !t.isPrivateName(nodePath.node.property)) {
          const prop = nodePath.node.property.name;
          if (saState.indexMap.has(prop)) {
            nodePath.node.property = decoderCall(saState, prop);
            nodePath.node.computed = true;
          }
        }
      },
    },

    ObjectExpression: {
      enter(nodePath: any) {
        if (collectStrings) collectObjectPropertyKeys(nodePath.node, collected);
      },
      exit(nodePath: any) {
        if (!collectStrings) obfuscateObjectProperties(nodePath.node, saState);
      },
    },

    NumericLiteral: {
      exit(nodePath: any) {
        if (collectStrings || !canReplaceNumberLiteral(nodePath)) return;
        const value = nodePath.node.value;
        if (Math.floor(value) === value && Math.abs(value) <= 0x7fffffff) nodePath.replaceWith(parseExpression(obfuscateNumberValue(value)));
      },
    },

    BlockStatement: {
      exit(nodePath: any) {
        if (collectStrings || !addCFF) return;
        if (nodePath.node.__jscool_cff) return;
        if (nodePath.findParent((p: any) => p.node?.__jscool_cff)) return;
        if (!nodePath.parentPath?.isFunctionDeclaration?.() && !nodePath.parentPath?.isFunctionExpression?.() && !nodePath.parentPath?.isArrowFunctionExpression?.()) return;
        const body = nodePath.node.body as t.Statement[];
        if (!canApplyControlFlowFlattening(body)) return;
        nodePath.node.body = applyControlFlowFlattening(body);
        nodePath.skip();
      },
    },

    Identifier(nodePath: any) {
      if (collectStrings) return;
      const name: string = nodePath.node.name;
      if (shouldSkipIdentifier(name)) return;
      if (name.startsWith("_") && /[^\x00-\x7F]/.test(name)) return;
      if (nodePath.isReferencedIdentifier() || nodePath.isBindingIdentifier()) {
        const binding = nodePath.scope?.getBinding(name);
        if (binding) {
          if (!identMap.has(name)) identMap.set(name, randomIdent(7));
          nodePath.node.name = identMap.get(name)!;
        }
      }
    },

  });

  if (!collectStrings && addJunk) {
    const programBody = ast.program.body as t.Statement[];
    const junkCount = randomInt(8, 20);
    for (let i = 0; i < junkCount; i++) {
      const insertAt = randomInt(0, programBody.length);
      try {
        const junkAst = parse(genJunkCode(randomInt(1, 3)), { sourceType: "script", errorRecovery: true });
        programBody.splice(insertAt, 0, ...junkAst.program.body);
      } catch {}
    }
  }

  const result = generate(ast as any, { compact: true, minified: true, comments: false, jsescOption: { minimal: false } });
  return { transformedCode: result.code, collectedStrings: collected };
}

async function obfuscate(sourceCode: string, options: { addAntiHook: boolean; addJunk: boolean; addCFF: boolean }): Promise<string> {
  const dummyState: StringArrayState = { arrName: "_dummy", decoderName: "_dummyDec", strings: [], indexMap: new Map() };
  const firstPass = transformAST(sourceCode, false, false, dummyState, true);
  const runtimeStrings = ["https://www.google.com/favicon.ico", "no-cors", "no-store", "load", "x-httptoolkit-injected"];
  const uniqueStrings = [...new Set([...firstPass.collectedStrings, ...runtimeStrings])].filter((s) => s.length > 0);
  const saState = buildStringArray(uniqueStrings);
  const secondPass = transformAST(sourceCode, options.addJunk, options.addCFF, saState, false);
  const stringPreamble = emitStringArrayPreamble(saState);
  const nativeShadowBlock = buildNativeShadowBlock();
  const antiHookBlock = options.addAntiHook ? buildAntiHookBlock() : "";
  const antiDebugBlock = buildAntiDebugBlock();
  const antiProxyBlock = buildAntiProxyBlock(saState);
  const codeHash = simpleHash(secondPass.transformedCode);
  const selfDefendBlock = buildSelfDefendBlock(codeHash);
  const deadCode = options.addJunk ? genJunkCode(randomInt(15, 30)) : "";
  const iifeName = randomIdent(8);
  const watermark = `
  var __INFO__ = {
    'Obfuscator': 'KTN',
    'Obfuscator Owner': 'Trương Nhật Bảo Nam - ktn',
    'Contact': 'https://github.com/Swp-dev/Javascript-Cool/',
  };
  /** Generated: ${new Date().toISOString()} | https://tanstack-start-app.kingktn.workers.dev/ */
  `;

  return `${watermark}
;(function ${iifeName}(){
${nativeShadowBlock}
${stringPreamble}
${antiHookBlock}
${antiDebugBlock}
${antiProxyBlock}
${selfDefendBlock}
${deadCode}
${secondPass.transformedCode}
})();`;
}

async function main() {
  printBanner();
  console.log(`\n${GREEN}${BOLD}[JScool]${RESET} Welcome to the High-Extreme JavaScript Obfuscator.\n`);
  const inputPath = (await prompt(`${YELLOW}Enter input JS file path: ${RESET}`)).replace(/^[\'"]|[\'"]$/g, "");

  if (!fs.existsSync(inputPath)) {
    console.error(`${RED}[ERROR] File not found: ${inputPath}${RESET}`);
    process.exit(1);
  }

  const ext = path.extname(inputPath).toLowerCase();
  if (ext !== ".js" && ext !== ".mjs" && ext !== ".cjs") {
    console.error(`${RED}[ERROR] Only .js / .mjs / .cjs files are supported.${RESET}`);
    process.exit(1);
  }

  const sourceCode = fs.readFileSync(inputPath, "utf-8");
  console.log(`${GREEN}[✓]${RESET} Loaded ${sourceCode.length.toLocaleString()} chars from ${CYAN}${inputPath}${RESET}`);

  const addAntiHook = await askYN(`\nAdd ${MAGENTA}Anti-Hooking${RESET} (native function integrity check)?`);
  const addJunk = await askYN(`Add ${MAGENTA}Junk / Dead Code${RESET} injection?`);
  const addCFF = await askYN(`Add ${MAGENTA}Control Flow Flattening${RESET} (switch / route obfuscation)?`);

  closeRl();

  console.log(`\n${DIM}────────────────────────────────────────────────────${RESET}`);
  console.log(`${GREEN}[*]${RESET} Starting obfuscation pipeline…`);
  console.log(`${DIM}  › Anti-Hook:    ${addAntiHook ? GREEN + "ON" : RED + "OFF"}${RESET}`);
  console.log(`${DIM}  › Anti-Debug:   ${GREEN}ON (always)${RESET}`);
  console.log(`${DIM}  › Anti-Proxy:   ${GREEN}ON (always)${RESET}`);
  console.log(`${DIM}  › AST Transform:${GREEN} ON (always)${RESET}`);
  console.log(`${DIM}  › String Array: ${GREEN}ON (multi-layer)${RESET}`);
  console.log(`${DIM}  › Prop Proxy:   ${GREEN}ON (always)${RESET}`);
  console.log(`${DIM}  › Number Obf:   ${GREEN}ON (always)${RESET}`);
  console.log(`${DIM}  › CFF:          ${addCFF ? GREEN + "ON" : RED + "OFF"}${RESET}`);
  console.log(`${DIM}  › Junk Code:    ${addJunk ? GREEN + "ON" : RED + "OFF"}${RESET}`);
  console.log(`${DIM}────────────────────────────────────────────────────${RESET}\n`);

  let result: string;
  try {
    result = await obfuscate(sourceCode, { addAntiHook, addJunk, addCFF });
  } catch (e: any) {
    console.error(`${RED}[ERROR] Obfuscation failed: ${e.message}${RESET}`);
    if (e.stack) console.error(DIM + e.stack + RESET);
    process.exit(1);
  }

  const baseName = path.basename(inputPath, ext);
  const outDir = path.dirname(inputPath);
  const outputPath = path.join(outDir, `${baseName}.obf${ext}`);
  fs.writeFileSync(outputPath, result, "utf-8");

  console.log(`${GREEN}${BOLD}[✓] Done!${RESET}`);
  console.log(`${GREEN}[✓]${RESET} Output written to: ${CYAN}${outputPath}${RESET}`);
  console.log(`${GREEN}[✓]${RESET} Original size: ${YELLOW}${sourceCode.length.toLocaleString()}${RESET} bytes`);
  console.log(`${GREEN}[✓]${RESET} Obfuscated size: ${YELLOW}${result.length.toLocaleString()}${RESET} bytes`);
  console.log(`${DIM}────────────────────────────────────────────────────${RESET}`);
  console.log(`${DIM}  JScool — Keep your code safe.${RESET}\n`);
}

main().catch((e) => {
  console.error(`${RED}Fatal: ${e.message}${RESET}`);
  process.exit(1);
});
