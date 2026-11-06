const OPERATIONS = {
  '+': (first, second) => first + second,
  '-': (first, second) => first - second,
  '*': (first, second) => first * second,
  '×': (first, second) => first * second,
  '/': (first, second) => first / second,
  '÷': (first, second) => first / second,
};

// Supports addition (+), subtraction (-), multiplication (* or ×), and division (/ or ÷).
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

  const result = operation(first, second);
  if (!Number.isFinite(result)) {
    throw new Error('The result is outside the supported numeric range.');
  }

  return result;
}

function main(args) {
  if (args.length !== 3) {
    throw new Error('Usage: node src/calculator.js <number> <operator> <number>');
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

module.exports = { calculate };
