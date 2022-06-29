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

const appCalculator = {
    operand: '',
    tempResult: '',
    expression: '',
    hasDot: false,
    canAddDigit: true,
    lastOperator: null,
    isEqual: false,
    handleEvents: function() {
        _this = this;
        digitBtns.forEach(function (digit) {
            digit.onclick = function(e) {
                if (_this.isEqual) {
                    _this.cleanAll();
                    _this.isEqual = false;
                }

                const txt = e.target.innerText;

                //check dot and check digit-0
                console.log(_this.canAddDigit);
                if ( txt === '.' && !_this.hasDot ) {
                    _this.canAddDigit = true;
                    _this.hasDot = true;
                } else if ((txt === '.' && _this.hasDot) || (txt=== '.' &&  !_this.operand) || !_this.canAddDigit) {
                   return;
                }

                if (txt === '0' && _this.canAddDigit && !_this.operand) {
                    _this.canAddDigit = false;
                    _this.hasDot = false;
                } 

                _this.resetOperand(txt);
            }

            operatorBtns.forEach(function (operator) {
                operator.onclick = function(e) {
                    if(_this.isEqual) {
                        _this.expression = '';
                        _this.resetExpression();
                        _this.isEqual = false;
                    }

                    if (_this.operand) {
                        if (_this.lastOperator) {
                            _this.calculate();
                        } else {
                            _this.tempResult = _this.operand;
                        }
                        const currentOperator = e.target.innerText;
                        _this.resetResult(_this.tempResult);
                        _this.resetExpression(`${_this.operand} ${currentOperator}`);
                        _this.resetOperand();
                        _this.lastOperator = currentOperator;
                    }
                    
                    
                }
            })

            equalBtn.onclick = function() {
                if (_this.lastOperator && _this.operand && _this.tempResult) {
                    _this.calculate();
                    _this.resetExpression(`${_this.operand} =`);
                    _this.resetOperand();
                    _this.resetOperand(_this.tempResult);
                    _this.tempResult = '';
                    _this.resetResult();
                    _this.lastOperator = null;
                    _this.isEqual = true;
                }
            }

            deleteNumberBtn.onclick = function() {
                _this.operand = '';
                operandElement.innerText = '0';
            }

            deleteDigitBtn.onclick = function() {
                if (_this.operand) {
                    const lent = _this.operand.length;
                    _this.operand = _this.operand.slice(0, lent - 1);
                    operandElement.innerText = _this.operand ? _this.operand : '0';
                } 
            }

            cleanAllBtn.onclick = function() {
                _this.operand = '';
                operandElement.innerText = '0';
                _this.resetResult();
                _this.resetExpression();
                _this.lastOperator = null;
            }

            percentBtn.onclick = function() {
                _this.operand /= 100;
                operandElement.innerText = _this.operand;
            }

            changeSingBtn.onclick = function() {
                _this.operand *= (-1);
                operandElement.innerText = _this.operand;
            }

            
        })
    },
    resetOperand: function(txt='') {
        if (txt) {
            this.operand += txt;
        } else {
            this.operand = '';
        }
        operandElement.innerText = this.operand;
        if (this.operand) {
            operandElement.classList.add('show');
        } else {
            operandElement.classList.remove('show');
        }
    },
    resetResult: function(value = '') {
        tempotaryResultElement.innerText = value;
    },
    resetExpression: function(txt = '') {
        if (txt) {
            this.expression += ' ' + txt;
        } else {
            this.expression = '';
        }
        expressionElement.innerText = this.expression.trim();
    },
    cleanAll: function() {
        this.resetOperand();
        this.resetExpression();
        this.resetResult();

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
        }
        this.tempResult = this.tempResult.toString();
    },
    start: function() {

        this.handleEvents();
    }
}

appCalculator.start();