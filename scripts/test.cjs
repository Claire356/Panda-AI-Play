const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/app.js','utf8').replace(/^home\(\);[ \t]*$/m,'');const c=vm.createContext({});vm.runInContext(fs.readFileSync('dist/engine.js','utf8'),c);vm.runInContext(source,c);
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
// Auction rules: scarce evidence is not low ability; hints/repeats are not independent evidence.
run('globalThis.testAuctionBoard=auctionBoard;auctionBoard=()=>{};auctionResult=()=>{};startAuction()');
run('auctionInvestigate("time");auctionInvestigate("time")');assert.equal(run('state.auction.coins'),2);
run('auctionInvestigate("sample");auctionInvestigate("cost");auctionChoose("reject");state.auction.basis="time";auctionSeal();auctionInvestigate("sample")');assert.equal(run('state.auction.coins'),0);assert.equal(run('state.auction.opened.garden.length'),0);
assert.equal(run('state.auction.decisions[0].opened.length'),3);
const reject={verdict:'reject',basis:'time',confidence:'certain',opened:['time'],hint:false,repeated:false};c.rejection=reject;
assert.equal(run('evaluateLot(auctionLots(0)[0],rejection).independent'),true);
assert.equal(run('evaluateLot(auctionLots(0)[0],{...rejection,hint:true}).independent'),false);
assert.equal(run('evaluateLot(auctionLots(0)[0],{...rejection,repeated:true}).independent'),false);
assert.equal(run('evaluateLot(auctionLots(0)[0],{...rejection,opened:[]}).unknown'),true);
assert.equal(run('evaluateLot(auctionLots(0)[0],{...rejection,verdict:"defer",basis:"uncertain",opened:[]}).reserved'),true);
assert.equal(run('auctionLots(1)[0].id'),'garden');
assert.equal(run('auctionNumbers(fixture).valid.periods'),5);
assert.equal(run('auctionNumbers(flat).oracle'),0);
run('state=fresh();state.auction={lots:auctionLots(0),decisions:auctionLots(0).map(l=>({lot:l.id,verdict:l.flaw?"reject":"accept",basis:l.flaw||"bounded",opened:[l.flaw||"sample"],hint:false,repeated:false,confidence:"tentative"})),practice:null};state.support="independent"');
assert.equal(run('profile().route'),'independent');assert.equal(run('auctionSummary().target'),'boundary');
run('state.auction.decisions[0].opened=[]');assert.equal(run('auctionSummary().target'),'time');
run('state.auction.decisions.forEach(d=>d.hint=true)');assert.equal(run('profile().route'),'guided');
console.log('PASS: auction evidence budget, sealed records, hints, unknowns, replay, data calculations and adaptive next task');
run('state.auction.decisions[0].opened=["time"];state.auction.decisions[1].verdict="defer";state.auction.decisions[1].basis="uncertain"');
assert.equal(run('auctionSummary().target'),'sample');
console.log('PASS: sample-gap recommendation');
// The cinematic timeline must remain deterministic when seeking or replaying.
for (const [frame,chapter] of [[0,0],[49,0],[50,1],[100,2],[150,3],[200,3]]) {
  assert.equal(run(`filmPose(${frame}).chapter`),chapter);
  assert(Number.isFinite(run(`filmPose(${frame}).scale`)));
}
assert.equal(run('filmPose(-10).seconds'),0);
assert.equal(run('filmPose(250).seconds'),20);
assert.equal(run('filmPose(125).asset'),1);
assert.equal(run('filmPose(70,true).scale'),1);
assert.equal(run('filmPose(177).stamp'),false);
assert.equal(run('filmPose(178).stamp'),true);
assert.equal(run('JSON.stringify(filmPose(70))'),run('JSON.stringify(filmPose(70))'));
console.log('PASS: cinematic cuts, seeking bounds, reduced motion and finale');

