const Calculator = require('./domain');

describe('Calculator', () => {
    describe('#sum', () => {
        it('returns the sum of two numbers', () => {
            const firstNumber = 1;
            const secondNumber = 2;

            const calculator = new Calculator();

            expect(calculator.sum(firstNumber, secondNumber)).to.be.equal(3);
        });
    });
});