/**
 * Created by Johanas on 23.11.2017.
 */
let numberOne = parseFloat(prompt("Введите число 1 (цифрами)", 7));
let numberTwo = parseFloat(prompt("Введите число 2 (цифрами)", 7));
if (isNaN(numberOne) || isNaN(numberTwo)) {
    while (isNaN(numberOne) && isNaN(numberTwo)) {
        numberOne = parseFloat(prompt("Введите число 1 (цифрами)", 7));
        numberTwo = parseFloat(prompt("Введите число 2 (цифрами)", 7));
    }
    if (isNaN(numberOne) || isNaN(numberTwo)) {
        alert("одна из переменных не число");
    } else {
        analyseNumbers(numberOne, numberTwo);};
}else {analyseNumbers(numberOne, numberTwo)};

function analyseNumbers(numberOne, numberTwo) {
    let analysisResult = '';
    analysisResult += 'число 1 чётно:' + (numberOne%2==0) +'\n';
    analysisResult += 'число 2 чётно:' + (numberTwo%2==0) +'\n';
    analysisResult += 'число 1 целое:' + (numberOne%1==0) +'\n';
    analysisResult += 'число 2 целое:' + (numberTwo%1==0) +'\n';
    analysisResult += 'число 1 положительное:' + (numberOne>0) +'\n';
    analysisResult += 'число 2 положительное:' + (numberTwo>0) +'\n';
    if (numberOne > numberTwo) {analysisResult += 'число 1 больше';
    } else if (numberTwo > numberOne) {analysisResult += 'число 2 больше';
    }else {analysisResult += 'числа равны';};
    console.log(analysisResult);
}