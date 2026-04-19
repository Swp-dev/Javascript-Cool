#!/usr/bin/env node
// @ts-nocheck
// Support .js, .mjs, .cjs file
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
    if (_lineWaiters.length > 0) {
      const waiter = _lineWaiters.shift()!;
      waiter(line);
    } else {
      _lineQueue.push(line);
    }
  });
}

function closeRl() {
  if (_rl) { _rl.close(); _rl = null; }
}

function readLine(): Promise<string> {
  initRl();
  if (_lineQueue.length > 0) {
    return Promise.resolve(_lineQueue.shift()!);
  }
  return new Promise((resolve) => {
    _lineWaiters.push(resolve);
  });
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
    for (let i = 1; i < len; i++) {
      result += Math.random() > 0.5 ? randomCJK() : randomHex(1);
    }
    const ident = "_" + result;
    if (t.isValidIdentifier(ident)) return ident;
  }
  return "_x" + randomHex(Math.max(4, len));
}

function toBase64(str: string): string {
  return Buffer.from(str, "utf8").toString("base64");
}

function rc4Encrypt(key: string, data: string): string {
  const s: number[] = [];
  for (let i = 0; i < 256; i++) s[i] = i;
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    [s[i], s[j]] = [s[j], s[i]];
  }
  let i2 = 0; let j2 = 0;
  const out: number[] = [];
  for (let k = 0; k < data.length; k++) {
    i2 = (i2 + 1) % 256;
    j2 = (j2 + s[i2]) % 256;
    [s[i2], s[j2]] = [s[j2], s[i2]];
    out.push(data.charCodeAt(k) ^ s[(s[i2] + s[j2]) % 256]);
  }
  return Buffer.from(out).toString("base64");
}

interface StringArrayState {
  arrName: string;
  decoderName: string;
  rc4Key: string;
  strings: string[];
  indexMap: Map<string, number>;
}

function buildStringArray(strings: string[]): StringArrayState {
  const key = randomHex(16);
  const arrName = randomIdent(8);
  const decoderName = randomIdent(8);
  const indexMap = new Map<string, number>();
  const encoded: string[] = [];
  strings.forEach((s, i) => {
    indexMap.set(s, i);
    encoded.push(rc4Encrypt(key, s));
  });
  return { arrName, decoderName, rc4Key: key, strings: encoded, indexMap };
}

function emitStringArrayPreamble(state: StringArrayState): string {
  const arr = JSON.stringify(state.strings);
  const key = JSON.stringify(state.rc4Key);
  const arrN = state.arrName;
  const decN = state.decoderName;
  return `
var ${arrN}=${arr};
function ${decN}(i){
  var _a=typeof atob==='function'?atob:function(x){return Buffer.from(x,'base64').toString('binary');};
  var _k=${key},_s=[],_j=0,_i,_r='',_d=_a(${arrN}[i]);
  for(_i=0;_i<256;_i++)_s[_i]=_i;
  for(_i=0;_i<256;_i++){_j=(_j+_s[_i]+_k.charCodeAt(_i%_k.length))%256;var _t=_s[_i];_s[_i]=_s[_j];_s[_j]=_t;}
  var _x=0,_y=0;
  for(_i=0;_i<_d.length;_i++){_x=(_x+1)%256;_y=(_y+_s[_x])%256;var _t=_s[_x];_s[_x]=_s[_y];_s[_y]=_t;_r+=String.fromCharCode(_d.charCodeAt(_i)^_s[(_s[_x]+_s[_y])%256]);}
  return _r;
}
`;
}

//  anti-hook

function buildAntiHookBlock(): string {
  const varN = randomIdent(5);
  const fnN = randomIdent(5);
  return `
(function(){
  function ${fnN}(fn){
    try{
      var s=Function.prototype.toString.call(fn);
      if(!/native code/.test(s))throw 1;
    }catch(e){
      try{debugger;}catch(e2){}
    }
  }
  var ${varN}=[
    setTimeout,clearTimeout,setInterval,clearInterval,
    JSON.stringify,JSON.parse,
    Object.keys,Object.assign,Object.defineProperty,
    Array.prototype.map,Array.prototype.forEach,Array.prototype.filter,
    Function.prototype.toString,Function.prototype.call,Function.prototype.apply,
    eval,parseInt,parseFloat,decodeURIComponent,encodeURIComponent
  ];
  for(var _i=0;_i<${varN}.length;_i++){${fnN}(${varN}[_i]);}
})();
`;
}

