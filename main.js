// this runs whenever a tab button is clicked
// it hides everything first then shows just the one we want
function switchTab(name) {
  let sections = document.querySelectorAll('.section');
  sections.forEach(s => s.classList.remove('active'));

  let tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(t => t.classList.remove('active'));

  document.getElementById('section-' + name).classList.add('active');

  // the tabs and names arrays are in the same order so the index lines up
  let names = ['atm', 'loan', 'fraud', 'merger', 'security'];
  let idx = names.indexOf(name);
  tabs[idx].classList.add('active');
}


// starting balance is $1000 as the assignment says
let balance = 1000;

// this is the main array we do all the push/pop/shift/unshift operations on
let transactionHistory = [];

// i added this so i can track what the last action was
// that way when undo is clicked i know whether to use pop() or shift()
let operationLog = [];

// runs when the dropdown changes, updates the hint text and hides the amount field if not needed
function handleTxnTypeChange() {
  let type = document.getElementById('txnType').value;
  let amtGroup = document.getElementById('amountGroup');

  // undo and remove oldest don't need a dollar amount so just hide that field
  if (type === 'Undo' || type === 'RemoveOldest') {
    amtGroup.style.display = 'none';
  } else {
    amtGroup.style.display = 'block';
  }

  let hints = {
    'Deposit':       'Method: <strong style="color:var(--light-blue)">Array.push()</strong> — appends deposit to the END of history',
    'Withdrawal':    'Method: <strong style="color:var(--light-blue)">Array.push()</strong> — appends withdrawal to the END of history',
    'Fee':           'Method: <strong style="color:var(--amber)">Array.unshift()</strong> — inserts fee at the FRONT (beginning) of history',
    'Undo':          'Method: <strong style="color:var(--red)">Array.pop()</strong> or <strong style="color:var(--red)">Array.shift()</strong> — reverses last action',
    'RemoveOldest':  'Method: <strong style="color:var(--mid-blue)">Array.shift()</strong> — removes and returns the FIRST item in history'
  };

  document.getElementById('methodHint').innerHTML = hints[type];
  hideErr('atmError');
}

// this handles all 5 transaction types in one function
function processATMTransaction() {
  let type = document.getElementById('txnType').value;
  hideErr('atmError');

  // not totally sure why parseFloat is needed here but without it the math breaks
  let amount = parseFloat(document.getElementById('txnAmount').value);

  if (type === 'Deposit') {
    if (isNaN(amount) || amount <= 0) {
      showErr('atmError', 'Please enter a valid deposit amount greater than $0');
      return;
    }

    balance += amount;
    let item = { type: 'Deposit', amount: amount, balanceAfter: balance };

    // push adds to the END of the array, that's what we want for normal history
    transactionHistory.push(item);
    operationLog.push({ action: 'push', item: item });

    flashBalance('up');

  } else if (type === 'Withdrawal') {
    if (isNaN(amount) || amount <= 0) {
      showErr('atmError', 'Please enter a valid withdrawal amount');
      return;
    }

    // okay so this checks if the balance is enough before we let them withdraw
    // i think using > is correct here because going negative shouldn't be allowed
    if (amount > balance) {
      showErr('atmError', 'Insufficient funds! Current balance: $' + balance.toFixed(2));
      return;
    }

    balance -= amount;
    let item = { type: 'Withdrawal', amount: amount, balanceAfter: balance };

    // push adds withdrawal to the end just like deposits
    transactionHistory.push(item);
    operationLog.push({ action: 'push', item: item });

    flashBalance('down');

  } else if (type === 'Fee') {
    if (isNaN(amount) || amount <= 0) {
      showErr('atmError', 'Please enter a valid fee amount');
      return;
    }

    balance -= amount;
    let item = { type: 'Fee', amount: amount, balanceAfter: balance };

    // unshift adds to the FRONT instead of the end, fees go first because they're urgent
    transactionHistory.unshift(item);
    operationLog.push({ action: 'unshift', item: item });

    flashBalance('fee');

  } else if (type === 'Undo') {
    if (operationLog.length === 0) {
      showErr('atmError', 'Nothing to undo! The history is empty.');
      return;
    }

    // pop the operation log to see what the last thing we did was
    let lastOp = operationLog.pop();

    // pop undoes a push (removes from end), shift undoes an unshift (removes from front)
    if (lastOp.action === 'push') {
      transactionHistory.pop();
    } else if (lastOp.action === 'unshift') {
      transactionHistory.shift();
    }

    // now put the balance back to where it was before that action
    if (lastOp.item.type === 'Deposit') {
      balance -= lastOp.item.amount;
    } else {
      // withdrawals and fees both subtracted from balance, so we add back
      balance += lastOp.item.amount;
    }

    flashBalance('neutral');

  } else if (type === 'RemoveOldest') {
    if (transactionHistory.length === 0) {
      showErr('atmError', 'History is already empty, nothing to remove.');
      return;
    }

    // shift removes from the FRONT which is the oldest entry
    let removed = transactionHistory.shift();

    // keep operationLog in sync too so undo doesn't get confused
    if (operationLog.length > 0) {
      operationLog.shift();
    }

    flashBalance('neutral');
  }

  // refresh the display after every action
  renderATMDisplay();
}

