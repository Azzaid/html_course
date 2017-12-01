/**
 * Created by Johanas on 23.11.2017.
 */

var screen = document.getElementById("screen");
var lastInput = "";

function buttonPush(event) {
   let button = event.target.textContent;
    console.log("button", button);
   let input = screen.value;
   switch (button) {
       case "C":
           lastInput ="";
           screen.value = "";
           break;
       case "=":
           let result = eval(lastInput);
           screen.value = result;
           lastInput = result;
           break;
       default:
           lastInput += button;
           screen.value = lastInput;
   }
   console.log("las input", lastInput);
}