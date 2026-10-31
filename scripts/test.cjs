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
    assert.equal(run(`testHTML.includes(plainFacts[state.auction.lots[state.auction.round].id]["${key}"])`),true);
    assert.equal(run(`testHTML.includes(shortQuestions["${key}"])`),true);
  }
  run('auctionChoose("defer");auctionSeal()');
}
assert.equal(run('state.auction.decisions.length'),3);
console.log('PASS: all beginner evidence renders');


// Use an isolated device history for each tier so self-report, assistance and repeat
// exposure cannot accidentally borrow state from the older expedition tests.
function tierSession(history={introSeen:false,lastLevel:null,seenLots:[],completed:0}) {
  const saved=new Map([['panda-auction-experience-v1',JSON.stringify(history)]]);
  const context=vm.createContext({localStorage:{getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,String(value))}});
  vm.runInContext(fs.readFileSync('dist/engine.js','utf8'),context);
  vm.runInContext(source,context);
  const invoke=expression=>vm.runInContext(expression,context);
  invoke('render=html=>{globalThis.testHTML=html};auctionFocus=()=>{};auctionResult=()=>{globalThis.testResultCount=(globalThis.testResultCount||0)+1}');
  return {run:invoke,saved};
}
for(const level of ['starter','regular','advanced']) {
  const t=tierSession().run;
  t(`launchExperience('${level}')`);
  assert.equal(t('state.auction.level'),level);
  assert.equal(t('state.auction.mode'),level==='starter'?'guided':'challenge');
  assert.equal(t('state.auction.lots.length'),3,'Every tier covers the same three assessment concepts.');
  assert.equal(t('auctionProfile().selfDeclaredLevel'),level);
  assert.equal(t('auctionProfile().verified'),false,'A chosen experience level is not a verified ability.');
  t('auctionInvestigate("time");quickChoose("reject")');
  assert.equal(t('state.auction.decisions.length'),0,'Selecting a verdict must not silently seal it.');
  t('quickSubmit("");quickSubmit("made-up-reason");quickSubmit("limited")');
  assert.equal(t('state.auction.decisions.length'),0,'A deliberate valid reason is required before moving on.');
  assert.equal(t('state.auction.round'),0);
  t('quickSubmit("time")');
  assert.equal(t('state.auction.round'),1);
  assert.equal(t('state.auction.decisions[0].basis'),'time');
  assert.equal(t('state.auction.decisions[0].assisted'),level==='starter');
  assert.equal(t('state.auction.coins'),level==='advanced'?2:3,'Only the advanced tier keeps a shared scarce budget.');
  assert.equal(t('state.auction.selected'),null,'The next proposal needs a fresh decision.');
  const sealed=t('JSON.stringify(state.auction.decisions[0])');
  t('auctionInvestigate("sample")');
  assert.equal(t('JSON.stringify(state.auction.decisions[0])'),sealed,'Later evidence cannot rewrite a sealed choice.');
  t('quickChoose("reject");quickSubmit("sample");auctionInvestigate("sample");quickChoose("accept");quickSubmit("limited")');
  assert.equal(t('state.auction.decisions.length'),3);
  assert.equal(t('state.auction.revealed'),true);
  assert.equal(t('testResultCount'),1);
  assert.equal(t('auctionSummary().supported'),3);
  assert.equal(t('auctionSummary().independent'),level==='starter'?0:3,'Guidance remains separate from an independent correct judgment.');
  const finished=t('JSON.stringify(state.auction)');
  t('quickChoose("accept");quickSubmit("limited");auctionSeal();auctionInvestigate("cost")');
  assert.equal(t('JSON.stringify(state.auction)'),finished,'Repeated finish events cannot add a fourth answer or spend coins.');
}
console.log('PASS: three experience tiers, budget differences, deliberate submission, sealed records and assisted assessment');

for(const reason of ['evidence','confused','unsure']) {
  const t=tierSession().run;
  t(`launchExperience('regular');quickChoose('defer');quickSubmit('${reason}')`);
  assert.equal(t('state.auction.decisions[0].verdict'),'defer');
  assert.equal(t('state.auction.decisions[0].basis'),'uncertain');
  assert.equal(t('state.auction.decisions[0].waitReason'),reason,'Different reasons for waiting must stay distinct in the behavior record.');
  assert.equal(t('auctionSummary().independent'),0);
}
const profitChoice=tierSession().run;
profitChoice("launchExperience('regular');auctionInvestigate('time');quickChoose('accept');quickSubmit('profit')");
assert.equal(profitChoice('state.auction.decisions[0].basis'),'profit');
assert.equal(profitChoice('auctionSummary().independent'),0,'Attractive returns do not demonstrate evidence-based judgment.');
const uncertainRejection=tierSession().run;
uncertainRejection("launchExperience('regular');quickChoose('reject');quickSubmit('unsure')");
assert.equal(uncertainRejection('state.auction.decisions[0].basis'),'uncertain');
assert.equal(uncertainRejection('auctionSummary().independent'),0);
console.log('PASS: waiting reasons, uncertain rejection and profit-based acceptance retain distinct meaning');

