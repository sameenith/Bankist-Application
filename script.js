'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sara Soni',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Mehak Cutee',
  movements: [200, 300, -400, 1500, 2000, -650, -130, 70, 1300],
  interestRate: 1.3, // %
  pin: 5555,
};
const account6 = {
  owner: 'Mohammed Samee',
  movements: [600, 450, -800, 3000, -650, -130, 70, 5000],
  interestRate: 0, // %
  pin: 6666,
};
const accounts = [account1, account2, account3, account4, account5, account6];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
//                 Displaying Movements                        //
/////////////////////////////////////////////////////////////////
const diplayMovements = function (movements, sort = false) {
  // const movs = sort? movements.sort()
  // ham esa nhi kar sakte kyuki ye fir hamari actual array ko hi sort kar dega
  // so we take copy of our movement array using slice method
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

///////////////////////////////////////////////////////////////
//            Calculating final balance of user              //
///////////////////////////////////////////////////////////////
const calcDisplayBlance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

///////////////////////////////////////////////////////////////
//             user name with use of map method              //
///////////////////////////////////////////////////////////////

const creatUserName = function (accs) {
  // here forEach metoh is used to do some work without returning something   or so called side effects
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) //pahle normal function se bana lo uske baad arrow function me convert kar lo
      .join('');
  });
};
creatUserName(accounts);

/*

///////////////////////////////////////////////////////////////
//             user name without use of map method           //
///////////////////////////////////////////////////////////////
const user = 'Steven Thomas Williams';
const userName = user.toLowerCase().split(' ');
const UserFirstLatter = [];
for (const n of userName) {
  UserFirstLatter.push(n[0]);
}
console.log(UserFirstLatter.join(''));

*/

///////////////////////////////////////////////////////////////
//                calculatin balance summary                 //
///////////////////////////////////////////////////////////////
const calcDisplaySummary = function (acc) {
  //  income
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  // spend
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  // intrest on deposited amount add if intrest on value is greater then 1
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

///////////////////////////////////////////////////////////////
//                      updating UI                          //
///////////////////////////////////////////////////////////////

const updateUI = function (acc) {
  // Display movements
  diplayMovements(acc.movements);
  // Display balance
  calcDisplayBlance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

//--------------------Event Handlers-------------------------//
///////////////////////////////////////////////////////////////
//                    implimenting login                     //
///////////////////////////////////////////////////////////////

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and massage
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }!`;
    // clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // updating UI
    updateUI(currentAccount);
  }
});

///////////////////////////////////////////////////////////////
//                      Transfer money                       //
///////////////////////////////////////////////////////////////
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username
  )
    // Doing the tranfer
    currentAccount.movements.push(-amount);
  reciverAcc.movements.push(amount);

  // updating UI
  updateUI(currentAccount);
});

///////////////////////////////////////////////////////////////
//                      Delete Account                       //
///////////////////////////////////////////////////////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // delete account
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

///////////////////////////////////////////////////////////////
//                       Request loan                        //
///////////////////////////////////////////////////////////////
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movements
    currentAccount.movements.push(amount);
    // updateUI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

///////////////////////////////////////////////////////////////
//                         Sorting                           //
///////////////////////////////////////////////////////////////

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  diplayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// inputLoanAmount

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*

////////////////////////////////////////////////////
//----------------Array Metohds-------------------//
////////////////////////////////////////////////////
// functions which are called on objects are methods
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr);
//------------------Slice Method--------------------//

// using this method we can extract part of an array without changing actual array
// if we use slice metod without any argument then it will make a shallow copy of an array
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(2, -2));
console.log(arr);

//-----------------------splice method---------------------//
// it mutate the orignal array the element in splice array are actually deleted from actual array
// in this 1st argument is for at witch positon we have to delete and 2nd argument for number of items we have to delete
console.log(arr.splice(-2));
console.log(arr.splice(2, 4));
console.log(arr.splice(0, 1));
console.log(arr.splice(0, 2));

console.log(arr);

// ---------------------Reverse method--------------------------//
// it also mutate orignal array
arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.reverse());
console.log(arr);

//---------------------Concat method------------------------//
// it does not mutate the orrignal array
let arr2 = ['a', 'b', 'c', 'd', 'e'];
const latters = arr.concat(arr2);
console.log(latters);
//          OR
console.log([...arr, ...arr2]);

//-------------------join method------------------------//
console.log(latters.join(' - '));

*/

///////////////////////////////////////////////////////////////
//-------------forEach Method for looping arrays-------------//
///////////////////////////////////////////////////////////////

// arr.forEach(function(){})  this function here is call back function

// parameter ka naam kya h vo important nhi h but postion of parameter is importnat
// like     1st parameter is always need to be  current element
//          2nd always would be current index and
//          3rd always will be entier array that we looping over

//              but in case of ****for-of loop****   arr.entries()
//      1st parameter is index and     2nd is current array element

// the diffrence between them(for-of loop and forEach method) is
//        Cotinue or break statements never works on forEach method

////////////////////////////////////////////////////////////////////
/*

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, mov] of movements.entries()) {
  if (mov > 0) {
    console.log(`Movement ${i} : You deposited ${mov}`);
  } else {
    console.log(`Movement ${i} : You withdrew ${Math.abs(mov)}`);
  }
}

console.log(`------forEach------`);
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i} : You deposited ${mov}`);
  } else {
    console.log(`Movement ${i} : You withdrew ${Math.abs(mov)}`);
  }
});

