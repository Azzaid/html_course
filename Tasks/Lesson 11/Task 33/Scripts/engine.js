/**
 * Created by Johanas on 23.11.2017.
 */
var arrayHolder=[];
function createArray() {
    while (arrayHolder.length < 5) {
        let input = prompt("Please input element number " + arrayHolder.length);
        if (input) {
            arrayHolder.push(input);
        }
    }
}

function checkArray() {
    let input = prompt("Please input element to check");
    if (input) {
        let index = arrayHolder.indexOf(input);
        if (index > -1) {
            alert("Found element. Index is " + index);
        } else {
            alert("Element not found!");
            arrayHolder.push(input);
        }

    } else {
        alert("nothing to look for")
    }
}

function deleteArray() {
    arrayHolder.length=0;
}