/**
 * Created by Johanas on 23.11.2017.
 */
let i = 0;
let row='';
while (i<9) {
    i++;
    row += '|_';
    console.log(row);
};

let holder = '';
let cellOne = '\u2B1B';
let cellTwo = '\u2B1C';
let outputString = '';

for (i=0; i<8; i++) {
    holder= cellOne;
    cellOne = cellTwo;
    cellTwo = holder;
    for (j=0; j<4; j++){
        outputString += cellOne + cellTwo;
    }
    outputString += '\n'
}
console.log(outputString);