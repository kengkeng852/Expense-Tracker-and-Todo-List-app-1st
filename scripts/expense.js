//Elements 
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income .income-total");
const expenseTotalEl = document.querySelector(".outcome .outcome-total");

const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");

//lists
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");

//Select Btns
const incomeBtn = document.querySelector(".tab1");
const expenseBtn = document.querySelector(".tab2");

//Input inputs
const addIncome = document.querySelector(".add-income i");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

//Expense inputs
const addExpense = document.querySelector(".add-expense i");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

// variables
let entry_list = JSON.parse(localStorage.getItem("entry_list")) || [];
let balance = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

updateUI();

//Event Listeners
incomeBtn.addEventListener("click",function() {
    console.log("Income button clicked");
    hide( expenseEl);
    show(incomeEl);
    inactive( expenseBtn );
    active( incomeBtn );
})

expenseBtn.addEventListener("click",function() {
    hide( incomeEl );
    show(expenseEl);
    inactive(incomeBtn );
    active( expenseBtn );
})

//add input
addExpense.addEventListener("click", function() {
    const title = expenseTitle.value;
    const amount = parseInt(expenseAmount.value);

    if(!title|| !amount) return; //return nothing / do nothing

    let entry = {
        type: "expense",
        title: title,
        amount: amount,
    }
    entry_list.push(entry);
    updateUI();
    clearInput([expenseTitle, expenseAmount])
})


addIncome.addEventListener("click", function() {
    const title = incomeTitle.value;
    const amount = parseInt(incomeAmount.value);
 
    if(!title || !amount ) return; //return nothing / do nothing

    let entry = {
        type: "income",
        title: title,
        amount: amount
    }
    entry_list.push(entry);
    updateUI();
    clearInput([incomeTitle, incomeAmount])
})

incomeList.addEventListener("click", action);
expenseList.addEventListener("click", action);

//delete and edit function
function action(event) {
    const target = event.target;
    const action = target.id;
    const entry = target.parentNode;

    switch(action) {
        case DELETE:
            deleteEntry(entry);
            break;
        case EDIT:
            editEntry(entry);
            break;
    }
}

function deleteEntry(entry) {
    entry_list.splice( entry.id, 1); //remove that specific entry
    updateUI();
}

function editEntry(entry){
    console.log(entry)
    let ENTRY = entry_list[entry.id];

    if(ENTRY.type == "income"){
        incomeTitle.value = ENTRY.title; //let title and amount in input boxes have value same as selected element to edit it
        incomeAmount.value = ENTRY.amount;  
    }else if(ENTRY.type == "expense"){
        expenseTitle.value = ENTRY.title;
        expenseAmount.value = ENTRY.amount;
    }

    deleteEntry(entry); //delete that element from the list 
}


function updateUI(){
    income = calculateTotal("income", entry_list);
    outcome = calculateTotal("expense", entry_list);
    balance = calculateBalance(income, outcome); // use absolute to calculate and show positive balance

    // update 
    balanceEl.innerHTML = `<small>฿ </small>${balance}`;
    incomeTotalEl.innerHTML = `<small>$ </small>${income}`;
    expenseTotalEl.innerHTML = `<small>$ </small>${outcome}`;

    clearElement( [expenseList, incomeList] ); //clear all elements fist before re rendering 

    entry_list.forEach( (entry, index) => {
        if( entry.type === "expense" ){
            showEntry(expenseList, entry.type, entry.title, entry.amount, index)
        }else if( entry.type === "income" ){
            showEntry(incomeList, entry.type, entry.title, entry.amount, index)
        }
    });

    localStorage.setItem("entry_list", JSON.stringify(entry_list));

}


function showEntry(list, type, title, amount, id){
    const entrylist = `<li id = "${id}" class="${type}">
                            <div class="entry">${title}: $${amount}</div>
                            <div   div id="edit"></div>
                            <div id="delete"></div>
                        </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entrylist);
}

function clearElement(elements) {
    elements.forEach(element => {
        element.innerHTML = ""; //delete everything set every element to empty
    })
}

function calculateTotal(type,entrylists) {
    let sum = 0;

    entrylists.forEach( list => {
        if(list.type == type){
            sum += list.amount;
        }
    })

    return sum;
}

function calculateBalance(income, expense) {
    return income - expense;
}

function clearInput(inputs) {
    inputs.forEach( input => {  //empty every input (title, amount)
        input.value = "";
    })
}

function show(El) { //remove hidden elements (income and expense input boxes)
    El.classList.remove("hide");
}

function hide(El){
        El.classList.add("hide");
}

function active(element){ //active hidden elements to be active text
    element.classList.add("active");
}

function inactive( element){
        element.classList.remove("active");
}