//  anti-debug

function buildAntiDebugBlock(): string {
  const timingN = randomIdent(5);
  const envN = randomIdent(5);
  return `
(function(){
  if(typeof window==='undefined')return;
  function ${timingN}(){
    if(typeof performance==='undefined'||!performance.now)return;
    var _s=performance.now();debugger;var _d=performance.now()-_s;
    if(_d>100){
      try{if(document&&document.body)document.body.innerHTML='';}catch(e){}
    }
  }
  function ${envN}(){
    var _th=160;
    if(window.outerWidth-window.innerWidth>_th||window.outerHeight-window.innerHeight>_th){
      try{debugger;}catch(e){}
    }
  }
  try{${timingN}();}catch(e){}
  try{${envN}();}catch(e){}
})();
`;
}

//  anti-httptoolkit & proxy

function buildAntiProxyBlock(): string {
  const chkN = randomIdent(5);
  const urlN = randomIdent(5);
  return `
(function(){
  if(typeof window==='undefined'||typeof fetch==='undefined')return;
  var ${urlN}=['https://www.google.com/favicon.ico','https://www.cloudflare.com/favicon.ico'];
  var ${chkN}=function(){
    var _t=Date.now();
    fetch(${urlN}[0],{mode:'no-cors',cache:'no-store'}).then(function(){
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
  try{${chkN}();}catch(e){}
})();
`;
}

function buildSelfDefendBlock(codeHash: number): string {
  return `
(function(){
  var _h=${codeHash};
  if(typeof _h!=='number'){try{debugger;}catch(e){}}
})();
`;
}

const JUNK_OPS = [
  () => `var ${randomIdent(4)}=Math.floor(Math.random()*${randomInt(1000, 99999)});`,
  () => `void(${randomInt(0, 1e9)}^${randomInt(0, 1e9)});`,
  () => `(function(){try{throw new Error('${randomHex(8)}');}catch(e){}})();`,
  () => `var ${randomIdent(4)}=(function(){return Array(${randomInt(2, 20)}).join('${randomHex(4)}');})();`,
  () => `if(${randomInt(0, 9999)}<${randomInt(10000, 99999)}){var ${randomIdent(4)}=null;}`,
  () => `[${Array.from({ length: randomInt(3, 8) }, () => randomInt(0, 255)).join(",")}].reverse();`,
  () => {
    const fn = `_${randomIdent(3)}`;
    return `(function ${fn}(n){if(n<=0)return 0;return n+${fn}(n-1);})(${randomInt(0, 5)});`;
  },
  () => `var ${randomIdent(4)}='${randomHex(12)}'.split('').reverse().join('');`,
  () => `try{Object.freeze({a:${randomInt(1, 999)}});}catch(e){}`,
  () => `void(typeof ${randomIdent(4)}==='undefined'?${randomInt(0, 100)}:${randomInt(0, 100)});`,
];

function genJunkCode(count: number): string {
  return Array.from({ length: count }, () => JUNK_OPS[randomInt(0, JUNK_OPS.length - 1)]()).join("\n");
}

function flattenFunctionBody(body: t.Statement[]): t.Statement[] {
  if (body.length < 2) return body;

  const stateVar = randomIdent(6);
  const switchLabel = randomIdent(5);
  const order = body.map((_, i) => i);

  for (let i = order.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [order[i], order[j]] = [order[j], order[i]];
  }

  const reverseMap: number[] = new Array(order.length);
  order.forEach((orig, pos) => {
    reverseMap[orig] = pos;
  });

  const cases: t.SwitchCase[] = [];

  order.forEach((originalIdx, pos) => {
    const stmt = body[originalIdx];
    const nextPos = reverseMap[originalIdx + 1];
    const stmtsForCase: t.Statement[] = [stmt];

    if (originalIdx < body.length - 1) {
      stmtsForCase.push(
        t.expressionStatement(
          t.assignmentExpression(
            "=",
            t.identifier(stateVar),
            t.numericLiteral(nextPos)
          )
        )
      );
      stmtsForCase.push(t.continueStatement(t.identifier(switchLabel)));
    } else {
      stmtsForCase.push(t.breakStatement(t.identifier(switchLabel)));
    }

    cases.push(t.switchCase(t.numericLiteral(pos), stmtsForCase));
  });

  const switchStmt = t.switchStatement(t.identifier(stateVar), cases);

  const labeledWhile = t.labeledStatement(
    t.identifier(switchLabel),
    t.whileStatement(t.booleanLiteral(true), t.blockStatement([switchStmt]))
  );

  return [
    t.variableDeclaration("var", [
      t.variableDeclarator(
        t.identifier(stateVar),
        t.numericLiteral(reverseMap[0])
      ),
    ]),
    labeledWhile,
  ];
}