//---------------------forEach for Maps and Sets------------//

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(['USD', 'EUR', 'USD', 'GBP', 'EUR']);
console.log(currenciesUnique);

// for Set key and value is equal in case of using forEach method
// so we use key= value in set example is below

// currenciesUnique.forEach(function (value, key, map) {
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});

*/
//////////////////////////////////////////////////////////////////
//-------------insertAdjacentHTML----------------//
//      document.querySelector('.class).insertAdjacentHTML('position in which we have to attache the html',string containig the html)
//      1)afterbegin  2)beforeend 3) beforebegin 4)afterend

//--------------------innerHTML property-------------------------//
// used when we have to remove preset values

/*
//////////////////////////////////////////////////////////////
//----------------------Challenge 01------------------------//
//////////////////////////////////////////////////////////////
const checkDogs = function (dogsJulia, dogsKate) {
  // const juliaCorrected = dogsJulia.slice(1, -2);
  const juliaCorrected = dogsJulia.slice();
  juliaCorrected.splice(0, 1);
  juliaCorrected.splice(-2);
  // const Dogs = [...juliaCorrected, ...dogsKate];
  const dogs = juliaCorrected.concat(dogsKate);
  console.log(dogs);
  dogs.forEach(function (dog, i) {
    if (dog < 3) {
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    } else {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old.`);
    }
    // console.log(
    //   `Dog number ${i + 1} is an ${category}, and is ${dog} years old.`
    // );
  });
};
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/

/*
//////////////////////////////////////////////////////////////////////
//-----------Map , filter, reduce to loop over arrays --------------//
/////////////////////////////////////////////////////////////////////


//  map ka use tab karte h jab hame new array chahiye hoti h retuen me
//  agar new array nhi chahiye to fir forEach method ka hi use karna h 
//  filter ka use ham tab karte h jab hame array me sekoi values ko hatana ho
//  reduce is for boiling down an array into a single values
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

// const movementsUsd = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

const movementsUsd = movements.map(mov => mov * eurToUsd);
console.log(movementsUsd);

//------same using for-of loop-----------//
const movementsUsdFor = [];
for (const mov of movements) {
  movementsUsdFor.push(mov * eurToUsd);
}
console.log(movementsUsdFor);

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1} ${mov > 0 ? 'deposited' : 'withdrew'} : ${Math.abs(mov)}`
);
console.log(movementsDescription);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposited = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposited);
const withdrew = movements.filter(mov => mov < 0);
console.log(withdrew);

///////////////-----------with for-of loop----------//////////

// same as filter medhod
const depositsFor = [];
for (const mov of movements) {
  if (mov > 0) {
    depositsFor.push(mov);
  }
}
console.log(depositsFor);

// same as reduced method
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

 // Accumulator is like the SNOWBALL it keep's adding values
 // we can also give accumulator some initial value 
 // first parameter in case of reduced method is accumulator and then
 // 2nd is current element of an array and then index and
 // last one is the whole array
 
 // const balance = movements.reduce(function (acc, mov, i, arr) {
   //   return acc + mov;
   // }, 0);
   const balance = movements.reduce((acc, mov) => acc + mov, 0); // initial value of accumulator
   console.log(balance);
   
   // reduced method for finding maximum value in an array
   const max = movements.reduce(function (acc, mov) {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
});
console.log(max);

*/

