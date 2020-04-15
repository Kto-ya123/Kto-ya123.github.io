var testing = false;
let maxErrors = 3;
let numAnswers = 10;
var currentAnswer;
var numError;

let COMPARATOR = new FormulaComparator();

function FormulaComparator() {

    this.compareFormulas = function (formula1, formula2) {
        let paramFormula1 = collectParams(formula1);
        let paramFormula2 = collectParams(formula2);

        formula1 = prepareFormula(formula1);
        formula2 = prepareFormula(formula2);

        let params = unionParams(paramFormula1, paramFormula2);

        let truthMatrix = [];
        for (let i = 0; i < Math.pow(2, params.length); i++) {
            let binaryLine = "0".repeat(params.length - i.toString(2).length) + i.toString(2);
            truthMatrix.push([...binaryLine]);
        }

        alert(truthMatrix);
        return areMatrixEquals(prepareMatrixForFormula(formula1, truthMatrix, params), prepareMatrixForFormula(formula2, truthMatrix, params));
    };

    function prepareMatrixForFormula(formula, truthMatrix, params) {
        let matrix = [];
        for (let i = 0; i < truthMatrix.length; i++) {
            let formulaWithValues = formula;
            for (let j = 0; j < params.length; j++) {
                formulaWithValues = formulaWithValues.split(params[j]).join(truthMatrix[i][j]);
            }
            try {
                matrix.push(Boolean(eval(formulaWithValues)));
            } catch (e) {
                alert("Formula incorrect. " + e.toString());
                return;
            }
        }
        return matrix;
    }

    function areMatrixEquals(matrix1, matrix2) {
        if (matrix1.length !== matrix2.length) {
            return false;
        }
        for (let i = 0; i < matrix1.length; i++) {
            if (matrix1[i] !== matrix2[i]) {
                return false;
            }
        }
        return true;
    }

    function collectParams(formula) {
        let params = [];
        while (formula.match("[A-z]")) {
            let index = formula.match("[A-z]").index;
            params.push(formula[index]);
            formula = formula.substring(index + 1);
        }
        return [...new Set(params)];
    }

    function prepareFormula(formula) {
        for (let ob of formula.matchAll("~")) {
            let index = formula.match("~").index;
            let leftIndexFormula1 = getLeftIndex(index, formula);
            let subFormula1 = formula.substring(leftIndexFormula1 + 1, index);
            let rightIndexFormula2 = getRightIndex(index, formula);
            let subFormula2 = formula.substring(index + 1, rightIndexFormula2);

            formula = formula.substring(0, leftIndexFormula1) +
                "((!(" + subFormula1 + ")|(" + subFormula2 + "))&" +
                "((" + subFormula1 + ")|!(" + subFormula2 + ")))" +
                formula.substring(rightIndexFormula2 + 1, formula.length);
        }

        for (let ob of formula.matchAll("->")) {
            let index = formula.match("->").index;
            let leftIndexFormula1 = getLeftIndex(index, formula);
            let subFormula1 = formula.substring(leftIndexFormula1 + 1, index);
            let rightIndexFormula2 = getRightIndex(index, formula);
            let subFormula2 = formula.substring(index + 2, rightIndexFormula2);

            formula = formula.substring(0, leftIndexFormula1) +
                "(!(" + subFormula1 + ")|(" + subFormula2 + "))" +
                formula.substring(rightIndexFormula2 + 1, formula.length);
        }

        formula = formula.split("&").join("&&");
        formula = formula.split("|").join("||");

        function getRightIndex(start, formula) {
            let index = 0;
            for (let i = start + 1; i < formula.length; i++) {
                if (formula[i] === ')' && index === 0) {
                    return i;
                } else {
                    if (formula [i] === '(') {
                        index++;
                    }
                    if (formula[i] === ')') {
                        index--;
                    }
                }

            }
            return formula.length;
        }

        function getLeftIndex(start, formula) {
            let index = 0;
            for (let i = start - 1; i > 0; i--) {
                if (formula[i] === '(' && index === 0) {
                    return i;
                } else {
                    if (formula [i] === '(') {
                        index--;
                    }
                    if (formula[i] === ')') {
                        index++;
                    }
                }
            }
            return 0;
        }

        return formula;
    }

    function unionParams(params1, params2) {
        return [...new Set([...params1, ...params2])];
    }

}

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

     if(COMPARATOR.compareFormulas(test, test2)){
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

