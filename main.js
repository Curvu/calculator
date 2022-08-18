const buttons = document.querySelectorAll('.element')
const result = document.getElementById('result')
const holder = document.getElementById('operation')

const operators = ['−', '+', '×', '÷']

let activated = true
let oldHolder = ''

// All buttons
buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let value = e.currentTarget.textContent
        if (value === 'AC') clear()
        else if (!e.currentTarget.classList.contains('operator') && value !== '=')
            appendNumber(value)
        else if (e.currentTarget.classList.contains('operator') && activated) {
            addOperator(result, value)
            addOperator(holder, value)
        } else if (value === '=') renderResult()
    })
})

// Keyboard event
window.addEventListener('keypress', (e) => {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key)
    if (e.key === '=' || e.key === 'Enter') renderResult()
    if ((e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') && activated) {
        addOperator(result, convertOperator(e.key))
        addOperator(holder, convertOperator(e.key))
    }
})

const convertOperator = (operator) => {
    return operators.find((o) => o === operator.replace('-', '−').replace('*', '×').replace('/', '÷'))
}

const clear = () => {
    result.textContent = '0'
    holder.textContent = ''
}

const renderResult = () => {
    let hasEqual = holder.textContent.includes('=')
    let hasOperatorBefore = operators.some((o) => holder.textContent[holder.textContent.length - 1].includes(o))
    if (!hasEqual && !hasOperatorBefore) {
        holder.textContent += '='
        let data = getNumbers(oldHolder, result.textContent)
        result.textContent = doOperation(data[0], data[1], data[2])
        activated = false
    }
}

const appendNumber = (value) => {
    let hasOperator = operators.some((o) => result.textContent.includes(o))
    if (result.textContent === '0') result.textContent = value
    else if (hasOperator) result.textContent = value
    else if (!activated) {
        result.textContent = value
        activated = true
        holder.textContent = ''
    } else result.textContent += value

    if (holder.textContent === '0') holder.textContent = value
    else holder.textContent += value
}

const getNumbers = (str, num2) => {
    let num1 = ''
    for (let i = 0; i < str.length - 1; i++) num1 += str[i] // loop and finish right before an operator
    num1 = parseInt(num1)
    num2 = parseInt(num2)
    return [num1, str[str.length - 1], num2]
}

const addOperator = (local, value) => {
    let hasOperator = hasOperatorFunc(local.textContent)
    if (hasOperatorFunc(holder.textContent.slice(0, holder.textContent.length - 1)))
            return
    if (!hasOperator) local.textContent += value
    else {
        if (hasOperatorFunc(holder.textContent.slice(0, holder.textContent.length - 1)))
            return
        local.textContent = local.textContent.replace(local.textContent[local.textContent.length - 1], value)
    }
    oldHolder = holder.textContent
}

const doOperation = (num1, operation, num2) => {
    if (operation === '+') return add(num1, num2)
    else if (operation === '−') return minus(num1, num2)
    else if (operation === '×') return multiply(num1, num2)
    else if (operation === '÷') return (num2 === 0) ? 'Burro' : reduce(num1, num2)
}

const hasOperatorFunc = (str) => operators.some((o) => str.includes(o))

// Operations
const add = (x, y) => x + y
const minus = (x, y) => x - y
const multiply = (x, y) => x * y
const reduce = (x, y) => x / y