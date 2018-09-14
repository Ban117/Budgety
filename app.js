// Moduel Pattern
// Model
var budgetController = (function () {

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };
  
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  }

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(curr => {
      sum += curr.value;
    });
    data.totals[type] = sum;
  };


  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      // Push it into data structure
      data.allItems[type].push(newItem);
      // data.allItems.type.push(newItem);

      // Return new element
      return newItem;
    },
    
    calculateBudget: function() {
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      
      // Calculate the percentage of income
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

    }, 
    
    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    }, 

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    deleteItem: function(type, id) {
      var ids, index;
      ids = data.allItems[type].map((current) => {
        return current.id;
      });

      index = ids.indexOf(id);
      console.log(typeof id);
      
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    testing: function() {
      console.log(data);
    }
  };
})();

// View
var UIController = (function () {

  var DOMStrings = {
    inputType:        '.add__type',
    inputDescription: '.add__description',
    inputValue:       '.add__value',
    inputBtn:         '.add__btn',
    incomeContainer:  '.income__list',
    expensesContainer:'.expenses__list',
    budgetLabel:      '.budget__value',
    incomeLabel:      '.budget__income--value',
    expenseLabel:     '.budget__expenses--value',
    percentageLabel:  '.budget__expenses--percentage',
    container:        '.container',
    expensesPercLabel:'.item__percentage'
  };

  return {
    getInput: function() {
      return {
        type:        document.querySelector(DOMStrings.inputType).value, // inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value:       parseFloat(document.querySelector(DOMStrings.inputValue).value)
      }
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
      }

      // Replace placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      
      // Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    }, 

    clearFields: function() {
      var fields, fieldsArray;
      // Returns nodeList
      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
      // Tricks slice() into thinking we're giving it an array
      fieldsArray = Array.prototype.slice.call(fields);
      fieldsArray.forEach( (current, index, array) => { // eslint-disable-line no-unused-vars
        current.value = '';
      });
      fieldsArray[0].focus();
    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    }, 

    displayBudget: function(obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      // Not using hack to convert to array
      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },
    
    formatNumber: function(num, type) {
      // + or - before decimal
      // exactly 2 decimal points
      // comma seperating 1000s
      num = Math.abs(num);
      num = num.toFixded(2);

    }, 

    getDOMstrings: function() {
      return DOMStrings;
    }
    
  };
})();


// Controller
var controller = (function (budgetCtrl, UICtrl) {

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
   
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  var updatePercentages = function(){
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();

    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
    
  }

  var updateBudget = function() {
    // 1. Calculate the budget 
    budgetCtrl.calculateBudget();

    // 2. Return the budgets
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on UI
    UICtrl.displayBudget(budget);
  };

  

  var ctrlAddItem = function() {
    var input, newItem;
    
    // 1. Get the filed input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to budget controller 
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      
      // 3. Add new item to the UI 
      UICtrl.addListItem(newItem, input.type);
      
      // 4. Clear fields
      UICtrl.clearFields();
  
      // 5. Calculate and update budget
      updateBudget();

      // 6. Calculate and updated item percentages
      updatePercentages();
    }

  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // Traversing the DOM
    
    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
      console.log(`Type: ${type} id: ${ID}`);
      
      // 1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();

      // 4. Calculate and updated item percentages
      updatePercentages();

    }
  };

  return {
    init: function() {
      console.log('Started');
      UICtrl.displayBudget({
        budget: 0,
        totalInc:0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();