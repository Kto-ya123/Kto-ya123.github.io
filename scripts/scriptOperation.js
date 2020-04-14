var testing = false;
let maxErrors = 3;
let numAnswers = 10;
var currentAnswer;
var numError;

function newTestTypeFormula() {
 var test = document.getElementById("outputTypeFormula").value;
 var test2 = document.getElementById("outputTypeFormula2").value;
 var outputCheckTypeFormula = document.getElementById("outputCheckTypeFormula");
 if (verificationFormula(test)&&verificationFormula(test2)) {
    document.getElementById("hiddenForm").hidden = false;
    var object = getTableTruth(test);
    var tbody = document.getElementById('tbody');

     document.getElementById("hiddenForm2").hidden = false;
     var object2 = getTableTruth(test2);
     var tbody2 = document.getElementById('tbody2');

     tbody.innerHTML = objectToTable(object.table, object.sizeSymbolInFormula);
     tbody2.innerHTML = objectToTable(object2.table, object2.sizeSymbolInFormula);
     if(checkEqualsFormula(object,object2,getSymbolInFormula(test),getSymbolInFormula(test2))){
         return 1;
     }
     else{
         return 0;
     }
 } else {
          return -1;
      }
}

function isEquals(){
    if(newTestTypeFormula() === 1){
        outputCheckTypeFormula.innerHTML = "Данные выражения являются равносильными";
    }
    else if(newTestTypeFormula() !== -1){
        outputCheckTypeFormula.innerHTML = "Выражения не равносильны";
    }else{
        document.getElementById("hiddenForm").hidden = true;
        document.getElementById("hiddenForm2").hidden = true;
        outputCheckTypeFormula.innerHTML = "Одно из выражений не является формулой";
    }
}

function startTest(){
    if(!testing) {
        numError = 0;
        currentAnswer = 0;
        testing = true;
        document.getElementById("outputTypeFormula").disabled = true;
        document.getElementById("outputTypeFormula2").disabled = true;
        document.getElementById("generate").hidden = true;
        document.getElementById("compare").hidden = true;
        document.getElementById("startTesting").textContent = "Stop testing";
        document.getElementById("startTesting").style.background = "Red";
        document.getElementById("equivalent").hidden = false;
        document.getElementById("nonEquivalent").hidden = false;
        outputRezult("");
        generate();
    }else{
        testing = false;
        document.getElementById("outputTypeFormula").readonly = false;
        document.getElementById("outputTypeFormula2").readonly = false;
        document.getElementById("generate").hidden = false;
        document.getElementById("compare").hidden = false;
        document.getElementById("startTesting").textContent = "Start testing";
        document.getElementById("startTesting").style.background = "Green";
        document.getElementById("equivalent").hidden = true;
        document.getElementById("nonEquivalent").hidden = true;
    }
}

function setAnswer(answer) {
    currentAnswer++;
    if(answer === newTestTypeFormula()){
        outputRezult("Ответ верный;\t");
    }else {
        numError++;
        outputRezult("Ответ неверный;\t\t");
    }
    generate();
}
function outputRezult(result) {
    if(numError !== maxErrors && currentAnswer < numAnswers) {
        outputCheckTypeFormula.innerHTML = `${result}Тест номер ${currentAnswer + 1};\tДопущено ошибок: ${numError};`;
    }else if(numError === maxErrors){
        outputCheckTypeFormula.innerHTML = `Вы не смогли пройти тест, допущено максимальное количество ошибок `;
        startTest();
    }else{
        outputCheckTypeFormula.innerHTML = `Вы успешно прошли тест`;
        startTest();
    }
}