// redraws the balance and the history list on screen
function renderATMDisplay() {
  // this regex adds commas every 3 digits so $1000 becomes $1,000
  let formatted = '$' + balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  document.getElementById('atmBalance').textContent = formatted;

  document.getElementById('histCount').textContent = transactionHistory.length;

  let histEl = document.getElementById('histDisplay');

  if (transactionHistory.length === 0) {
    histEl.innerHTML = '<div class="h-empty">Array is empty</div>';
  } else {
    let html = '';
    // forEach gives us both the item and its index, using index to show [0], [1] etc
    transactionHistory.forEach(function(item, index) {
      let cls = item.type.toLowerCase();
      let sign = item.type === 'Deposit' ? '+' : '-';
      html += '<div class="h-row ' + cls + '">';
      html += '<span style="opacity:0.45; font-size:0.7rem;">[' + index + ']</span>';
      html += '<span style="font-weight:600;">' + item.type.toUpperCase() + '</span>';
      html += '<span>' + sign + '$' + item.amount.toFixed(2) + '</span>';
      html += '</div>';
    });
    histEl.innerHTML = html;
  }

  // build the raw text version so you can see what the actual array looks like
  let raw = 'transactionHistory = [\n';
  if (transactionHistory.length === 0) {
    raw = 'transactionHistory = []';
  } else {
    transactionHistory.forEach(function(item, i) {
      raw += '  { type: "' + item.type + '", amount: ' + item.amount.toFixed(2) + ', balanceAfter: ' + item.balanceAfter.toFixed(2) + ' }';
      if (i < transactionHistory.length - 1) raw += ',';
      raw += '\n';
    });
    raw += ']';
  }
  document.getElementById('rawArrOutput').textContent = raw;
}

// flashes the balance number green, red, or amber depending on what happened
function flashBalance(direction) {
  let el = document.getElementById('atmBalance');
  el.classList.remove('flash-up', 'flash-down', 'flash-fee');

  if (direction === 'up')   el.classList.add('flash-up');
  if (direction === 'down') el.classList.add('flash-down');
  if (direction === 'fee')  el.classList.add('flash-fee');

  // remove the color class after 1 second so it fades back to white
  setTimeout(function() {
    el.classList.remove('flash-up', 'flash-down', 'flash-fee');
  }, 1000);
}


// puts some sample scores in the input so you can test without typing
function loadSampleScores() {
  document.getElementById('creditInput').value = '720, 540, 810, 430, 900, 650, 310, 780';
  hideErr('loanError');
}