/*
//////////////////////////////////////////////////////////////
//----------------------Challenge 02------------------------//
//////////////////////////////////////////////////////////////

const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(dogAge =>
    dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
  );
  console.log(humanAge);
  const adults = humanAge.filter(age => age > 18);
  console.log(adults);
  const averageHumanAge =
    // adults.reduce((acc, age) => acc + age, 0) / adults.length;
    adults.reduce((acc, age, i, arr) => acc + age / arr.length, 0);

  console.log(averageHumanAge);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

///////////////////////////////////////////////////////////////

*/

/*
//////////////////////////////////////////////////////////////
//             chainig map, filter & reduce                 //
//////////////////////////////////////////////////////////////

// we can only chain method after one another if the previous one will
// return an array like map and filter where as reduce return a value so
// we can't after using reduce method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;
// const totalDepositsUsd = movements
//   .filter(function (mov,i,arr) {
//     return mov > 0;
//   })
//   .map(function (mov, i, arr) {
//     return mov * eurToUsd;
//   })
//   .reduce(function (acc, mov, i, arr) {
//     return acc + mov;
//   }, 0);
// console.log(totalDepositsUsd);

const totalDepositsUsd = movements
  .filter(mov => mov > 0)
  // .map(mov => mov * eurToUsd)
  .map((mov, i, arr) => {
    console.log(arr);
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUsd);

// debugging this type of chain methods
// to check this cheak array in each steps

*/

/*
//////////////////////////////////////////////////////////////
//----------------------Challenge 03------------------------//
//////////////////////////////////////////////////////////////

const calcAverageHumanAgeNew = ages =>
  ages
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(age => age > 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
const age1 = calcAverageHumanAgeNew([5, 2, 4, 1, 15, 8, 3]);
const age2 = calcAverageHumanAgeNew([16, 6, 10, 5, 6, 1, 4]);
console.log(age1, age2);

//////////////////////////////////////////////////////////////

*/

/*
//////////////////////////////////////////////////////////////
//                      find method                         //
//////////////////////////////////////////////////////////////
// it alos work as filter method it return boolean but the diffrance is
// that find method only returns first element of the condition from array
// also filter method returns an array but find method returns only one element

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

// same thing using for-of loop
for (const accountNew of accounts) {
  accountNew.owner === 'Jessica Davis'
    ? console.log(accountNew)
    : `account not found`;
}

// prevent form submitting
// .preventDefault()


//------------------findIndex method-----------------------//
// similar to find method it finds index of array at witch the element is placed
// where as find method gives us a boolean value

//-----------------------some & every -----------------------//
// /it is same as includes but the diffrence is inclues checks equality
// where as some check's for conditons and every return true when all
// elements satisfy the condition

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
// includes : equality
console.log(movements.includes(-130));

// some: Condition
console.log(movements.some(mov => mov > 0));

// Every
console.log(movements.every(mov => mov > 0));

*/

/*

//-----------------flat & flatMap method--------------------//

//-------------------------flat-----------------------------//
// if we have nested array and we have to make only array out of them
// then we use flat method

const arr = [[1, 2, 3], [4, 5, 6], 7, 8, 9];
console.log(arr);

console.log(arr.flat());
// let us assume ye or deeply nested array hoti to fir
const arr2 = [[1, [2, 3]], [[4, 5], 6], 7, 8, 9];
console.log(arr2.flat());
console.log(arr2.flat(2)); // ye 2nd level tak work karega

// let us assume hame bank vale jitne bhi user h un sab k movements treck karne h to kya karenge
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// now same thing  by chaining
const overallBalance1 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance1);

//-------------------------flatMap--------------------------//

// now here we can see we use map and flat togeather every time
// so we introduced a new method known as flatMap
// in flatMap method we can only go 1 level deep for making new combined array

const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

*/