// Returning is a navigation preference; repeated evidence depends on the actual
// proposals seen on this device, even when the previous run was abandoned.
const newReturning=tierSession().run;
newReturning("launchExperience('advanced',true);auctionInvestigate('time');quickChoose('reject');quickSubmit('time')");
assert.equal(newReturning('state.auction.decisions[0].repeated'),false,'Selecting already played does not invent history.');
assert.equal(newReturning('auctionSummary().independent'),1);
const partial=tierSession({introSeen:true,lastLevel:'starter',seenLots:['clock'],completed:0}).run;
partial("launchExperience('regular',true);auctionInvestigate('time');quickChoose('reject');quickSubmit('time')");
assert.equal(partial('state.auction.decisions[0].repeated'),true,'An abandoned but already seen proposal is repeated.');
partial("auctionInvestigate('sample');quickChoose('reject');quickSubmit('sample')");
assert.equal(partial('state.auction.decisions[1].repeated'),false,'An unseen proposal still supplies new evidence.');
assert.equal(partial('auctionSummary().independent'),1);
const historySnapshot=partial('JSON.stringify(state.auction.decisions)');
partial("state.auction.level='advanced'");
assert.equal(partial('JSON.stringify(state.auction.decisions)'),historySnapshot,'Changing self-reported level cannot rewrite recorded help or repeated exposure.');
console.log('PASS: return preference and per-proposal repeat exposure remain separate from self-reported level');

for(const [verdict,reason] of [['reject','time'],['accept','limited']]) {
  const t=tierSession().run;
  t(`launchExperience('advanced');quickSkipClue();quickChoose('${verdict}');quickSubmit('${reason}')`);
  assert.equal(t('state.auction.decisions[0].opened.length'),0);
  assert.equal(t('auctionSummary().independent'),0,'Guessing the expected answer without opening evidence is not independent support.');
  assert.equal(t('auctionProfile().verified'),false);
}
const helped=tierSession().run;
helped("launchExperience('regular');auctionInvestigate('time');auctionHint();quickChoose('reject');quickSubmit('time')");
assert.equal(helped('state.auction.decisions[0].hint'),true);
assert.equal(helped('auctionSummary().supported'),1);
assert.equal(helped('auctionSummary().independent'),0,'An on-demand explanation must be separated from independent judgment.');
const changedLevel=helped('auctionProfile().verified');
helped("state.auction.level='advanced'");
assert.equal(helped('auctionProfile().verified'),changedLevel,'Changing presentation level cannot upgrade an assessment.');
assert.equal(helped('auctionProfile().evidence.filter(e=>e.event==="auction_verdict")[0].hint'),true,'Profile export must retain help and repeat flags.');
assert.equal(helped('auctionProfile().evidence.filter(e=>e.event==="auction_verdict")[0].repeated'),false);
assert.equal(helped('auctionProfile().evidence.filter(e=>e.event==="auction_verdict")[0].assisted'),false);
console.log('PASS: unknown evidence, on-demand help and self-declared level cannot create independent ability');

const remembered=tierSession();
remembered.run("markLotSeen('clock');markLotSeen('clock');saveExperience({lastLevel:'regular'})");
const history=JSON.parse(remembered.saved.get('panda-auction-experience-v1'));
assert.deepEqual(history.seenLots,['clock'],'Reopening a proposal must not duplicate exposure history.');
assert.deepEqual(Object.keys(history).sort(),['completed','introSeen','lastLevel','seenLots'],'Device memory stores only minimal navigation and seen-case history.');
remembered.saved.set('panda-auction-experience-v1','not valid JSON');
assert.equal(remembered.run('experienceHistory().seenLots.length'),0,'Corrupt saved preferences must not prevent play.');
remembered.run("delete globalThis.localStorage;launchExperience('starter')");
assert.equal(remembered.run('state.auction.level'),'starter','The game must still work when browser storage is unavailable.');
console.log('PASS: minimal local history, exposure deduplication, corrupted history and storage-unavailable fallback');

const costConcern=tierSession().run;
costConcern("launchExperience('regular');auctionInvestigate('cost');quickChoose('reject');quickSubmit('cost')");
assert.equal(costConcern('auctionSummary().supported'),1,'A visible omitted fee is a valid reason to question the report.');
assert.equal(costConcern('auctionSummary().independent'),1);
assert.equal(costConcern('auctionSummary().evaluated[0].r.primaryVerified'),false,'Finding the fee omission does not prove the player identified future leakage.');
assert.equal(costConcern('auctionSummary().target'),'time','The next task still covers the unexamined time-order issue.');
const noCostEvidence=tierSession().run;
noCostEvidence("launchExperience('regular');quickSkipClue();quickChoose('reject');quickSubmit('cost')");
assert.equal(noCostEvidence('auctionSummary().supported'),0,'A lucky guess about fees still requires the underlying evidence.');
const confused=tierSession().run;
confused("launchExperience('advanced');quickSkipClue();quickChoose('defer');quickSubmit('confused');quickSkipClue();quickChoose('defer');quickSubmit('confused')");
assert.equal(confused('auctionProfile().species'),'探索候鸟','Not understanding two proposals must not be mislabeled as deliberate patience.');
assert.equal(confused('auctionProfile().route'),'guided','A stated comprehension need overrides a self-selected advanced presentation.');
assert.equal(confused('auctionSummary().independent'),0);
const exhausted=tierSession().run;
exhausted("launchExperience('advanced');auctionInvestigate('time');auctionInvestigate('sample');auctionInvestigate('cost');quickChoose('reject');quickSubmit('time')");
assert.equal(exhausted('state.auction.coins'),0);
exhausted("auctionInvestigate('sample')");
assert.equal(exhausted('(state.auction.opened[state.auction.lots[1].id]||[]).length'),0,'An exhausted budget cannot expose a new record.');
exhausted("quickSkipClue();quickChoose('defer');quickSubmit('evidence')");
assert.equal(exhausted('state.auction.decisions[1].waitReason'),'evidence');
assert.equal(exhausted('auctionSummary().evaluated[1].r.unknown'),true,'An unviewed concept remains unknown, not a wrong answer.');
console.log('PASS: valid secondary evidence, untested main issue, comprehension support and exhausted-budget uncertainty');
