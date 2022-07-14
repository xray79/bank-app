'use strict';

// Accounts with date info
const account1 = {
  owner: 'Ibnul Huq',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-07-08T14:11:59.604Z',
    '2022-07-10T17:01:17.194Z',
    '2022-07-12T23:36:17.929Z',
    '2022-07-01T10:51:36.790Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

// Helper function to modify dates
const modifyDate = n => {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString();
};

// Modify dates to today, yesterday, 3 days ago, 6 days ago
account1.movementsDates[7] = modifyDate(0);
account1.movementsDates[6] = modifyDate(1);
account1.movementsDates[5] = modifyDate(3);
account1.movementsDates[4] = modifyDate(6);

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-25T18:49:59.371Z',
    '2022-07-13T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Select elements
// Labels
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

// Containers
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

// Buttons
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

// Inputs
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Functions
// Days passed
const calcDaysPassed = function (date1, date2) {
  // calc days passed, divide by ms * s *  d * h
  return Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
};

// Format dates
const formatMovementDate = function (date, locale) {
  const today = new Date();
  const daysPassed = calcDaysPassed(today, date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// Format currencies
const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display each movement as a new element
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Movements dates
    const movDate = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(movDate, acc.locale);

    // Movement amounts
    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value movements__value--${type}">${formattedMov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/**
 * Calculates and displays total balance in account
 * @param {number[]} movements Array containing all movements for an account
 */
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

/**
 * returns an unsigned float with 2dp
 * @param {Number} n Floating point number
 * @returns unsigned float with 2dp
 */
const roundTwoDecimals = n => Math.abs(n.toFixed(2));

/**
 * Calculates and displays account summary, total in/out and interest paid in
 * @param {Object} account Object containing 1 users account data
 * @param {number[]} account.movements Array containg user movements - transation history
 * @param {number} account.interest Interest rate for an indivisual user
 */
const calcDisplaySummary = function (account) {
  let incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  incomes = formatCurrency(incomes, account.locale, account.currency);
  labelSumIn.textContent = `${incomes}`;

  let out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  out = formatCurrency(Math.abs(out), account.locale, account.currency);
  labelSumOut.textContent = `${out}`;

  let interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  interest = formatCurrency(interest, account.locale, account.currency);
  labelSumInterest.textContent = `${interest}`;
};

/**
 * Create account.username attribute using initials of account.owner
 * @param {[]} accounts An array of all user accounts
 */
const createUserNames = function (accounts) {
  accounts.forEach(
    account =>
      (account.username = account.owner
        .toLowerCase()
        .split(' ')
        .map(word => word[0])
        .join(''))
  );
};
createUserNames(accounts);

let currentAccount, timer;

/**
 * Updates UI based on changes to the current account
 * @param {{}} acc
 */
const updateUI = function (acc) {
  // Display movements
  displayMovements(currentAccount);

  // Display balance
  calcDisplayBalance(currentAccount);

  // Display summary
  calcDisplaySummary(currentAccount);
};

// Internationalisation api, set for login label
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
};
const locale = navigator.language;
labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

// Log out timer
const startLogOutTimer = function () {
  // set time to 5 mins
  let time = 5 * 60;

  const tickCallback = function () {
    // calc mins and seconds
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // in each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // when 0, stop timer and log out
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
    }

    time--;
  };

  // call timer every second
  tickCallback();
  const timer = setInterval(tickCallback, 1000);
  return timer;
};

// Login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // .blur() = lose focus on input field

    // Log out timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

// Transfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const targetAccount = accounts.find(
    acc => inputTransferTo.value === acc.username
  );

  /* 
  Must transfer positive amount
  Must have more in balance than the transfer amount
  Target account must be real account
  Target account must be different account
  */
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    targetAccount &&
    targetAccount?.username !== currentAccount.username
  ) {
    // Transfer done on current account and target
    currentAccount.movements.push(-amount);
    targetAccount.movements.push(amount);

    // Add dates for current account and target
    currentAccount.movementsDates.push(new Date().toISOString());
    targetAccount.movementsDates.push(new Date().toISOString());

    // Clear inputs
    inputTransferAmount.value = inputTransferTo.value = '';

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    // Rerender UI
    updateUI(currentAccount);
  }
});

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => currentAccount.username === acc.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Loans
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.ceil(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add loan if approved
    currentAccount.movements.push(amount);

    // add current date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();

    // show loan
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Sorting
let sorted = false; // State is false by default (unsorted)
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount, sorted);
});
