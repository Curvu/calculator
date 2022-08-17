const buttons = document.querySelectorAll('.element');
const result = document.getElementById('result');
const holder = document.getElementById('operation');

const operators = ['−', '+', '×', '÷']


// All buttons

let activated = true;
let oldHolder = '';

buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let value = e.currentTarget.textContent;
        if (value === 'AC') clear()
        else if (!e.currentTarget.classList.contains('operator') && value !== '=')
            appendNumber([result, holder], value)
        else if (e.currentTarget.classList.contains('operator') && activated) {
            addOperator(result, value);
            addOperator(holder, value);
            oldHolder = holder.textContent;
        } else if (value === '=') renderResult([result, holder])
    })
})

window.addEventListener('keypress', (e) => {
    if (e.key >= 0 && e.key <= 9) appendNumber([result, holder], e.key)
    if (e.key === '=' || e.key === 'Enter') renderResult([result, holder])
    if ((e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') && activated) {
        addOperator(result, convertOperator(e.key))
        addOperator(holder, convertOperator(e.key))
        oldHolder = holder.textContent;
    }
})

const convertOperator = (operator) => {
    /* if (operator === '+') return '+'
    else if (operator === '-') return '−'
    else if (operator === '*') return '×'
    else if (operator === '/') return '÷' */
    return operators.find((o) => o === operator.replace('-', '−').replace('*', '×').replace('/', '÷'))
}

const clear = () => {
    result.textContent = '0';
    holder.textContent = '';
}

const renderResult = (locals) => {
    let hasEqual = locals[1].textContent.includes('=');
    let hasOperatorBefore = operators.some((o) => locals[1].textContent[locals[1].textContent.length - 1].includes(o))
    if (!hasEqual && !hasOperatorBefore) {
        locals[1].textContent += '='
        let data = getNumbers(oldHolder, locals[0].textContent)
        locals[0].textContent = doOperation(data[0], data[1], data[2])
        activated = false;
    }
}

const appendNumber = (locals, value) => {
    let hasOperator = operators.some((o) => locals[0].textContent.includes(o));
    if (locals[0].textContent === '0') locals[0].textContent = value;
    else if (hasOperator) locals[0].textContent = value;
    else if (!activated) {
        locals[0].textContent = value;
        activated = true;
        locals[1].textContent = '';
    } else locals[0].textContent += value;

    if (locals[1].textContent === '0') locals[1].textContent = value;
    else locals[1].textContent += value;
}

const getNumbers = (str, num2) => {
    let num1 = '';
    for (let i = 0; i < str.length - 1; i++) num1 += str[i]; // loop and finish right before an operator
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    return [num1, str[str.length - 1], num2]
}

const addOperator = (local, value) => {
    let hasOperator = hasOperatorfunc(local.textContent);
    if (!hasOperator) local.textContent += value;
    else {
        if (hasOperatorfunc(holder.textContent.slice(0, holder.textContent.length - 1))) {
            return;
        }
        local.textContent = local.textContent.replace(local.textContent[local.textContent.length - 1], value);
    }
}

const doOperation = (num1, operation, num2) => {
    let res = 0;
    if (operation === '+') res = add(num1, num2)
    else if (operation === '−') res = minus(num1, num2)
    else if (operation === '×') res = multiply(num1, num2)
    else if (operation === '÷') {
        if (num2 === 0) return 'Burro'
        res = reduce(num1, num2)
    }
    return res;
}

const hasOperatorfunc = (str) => operators.some((o) => str.includes(o))

// Operations
const add = (x, y) => x + y
const minus = (x, y) => x - y
const multiply = (x, y) => x * y
const reduce = (x, y) => x / y
