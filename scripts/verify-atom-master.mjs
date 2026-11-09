import { readFileSync } from 'node:fs';
import { Script, createContext, runInContext } from 'node:vm';
import assert from 'node:assert/strict';

const html = readFileSync('public/demos/atom-master/index.html', 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match, 'inline menu application script exists');
new Script(match[1], { filename: 'atom-master-app.js' });
for (const id of ['products','moment-banner','detail-overlay','combo-overlay','cart-panel','combo-btn']) {
  assert.ok(html.includes('id="' + id + '"'), 'Required UI element: ' + id);
}
assert.ok(html.includes('Bağımsız tasarım konsepti'), 'Unapproved business demo disclaimer');
assert.ok(html.includes('www.atomstation.com.tr/lezzetler'), 'Corporate ingredient source should be linked');
assert.ok(!html.includes('SameSite=None; Secure'), 'No unrelated auth configuration');

const elements = new Map();
class FakeElement {
  constructor(id) {
    this.id = id; this.dataset = {}; this.value = '';
    this.style = {}; this.innerHTML = ''; this.textContent = '';
    this.classList = { add() {}, remove() {}, toggle() {} };
    this.listeners = {};
  }
  addEventListener(name, cb) { this.listeners[name] = cb; }
  querySelectorAll() { return []; }
  querySelector() { return { focus() {} }; }
  setAttribute() {}
  scrollIntoView() {}
  focus() {}
}
function getElementById(id) {
  if (!elements.has(id)) elements.set(id, new FakeElement(id));
  return elements.get(id);
}
const store = new Map();
const context = createContext({
  document: {
    documentElement: { dataset: {}, lang: 'tr' },
    body: { style: {} },
    getElementById,
    querySelectorAll(selector) {
      if (selector === '[data-view]') return ['feed','grid','list'].map(v=>Object.assign(new FakeElement(v),{dataset:{view:v}}));
      if (selector === '[data-moment]') return ['all','morning','afternoon','evening'].map(v=>Object.assign(new FakeElement(v),{dataset:{moment:v}}));
      return [];
    },
    addEventListener() {},
  },
  localStorage: { getItem: key => store.get(key)||null, setItem:(key,value)=>store.set(key,value) },
  window: { toastTimer: null },
  navigator: { clipboard: { writeText: async () => {} } },
  setTimeout: () => 1, clearTimeout: () => {},
  scrollTo() {},
  console,
});
runInContext(match[1],context,{timeout:2000});
const evaluate = expr => runInContext(expr,context,{timeout:2000});
assert.equal(evaluate('rows.length'), 38, 'All photographed menu items are preserved');
assert.equal(evaluate('REC["Benzin"].includes("pineapple")'), true, 'Benzin corporate ingredients');
assert.equal(evaluate('REC["Atom"].includes("honey")'), true, 'Atom corporate ingredients');
assert.equal(evaluate('getP("Kaşarlı Tost")[6]'),100);
assert.equal(evaluate('getP("Kova Waffle")[6]'),350);
assert.equal(evaluate('getP("Bomba")[6]'),null, 'Do not fabricate prices for drinks');
evaluate('detail("Atom")');
assert.ok(getElementById('detail-body').innerHTML.includes('www.atomstation.com.tr/lezzetler'), 'Product detail has corporate catalogue attribution');
assert.ok(getElementById('detail-body').innerHTML.includes('Gazipaşa'), 'Product detail is clear about local uncertainty');
evaluate('add("Atom","small",true); add("Atom","big",true); add("Bardak Waffle","small",true)');
assert.equal(evaluate('cart.length'),3,'Cart keeps sizes separate');
assert.equal(evaluate('total()'),320,'Cart counts confirmed prices only');
assert.equal(evaluate('hasUnknown()'),true,'Unknown drink price is flagged');
assert.ok(evaluate('orderSummary()').includes('PRICE NOT CONFIRMED'));
evaluate('renderCart()');
assert.ok(getElementById('cart-body').innerHTML.includes('Atom::big'),'Large variant has independent quantity control');
getElementById('combo-food').value='Kaşarlı Tost';
getElementById('combo-drink').value='Atom';
evaluate('openCombo()');
assert.ok(getElementById('combo-body').innerHTML.includes('combo-add'),'Actual combo builder is rendered');
assert.ok(getElementById('combo-total').innerHTML.includes('100'),'Combo subtotals only known prices');
console.log('PASS: Atom Master 38 items, price integrity, corporate ingredient attribution, size-specific cart, actual combo flow, modal and translation structure');
