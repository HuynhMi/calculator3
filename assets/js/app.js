const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//get all btns
const operatorBtns = $$('.operator');
const digitBtns = $$('.digit');

const percentBtn = $('.percent');
const cleanAllBtn = $('.clear-all-btn');
const deleteNumberBtn = $('.delete-number');
const deleteDigitBtn = $('.delete-digit');
const equalBtn = $('.equals');
const changeSingBtn = $('.change-sign');

const expressionElement = $('.display__expression');
const operandElement = $('.display__operand');
const tempotaryResultElement = $('.display__result');

const historyOpenBtn = $('.calculator__history-btn');
const historyCloseBtn = $('.history__btn--close');
const historyWrapper = $('.calculator__history-overlay');
const historyListElement = $('.history__list');
const historyDeleteBtn = $('.history__btn--delete');
const KEYS = 'KEY_CALCULATOR';

const appCalculator = {
    operand: '',
    tempResult: '',
    expression: '',
    hasDot: false,
    hasZero: false,
    lastOperator: null,
    isEqual: false,
    calculateList: JSON.parse(localStorage.getItem(KEYS)) || [],
    handleEvents: function() {
        _this = this;
        digitBtns.forEach(function (digit) {
            // CÓ 2 THỜI ĐIỂM NHẬP DIGIT KHỞI TẠO OPERAND CẦN SETUP
            digit.onclick = function(e) {
                //xử lý operand sau khi equal to, và bấm dấu ".""
                //(1)sau khi kết thúc một phép tính bằng dấu bằng: setup lại 1 số variable
                if (_this.isEqual) {
                    _this.operand = '';
                }

                //(2) nhập bình thường
                /* KIỂM TRA KHI NHẬP DIGIT TẠO OPERAND
                    1. 1 số 0 nếu 0.000
                    2. chỉ cho nhập 1 dot
                */
                const value = e.target.innerText;
                if (value === '0' && !_this.operand && !_this.hasZero) {
                    _this.hasZero = true;
                    // _this.hasDot = false;
                } else if(value === '0' && _this.hasZero){
                    return;
                }

                if ((value === '.' && _this.hasDot) || (value === '.' && !_this.operand)) {
                    return;
                } else if (value === '.' && !_this.hasDot) {
                    _this.hasDot = true;
                    _this.hasZero = false;
                } 

                if (value != '0' && _this.operand === '0' && value != '.') {
                    _this.operand = '';
                    _this.hasZero = false;
                }

                if (_this.isEqual) {
                    _this.resetExpression();
                    _this.isEqual = false;
                }
                _this.resetOperand(value);
            }

            operatorBtns.forEach(function (operator) {
                operator.onclick = function(e) {
                    //CHECK NẾU OPERAND KHÔNG CÓ GIÁ TRỊ THÌ KO ADD OPERATOR
                    if (!_this.operand) return;
                    
                    // CÓ 3 THỜI ĐIỂM CẦN SETUP KHI ENTER OPERATOR
                    // (1): sau khi bằng 1 kết quả
                    if(_this.isEqual) {
                        _this.resetExpression();
                        _this.isEqual = false;
                    }

                    //(2), (3): tính toán nếu đã có lastOperator or không
                    if (_this.lastOperator) {
                        _this.calculate();
                    } else {
                        _this.tempResult = _this.operand;
                    }

                    const currentOperator = e.target.innerText;
                    _this.resetResult(_this.tempResult);
                    _this.resetExpression(_this.operand, currentOperator);
                    _this.resetOperand();
                    _this.lastOperator = currentOperator;
                }
            })

            equalBtn.onclick = function() {
                if(_this.operand && _this.tempResult && _this.lastOperator) {
                    _this.calculate();
                    _this.resetExpression(_this.operand, '=');
                    _this.resetOperand();
                    _this.resetOperand(_this.tempResult);
                    _this.resetResult();
                    _this.lastOperator = null;
                    _this.isEqual = true;
                    _this.getCalculateItem();
                    _this.showCalculatorList();
                }
                
            }

            deleteNumberBtn.onclick = function() {
                _this.operand = '';
                operandElement.innerText = '0';
                operandElement.classList.remove('show');
            }

            deleteDigitBtn.onclick = function() {
                if (_this.operand) {
                    const lent = _this.operand.length;
                    _this.operand = _this.operand.slice(0, lent - 1);
                    if (_this.operand) {
                        operandElement.innerText = _this.operand;
                    } else {
                        operandElement.innerText = '0';
                        operandElement.classList.remove('show');
                    }
                } 
            }

            cleanAllBtn.onclick = function() {
                _this.clean();
            }

            percentBtn.onclick = function() {
                _this.operand /= 100;
                operandElement.innerText = _this.operand;
            }

            changeSingBtn.onclick = function() {
                console.log(_this.operand);
                _this.operand *= (-1);
                _this.displayOperand(_this.operand);
                console.log(_this.operand);
            }

            historyOpenBtn.onclick = function() {
                historyWrapper.classList.add('show-history');
            }
            
            historyCloseBtn.onclick = function() {
                historyWrapper.classList.remove('show-history')
            }

            historyDeleteBtn.onclick = function() {
                _this.calculateList = [];
                _this.removeDataFromLocalStorage();
                _this.showCalculatorList();
                
            }

            historyListElement.onclick = function(e) {
                const element = e.target.closest('.history__item');
                if (element) {
                    const id = element.dataset.id;
                    const item = _this.calculateList[id];
                    _this.resetExpression();
                    expressionElement.innerHTML = item.expression;
                    _this.operand = item.result;
                    operandElement.innerHTML = item.result;
                    _this.resetResult();
                    _this.isEqual = true;
                    _this.lastOperator = null;
                }
            }

            // handle when clicks on the keyboard
            window.onkeyup = function(e) {
                //numbers, delete => ce,backspace => delete digit, =  or enter
                const key = e.key;
                if (key == '.'||
                    key == '1'||
                    key == '2'||
                    key == '3'||
                    key == '4'||
                    key == '5'||
                    key == '6'||
                    key == '7'||
                    key == '8'||
                    key == '9'||
                    key == '0'
                    ) {
                        digitBtns.forEach(function(btn) {
                            if (btn.innerText === key) {
                                btn.click();
                            }
                        })
                    } else if (key === 'Delete') {
                        deleteNumberBtn.click()
                    } else if (key === 'Backspace') {
                        deleteDigitBtn.click();
                    } else if (key === '=' || key === 'Enter') {
                        equalBtn.click();
                    } else if (
                        key === '+'||
                        key === '-'||
                        key === '*'||
                        key === '/'
                    ) {
                        let btnClick;
                        switch(key) {
                            case '+':
                                btnClick = Array.from(operatorBtns).filter(function(btn) {
                                    return btn.innerText === '+';

                                });
                                btnClick[0].click();
                                break;
                            case '-':
                                btnClick = Array.from(operatorBtns).filter(function(btn) {
                                    return btn.innerText === '−';

                                });
                                btnClick[0].click();
                                break;
                            case '*':
                                btnClick = Array.from(operatorBtns).filter(function(btn) {
                                    return btn.innerText === '×';

                                });
                                btnClick[0].click();
                                break;
                            case '/':
                                btnClick = Array.from(operatorBtns).filter(function(btn) {
                                    return btn.innerText === '÷';

                                });
                                btnClick[0].click();
                                break;
                        }
                    } else if (key === 'H') {
                        historyOpenBtn.click();
                    } else if (key === 'C') {
                        historyCloseBtn.click();
                    } else if (key === 'D') {
                        historyDeleteBtn.click();
                    }
            }
        })
    },
    getCalculateItem: function() {
        if (this.expression && this.operand) {
            const newCalculate = {
                expression: this.expression,
                result: this.operand
            };
            this.calculateList.push(newCalculate);
            this.setDataToLocalStorage();
        }
    },
    showCalculatorList: function() {
        let htmls;
        if  (this.calculateList.length === 0) {
            htmls = '<li class="row history__item"><span class="history__text">There is no history yet</span></li>';
        } else {
            htmls = this.calculateList.map(function(item, index) {
                return `
                    <li class="history__item" data-id="${index}">
                        <span class="history__item-expression">${item.expression} ${item.result}</span>
                    </li>
                `;
            });
            htmls = htmls.join('\n')
        }
        historyListElement.innerHTML = htmls;

    },
    setDataToLocalStorage: function() {
        localStorage.setItem(KEYS, JSON.stringify(this.calculateList));
    },
    removeDataFromLocalStorage: function() {
        localStorage.removeItem(KEYS);
    },
    resetOperand: function(txt = '') {
        if (txt) {
            this.operand += txt;
        } else {
            this.operand = '';
            this.hasDot = false;
            this.hasZero = false;
        }

        if (this.operand < 0) {
            operandElement.innerText = `(${this.operand})`;
        } else {
            operandElement.innerText = this.operand;
        }
        if (this.operand) {
            operandElement.classList.add('show');
        } else {
            operandElement.classList.remove('show');
        }
    },
    displayOperand: function(operand) {
        if(operand < 0) {
            operandElement.innerText = '('+operand+')';
        } else {
            operandElement.innerText = operand;
        }
    },
    resetResult: function(value = '') {
        if (value < 0) {
            tempotaryResultElement.innerText = `(${value})`;
        } else {
            tempotaryResultElement.innerText = value;
        }
    },
    resetExpression: function(operand = '', operator = '') {
        if (operand) {
            if (operand >= 0) {
                this.expression += `${operand} ${operator} `;
            } else {
                this.expression += `(${operand}) ${operator}`;
            }
        } else if(!operand) {
            this.expression = '';
        }
        expressionElement.innerText = this.expression.trim();
    },
    clean: function() {
        _this.operand = '';
        operandElement.innerText = '0';
        operandElement.classList.remove('show');
        _this.tempResult = '';
        tempotaryResultElement.innerText = '0';
        _this.expression = '';
        expressionElement.innerText = '0';
        _this.lastOperator = null;
        
    },
    calculate: function () {
        if (this.tempResult && this.operand) {
            switch(this.lastOperator) {
                case '+':
                    this.tempResult = parseFloat(this.tempResult) + parseFloat(this.operand);
                    break;
                case '−':
                    this.tempResult = parseFloat(this.tempResult) - parseFloat(this.operand);
                    break;
                case '×':
                    this.tempResult = parseFloat(this.tempResult) * parseFloat(this.operand);
                    break;
                case '÷':
                    this.tempResult = parseFloat(this.tempResult) / parseFloat(this.operand);
                    break;
            }
            this.tempResult = parseFloat(this.tempResult.toPrecision(12)).toString();
        }
        
    },
    start: function() {
        this.showCalculatorList();
        this.handleEvents();
    }
}

appCalculator.start();