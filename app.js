// Moduel Pattern
// Model
var budgetController = (function () {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

  return {
    addItem: function(type, des, val) {
      var newItem;

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
    expensesContainer:'.expenses__list'
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
        html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
      } else if (type === 'exp') {
        element = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
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
      fieldsArray.forEach( (current, index, array) => {
        current.value = '';
      });
      fieldsArray[0].focus();
      
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
  };

  var updateBudget = function() {
    // 1. Calculate the budget 

    // 2. Return the budgets
  
    // 3. Display the budget on UI

  }

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
    }

  };

  return {
    init: function() {
      console.log('Started');
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();