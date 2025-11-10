const API_HOST = 'https://dice-api-abhirekhaa-fsd9e8cge8c3e5gy.westus3-01.azurewebsites.net';
const API_BASE = API_HOST + '/api';

const outGrid = document.getElementById('resultGrid');
const totalInput = document.getElementById('total');
const wakeBtn = document.getElementById('wake');
const rollBtn = document.getElementById('roll');

async function wake() {
  try {
    const r = await fetch(`${API_BASE}/ping`);
    const j = await r.json();
    console.log('wake', j);
  } catch (e) {
    console.error('wake error', e);
  }
}

function renderResult(rolls) {
  outGrid.innerHTML = ''; // clear
  rolls.forEach((val, i) => {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.value = String(val);
    inp.readOnly = true;
    inp.setAttribute('aria-label', `Die ${i+1}`);
    inp.classList.add('right');
    outGrid.appendChild(inp);
  });
  totalInput.value = rolls.reduce((a,b)=>a+b,0);
}

async function roll() {
  const count = Number(document.getElementById('count').value || 1);
  const sides = Number(document.getElementById('sides').value || 6);
  try {
    const r = await fetch(`${API_BASE}/roll?count=${count}&sides=${sides}`);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    renderResult(data.rolls);
  } catch (e) {
    console.error('roll error', e);
    // if you want user-friendly message, render it somewhere
  }
}

wakeBtn.addEventListener('click', wake);
rollBtn.addEventListener('click', roll);

// --- Requirement 2 items:
// Auto-roll the first time the page loads:
window.addEventListener('load', () => {
  // wake first (optional) then roll:
  wake().then(() => roll());
});

// Also allow Enter to trigger Roll (autofocus above helps)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    // prevent accidentally submitting forms (if any)
    e.preventDefault();
    roll();
  }
});
