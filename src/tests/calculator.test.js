const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { calculate } = require('../calculator');

describe('calculate', () => {
  describe('addition', () => {
    it('adds the example operands', () => {
      assert.equal(calculate(2, '+', 3), 5);
    });

    it('supports decimals, negative operands, and zero', () => {
      assert.equal(calculate(1.5, '+', 2.25), 3.75);
      assert.equal(calculate(-4, '+', 1), -3);
      assert.equal(calculate(0, '+', 0), 0);
    });
  });

  describe('subtraction', () => {
    it('subtracts the example operands', () => {
      assert.equal(calculate(10, '-', 4), 6);
    });

    it('supports negative results, decimals, and negative operands', () => {
      assert.equal(calculate(3, '-', 8), -5);
      assert.equal(calculate(5.5, '-', 2.25), 3.25);
      assert.equal(calculate(-2, '-', -3), 1);
    });
  });

  describe('multiplication', () => {
    it('multiplies the example operands with the standard symbol', () => {
      assert.equal(calculate(45, '*', 2), 90);
    });

    it('supports the image symbol, negative operands, and zero', () => {
      assert.equal(calculate(45, '×', 2), 90);
      assert.equal(calculate(-3, '*', 4), -12);
      assert.equal(calculate(100, '×', 0), 0);
    });
  });

  describe('division', () => {
    it('divides the example operands with the standard symbol', () => {
      assert.equal(calculate(20, '/', 5), 4);
    });

    it('supports the image symbol, fractions, and negative operands', () => {
      assert.equal(calculate(20, '÷', 5), 4);
      assert.equal(calculate(1, '/', 4), 0.25);
      assert.equal(calculate(-9, '÷', 3), -3);
      assert.equal(calculate(0, '/', 5), 0);
    });

    it('rejects positive and negative zero divisors for both symbols', () => {
      assert.throws(() => calculate(1, '/', 0), /Cannot divide by zero/);
      assert.throws(() => calculate(1, '/', -0), /Cannot divide by zero/);
      assert.throws(() => calculate(1, '÷', 0), /Cannot divide by zero/);
    });
  });

  it('rejects unsupported operators, including inherited object properties', () => {
    assert.throws(() => calculate(1, '%', 2), /Unsupported operator: %/);
    assert.throws(() => calculate(1, 'constructor', 2), /Unsupported operator/);
    assert.throws(() => calculate(1, '__proto__', 2), /Unsupported operator/);
  });

  it('requires finite numeric operands', () => {
    for (const invalidOperand of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      assert.throws(() => calculate(invalidOperand, '+', 1), /finite numbers/);
      assert.throws(() => calculate(1, '+', invalidOperand), /finite numbers/);
    }

    assert.throws(() => calculate('1', '+', 2), /finite numbers/);
  });

  it('rejects results outside the supported numeric range', () => {
    assert.throws(
      () => calculate(Number.MAX_VALUE, '*', 2),
      /outside the supported numeric range/,
    );
  });
});

describe('calculator CLI', () => {
  const calculatorPath = path.join(__dirname, '..', 'calculator.js');

  it('prints the result for a calculation using an image operator', () => {
    const result = spawnSync(process.execPath, [calculatorPath, '20', '÷', '5'], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout, '4\n');
    assert.equal(result.stderr, '');
  });

  it('prints a clear error and exits unsuccessfully for division by zero', () => {
    const result = spawnSync(process.execPath, [calculatorPath, '1', '/', '0'], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /Cannot divide by zero/);
  });

  it('prints usage when arguments are missing', () => {
    const result = spawnSync(process.execPath, [calculatorPath], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Usage: node src\/calculator\.js/);
  });
});