// this runs all the array methods on the credit scores the user entered
function processLoanScores() {
  let input = document.getElementById('creditInput').value;
  hideErr('loanError');

  if (!input.trim()) {
    showErr('loanError', 'Please enter at least one credit score');
    return;
  }

  // split turns the string into an array at each comma, then map+parseInt converts each piece to a number
  // trim() removes any extra spaces so "720, 540" doesn't break
  let scores = input.split(',').map(s => parseInt(s.trim()));

  // using some() here to check if any score failed to parse as a number
  if (scores.some(s => isNaN(s))) {
    showErr('loanError', 'Some values are not valid numbers. Format: 720, 540, 810');
    return;
  }

  // filter only keeps items where the condition is true, so this gives us scores above 700
  let eligible = scores.filter(score => score > 700);

  // map creates a new array by transforming every item, here we just add 20 to each one
  let adjustedScores = scores.map(score => score + 20);

  // reduce was confusing at first but basically it just adds everything together
  // the 0 at the end is the starting value for the accumulator
  let totalRisk = scores.reduce((sum, score) => sum + score, 0);

  // some() returns true if at least one item passes the test
  let hasPremium = scores.some(score => score >= 900);

  // every() only returns true if ALL items pass, one failure makes it false
  let allAbove400 = scores.every(score => score > 400);

  // find() returns the actual value of the first match, not just true/false
  let firstHighRisk = scores.find(score => score < 500);

  // findIndex() is like find() but gives us the position in the array instead of the value
  let highRiskIdx = scores.findIndex(score => score < 500);

  document.getElementById('loanResults').style.display = 'block';

  let eligibleHtml = eligible.length > 0
    ? eligible.map(s => '<span class="chip chip-eligible">' + s + '</span>').join('')
    : '<span style="color:var(--red); font-size:0.8rem;">[ ] — none eligible</span>';
  document.getElementById('resFilter').innerHTML = eligibleHtml;

  let adjustedHtml = adjustedScores.map(s => '<span class="chip chip-normal">' + s + '</span>').join('');
  document.getElementById('resMap').innerHTML = adjustedHtml;

  document.getElementById('resReduce').textContent = totalRisk.toLocaleString() + ' (total sum)';

  // some and every both return booleans so i'm coloring them green or red accordingly
  let someEl = document.getElementById('resSome');
  someEl.innerHTML = hasPremium
    ? '<span class="val-true">true</span> — a score >= 900 was found'
    : '<span class="val-false">false</span> — no premium scores found';

  let everyEl = document.getElementById('resEvery');
  everyEl.innerHTML = allAbove400
    ? '<span class="val-true">true</span> — all scores pass minimum threshold'
    : '<span class="val-false">false</span> — one or more scores too low';

  // find returns undefined if nothing matches, so i check for that before displaying
  document.getElementById('resFind').textContent = firstHighRisk !== undefined
    ? firstHighRisk + ' (first score below 500)'
    : 'undefined — none found';

  // findIndex returns -1 if nothing matches
  document.getElementById('resFindIdx').textContent = highRiskIdx !== -1
    ? highRiskIdx + ' (position in array)'
    : '-1 (not found)';

  // draw the score chips at the bottom, color coded by risk level
  let chipsHtml = scores.map(function(score) {
    let cls = score > 700 ? 'chip-eligible' : (score < 500 ? 'chip-risk' : 'chip-normal');
    let badge = score > 700
      ? '<span class="badge-approved">APPROVED</span>'
      : (score < 500 ? '<span class="badge-rejected">HIGH RISK</span>' : '');
    return '<span class="chip ' + cls + '">' + score + badge + '</span>';
  }).join('');
  document.getElementById('scoreChips').innerHTML = chipsHtml;
}


// the transactions array from the assignment, exactly as specified
let originalTxns = [1042, 8922, 3301, 5510, 7719, 9920];

// copying it with spread so i can reset later without losing the original values
let transactions = [...originalTxns];

let fraudID = 5510;
let auditRan = false;

// draws the transaction ID chips, the fraud one shows red
function renderFraudChips() {
  let html = transactions.map(function(id) {
    let cls = id === fraudID ? 'tid-fraud' : 'tid-normal';
    return '<span class="tid-chip ' + cls + '">' + id + '</span>';
  }).join('');
  document.getElementById('fraudChips').innerHTML = html;
}

// runs includes(), indexOf(), and slice() to investigate the fraud ID
function runFraudAudit() {
  auditRan = true;

  // includes() just checks if the value is in the array, returns true or false
  let isFound = transactions.includes(fraudID);

  // indexOf() tells us the exact position, returns -1 if not found
  let fraudPos = transactions.indexOf(fraudID);

  // slice(-3) grabs the last 3 items without changing the original array
  let lastThree = transactions.slice(-3);

  let html = '';

  html += '<div class="audit-step step-' + (isFound ? 'err' : 'ok') + '">';
  html += '<div class="step-method">.includes(' + fraudID + ')</div>';
  html += '<div class="step-result">Fraud ID present in array: <strong style="color:' + (isFound ? 'var(--red)' : 'var(--green)') + '">' + isFound + '</strong></div>';
  html += '</div>';

  html += '<div class="audit-step step-warn">';
  html += '<div class="step-method">.indexOf(' + fraudID + ')</div>';
  html += '<div class="step-result">Position found at index: <strong style="color:var(--amber)">[ ' + fraudPos + ' ]</strong></div>';
  html += '</div>';

  html += '<div class="audit-step">';
  html += '<div class="step-method">.slice(-3)</div>';
  html += '<div class="step-result">Last 3 transactions: <strong style="font-family:var(--font-mono)">[ ' + lastThree.join(', ') + ' ]</strong></div>';
  html += '</div>';

  if (isFound) {
    html += '<div style="margin-top:0.75rem; padding:0.65rem 0.85rem; background:rgba(239,68,68,0.08); border-radius:6px; color:var(--red); font-size:0.78rem; font-weight:600;">FRAUD CONFIRMED AT INDEX ' + fraudPos + ' — Click "Remove Fraud" to splice it out</div>';
  }

  document.getElementById('auditPanel').innerHTML = html;
  document.getElementById('removeFraudBtn').style.display = 'inline-flex';
}

