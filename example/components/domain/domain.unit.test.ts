import { Calculator } from './domain';
import { describe, it, expect } from '@jest/globals';

describe('.Calculator', () => {
    it('returns the sum of two numbers', () => {
        const firstNumber = 1;
        const secondNumber = 2;

        const calculator = new Calculator();
        expect(calculator.sum(firstNumber, secondNumber)).toBe(3);
    });
})