function canFlattenFunctionBody(body: t.Statement[]): boolean {
  return !body.some((stmt) => {
    if (t.isVariableDeclaration(stmt)) return stmt.kind !== "var";
    return t.isDeclaration(stmt);
  });
}

function canReplaceStringLiteral(nodePath: any): boolean {
  const parent = nodePath.parent;
  if (t.isObjectProperty(parent) && parent.key === nodePath.node && !parent.computed) return false;
  if (t.isObjectMethod(parent) && parent.key === nodePath.node && !parent.computed) return false;
  if (t.isImportDeclaration(parent) || t.isExportAllDeclaration(parent) || t.isExportNamedDeclaration(parent)) return false;
  return true;
}

function transformAST(
  code: string,
  addAntiHook: boolean,
  addJunk: boolean,
  saState: StringArrayState,
  collectStrings: boolean
): { transformedCode: string; collectedStrings: string[] } {
  const collected: string[] = [];

  let ast: any;
  try {
    ast = parse(code, {
      sourceType: "unambiguous",
      allowReturnOutsideFunction: true,
      allowImportExportEverywhere: true,
      errorRecovery: true,
      plugins: ["jsx"],
    });
  } catch {
    ast = parse(code, {
      sourceType: "script",
      allowReturnOutsideFunction: true,
      errorRecovery: true,
    });
  }

  const identMap = new Map<string, string>();

  traverse(ast, {
    StringLiteral: {
      enter(nodePath: any) {
        const val: string = nodePath.node.value;
        if (collectStrings && val.length > 3 && !saState.indexMap.has(val)) {
          collected.push(val);
        }
      },
      exit(nodePath: any) {
        const val: string = nodePath.node.value;
        if (saState.indexMap.has(val) && canReplaceStringLiteral(nodePath)) {
          const idx = saState.indexMap.get(val)!;
          nodePath.replaceWith(
            t.callExpression(t.identifier(saState.decoderName), [t.numericLiteral(idx)])
          );
        }
      },
    },

    Identifier(nodePath: any) {
      const name: string = nodePath.node.name;
      const skipList = ["undefined", "null", "true", "false", "NaN", "Infinity", "arguments", "this", "super", "constructor", "prototype", "__proto__", "exports", "module", "require", "process", "global", "window", "document", "console", "Math", "JSON", "Object", "Array", "Function", "String", "Number", "Boolean", "RegExp", "Error", "Promise", "Symbol", "Map", "Set", "Date", "parseInt", "parseFloat", "isNaN", "isFinite", "eval", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "fetch", "XMLHttpRequest", "performance", "navigator", "location", "history", "atob", "btoa", "encodeURIComponent", "decodeURIComponent"];

      if (skipList.includes(name)) return;
      if (name.startsWith("_") && /[^\x00-\x7F]/.test(name)) return;

      if (nodePath.isReferencedIdentifier() || nodePath.isBindingIdentifier()) {
        const binding = nodePath.scope?.getBinding(name);
        if (binding) {
          if (!identMap.has(name)) {
            identMap.set(name, randomIdent(7));
          }
          nodePath.node.name = identMap.get(name)!;
        }
      }
    },

    // Control flow flattening on function bodies
    FunctionDeclaration(nodePath: any) {
      const body = nodePath.node.body.body as t.Statement[];
      if (body.length >= 3 && canFlattenFunctionBody(body)) {
        nodePath.node.body.body = flattenFunctionBody(body);
      }
    },
    FunctionExpression(nodePath: any) {
      const body = nodePath.node.body.body as t.Statement[];
      if (body.length >= 3 && canFlattenFunctionBody(body)) {
        nodePath.node.body.body = flattenFunctionBody(body);
      }
    },
  });

  if (addJunk) {
    const programBody = ast.program.body as t.Statement[];
    const junkCount = randomInt(8, 20);
    for (let i = 0; i < junkCount; i++) {
      const insertAt = randomInt(0, programBody.length);
      const junkSrc = genJunkCode(randomInt(1, 3));
      try {
        const junkAst = parse(junkSrc, { sourceType: "script", errorRecovery: true });
        programBody.splice(insertAt, 0, ...junkAst.program.body);
      } catch {}
    }
  }

  const result = generate(ast as any, { compact: true, minified: true, comments: false });
  return { transformedCode: result.code, collectedStrings: collected };
}