// uses splice() to remove the fraud ID then forEach() to log the clean ones
function performFraudRemoval() {
  if (!auditRan) return;

  let pos = transactions.indexOf(fraudID);
  if (pos === -1) {
    alert('Fraud ID has already been removed!');
    return;
  }

  // splice actually changes the original array, unlike slice which just copies
  // first arg is the index to start at, second is how many items to remove
  transactions.splice(pos, 1);

  renderFraudChips();

  // turn all the remaining chips green to show they're cleared
  let container = document.getElementById('fraudChips');
  let chips = container.querySelectorAll('.tid-chip');
  chips.forEach(chip => chip.className = 'tid-chip tid-cleared');

  let panel = document.getElementById('auditPanel');
  let newStep = document.createElement('div');
  newStep.className = 'audit-step step-ok';
  newStep.innerHTML =
    '<div class="step-method">.splice(' + pos + ', 1)</div>' +
    '<div class="step-result" style="color:var(--green)">Fraud ID ' + fraudID + ' removed from index [' + pos + ']</div>';
  panel.appendChild(newStep);

  document.getElementById('clearedPanel').style.display = 'block';

  // forEach runs a function on every item, we're using it to print each cleared transaction
  let clearedHtml = '';
  transactions.forEach(function(id) {
    clearedHtml += '<div style="color:var(--green)">Transaction ' + id + ' cleared</div>';
  });
  document.getElementById('clearedList').innerHTML = clearedHtml;

  document.getElementById('removeFraudBtn').style.display = 'none';
}

// resets everything in section 3 back to the original state
function resetFraudSection() {
  // spread copies the original so we get a fresh array each time
  transactions = [...originalTxns];
  auditRan = false;
  renderFraudChips();
  document.getElementById('auditPanel').innerHTML =
    '<div style="color:var(--mid-blue); font-size:0.8rem; text-align:center; padding:1.5rem 0; font-style:italic;">Click "Run Audit" to begin the investigation</div>';
  document.getElementById('clearedPanel').style.display = 'none';
  document.getElementById('removeFraudBtn').style.display = 'none';
}


// the two branch arrays from the assignment
let branchA = ['Alice Johnson', 'Bob Smith', 'Carol White', 'David Lee'];
let branchB = ['Emma Davis', 'Frank Miller', 'Grace Wilson', 'Henry Brown'];

// this one is nested on purpose so we can practise flat()
let messyData = [
  ['Liam Harris', 'Olivia Martin'],
  ['Noah Thompson', 'Sophia Garcia'],
  ['Aiden Martinez']
];

// these start empty and get filled when the user clicks each button
let allCustomers = [];
let flatData = [];

// draws the branch lists and sets up the teller windows on page load
function renderBranches() {
  let aHtml = branchA.map(n => '<span class="name-chip nc-a">' + n + '</span>').join('');
  let bHtml = branchB.map(n => '<span class="name-chip nc-b">' + n + '</span>').join('');
  document.getElementById('branchAView').innerHTML = aHtml;
  document.getElementById('branchBView').innerHTML = bHtml;

  document.getElementById('messyDataView').textContent = JSON.stringify(messyData, null, 2);

  // new Array(5) makes an array with 5 empty slots, fill() puts "Closed" in all of them
  let tellerArr = new Array(5).fill('Closed');
  let tellerHtml = '';
  tellerArr.forEach(function(status, i) {
    tellerHtml +=
      '<div class="teller-card">' +
      '<div class="teller-num">WINDOW ' + (i + 1) + '</div>' +
      '<div class="teller-status">' + status + '</div>' +
      '</div>';
  });
  document.getElementById('tellerGrid').innerHTML = tellerHtml;
}

// concat joins the two arrays into one without changing the originals
function runConcat() {
  allCustomers = branchA.concat(branchB);

  let html = allCustomers.map(function(name, i) {
    // i < branchA.length means the first chunk came from branch A
    let cls = i < branchA.length ? 'nc-a' : 'nc-b';
    return '<span class="name-chip ' + cls + '">' + name + '</span>';
  }).join('');

  document.getElementById('concatChips').innerHTML = html;
  document.getElementById('concatOut').style.display = 'block';
}

