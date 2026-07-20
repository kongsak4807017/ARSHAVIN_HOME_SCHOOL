import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = path.resolve(import.meta.dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = relative => fs.existsSync(path.join(root, relative));
const slugs = [
  'sleep-ready-brain','bones-joints-safer-posture','muscles-rest-movement','breathing-gas-exchange-safer-air','circulation-heart-safer-care','digestion-nutrients-responsible-food-information','excretion-kidneys-water-balance',
  'fact-opinion-ai-claims','personal-data-digital-footprints-consent','learning-from-data-and-bias','patterns-features-edge-cases','ai-decisions-confidence-human-escalation',
  'pm25-safer-action','water-cycle-responsible-use','soil-erosion-conservation','waste-5r-lower-waste-system','household-energy-efficiency-responsible-choices',
  'levers-make-work-easier','pulleys-gears-transfer-force','wheels-axles-designing-motion','structures-shapes-strength','materials-properties-responsible-selection',
  'rights-responsibilities-digital-kindness','community-rules-shared-decisions','media-public-information-evidence-checking','disagreement-dialogue-peaceful-resolution','community-institutions-responsible-participation'
];
const lessons = [
  'subjects/human-body/sleep-ready-brain.html','subjects/human-body/bones-joints-safer-posture.html','subjects/human-body/muscles-rest-movement.html','subjects/human-body/breathing-gas-exchange-safer-air.html','subjects/human-body/circulation-heart-safer-care.html','subjects/human-body/digestion-nutrients-responsible-food-information.html','subjects/human-body/excretion-kidneys-water-balance.html',
  'subjects/ai-science/fact-opinion-ai-claims.html','subjects/ai-science/personal-data-digital-footprints-consent.html','subjects/ai-science/learning-from-data-and-bias.html','subjects/ai-science/patterns-features-edge-cases.html','subjects/ai-science/ai-decisions-confidence-human-escalation.html',
  'subjects/environment/pm25-safer-action.html','subjects/environment/water-cycle-responsible-use.html','subjects/environment/soil-erosion-conservation.html','subjects/environment/waste-5r-lower-waste-system.html','subjects/environment/household-energy-efficiency-responsible-choices.html',
  'subjects/maker-engineering/levers-make-work-easier.html','subjects/maker-engineering/pulleys-gears-transfer-force.html','subjects/maker-engineering/wheels-axles-designing-motion.html','subjects/maker-engineering/structures-shapes-strength.html','subjects/maker-engineering/materials-properties-responsible-selection.html',
  'subjects/citizenship/rights-responsibilities-digital-kindness.html','subjects/citizenship/community-rules-shared-decisions.html','subjects/citizenship/media-public-information-evidence-checking.html','subjects/citizenship/disagreement-dialogue-peaceful-resolution.html','subjects/citizenship/community-institutions-responsible-participation.html'
];
const worksheets = slugs.map(slug => `worksheets/student/${slug}-a4.html`);
const guides = slugs.slice(1).map(slug => `worksheets/teacher-guides/${slug}-guide.html`);
const scripts = [
  'sleep-lesson','bones-posture-lesson','muscles-movement-lesson','breathing-air-lesson','circulation-heart-lesson','digestion-nutrients-lesson','kidneys-water-balance-lesson','ai-claims-lesson','privacy-consent-lesson','data-bias-lesson','patterns-features-lesson','ai-confidence-lesson','pm25-lesson','water-cycle-lesson','soil-erosion-lesson','waste-5r-lesson','household-energy-lesson','levers-lesson','pulleys-gears-lesson','wheels-axles-core','wheels-axles-assessment','structures-strength-lesson','materials-properties-lesson','citizenship-lesson','community-decisions-lesson','media-evidence-lesson','peaceful-dialogue-lesson','community-participation-lesson','learning-shell'
].map(name => `assets/js/${name}.js`).concat('service-worker.js');
const keys = [
  'arshavin.sleep.lesson.v1','arshavin.humanbody.bones.v1','arshavin.humanbody.muscles.v1','arshavin.humanbody.breathing.v1','arshavin.humanbody.circulation.v1','arshavin.humanbody.digestion.v1','arshavin.humanbody.kidneys.v1',
  'arshavin.ai.claims.v1','arshavin.ai.privacy.v1','arshavin.ai.databias.v1','arshavin.ai.patterns.v1','arshavin.ai.confidence.v1',
  'arshavin.environment.pm25.v1','arshavin.environment.water.v1','arshavin.environment.soil.v1','arshavin.environment.waste.v1','arshavin.environment.energy.v1',
  'arshavin.maker.levers.v1','arshavin.maker.pulleysgears.v1','arshavin.maker.wheelsaxles.v1','arshavin.maker.structures.v1','arshavin.maker.materials.v1',
  'arshavin.citizenship.rights.v1','arshavin.citizenship.community.v1','arshavin.citizenship.media.v1','arshavin.citizenship.dialogue.v1','arshavin.citizenship.participation.v1'
];
function check(name, fn) { try { fn(); console.log(`PASS ${name}`); } catch (error) { console.error(`FAIL ${name}: ${error.message}`); process.exitCode = 1; } }
check('required files exist', () => {[...lessons,...worksheets,...guides,...scripts,'index.html','assets/css/site.css'].forEach(file=>assert.ok(exists(file),file));});
check('JavaScript parses', () => scripts.forEach(file => new vm.Script(read(file), { filename: file })));
check('bilingual lesson shell structure', () => lessons.forEach(file => {const html=read(file);assert.match(html,/<html lang="th">/);assert.match(html,/<h1>[\s\S]*<br>[\s\S]*<span>/);assert.match(html,/data-learning-shell/);assert.match(html,/assets\/js\/learning-shell\.js/);}));
check('local links resolve', () => {for(const file of ['index.html',...lessons,...worksheets,...guides]){const html=read(file),directory=path.dirname(file);for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){const target=match[1];if(/^(?:https?:|mailto:|data:)/.test(target))continue;assert.ok(exists(path.normalize(path.join(directory,target))),`${file} -> ${target}`);}}});
check('worksheets are exactly two A4 sheets', () => worksheets.forEach(file => {const html=read(file);assert.equal((html.match(/class="worksheet(?:\s|")/g)||[]).length,2,file);assert.ok(/@page\s*\{[\s\S]*size:\s*A4/.test(html)||/assets\/css\/site\.css/.test(html),file);}));
check('homepage and shell expose all lessons and keys', () => {const homepage=read('index.html'),shell=read('assets/js/learning-shell.js');lessons.forEach(file=>assert.ok(homepage.includes(file),file));['HB-01','HB-02','HB-03','HB-04','HB-05','HB-06','HB-07','AI-01','AI-02','AI-03','AI-04','AI-05','ENV-01','ENV-02','ENV-03','ENV-04','ENV-05','MAKER-01','MAKER-02','MAKER-03','MAKER-04','MAKER-05','CIT-01','CIT-02','CIT-03','CIT-04','CIT-05'].forEach(id=>assert.ok(shell.includes(id),id));keys.forEach(key=>{assert.ok(homepage.includes(key),key);assert.ok(shell.includes(key),key);});});
check('lesson scripts are local-only', () => scripts.filter(file=>file.startsWith('assets/js/')&&!file.endsWith('learning-shell.js')).forEach(file=>assert.doesNotMatch(read(file),/fetch\(|XMLHttpRequest|WebSocket|sendBeacon/,file)));
check('offline precache', () => {const serviceWorker=read('service-worker.js');[...scripts.filter(file=>file.startsWith('assets/js/')),...lessons,...worksheets,...guides].forEach(file=>assert.ok(serviceWorker.includes(`./${file}`),file));assert.match(serviceWorker,/arshavin-grade4-v\d+/);});
check('HB-07 kidneys, water balance and privacy safeguards',()=>{const material=read(lessons[6])+read(guides[5])+read(worksheets[6]);const script=read('assets/js/kidneys-water-balance-lesson.js');['kidney','nephron','ureter','bladder','water balance'].forEach(term=>assert.match(material,new RegExp(term,'i')));assert.match(material,/คืน.*กลับ.*เลือด|return.*blood/i);assert.match(material,/ไม่.*วินิจฉัย|does not diagnose/i);assert.match(material,/แข่งขันดื่มน้ำ|water-drinking challenge/i);assert.match(material,/ความเป็นส่วนตัว|privacy/i);['pathComplete','balanceComplete','quizComplete'].forEach(key=>assert.match(script,new RegExp(key)));assert.doesNotMatch(material,/draggable="true"/);});
if(process.exitCode)process.exit(process.exitCode);