//  main

async function obfuscate(
  sourceCode: string,
  options: {
    addAntiHook: boolean;
    addJunk: boolean;
  }
): Promise<string> {
  // Pass 1: Collect strings
  const dummyState: StringArrayState = {
    arrName: "_dummy",
    decoderName: "_dummyDec",
    rc4Key: "dummy",
    strings: [],
    indexMap: new Map(),
  };

  const { collectedStrings } = transformAST(sourceCode, false, false, dummyState, true);

  const uniqueStrings = [...new Set(collectedStrings)].filter((s) => s.length > 3);

  const saState = buildStringArray(uniqueStrings);

  const { transformedCode } = transformAST(
    sourceCode,
    options.addAntiHook,
    options.addJunk,
    saState,
    false
  );

  const stringPreamble = emitStringArrayPreamble(saState);

  const antiHookBlock = options.addAntiHook ? buildAntiHookBlock() : "";
  const antiDebugBlock = buildAntiDebugBlock();
  const antiProxyBlock = buildAntiProxyBlock();

  let codeHash = 0;
  for (let i = 0; i < transformedCode.length; i++) {
    codeHash = (Math.imul(31, codeHash) + transformedCode.charCodeAt(i)) | 0;
  }
  const selfDefendBlock = buildSelfDefendBlock(codeHash);

  const deadCode = options.addJunk ? genJunkCode(randomInt(15, 30)) : "";

  const watermark = `
  var __INFO__ = {
    'Obfuscator': 'KTN',
    'Obfuscator Owner': 'Trương Nhật Bảo Nam - ktn',
    'Contact': 'https://github.com/Swp-dev/Javascript-Cool',
  };
  /** Generated: ${new Date().toISOString()} | https://tanstack-start-app.kingktn.workers.dev/ */
  `;

  const iifeName = randomIdent(8);
  const assembled = `${watermark}
;(function ${iifeName}(){
${stringPreamble}
${antiHookBlock}
${antiDebugBlock}
${antiProxyBlock}
${selfDefendBlock}
${deadCode}
${transformedCode}
})();`;

  return assembled;
}

async function main() {
  printBanner();

  console.log(`\n${GREEN}${BOLD}[JScool]${RESET} Welcome to the High-Extreme JavaScript Obfuscator.\n`);

  const inputPath = (await prompt(`${YELLOW}Enter input JS file path: ${RESET}`)).replace(/^['"]|['"]$/g, "");

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

  closeRl();

  console.log(`\n${DIM}────────────────────────────────────────────────────${RESET}`);
  console.log(`${GREEN}[*]${RESET} Starting obfuscation pipeline…`);
  console.log(`${DIM}  › Anti-Hook:    ${addAntiHook ? GREEN + "ON" : RED + "OFF"}${RESET}`);
  console.log(`${DIM}  › Anti-Debug:   ${GREEN}ON (always)${RESET}`);
  console.log(`${DIM}  › Anti-Proxy:   ${GREEN}ON (always)${RESET}`);
  console.log(`${DIM}  › AST Transform:${GREEN} ON (always)${RESET}`);
  console.log(`${DIM}  › Junk Code:    ${addJunk ? GREEN + "ON" : RED + "OFF"}${RESET}`);
  console.log(`${DIM}────────────────────────────────────────────────────${RESET}\n`);

  let result: string;
  try {
    result = await obfuscate(sourceCode, { addAntiHook, addJunk });
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
