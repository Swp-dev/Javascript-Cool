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
  rotateBy: number;
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
  const rotateBy = encoded.length > 1 ? randomInt(1, Math.min(encoded.length - 1, 64)) : 0;
  return { arrName, decoderName, strings: encoded, indexMap, rotateBy };
}

function splitStringLiteral(s: string): string {
  if (s.length < 8) return JSON.stringify(s);
  const parts = randomInt(2, 3);
  const chunkSize = Math.ceil(s.length / parts);
  const chunks: string[] = [];
  for (let i = 0; i < s.length; i += chunkSize) chunks.push(JSON.stringify(s.slice(i, i + chunkSize)));
  return "(" + chunks.join("+") + ")";
}

function emitStringArrayLiteral(state: StringArrayState): string {
  const items = state.strings.map((triple) => {
    const [mode, key, payload] = triple;
    return `[${mode},${JSON.stringify(key)},${splitStringLiteral(payload)}]`;
  });
  return `[${items.join(",")}]`;
}

function emitStringArrayPreamble(state: StringArrayState): string {
  const arrLit = emitStringArrayLiteral(state);
  const cacheN = randomIdent(6);
  const arrN = state.arrName;
  const decN = state.decoderName;
  const rotN = randomIdent(5);
  const rot = state.rotateBy | 0;
  return `
var ${arrN}=${arrLit},${cacheN}={};
(function(arr,n){if(!n)return;var x=function(){return arr.push(arr.shift())};while(n-- >0)x()})(${arrN},${rot});
function ${decN}(i){
  var ${rotN}=${rot};
  var _len=${arrN}.length;
  var _i=((((i|0)-${rotN})%_len)+_len)%_len;
  if(${cacheN}[_i])return ${cacheN}[_i];
  var _hasAtob=(typeof atob==='function');
  var _hasBuf=(typeof Buffer!=='undefined'&&Buffer&&typeof Buffer.from==='function');
  var _a=_hasAtob?atob:(_hasBuf?function(x){return Buffer.from(x,'base64').toString('binary')}:function(x){return x});
  var _u=function(x){try{return decodeURIComponent(escape(x))}catch(e){return _hasBuf?Buffer.from(x,'binary').toString('utf8'):x}};
  var _r=function(x){return x.split('').reverse().join('')};
  var _x=function(d,k){var o='';for(var i=0;i<d.length;i++)o+=String.fromCharCode(d.charCodeAt(i)^k.charCodeAt(i%k.length));return o};
  var _q=function(k,d){var s=[],j=0,i,r='',x=0,y=0,t;for(i=0;i<256;i++)s[i]=i;for(i=0;i<256;i++){j=(j+s[i]+k.charCodeAt(i%k.length))&255;t=s[i];s[i]=s[j];s[j]=t}for(i=0;i<d.length;i++){x=(x+1)&255;y=(y+s[x])&255;t=s[x];s[x]=s[y];s[y]=t;r+=String.fromCharCode(d.charCodeAt(i)^s[(s[x]+s[y])&255])}return r};
  var _v=${arrN}[_i],_m=_v[0],_k=_v[1],_d=_v[2],_o='';
  if(_m===0)_o=_u(_q(_k,_x(_a(_r(_d)),_r(_k))));
  else if(_m===1)_o=_r(_u(_x(_a(_r(_d)),_k)));
  else if(_m===2)_o=_u(_a(_x(_a(_d),_k)));
  else _o=_r(_u(_q(_k,_a(_d))));
  return ${cacheN}[_i]=_o;
}
`;
}