// flat() collapses one level of nesting so [[a, b], [c]] becomes [a, b, c]
function runFlat() {
  flatData = messyData.flat();

  let html = flatData.map(n => '<span class="name-chip nc-b">' + n + '</span>').join('');
  document.getElementById('flatChips').innerHTML = html;
  document.getElementById('flatOut').style.display = 'block';
}

// sorts alphabetically then reverses so we end up with Z to A order
function runSortReverse() {
  // if flat hasn't been run yet, run it now so we have data to sort
  if (flatData.length === 0) flatData = messyData.flat();

  // using spread to copy the array first so sort doesn't mutate flatData directly
  let sorted = [...flatData].sort();

  // reverse flips the whole array in place, i'm copying again to be safe
  let reversed = [...sorted].reverse();

  let sortedHtml   = sorted.map(n => '<span class="name-chip nc-a">' + n + '</span>').join('');
  let reversedHtml = reversed.map(n => '<span class="name-chip nc-b">' + n + '</span>').join('');

  document.getElementById('sortContent').innerHTML =
    '<div class="label-sm mb-sm">.sort() — alphabetical A to Z:</div>' + sortedHtml +
    '<div class="label-sm mt-md mb-sm">.reverse() — flipped Z to A:</div>' + reversedHtml;

  document.getElementById('sortOut').style.display = 'block';
}

// join turns the array into one big string with " - " between each name
function runJoin() {
  // make sure allCustomers has data, run concat if it doesn't
  if (allCustomers.length === 0) allCustomers = branchA.concat(branchB);

  let bannerStr = allCustomers.join(' - ');

  document.getElementById('bannerStr').textContent = bannerStr;
  document.getElementById('joinOut').style.display = 'block';
}


// validates the password against the 3 rules from the assignment
// returns the plain string "Access Granted" or "Access Denied"
function validateBankPassword(pwd) {
  // rule 1: has to be at least 8 characters
  if (pwd.length < 8) {
    return 'Access Denied';
  }

  // rule 2: can't contain the word "password" anywhere, even if capitalised
  // toLowerCase() makes sure "PASSWORD" or "Password" are caught too
  if (pwd.toLowerCase().includes('password')) {
    return 'Access Denied';
  }

  // rule 3: needs at least one vowel so it's actually memorable
  // the /i flag on the regex means it catches uppercase vowels as well
  if (!/[aeiou]/i.test(pwd)) {
    return 'Access Denied';
  }

  return 'Access Granted';
}

// runs when the user clicks the Validate button
function validatePassword() {
  let pwd = document.getElementById('pwInput').value;
  hideErr('pwError');

  if (!pwd) {
    showErr('pwError', 'Please enter a password to validate');
    return;
  }

  // validateBankPassword returns the plain string now, not an object
  let result = validateBankPassword(pwd);
  let el = document.getElementById('accessResult');
  el.style.display = 'block';

  if (result === 'Access Granted') {
    el.className = 'access-result granted';
    el.innerHTML =
      '<div class="access-title">ACCESS GRANTED</div>' +
      '<div class="access-reason">All requirements met</div>';
  } else {
    el.className = 'access-result denied';
    el.innerHTML =
      '<div class="access-title">ACCESS DENIED</div>' +
      '<div class="access-reason">One or more requirements failed — check the list above</div>';
  }
}

// updates the checklist and strength bar as the user types
function livePasswordCheck() {
  let pwd = document.getElementById('pwInput').value;

  // these three match exactly what validateBankPassword checks
  let hasLength  = pwd.length >= 8;
  let noPassword = !pwd.toLowerCase().includes('password');
  let hasVowel   = /[aeiou]/i.test(pwd);

  updateReqItem('req-length',  hasLength,  'At least 8 characters');
  updateReqItem('req-nopass',  noPassword, 'Does not contain the word "password"');
  updateReqItem('req-vowel',   hasVowel,   'Contains at least one vowel (a, e, i, o, u)');

  // filter(Boolean) counts how many of the three are true
  let score = [hasLength, noPassword, hasVowel].filter(Boolean).length;

  let fill  = document.getElementById('strengthFill');
  let label = document.getElementById('strengthLabel');

  let pct = (score / 3) * 100;
  fill.style.width = pwd ? pct + '%' : '0%';

  if (!pwd) {
    fill.style.background = '';
    label.textContent = 'Enter a password to see strength';
    label.style.color = 'var(--mid-blue)';
  } else if (score === 1) {
    fill.style.background = 'var(--red)';
    label.textContent = 'Weak';
    label.style.color = 'var(--red)';
  } else if (score === 2) {
    fill.style.background = 'var(--amber)';
    label.textContent = 'Getting there...';
    label.style.color = 'var(--amber)';
  } else {
    fill.style.background = 'var(--green)';
    label.textContent = 'Strong password';
    label.style.color = 'var(--green)';
  }

  // hide the access result while the user is still typing
  document.getElementById('accessResult').style.display = 'none';
}