/*

//------------------------Sorting-----------------------//

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// sorting mutates our array
// with number's sorting does not work properly it convert all numbers to
// string and then arrenge in order according to that
// but we can fix this
// if numbers and strings are mixed then don't use sorting

//---------we make copy on an array using slice method----------//

//  STRING
const friends = ['abhay ', 'samee', 'akshat', 'numan', 'mohit', 'anushk'];
console.log(friends.sort());

//  NUMBERS
console.log(movements.sort()); //does't work as we want

// ASSENDING ORDER
movements.sort((a, b) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
});
console.log(movements);

//  DECENDING ORDER
movements.sort((a, b) => {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
});
console.log(movements);

// same thing but using maths we make it short

// ASSENDING ORDER
movements.sort((a, b) => a - b);
console.log(movements);

//  DECENDING ORDER
movements.sort((a, b) => b - a);
console.log(movements);

*/

/*

// Empty array
const arr = new Array(1, 2, 3, 4, 5, 6, 7);
console.log(arr);

const x = new Array(7); // agr ek ki value dalenge to yaha par array nhi
// banegi balki jo number dala usi lenth ki ek eampty array ban jayegi
console.log(x);

// empty array + fill method
x.fill(2, 3, 6);
// ye slice method ki tarah hi use hota h isme 1st argument to vo hota h
// jo hame value hame array me dalni h or 2nd and 3rd argument kaha se kaha tak
console.log(x);

// Array.from
const y = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(y);

const rollingDice = Array.from({ length: 100 }, function () {
  return Math.trunc(Math.random() * 6 + 1);
});
console.log(rollingDice);

// array like structure can be conveted to an array easily using " Array.from "

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementUI);

  // const movementUI2 = [...document.querySelectorAll('.movements__value')];
  // console.log(movementUI2.replace('€', ''));
});
acc => acc.movements
*/

/*
////////////////////////////////////////////////////////////////
//----------------------Array method practice-----------------//
////////////////////////////////////////////////////////////////

//  1)
const bankDepositsSum = accounts
  .map(function (acc) {
    return acc.movements;
  })
  .flat()
  .filter(function (mov) {
    return mov > 0;
  })
  .reduce(function (sum, mov) {
    return sum + mov;
  }, 0);

console.log(bankDepositsSum);

// simplified code
const bankDepositsSum2 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, mov) => sum + mov, 0);
console.log(bankDepositsSum2);

//  2)

// using filter method
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(numDeposits1000);

// using reduce method
const numDeposits1000_2 = accounts
  .flatMap(acc => acc.movements)
  // .reduce((count, mov) => (mov >= 1000 ? count++ : count), 0);
  // count++ here the ++ operator has done it's job but it will still return
  // the old value so to fix this problem we use it as prefix ++ operator
  .reduce((count, mov) => (mov >= 1000 ? ++count : count), 0);
console.log(numDeposits1000_2);

//  3)

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      // using bracket[ ] notation
      // sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

//  4)

const convertTitleCase = function (title) {
  const exception = ['a', 'an', 'the', 'with', 'and', 'but', 'or', 'in', 'on'];
  const capitalized = str => str[0].toUpperCase() + str.slice(1);
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exception.includes(word) ? word : capitalized(word)))
    .join(' ');
  return capitalized(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

*/

/*

//////////////////////////////////////////////////////////////
//----------------------Challenge 04------------------------//
//////////////////////////////////////////////////////////////

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//  1)
dogs.forEach(dog => (dog.recommended = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);
//  2)
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);

console.log(
  `Sarah's Dog is eating too ${
    dogSarah.curFood > dogSarah.recommended ? 'much' : 'little'
  }`
);

//  3)
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommended)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittel = dogs
  .filter(dog => dog.curFood < dog.recommended)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittel);

//  4)
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittel.join(' and ')}'s dogs eat too little!`);

//  5)
console.log(dogs.some(dog => dog.curFood === dog.recommended));

//  6)
const checkEatingOkay = dog =>
  dog.curFood > dog.recommended * 0.9 && dog.curFood < dog.recommended * 1.1;

console.log(dogs.some(checkEatingOkay));

//  7)
console.log(dogs.filter(checkEatingOkay));

//  8)
const dogSorting = dogs.slice().sort((a, b) => a.curFood - b.curFood);
console.log(dogSorting);

*/