function obfuscateNumberValue(value: number): string {

  if (!Number.isFinite(value) || Math.floor(value) !== value || Math.abs(value) > 0x7fffffff) return String(value);
  const k = randomInt(17, 0x3fff);
  const mode = randomInt(0, 4);

  if (mode === 0) return `((${value ^ k})^${k})`;
  if (mode === 1) return `((${value + k})-${k})`;
  if (mode === 2) return `((${value - k})+${k})`;
  if (mode === 3) return `((${value | k})&${value | ~k})`;
  return `(${value}+0)`;
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

function opaqueTrue(): string {
  const n = randomInt(2, 0x3fff);
  const mode = randomInt(0, 2);
  if (mode === 0) return `((${n}*(${n}+1))%2===0)`;
  if (mode === 1) return `((${n}|0)===(${n}|0))`;
  return `(typeof undefined==='undefined')`;
}

function opaqueFalse(): string {
  const n = randomInt(2, 0x3fff);
  const mode = randomInt(0, 2);
  if (mode === 0) return `((${n}*(${n}+1))%2!==0)`;
  if (mode === 1) return `((${n}|0)!==(${n}|0))`;
  return `(typeof undefined!=='undefined')`;
}

function statementHasUnsafeFlow(stmt: t.Statement): boolean {
  let unsafe = false;
  const visit = (node: any): void => {
    if (!node || unsafe) return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (typeof node !== "object" || !node.type) return;
    if (
      t.isReturnStatement(node) ||
      t.isThrowStatement(node) ||
      t.isAwaitExpression(node) ||
      t.isYieldExpression(node) ||
      t.isBreakStatement(node) ||
      t.isContinueStatement(node)
    ) {
      unsafe = true;
      return;
    }
    if (t.isFunction(node)) return;
    for (const key of Object.keys(node)) {
      if (key === "loc" || key === "start" || key === "end" || key === "range" || key.startsWith("_")) continue;
      visit((node as any)[key]);
    }
  };
  visit(stmt);
  return unsafe;
}

function canApplyControlFlowFlattening(statements: t.Statement[]): boolean {
  if (statements.length < 3) return false;
  return !statements.some((stmt) => {
    if (t.isVariableDeclaration(stmt)) return stmt.kind !== "var";
    if (t.isBreakStatement(stmt) || t.isContinueStatement(stmt)) return true;
    if (t.isReturnStatement(stmt) || t.isThrowStatement(stmt)) return true;
    if (t.isLabeledStatement(stmt) || t.isFunctionDeclaration(stmt) || t.isClassDeclaration(stmt)) return true;
    if (t.isWhileStatement(stmt) || t.isDoWhileStatement(stmt) || t.isForStatement(stmt) || t.isForInStatement(stmt) || t.isForOfStatement(stmt)) return true;
    if (t.isTryStatement(stmt) || t.isSwitchStatement(stmt)) return true;
    if (t.isIfStatement(stmt)) return true;
    if (t.isDeclaration(stmt)) return true;
    if (statementHasUnsafeFlow(stmt)) return true;
    return false;
  });
}

function applyControlFlowFlattening(statements: t.Statement[]): t.Statement[] {
  if (!canApplyControlFlowFlattening(statements)) return statements;
  const n = statements.length;

  const stateIds: number[] = [];
  const used = new Set<number>();
  for (let i = 0; i < n; i++) {
    let s: number;
    do { s = randomInt(0x1000, 0xfffff); } while (used.has(s));
    used.add(s);
    stateIds.push(s);
  }

  const stateVar = randomIdent(6);
  const doneVar = randomIdent(6);

  const orderedCases: t.SwitchCase[] = statements.map((stmt, idx) => {
    const currentState = stateIds[idx];
    const isLast = idx === n - 1;
    let transition: t.Statement;
    if (isLast) {
      transition = t.expressionStatement(
        t.assignmentExpression("=", t.identifier(doneVar), parseExpression(opaqueTrue()))
      );
    } else {
      const nextState = stateIds[idx + 1];
      const delta = randomInt(1, 0x3fff);
      const mask = (currentState + delta) ^ nextState;
      const nextExpr = `((${obfuscateNumberValue(currentState)}+${obfuscateNumberValue(delta)})^${obfuscateNumberValue(mask)})`;
      transition = t.expressionStatement(
        t.assignmentExpression("=", t.identifier(stateVar), parseExpression(nextExpr))
      );
    }
    const caseBody = t.blockStatement([stmt, transition, t.continueStatement()]);
    (caseBody as any).__jscool_cff = true;
    return t.switchCase(parseExpression(obfuscateNumberValue(currentState)), [caseBody]);
  });

  const shuffledCases = [...orderedCases];
  for (let i = shuffledCases.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [shuffledCases[i], shuffledCases[j]] = [shuffledCases[j], shuffledCases[i]];
  }

  const whileTest = parseExpression(`!${doneVar}`);
  const cffBody = t.blockStatement([
    t.switchStatement(t.identifier(stateVar), shuffledCases),
    t.breakStatement(),
  ]);
  (cffBody as any).__jscool_cff = true;
  const whileNode = t.whileStatement(whileTest, cffBody);
  (whileNode as any).__jscool_cff = true;

  return [
    t.variableDeclaration("var", [
      t.variableDeclarator(t.identifier(stateVar), parseExpression(obfuscateNumberValue(stateIds[0]))),
      t.variableDeclarator(t.identifier(doneVar), parseExpression(opaqueFalse())),
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

  const parts: t.Expression[] = [t.stringLiteral("")];
  node.quasis.forEach((quasi, i) => {
    const text = quasi.value.cooked ?? quasi.value.raw;
    if (text) parts.push(decoderCall(state, text));
    if (node.expressions[i]) parts.push(node.expressions[i] as t.Expression);
  });
  return parts.reduce((left, right) => t.binaryExpression("+", left, right));
}

const SKIP_IDENT_SET = new Set([
  "undefined", "NaN", "Infinity", "arguments", "this", "super",
  "constructor", "prototype", "__proto__",
  "toString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toJSON",
  "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__",
  "length", "name", "then", "catch", "finally",
  "exports", "module", "require", "process", "global", "globalThis", "window", "document", "console", "self",
  "Math", "JSON", "Object", "Array", "Function", "String", "Number", "Boolean", "RegExp", "Error",
  "Promise", "Symbol", "Map", "Set", "WeakMap", "WeakSet", "Date", "BigInt", "Reflect", "Proxy",
  "parseInt", "parseFloat", "isNaN", "isFinite", "eval",
  "setTimeout", "clearTimeout", "setInterval", "clearInterval",
  "fetch", "XMLHttpRequest", "performance", "navigator", "location", "history",
  "atob", "btoa", "encodeURIComponent", "decodeURIComponent", "Buffer",
  "default", "import", "export",
  "displayName", "props", "state", "ref", "key", "children",
]);

function shouldSkipIdentifier(name: string): boolean {
  return SKIP_IDENT_SET.has(name);
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

function importDeclToDynamic(node: t.ImportDeclaration): string {
  const src = JSON.stringify(node.source.value);
  const specs = node.specifiers;
  if (specs.length === 0) return `await import(${src});`;
  const defSpec = specs.find((s): s is t.ImportDefaultSpecifier => t.isImportDefaultSpecifier(s));
  const nsSpec  = specs.find((s): s is t.ImportNamespaceSpecifier => t.isImportNamespaceSpecifier(s));
  const named   = specs.filter((s): s is t.ImportSpecifier => t.isImportSpecifier(s));
  const lines: string[] = [];
  if (nsSpec) {
    lines.push(`var ${nsSpec.local.name}=(await import(${src}));`);
  } else if (defSpec && named.length > 0) {
    const tmp = "_m" + randomHex(5);
    lines.push(`var ${tmp}=(await import(${src}));`);
    lines.push(`var ${defSpec.local.name}=(${tmp}.default!==undefined?${tmp}.default:${tmp});`);
    const pairs = named.map(s => {
      const imp = t.isIdentifier(s.imported) ? s.imported.name : (s.imported as t.StringLiteral).value;
      return imp === s.local.name ? imp : `${imp}:${s.local.name}`;
    }).join(",");
    lines.push(`var {${pairs}}=${tmp};`);
  } else if (defSpec) {
    lines.push(`var ${defSpec.local.name}=(await import(${src})).default??(await import(${src}));`);
  } else {
    const pairs = named.map(s => {
      const imp = t.isIdentifier(s.imported) ? s.imported.name : (s.imported as t.StringLiteral).value;
      return imp === s.local.name ? imp : `${imp}:${s.local.name}`;
    }).join(",");
    lines.push(`var {${pairs}}=(await import(${src}));`);
  }
  return lines.join("\n");
}

function extractTopLevelModuleDeclarations(ast: any): string {
  const keepNodes: t.Statement[] = [];
  const dynamicLines: string[] = [];
  for (const node of ast.program.body as t.Statement[]) {
    if (t.isImportDeclaration(node)) {
      dynamicLines.push(importDeclToDynamic(node));
    } else {
      keepNodes.push(node);
    }
  }
  ast.program.body = keepNodes;
  return dynamicLines.join("\n");
}

const JUNK_OPS = [
  () => `var ${randomIdent(4)}=Math.floor(Math.random()*${obfuscateNumberValue(randomInt(1000, 99999))});`,
  () => `void(${obfuscateNumberValue(randomInt(0, 1e9))}^${obfuscateNumberValue(randomInt(0, 1e9))});`,
  () => `(function(){try{throw new Error('${randomHex(8)}')}catch(e){}})();`,
  () => `var ${randomIdent(4)}=(function(){return Array(${obfuscateNumberValue(randomInt(2, 20))}).join('${randomHex(4)}')})();`,
  () => `if(${obfuscateNumberValue(randomInt(0, 9999))}<${obfuscateNumberValue(randomInt(10000, 99999))}){var ${randomIdent(4)}=null;}`,
  () => `[${Array.from({ length: randomInt(3, 8) }, () => obfuscateNumberValue(randomInt(0, 255))).join(",")}].reverse();`,
  () => `try{Object.freeze({a:${obfuscateNumberValue(randomInt(1, 999))}})}catch(e){}`,

  () => {
    const c = randomIdent(5), m = randomIdent(4), f = randomIdent(4);
    return `var ${c}=(function(){function ${c}(){this.${f}=${obfuscateNumberValue(randomInt(1, 9999))}}${c}.prototype.${m}=function(){return this.${f}^${obfuscateNumberValue(randomInt(1, 9999))}};return ${c}})();`;
  },

  () => {
    const o = randomIdent(5), s = randomIdent(4), g = randomIdent(4);
    return `var ${o}=(function(){var _v=${obfuscateNumberValue(randomInt(0, 9999))};return{${s}:function(x){_v=(_v^x)|0},${g}:function(){return _v}}})();`;
  },

  () => {
    const v = randomIdent(4);
    return `if(${opaqueFalse()}){var ${v}=${obfuscateNumberValue(randomInt(1, 9999))};throw new Error('${randomHex(6)}'+${v})}`;
  },

  () => `try{(typeof Promise!=='undefined')&&Promise.resolve(${obfuscateNumberValue(randomInt(0, 9999))}).then(function(_v){return _v})}catch(e){}`,

  () => `void(/${randomHex(4)}/.test('${randomHex(8)}'));`,

  () => {
    const a = randomIdent(4), b = randomIdent(4);
    return `if(${opaqueFalse()}){var ${a}={a:${obfuscateNumberValue(randomInt(1, 99))},b:${obfuscateNumberValue(randomInt(1, 99))}};var ${b}=${a}.a+${a}.b;}`;
  },

  () => {
    const v = randomIdent(4);
    return `var ${v}=(Date.now()&${obfuscateNumberValue(randomInt(1, 0xff))})|${obfuscateNumberValue(randomInt(0, 0xff))};if(${v}===-1){throw new Error('_'+${v})}`;
  },
  () => {
    const v = randomIdent(4);
    return `var ${v}=((Math.random()*${obfuscateNumberValue(randomInt(2, 100))})|0)+${obfuscateNumberValue(randomInt(0, 50))};void ${v};`;
  },
];

function genJunkCode(count: number): string {
  return Array.from({ length: count }, () => JUNK_OPS[randomInt(0, JUNK_OPS.length - 1)]()).join("\n");
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
  const poison = randomIdent(5);
  const burnVar = randomIdent(4);
  return `
(function(){
  var ${guard}=(${a}^${b});
  if(typeof ${guard}!=='number'||(${guard}|0)!==(${codeHash}|0)){
    try{debugger}catch(e){}
    var ${poison}=function(){var ${burnVar}=0;while(${opaqueTrue()}){${burnVar}=(${burnVar}+1)|0;try{debugger}catch(e){}}};
    try{${poison}()}catch(e){}
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
`;
}

type OpName =
  | "NOP" | "WIN_GUARD" | "DOC_GUARD" | "DEBUGGER" | "TIMING_START" | "TIMING_CHECK"
  | "BURN" | "HOOK_CHECK" | "SET_INTERVAL" | "ANTI_PROXY_FETCH"
  | "ANTI_PROXY_XHR" | "SELF_DEFEND" | "NATIVE_SHADOW" | "GLOBAL_INDIR"
  | "DEC_FETCH" | "CMP_REG" | "JMP" | "JMP_IF" | "STORE_GLOBAL"
  | "CHECK_DEVTOOLS" | "HOOK_CHECK_ALL" | "RAND_BURN" | "STACK_TRACE_CHECK"
  | "FULL_INTEGRITY" | "DONE";

const OP_NAMES: OpName[] = [
  "NOP", "WIN_GUARD", "DOC_GUARD", "DEBUGGER", "TIMING_START", "TIMING_CHECK",
  "BURN", "HOOK_CHECK", "SET_INTERVAL", "ANTI_PROXY_FETCH",
  "ANTI_PROXY_XHR", "SELF_DEFEND", "NATIVE_SHADOW", "GLOBAL_INDIR",
  "DEC_FETCH", "CMP_REG", "JMP", "JMP_IF", "STORE_GLOBAL",
  "CHECK_DEVTOOLS", "HOOK_CHECK_ALL", "RAND_BURN", "STACK_TRACE_CHECK",
  "FULL_INTEGRITY", "DONE",
];

function mintOpcodeMap(): Record<OpName, number> {
  const pool = new Set<number>();
  const map: Partial<Record<OpName, number>> = {};
  for (const name of OP_NAMES) {
    let n: number;
    do { n = randomInt(3, 250); } while (pool.has(n));
    pool.add(n);
    map[name] = n;
  }
  return map as Record<OpName, number>;
}

function buildVMBlock(addAntiHook: boolean, addAntiDebug: boolean, state: StringArrayState): string {
  const OP = mintOpcodeMap();
  const nativeFnSlots = [
    "setTimeout", "clearTimeout", "setInterval", "clearInterval",
    "JSON.stringify", "JSON.parse", "Object.keys", "Object.assign",
    "Object.defineProperty", "Array.prototype.map", "Array.prototype.forEach",
    "Array.prototype.filter", "Function.prototype.toString",
    "Function.prototype.call", "Function.prototype.apply",
    "eval", "parseInt", "parseFloat", "decodeURIComponent", "encodeURIComponent",
  ];

  const bytecodes: number[] = [];

  bytecodes.push(OP.NATIVE_SHADOW);
  bytecodes.push(OP.GLOBAL_INDIR);

  if (addAntiDebug) {
    bytecodes.push(OP.WIN_GUARD);
    bytecodes.push(OP.TIMING_START);
    bytecodes.push(OP.DEBUGGER);
    bytecodes.push(OP.TIMING_CHECK);
    bytecodes.push(OP.BURN);
    bytecodes.push(OP.CHECK_DEVTOOLS);
    bytecodes.push(OP.STACK_TRACE_CHECK);
    bytecodes.push(OP.RAND_BURN);
    bytecodes.push(OP.SET_INTERVAL);
  }

  if (addAntiHook) {
    bytecodes.push(OP.HOOK_CHECK_ALL);

    [0, 4, 8, 12, 15].forEach((slot) => {
      bytecodes.push(OP.HOOK_CHECK);
      bytecodes.push(slot);
    });
  }

  const urlIdx = state.indexMap.get("https://www.google.com/favicon.ico") ?? 0;
  const modeIdx = state.indexMap.get("no-cors") ?? 0;
  const cacheIdx = state.indexMap.get("no-store") ?? 0;
  const loadIdx = state.indexMap.get("load") ?? 0;
  const headerIdx = state.indexMap.get("x-httptoolkit-injected") ?? 0;
  bytecodes.push(OP.ANTI_PROXY_FETCH);
  bytecodes.push(urlIdx, modeIdx, cacheIdx);
  bytecodes.push(OP.ANTI_PROXY_XHR);
  bytecodes.push(loadIdx, headerIdx);

  bytecodes.push(OP.FULL_INTEGRITY);
  bytecodes.push(OP.SELF_DEFEND);

  bytecodes.push(OP.DONE);

  const vmN = randomIdent(6);
  const bcN = randomIdent(6);
  const ipN = randomIdent(4);
  const tN = randomIdent(4);
  const regN = randomIdent(4);
  const flagN = randomIdent(4);
  const shadowN = randomIdent(5);
  const indirN = randomIdent(5);
  const burnN = randomIdent(4);
  const hookFnN = randomIdent(4);
  const fnsN = randomIdent(5);
  const wN = randomIdent(4);
  const cN = randomIdent(4);
  const isMobN = randomIdent(4);
  const origToStrN = randomIdent(5);
  const bcStr = `[${bytecodes.join(",")}]`;
  const decoder = state.decoderName;
  const arrName = state.arrName;

  return `
(function(){
  var ${bcN}=${bcStr};
  var ${tN}=0,${regN}=0,${flagN}=0;
  var ${shadowN}=null,${indirN}=null;
  var ${wN}=typeof window!=='undefined'?window:typeof globalThis!=='undefined'?globalThis:typeof self!=='undefined'?self:null;
  var ${cN}=typeof console!=='undefined'?console:{log:function(){},warn:function(){},error:function(){}};

  var ${isMobN}=(function(){try{var _ua=(typeof navigator!=='undefined'&&navigator.userAgent)||'';return /Mobi|Android|iPhone|iPad|iPod|Touch|Tablet/i.test(_ua)||(typeof navigator!=='undefined'&&(navigator.maxTouchPoints|0)>1)}catch(e){return false}})();

  var ${origToStrN}=(function(){try{return Function.prototype.toString}catch(e){return null}})();
  var ${burnN}=function(m){var lim=Math.min(m|0,100000);if(${isMobN})lim=Math.min(lim,8000);var x=0;for(var i=0;i<lim;i++)x=((x<<1)^(i+x))|0;return x};
  var ${hookFnN}=function(fn){
    if(!fn)return;
    try{

      var s='';
      if(${origToStrN}){s=${origToStrN}.call(fn)}else{s=Function.prototype.toString.call(fn)}
      if(s.indexOf('[native code]')<0)throw 1;

      if(fn.toString&&fn.toString!==Function.prototype.toString&&typeof fn.toString==='function'){
        var s2=${origToStrN}?${origToStrN}.call(fn.toString):Function.prototype.toString.call(fn.toString);
        if(s2.indexOf('[native code]')<0)throw 2;
      }
    }catch(e){try{debugger}catch(e2){}}
  };
  var ${fnsN}=[
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
  var ${vmN}=function(){
    var ${ipN}=0;
    while(${ipN}<${bcN}.length){
      var _op=${bcN}[${ipN}++];

      if(_op===${OP.NOP}){}
      else if(_op===${OP.WIN_GUARD}){if(${wN}===null||typeof window==='undefined')return;}
      else if(_op===${OP.DOC_GUARD}){if(typeof document==='undefined')return;}
      else if(_op===${OP.DEBUGGER}){try{debugger}catch(e){}}
      else if(_op===${OP.TIMING_START}){try{${tN}=typeof performance!=='undefined'&&performance.now?performance.now():Date.now()}catch(e){}}
      else if(_op===${OP.TIMING_CHECK}){
        try{
          var _d=(typeof performance!=='undefined'&&performance.now?performance.now():Date.now())-${tN};
          if(_d>(${isMobN}?500:120)){for(var _qi=0;_qi<3;_qi++){try{debugger}catch(e){}${burnN}(${isMobN}?6000:60000+_qi*30000)}}
        }catch(e){}
      }
      else if(_op===${OP.BURN}){${burnN}(32)}
      else if(_op===${OP.RAND_BURN}){try{${burnN}(${isMobN}?((Math.random()*256)|0):((Math.random()*2048)|0)+256)}catch(e){}}
      else if(_op===${OP.CHECK_DEVTOOLS}){
        try{
          if(${wN}&&((${wN}.outerWidth-${wN}.innerWidth)>160||(${wN}.outerHeight-${wN}.innerHeight)>160)){
            for(var _ci=0;_ci<2;_ci++){try{debugger}catch(e){}${burnN}(${isMobN}?5000:40000+_ci*15000)}
          }

          var _trap={};
          try{Object.defineProperty(_trap,'toString',{get:function(){try{debugger}catch(e){}${burnN}(${isMobN}?2000:20000);return ''}})}catch(e){}
          if(${cN}&&typeof ${cN}.log==='function'){try{${cN}.log.call(${cN},_trap)}catch(e){}}
        }catch(e){}
      }
      else if(_op===${OP.STACK_TRACE_CHECK}){

        try{
          var _err=new Error('x');
          var _stk=(_err&&_err.stack)?String(_err.stack):'';
          if(_stk){
            var _bad=/\\b(devtools?|chrome-extension|debugger|inspector)\\b/i;
            if(_bad.test(_stk)){try{debugger}catch(e){}${burnN}(${isMobN}?3000:25000)}

            var _depth=(_stk.match(/\\n/g)||[]).length;
            if(_depth>40){try{debugger}catch(e){}${burnN}(${isMobN}?2000:15000)}
          }
        }catch(e){}
      }
      else if(_op===${OP.SET_INTERVAL}){try{if(typeof setInterval!=='undefined')setInterval(${vmN},${isMobN}?4500:1500+(${obfuscateNumberValue(17)}%250))}catch(e){}}
      else if(_op===${OP.HOOK_CHECK}){var _fi=${bcN}[${ipN}++];if(${fnsN}[_fi])${hookFnN}(${fnsN}[_fi]);}
      else if(_op===${OP.HOOK_CHECK_ALL}){for(var _hi=0;_hi<${fnsN}.length;_hi++){if(${fnsN}[_hi])${hookFnN}(${fnsN}[_hi])}}
      else if(_op===${OP.ANTI_PROXY_FETCH}){
        var _u=${bcN}[${ipN}++],_m=${bcN}[${ipN}++],_c=${bcN}[${ipN}++];
        try{
          if(${wN}&&typeof fetch!=='undefined'){
            var _t0=Date.now();
            fetch(${decoder}(_u),{mode:${decoder}(_m),cache:${decoder}(_c)}).then(function(){
              if(Date.now()-_t0>3000){try{debugger}catch(e){}}
            }).catch(function(){});
          }
        }catch(e){}
      }
      else if(_op===${OP.ANTI_PROXY_XHR}){
        var _l=${bcN}[${ipN}++],_h=${bcN}[${ipN}++];
        try{
          if(typeof XMLHttpRequest!=='undefined'&&!XMLHttpRequest.prototype.__jscool_wrapped){

            XMLHttpRequest.prototype.__jscool_wrapped=true;
            var _xo=XMLHttpRequest.prototype.open,_xs=XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.open=function(){this.__jscool_ts=Date.now();return _xo.apply(this,arguments)};
            XMLHttpRequest.prototype.send=function(){var _self=this;try{this.addEventListener(${decoder}(_l),function(){try{var _cert=_self.getResponseHeader&&_self.getResponseHeader(${decoder}(_h));if(_cert){try{debugger}catch(e){}}}catch(e){}})}catch(e){}return _xs.apply(this,arguments)};
          }
        }catch(e){}
      }
      else if(_op===${OP.FULL_INTEGRITY}){

        try{
          if(typeof window!=='undefined'&&typeof document!=='undefined'){
            var _cs=document.currentScript;
            if(_cs&&!_cs.src&&typeof _cs.textContent==='string'){
              var _s=_cs.textContent,_h2=0;
              for(var _si=0;_si<_s.length;_si++)_h2=(Math.imul(31,_h2)+_s.charCodeAt(_si))|0;
              if(${shadowN})${shadowN}.fullHash=_h2;
              ${regN}=_h2;
            }
          }
        }catch(e){}
      }
      else if(_op===${OP.SELF_DEFEND}){

        try{
          if(typeof window!=='undefined'&&typeof document!=='undefined'){
            var _cs2=document.currentScript;
            if(_cs2&&!_cs2.src&&typeof _cs2.textContent==='string'&&_cs2.textContent.length>=64){
              if(${regN}===0){try{debugger}catch(e){}${burnN}(${isMobN}?4000:30000)}

              var _t2=_cs2.textContent,_h3=0x811c9dc5;
              for(var _ti=0;_ti<_t2.length;_ti++)_h3=(Math.imul(_h3^_t2.charCodeAt(_ti),16777619))|0;
              if(_h3===0||_h3===${regN}){try{debugger}catch(e){}${burnN}(${isMobN}?4000:30000)}
            }
          }
        }catch(e){}
      }
      else if(_op===${OP.NATIVE_SHADOW}){
        try{
          var _F=Function.prototype,_O=Object,_J=typeof JSON!=='undefined'?JSON:null;
          ${shadowN}={
            w:${wN},
            st:${wN}&&${wN}.setTimeout,ct:${wN}&&${wN}.clearTimeout,
            si:${wN}&&${wN}.setInterval,ci:${wN}&&${wN}.clearInterval,
            fe:${wN}&&${wN}.fetch,xh:${wN}&&${wN}.XMLHttpRequest,
            fp:_F.toString,fc:_F.call,fa:_F.apply,
            ok:_O.keys,od:_O.defineProperty,
            js:_J&&_J.stringify,jp:_J&&_J.parse,
            fullHash:0
          };
        }catch(e){${shadowN}={fullHash:0}}
      }
      else if(_op===${OP.GLOBAL_INDIR}){
        try{
          var _check=function(fn){try{var _ts=${origToStrN}?${origToStrN}.call(fn):Function.prototype.toString.call(fn);return _ts.indexOf('[native code]')>=0}catch(e){return false}};
          var _wrap=function(fn,ctx){return function(){if(_check(fn))return fn.apply(ctx||this,arguments);return fn.apply(ctx||this,arguments)}};
          ${indirN}={
            log:${cN}&&${cN}.log?_wrap(${cN}.log,${cN}):function(){},
            warn:${cN}&&${cN}.warn?_wrap(${cN}.warn,${cN}):function(){},
            error:${cN}&&${cN}.error?_wrap(${cN}.error,${cN}):function(){},
            fetch:${wN}&&${wN}.fetch?_wrap(${wN}.fetch,${wN}):null,
            xr:${wN}&&${wN}.XMLHttpRequest||null,
            win:${wN}||null,
            doc:typeof document!=='undefined'?document:null
          };
        }catch(e){${indirN}={}}
      }
      else if(_op===${OP.DEC_FETCH}){var _di=${bcN}[${ipN}++];try{${regN}=${decoder}(_di)}catch(e){${regN}=null}}
      else if(_op===${OP.CMP_REG}){var _cv=${bcN}[${ipN}++];${flagN}=(${regN}===_cv)?1:0;}
      else if(_op===${OP.JMP}){var _off=${bcN}[${ipN}++];${ipN}+=_off|0;}
      else if(_op===${OP.JMP_IF}){var _off2=${bcN}[${ipN}++];if(${flagN})${ipN}+=_off2|0;}
      else if(_op===${OP.STORE_GLOBAL}){
        var _gi=${bcN}[${ipN}++];
        try{
          if(${wN}){var _gk=${decoder}(_gi);${wN}[_gk]=${regN};}
        }catch(e){}
      }
      else if(_op===${OP.DONE}){break}

      if(${arrName}&&${arrName}.length>0&&(${ipN}&7)===0){try{${decoder}((${ipN}*2654435761)>>>0)}catch(e){}}
    }
  };
  try{${vmN}()}catch(e){}
})();
`;
}

function isUnsafeBindingForRename(binding: any): boolean {
  if (!binding) return true;
  const p = binding.path;
  if (!p) return true;
  if (typeof p.isImportSpecifier === "function" && p.isImportSpecifier()) return true;
  if (typeof p.isImportDefaultSpecifier === "function" && p.isImportDefaultSpecifier()) return true;
  if (typeof p.isImportNamespaceSpecifier === "function" && p.isImportNamespaceSpecifier()) return true;
  if (typeof p.isExportSpecifier === "function" && p.isExportSpecifier()) return true;
  if (typeof p.isExportDefaultSpecifier === "function" && p.isExportDefaultSpecifier()) return true;
  if (typeof p.isExportNamespaceSpecifier === "function" && p.isExportNamespaceSpecifier()) return true;
  if (binding.kind === "module") return true;
  return false;
}

function transformAST(
  code: string,
  addJunk: boolean,
  addCFF: boolean,
  saState: StringArrayState,
  collectStrings: boolean
): { transformedCode: string; collectedStrings: string[]; hoistedImports: string } {
  const collected: string[] = [];
  const ast = parseAst(code);
  const hoistedImports = extractTopLevelModuleDeclarations(ast);
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
          if (shouldSkipIdentifier(prop)) return;
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

    BooleanLiteral: {
      exit(nodePath: any) {
        if (collectStrings) return;
        if ((nodePath.node as any).__jscool_obf) return;
        if (nodePath.findParent((p: any) => p.node?.__jscool_cff || p.node?.__jscool_obf)) return;
        const val: boolean = nodePath.node.value;
        const replacement = parseExpression(val ? opaqueTrue() : opaqueFalse());
        nodePath.replaceWith(replacement);
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
      const parent = nodePath.parent;
      const parentPath = nodePath.parentPath;

      if (t.isMemberExpression(parent) && parent.property === nodePath.node && !parent.computed) return;

      if (t.isOptionalMemberExpression(parent) && parent.property === nodePath.node && !parent.computed) return;

      if ((t.isObjectProperty(parent) || t.isObjectMethod(parent)) && parent.key === nodePath.node && !parent.computed) return;
      if (t.isClassProperty(parent) && parent.key === nodePath.node && !parent.computed) return;
      if (t.isClassMethod(parent) && parent.key === nodePath.node && !parent.computed) return;
      if (t.isClassPrivateProperty?.(parent) || t.isClassPrivateMethod?.(parent)) return;

      if (parentPath && (
        parentPath.isJSXOpeningElement?.() ||
        parentPath.isJSXClosingElement?.() ||
        parentPath.isJSXAttribute?.() ||
        parentPath.isJSXMemberExpression?.() ||
        parentPath.isJSXSpreadAttribute?.() ||
        parentPath.isJSXNamespacedName?.()
      )) return;
      if (nodePath.isReferencedIdentifier() || nodePath.isBindingIdentifier()) {
        const binding = nodePath.scope?.getBinding(name);
        if (!binding) return;
        if (isUnsafeBindingForRename(binding)) return;

        if (SKIP_IDENT_SET.has(name)) return;
        if (!identMap.has(name)) identMap.set(name, randomIdent(7));
        nodePath.node.name = identMap.get(name)!;
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
  return { transformedCode: result.code, collectedStrings: collected, hoistedImports };
}

async function obfuscate(sourceCode: string, options: { addAntiHook: boolean; addJunk: boolean; addCFF: boolean }): Promise<string> {
  const dummyState: StringArrayState = { arrName: "_dummy", decoderName: "_dummyDec", strings: [], indexMap: new Map(), rotateBy: 0 };
  const firstPass = transformAST(sourceCode, false, false, dummyState, true);
  const runtimeStrings = ["https://www.google.com/favicon.ico", "no-cors", "no-store", "load", "x-httptoolkit-injected"];
  const uniqueStrings = [...new Set([...firstPass.collectedStrings, ...runtimeStrings])].filter((s) => s.length > 0);
  const saState = buildStringArray(uniqueStrings);
  const secondPass = transformAST(sourceCode, options.addJunk, options.addCFF, saState, false);
  const hoistedImports = secondPass.hoistedImports;
  const stringPreamble = emitStringArrayPreamble(saState);

  const vmBlock = buildVMBlock(options.addAntiHook, true, saState);
  const codeHash = simpleHash(secondPass.transformedCode);
  const selfDefendBlock = buildSelfDefendBlock(codeHash);
  const deadCode = options.addJunk ? genJunkCode(randomInt(15, 30)) : "";
  const iifeName = randomIdent(8);
  const watermark = `var __INFO__ = {
    'Obfuscator': 'KTN',
    'Obfuscator Owner': 'Trương Nhật Bảo Nam - ktn',
    'Contact': 'https://github.com/Swp-dev/Javascript-Cool/'
  };
  /** Generated: ${new Date().toISOString()} | https://tanstack-start-app.kingktn.workers.dev/ */
  `;

  const iifePart = `;(async function ${iifeName}(){
${hoistedImports ? hoistedImports + "\n" : ""}${stringPreamble}
${vmBlock}
${selfDefendBlock}
${deadCode}
${secondPass.transformedCode}
})();`;
  return `${watermark}
${iifePart}`;
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
  console.log(`${DIM}  › VM Bytecode:  ${GREEN}ON (anti-debug + anti-hook)${RESET}`);
  console.log(`${DIM}  › Anti-Hook:    ${addAntiHook ? GREEN + "ON (via VM)" : RED + "OFF"}${RESET}`);
  console.log(`${DIM}  › Anti-Debug:   ${GREEN}ON via VM (always)${RESET}`);
  console.log(`${DIM}  › Anti-Proxy:   ${GREEN}ON (always)${RESET}`);
  console.log(`${DIM}  › AST Transform:${GREEN} ON (always)${RESET}`);
  console.log(`${DIM}  › String Array: ${GREEN}ON (multi-layer + rotation + split)${RESET}`);
  console.log(`${DIM}  › Prop Proxy:   ${GREEN}ON (always)${RESET}`);
  console.log(`${DIM}  › Number Obf:   ${GREEN}ON (always)${RESET}`);
  console.log(`${DIM}  › Opaque Pred.: ${GREEN}ON (always)${RESET}`);
  console.log(`${DIM}  › Global Indir.:${GREEN} ON (always)${RESET}`);
  console.log(`${DIM}  › CFF (Dynamic):${addCFF ? GREEN + "ON" : RED + "OFF"}${RESET}`);
  console.log(`${DIM}  › Self-Healing: ${GREEN}ON (browser-guarded)${RESET}`);
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
