const amount = document.getElementById("amount"),
  select = document.querySelectorAll(".select"),
  from = document.getElementById("from"),
  to = document.getElementById("to"),
  result = document.getElementById("rate"),
  convertBtn = document.getElementById("convert-icon"),
  calculateBtn = document.querySelector(".convert-btn");

async function getRate() {
  const response = await fetch(`https://api.exchangerate.host/latest?base=USD`);
  var data = await response.json();
  const rates = data.rates;
  if (response) {
    // get all curreny names li element
    updateOptions(from, getList(rates));
    updateOptions(to, getList(rates));
  } else {
    throw new Error(response.status);
  }
}
getRate();

function getList(rates) {
  //extract only keys from array
  const arrKeys = Object.keys(rates);
  //li array to hold all the li's
  let liArr = [];
  arrKeys.map((item) => {
    //create a li
    const li = document.createElement("li");
    //remove last character from currency to get country code
    const country = item.slice(0, -1);
    li.innerHTML = `
                <img src="https://countryflagsapi.com/png/${country}" alt="" />
                <span>${item}</span>

        `;
    //add eventlistner on li
    li.addEventListener("click", () => {
      //add the clciked option in select box
      //select parent of li which is ul and then parent of ul select then child of select span and change its content with item
      li.parentElement.parentElement.querySelector("span").innerHTML = item;
      //same for country flag
      li.parentElement.parentElement.querySelector("img").src = `
        https://countryflagsapi.com/png/${country}
        `;

      li.parentElement.querySelectorAll("li").forEach((li) => {
        li.classList.remove("active");
        //remove active on prev active li then add on clicked one
      });
      li.classList.add("active");
      //call calculate when any option is clciked
      calculate();
    });
    //push option in array
    liArr.push(li);
  });
  //return array of all options
  return liArr;
}
//we got all the option now lets add in select ul

function updateOptions(select, options) {
  ul = document.createElement("ul");
  options.forEach((option) => {
    //append all the options as child of ul
    ul.appendChild(option);
  });
  //append ul as child of select
  select.appendChild(ul);
}

//now lets create a function to convert rates

async function calculate() {
  //if amount is empty or zero do nothing
  if (amount.value === "" || amount.value === "0") {
    return;
  }
  //update button
  calculateBtn.innerHTML = "Calculating...";
  calculateBtn.disabled = true;

  //select from curerncy and to curerncy

  const fromCurrency = from.querySelector("span").innerHTML;
  const toCurrency = to.querySelector("span").innerHTML;
  const fromAmount = amount.value;
  // we will do fetch directly converted rate so we dont need to do maths
  await fetch(
    `
https://api.exchangerate.host/latest?base=${fromCurrency}&symbols=${toCurrency}&amount=${amount.value}&places=2
    `
    // base is the from currency which we want to conver
    // symbols is the currency in which we want to conver we can user one ore more comma separated
    //amount is the value to be converted
    // place are after the decimal part
  )
    .then((res) => res.json())
    .then((data) => {
      //select on required rate form data
      const rate = data.rates[toCurrency];
      //update result
      result.innerHTML = `${rate} ${toCurrency}`;
    });
  //restroe button
  calculateBtn.innerHTML = "Convert";
  calculateBtn.disabled = false;
}

//toggle active class in select when clicked
select.forEach((item) => [
  item.addEventListener("click", () => {
    item.classList.toggle("active");
  }),
]);

//lets a document click listner to remove active when clicked outside select

document.addEventListener("click", (e) => {
  if (!e.target.closest(".select")) {
    //if clicked outside
    select.forEach((item) => {
      item.classList.remove("active");
    });
  }
});

//add calculate on input

amount.addEventListener("input", function () {
  // remove other characters than numbers
  this.value = this.value.replace(/[^0-9.]/g, "");
  calculate();
});

//calculate on button click

calculateBtn.addEventListener("click", () => {
  calculate();
});

//exchange value on arrows click

convertBtn.addEventListener("click", () => {
  //get and store currently selected value then replace
  const fromSelected = from.querySelector("span").innerHTML;
  const toSelected = to.querySelector("span").innerHTML;
  const fromImg = from.querySelector("img").src;
  const toImg = to.querySelector("img").src;
  from.querySelector("span").innerHTML = toSelected;
  to.querySelector("span").innerHTML = fromSelected;
  from.querySelector("img").src = toImg;
  to.querySelector("img").src = fromImg;
  //calculate after exchange
  calculate();
});

/// its done hope you like it dont forget to like and subscribe see you in next video
