$(() => {
    "use strict";
    // Check is Screen is to be cleared
    let isClear = false;
  
    // Update the expression in the History Screen
    function changeHistory(history) {
      $(".history").text(history);
      let maxScrollLeft = $(".history").get(0).scrollWidth - $(".history").get(0).clientWidth;
      $(".history").scrollLeft(maxScrollLeft);
    }
  
    // Backspace Button Click Event
    $("#btnBackspace").click(function() {
      let val = $(".screen").text();
      
      // Cancel clearning of screen
      if(isClear) {
        isClear = false;
      }
      
      // If vurrent value is not an operator
      if(val != "+" && val != "-" 
         && val != "x" && val != "÷") {
        val = val.slice(0, val.length -1);
        
        // Reset to 0
        if(val.length < 1 || (val[0] == "-" && val.length <= 1))
          val = 0;
        
        $(".screen").text(val);
        
        // Set the hidden scroll in history screen to max
        let maxScrollLeft = $(".history").get(0).scrollWidth - $(".history").get(0).clientWidth;
        $(".history").scrollLeft(maxScrollLeft);
      }
    }); 
  
    // All Clean (AC) Button Click Event
    $("#btnAllClear").click(function() {
      $(".history").text("");
      $(".screen").text(0);
    });
  
    // Clear Entry (CE) Button Click Event
    $("#btnClearEntry").click(function() {
      $(".screen").text(0);
    });  
  
    // Number (0-9) Button Click Event
    $(".num").click(function() {
      let val = $(".screen").text();
      
      // Divide by Zero Warning
      if(val[val.length-1] == "÷" && $(this).text() == 0) {
        $("#alert1").css("display","block");
        return;
      }
      
      // Cancel clearning of screen
      if(isClear) {
        val = "";
        isClear = false;
      }
      
      // If current value is not an operator
      if(val != "+" && val != "-" 
         && val != "x" && val != "÷") {
        
        // If current value is 0 change it 
        if(val[0] == 0 && val[1] != ".")
          val = $(this).text();
        else
          val += $(this).text();

        // If current value exceeded the length allowed
        if(val.length >= 13)
          $("#alert2").css("display","block");
        else
          $(".screen").text(val);
      }
      else {
        let history = $(".history").text();
        
        // Append the current value to the history screen
        history += " " + val;
        changeHistory(history);
        
        // Updated the current value to the input value
        val = $(this).text();
        $(".screen").text(val);
      }
    });
  
    // Decimal (.) Button Click Event
    $("#btnDecimal").click(function() {
      let val = $(".screen").text();
      
      // Cancel clearning of screen
      if(isClear) {
        isClear = false;
      }
      
      // If current value is not an operator
      if(val != "+" && val != "-" 
         && val != "x" && val != "÷") {

        // If current value exceeded the length allowed
        if(val.length >= 13) {    
          $("#alert2").css("display","block");
        }
        // If current value doesn't have a Decimal Point
        else if(val.indexOf(".") == -1) {
          val += ".";
          $(".screen").text(val);
        }
      }
    });
  
    // Operator Button Click Event
    $(".op").click(function() {
      let op = $(this).text();
      let val = $(".screen").text();
      let history = $(".history").text();
      
      // Cancel clearning of screen
      if(isClear)
        isClear = false;
          
      // If current value is not an operator
      if(val != "+" && val != "-" 
         && val != "x" && val != "÷") {
        if(val[val.length - 1] == ".")
          val = val.slice(0, val.length-1);
        
        history += " " + val;
        changeHistory(history);
      }
      
      $(".screen").text(op);
    });
  
  
    /* Takes an expression as an input and
      Returns the result to the Computation */
    function compute(compArr) {
        let index = 0;
        let result = 0;

        /* While there are more
           than 1 term in the expression */
        /* Computation is in the Order of Precedence
           and left-to-right
           1. Multiplication and Division
           2. Addition and Subtraction */
        while (compArr.length > 1) {
          
            // For multiplication
            if (compArr.indexOf("x") != -1 && (compArr.indexOf("÷") == -1 || compArr.indexOf("x") < compArr.indexOf("÷"))) {
                index = compArr.indexOf("x");
                result = compArr[index - 1] * compArr[index + 1];
                compArr.splice(index - 1, 3, result);
            }
            // For division
            else if (compArr.indexOf("÷") != -1 && (compArr.indexOf("x") == -1 || compArr.indexOf("÷") < compArr.indexOf("x"))) {
                index = compArr.indexOf("÷");
                result = compArr[index - 1] / compArr[index + 1];
                compArr.splice(index - 1, 3, result);
            }
            // For addition
            else if (compArr.indexOf("+") != -1 && (compArr.indexOf("-") == -1 || compArr.indexOf("+") < compArr.indexOf("-"))) {
                index = compArr.indexOf("+");
                result = parseFloat(compArr[index - 1]) + parseFloat(compArr[index + 1]);
                compArr.splice(index - 1, 3, result);
            } 
            // For subtraction
            else if (compArr.indexOf("-") != -1 && (compArr.indexOf("+") == -1 || compArr.indexOf("-") < compArr.indexOf("+"))) {
                index = compArr.indexOf("-");
                result = compArr[index - 1] - compArr[index + 1];
                compArr.splice(index - 1, 3, result);
            }
        }

        // If the result is longer than 13, trim it
        if (result.toString().length > 13) {
              result = result.toPrecision(12);
        }
        return parseFloat(result);
    }
  
    // Equal Button Click Event
    $("#btnEqual").click(function() {
      let val = $(".screen").text();
      let history = $(".history").text();
      
      // If current value is not an operator
      if(val != "+" && val != "-" 
         && val != "x" && val != "÷") {
        history += " " + val;
        history = history.slice(1);
      }
      
      if(history.indexOf("÷ 0") == -1) {
        let compArr = history.split(" ");
        if(compArr.length < 3)
          return;
        // Start Computation
        val = compute(compArr);
        $(".history").text("");
        $(".screen").text(val);
        isClear = true;
      }
    });
});