// helper that marks a checklist item as passed (green tick) or not yet (grey circle)
function updateReqItem(id, passed, text) {
  let el = document.getElementById(id);
  if (passed) {
    el.textContent = 'v  ' + text;
    el.className = 'req-item pass';
  } else {
    el.textContent = 'o  ' + text;
    el.className = 'req-item';
  }
}

// toggles the password input between hidden and visible
function togglePwView() {
  let input = document.getElementById('pwInput');
  let btn = document.getElementById('pwToggleBtn');
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'HIDE';
  } else {
    input.type = 'password';
    btn.textContent = 'SHOW';
  }
}

// loops through each year and checks for leap years and FizzBuzz anniversaries
function generateYearlyReport(startYear, endYear) {
  let report = [];

  for (let year = startYear; year <= endYear; year++) {
    // leap year is divisible by 4, except century years, unless also divisible by 400
    // i had to look this up, it's surprisingly tricky
    let isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

    // this is the FizzBuzz part — decade check has to come first
    // because if you check % 5 first, years like 2020 would match that instead of the decade one
    let anniversaryLabel = null;
    if (year % 10 === 0) {
      anniversaryLabel = year + ' - Decade Anniversary';
    } else if (year % 5 === 0) {
      anniversaryLabel = year + ' - 5 Year Anniversary';
    }

    // the assignment says to print these to the console
    if (isLeap) {
      console.log('Year ' + year + ' is a special audit year.');
    }
    if (anniversaryLabel) {
      console.log(anniversaryLabel);
    }

    report.push({
      year: year,
      isLeap: isLeap,
      anniversaryLabel: anniversaryLabel
    });
  }

  return report;
}

// called when the user clicks Generate Report, renders the results on screen
function generateReport() {
  let startYear = parseInt(document.getElementById('startYear').value);
  let endYear   = parseInt(document.getElementById('endYear').value);
  hideErr('reportError');

  if (isNaN(startYear) || isNaN(endYear)) {
    showErr('reportError', 'Please enter valid year numbers');
    return;
  }

  if (startYear > endYear) {
    showErr('reportError', 'Start year must be before or equal to end year');
    return;
  }

  // capping at 200 years so it doesn't generate thousands of rows
  if (endYear - startYear > 200) {
    showErr('reportError', 'Please keep the range to 200 years or less');
    return;
  }

  let reportData = generateYearlyReport(startYear, endYear);

  let html = '';
  reportData.forEach(function(yr) {
    // anniversaryLabel is null for normal years, so this check works
    let isAnniversary = yr.anniversaryLabel !== null;
    let rowClass = 'yr-normal';
    if (yr.isLeap && isAnniversary) rowClass = 'yr-both';
    else if (yr.isLeap)             rowClass = 'yr-leap';
    else if (isAnniversary)         rowClass = 'yr-anniversary';

    html += '<div class="report-row ' + rowClass + '">';
    html += '<strong style="min-width:44px">' + yr.year + '</strong>';

    if (yr.isLeap) {
      html += '<span class="yr-tag yr-tag-leap">LEAP</span>';
    }

    if (isAnniversary) {
      let tagText = yr.anniversaryLabel.includes('Decade') ? 'DECADE ANN.' : '5YR ANN.';
      html += '<span class="yr-tag yr-tag-anniversary">' + tagText + '</span>';
    }

    html += '<span style="opacity:0.6; font-size:0.72rem">' + (yr.isLeap ? '366' : '365') + ' days</span>';
    html += '</div>';
  });

  document.getElementById('reportPanel').innerHTML = html;
}


// shows an error message below an input
function showErr(id, msg) {
  let el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}

// hides an error message
function hideErr(id) {
  document.getElementById(id).style.display = 'none';
}


// runs once when the page first loads
window.onload = function() {
  renderFraudChips();
  renderBranches();
  renderATMDisplay();
};