// A beginner can inspect every proposal; moving on must not carry over their answer.
run('auctionRuns=0;globalThis.testResults=0;auctionResult=()=>{testResults++};startAuction("guided")');
assert.equal(run('state.auction.mode'),'guided');
run('auctionInvestigate("time");auctionInvestigate("time")');
assert.equal(run('state.auction.coins'),2,'Reopening one clue is free.');
run('auctionInvestigate("sample");auctionInvestigate("cost");auctionChoose("reject");state.auction.basis="time";state.auction.confidence="certain";auctionSeal()');
assert.equal(run('state.auction.round'),1);
assert.equal(run('state.auction.coins'),3,'The second guided proposal has a fresh investigation budget.');
assert.equal(run('state.auction.selected'),null);
assert.equal(run('state.auction.basis'),'uncertain');
assert.equal(run('state.auction.confidence'),'tentative');
assert.equal(run('(state.auction.opened[state.auction.lots[1].id]||[]).length'),0);
assert.equal(run('state.auction.decisions[0].assisted'),true);
assert.equal(run('state.auction.decisions[0].opened.length'),3);
const firstRecord=run('JSON.stringify(state.auction.decisions[0])');
run('auctionInvestigate("time")');
assert.equal(run('state.auction.coins'),2,'The same investigation category belongs to a different proposal.');
assert.equal(run('JSON.stringify(state.auction.decisions[0])'),firstRecord,'Later investigation must not mutate a sealed record.');
run('auctionInvestigate("sample");auctionChoose("reject");state.auction.basis="sample";auctionSeal()');
assert.equal(run('state.auction.round'),2);
assert.equal(run('state.auction.coins'),3);
assert.equal(run('state.auction.selected'),null);
assert.equal(run('state.auction.basis'),'uncertain');
assert.equal(run('(state.auction.opened[state.auction.lots[2].id]||[]).length'),0);
run('auctionInvestigate("cost");auctionChoose("accept");state.auction.basis="bounded";auctionSeal()');
assert.equal(run('state.auction.round'),3);
assert.equal(run('state.auction.revealed'),true);
assert.equal(run('state.auction.decisions.length'),3);
assert.equal(run('testResults'),1);
assert.equal(run('auctionSummary().supported'),3,'Guided success remains visible.');
assert.equal(run('auctionSummary().independent'),0,'Guided success is not independent assessment evidence.');
assert.equal(run('auctionProfile().playMode'),'guided');
assert.equal(run('auctionProfile().independent'),false);
const completed=run('JSON.stringify(state.auction)');
run('auctionSeal();auctionInvestigate("sample")');
assert.equal(run('JSON.stringify(state.auction)'),completed,'Finishing twice must not add a fourth proposal or change the budget.');
assert.equal(run('testResults'),1);
assert.equal(run('evaluateLot(auctionLots(0)[0],{...rejection,assisted:true}).independent'),false);
console.log('PASS: beginner budgets, answer resets, sealed evidence isolation, assisted assessment and three-proposal completion');

// Challenge mode keeps the original scarce budget, while questions speak to the current story.
run('startAuction("challenge");auctionInvestigate("time");auctionChoose("defer");auctionSeal()');
assert.equal(run('state.auction.mode'),'challenge');
assert.equal(run('state.auction.coins'),2,'Challenge mode does not replenish coins between proposals.');
assert.equal(run('state.auction.decisions[0].assisted'),false);
assert.equal(run('auctionProfile().playMode'),'challenge');
for(const key of ['time','sample','cost']) {
  const ids=JSON.parse(run('JSON.stringify(auctionLots(0).map(l=>l.id))'));
  const questions=ids.map(id=>{
    assert.equal(run(`typeof auctionQuestions["${id}"]?.["${key}"]`),'string',`The ${id} question must not fall back to the old generic label.`);
    assert.equal(run(`typeof simpleEvidence["${id}"]?.["${key}"]`),'string',`The ${id} explanation must exist before a beginner opens it.`);
    return run(`auctionQuestion("${id}","${key}")`);
  });
  assert(questions.every(q=>typeof q==='string'&&q.trim().length>0));
  assert.equal(new Set(questions).size,3,`The ${key} questions must explain each proposal's own investigation.`);
}
console.log('PASS: challenge budget and proposal-specific investigation questions');

// Exercise the real board template too: a missing story-to-explanation mapping must not crash the first clue.
run('render=html=>{globalThis.testHTML=html};auctionBoard=testAuctionBoard;auctionFocus=()=>{};startAuction("guided")');
for(let round=0;round<3;round++) {
  for(const key of ['time','sample','cost']) {
    run(`auctionInvestigate("${key}")`);
    assert.equal(run(`testHTML.includes(simpleEvidence[state.auction.lots[state.auction.round].id]["${key}"])`),true);
    assert.equal(run(`testHTML.includes(auctionQuestion(state.auction.lots[state.auction.round].id,"${key}"))`),true);
  }
  run('auctionChoose("defer");auctionSeal()');
}
assert.equal(run('state.auction.decisions.length'),3);
const beforeTutorial=run('JSON.stringify(state)');
run('enterAuction();openTutorialEvidence();finishTutorial()');
assert.equal(run('tutorialOpened&&tutorialDone'),true);
assert.equal(run('JSON.stringify(state)'),beforeTutorial,'The cookie practice must not modify game or assessment records.');
console.log('PASS: all beginner evidence renders and the practice example does not affect assessment records');
