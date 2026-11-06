const OPERATIONS = {
  '+': (first, second) => first + second,
  '-': (first, second) => first - second,
  '*': (first, second) => first * second,
  '×': (first, second) => first * second,
  '/': (first, second) => first / second,
  '÷': (first, second) => first / second,
  '%': modulo,
  '^': power,
};

function modulo(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error('Both operands must be finite numbers.');
  }
  if (b === 0) {
    throw new Error('Cannot calculate modulo by zero.');
  }

  return ensureFiniteResult(a % b);
}

function power(base, exponent) {
  if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
    throw new Error('Both operands must be finite numbers.');
  }

  return ensureFiniteResult(base ** exponent);
}

function squareRoot(n) {
  if (!Number.isFinite(n)) {
    throw new Error('The operand must be a finite number.');
  }
  if (n < 0) {
    throw new Error('Cannot calculate the square root of a negative number.');
  }

  return ensureFiniteResult(Math.sqrt(n));
}

function ensureFiniteResult(result) {
  if (!Number.isFinite(result)) {
    throw new Error('The result is outside the supported numeric range.');
  }
  return result;
}

// Supports arithmetic operators and square root through the CLI.
function calculate(first, operator, second) {
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    throw new Error('Both operands must be finite numbers.');
  }

  if (!Object.prototype.hasOwnProperty.call(OPERATIONS, operator)) {
    throw new Error(`Unsupported operator: ${operator}`);
  }

  const operation = OPERATIONS[operator];
  if ((operator === '/' || operator === '÷') && second === 0) {
    throw new Error('Cannot divide by zero.');
  }

  return ensureFiniteResult(operation(first, second));
}

function main(args) {
  if (args.length === 2 && args[0] === 'sqrt') {
    if (args[1].trim() === '') {
      throw new Error('The operand must be a number.');
    }

    const operand = Number(args[1]);
    console.log(squareRoot(operand));
    return;
  }

  if (args.length !== 3) {
    throw new Error('Usage: node src/calculator.js <number> <operator> <number> | sqrt <number>');
  }

  const [firstInput, operator, secondInput] = args;
  if (firstInput.trim() === '' || secondInput.trim() === '') {
    throw new Error('Both operands must be numbers.');
  }

  const first = Number(firstInput);
  const second = Number(secondInput);
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    throw new Error('Both operands must be finite numbers.');
  }

  console.log(calculate(first, operator, second));
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { calculate, modulo, power, squareRoot };
