const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/app.js','utf8').replace(/home\(\);\s*$/,'');const c=vm.createContext({});vm.runInContext(fs.readFileSync('dist/engine.js','utf8'),c);vm.runInContext(source,c);
const run=x=>vm.runInContext(x,c);
const base=run("({...fresh(),clues:['sample','volume'],decision:'wait',storm:[{action:'hold'},{action:'inspect'}],repairs:['timing','sample','fees'],log:[{event:'repair_test',attempt:1,correct:3,hints:0}],support:'independent'})");
function p(s){return run(`profile(${JSON.stringify(s)})`)}
assert.equal(p(base).route,'independent');assert.equal(p(base).species,'证据狐狸');
assert.equal(p({...base,support:'guide'}).route,'validation');
assert.equal(p({...base,log:[{event:'repair_test',attempt:2,correct:3,hints:0}]}).route,'guided');
assert.equal(p({...base,log:[{event:'repair_test',attempt:1,correct:3,hints:1}]}).confidence,'有限');
assert.equal(p({...base,clues:[]}).independent,true);
assert.equal(p({...base,decision:'act'}).route,'independent');
assert.equal(p({...base,revision:{correct:true}}).revision.correct,true);
run('render=()=>{};state=fresh();clue("sample");clue("sample");clue("volume");clue("story")');assert.equal(run('state.clues.length'),2);
run('decide("wait")');assert.equal(run('revealEnd()'),30);
run('stormMove("switch")');assert.equal(run('state.position'),1);assert.equal(run('state.storm[0].visibleEnd'),run('rows[29].date'));assert.equal(run('revealEnd()'),40);
run('stormMove("inspect")');assert.equal(run('state.step'),3);assert.equal(run('state.position'),0);
run('selectTool("clock");installTool("timing");selectTool("clock");installTool("sample")');assert.equal(run('state.tools.timing'),undefined);
run('state.tools={timing:"clock",sample:"vault",fees:"cost"};testMachine()');assert.equal(run('profile().independent'),true);
run('state=fresh();repairHint();state.tools={timing:"clock",sample:"vault",fees:"cost"};testMachine()');assert.equal(run('profile().independent'),false);
for(let n=2;n<=8;n++){let r=run(`compute(${n})`);assert(Number.isFinite(r.ret));assert(r.dd>=0);assert(r.trades>=0)}
console.log('PASS: routes, conflicts, uncertainty, revision, preference separation, calculation windows');

const sample=Array.from({length:18},(_,i)=>({date:String(i),open:100+i,close:100+i,volume:100}));c.fixture=sample;
const original=run('research(3,fixture,12)');
const changed=sample.map(x=>({...x}));changed[12].close=10000;c.changed=changed;
assert.equal(original.signals[0].position,run('research(3,changed,12)').signals[0].position);assert.equal(original.periods,5);
const flat=sample.map(x=>({...x,open:100,close:100}));c.flat=flat;
const noTrade=run('research(3,flat,12)');assert.equal(noTrade.ret,0);assert.equal(noTrade.trades,0);assert(noTrade.baseReturn<0);
const bad=sample.map(x=>({...x}));bad[1].date=bad[0].date;bad[2].close=null;c.bad=bad;
assert.equal(run('qualityReport(bad)').duplicates,1);assert.equal(run('qualityReport(bad)').missing,1);
console.log('PASS: no lookahead, 18-row dataset, no-trade returns, benchmark cost, quality checks');
