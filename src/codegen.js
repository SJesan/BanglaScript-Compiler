const chalk = require('chalk');

class CodeGenerator {
    constructor() {
        this.output = [];
        this.indentLevel = 0;
        this.tempVariables = new Map();
        this.labelMap = new Map();
        this.functionStack = [];
    }

    generate(instructions) {
        console.log(chalk.red.bold('\n🎯 PHASE 6: CODE GENERATION'));
        console.log(chalk.red('Generating JavaScript code...\n'));

        this.output = [];
        this.indentLevel = 0;
        this.tempVariables.clear();
        this.labelMap.clear();
        this.functionStack = [];

        // First pass: collect labels
        this.collectLabels(instructions);

        // Second pass: generate code
        instructions.forEach(instruction => {
            this.generateInstruction(instruction);
        });

        const generatedCode = this.output.join('\n');

        console.log(chalk.green('✅ Generated JavaScript code:'));
        console.log(chalk.cyan('```javascript'));
        console.log(chalk.white(generatedCode));
        console.log(chalk.cyan('```'));

        return generatedCode;
    }

    collectLabels(instructions) {
        instructions.forEach(instruction => {
            if (instruction.label) {
                this.labelMap.set(instruction.label, instruction);
            }
        });
    }

    generateInstruction(instruction) {
        switch (instruction.opcode) {
            case 'ASSIGN':
                this.generateAssign(instruction);
                break;
            case 'ADD':
                this.generateBinaryOp(instruction, '+');
                break;
            case 'SUB':
                this.generateBinaryOp(instruction, '-');
                break;
            case 'MUL':
                this.generateBinaryOp(instruction, '*');
                break;
            case 'DIV':
                this.generateBinaryOp(instruction, '/');
                break;
            case 'EQ':
                this.generateBinaryOp(instruction, '===');
                break;
            case 'NE':
                this.generateBinaryOp(instruction, '!==');
                break;
            case 'LT':
                this.generateBinaryOp(instruction, '<');
                break;
            case 'GT':
                this.generateBinaryOp(instruction, '>');
                break;
            case 'LE':
                this.generateBinaryOp(instruction, '<=');
                break;
            case 'GE':
                this.generateBinaryOp(instruction, '>=');
                break;
            case 'IF':
                this.generateIf(instruction);
                break;
            case 'GOTO':
                this.generateGoto(instruction);
                break;
            case 'LABEL':
                this.generateLabel(instruction);
                break;
            case 'FUNCTION':
                this.generateFunction(instruction);
                break;
            case 'ENDFUNCTION':
                this.generateEndFunction(instruction);
                break;
            case 'CALL':
                this.generateCall(instruction);
                break;
            case 'PUSH':
                this.generatePush(instruction);
                break;
            case 'POP':
                this.generatePop(instruction);
                break;
            case 'RETURN':
                this.generateReturn(instruction);
                break;
            case 'PRINT':
                this.generatePrint(instruction);
                break;
            case 'SHL':
                this.generateShift(instruction, '<<');
                break;
            case 'SHR':
                this.generateShift(instruction, '>>');
                break;
            default:
                console.warn(`Unknown instruction: ${instruction.opcode}`);
        }
    }

    generateAssign(instruction) {
        const [target, value] = instruction.operands;
        const line = `${this.getIndent()}let ${target} = ${value};`;
        this.output.push(line);
    }

    generateBinaryOp(instruction, operator) {
        const [target, left, right] = instruction.operands;
        const line = `${this.getIndent()}let ${target} = ${left} ${operator} ${right};`;
        this.output.push(line);
    }

    generateIf(instruction) {
        const [condition, label] = instruction.operands;
        const line = `${this.getIndent()}if (${condition}) {`;
        this.output.push(line);
        this.indentLevel++;
    }

    generateGoto(instruction) {
        const [label] = instruction.operands;
        const line = `${this.getIndent()}goto ${label};`;
        this.output.push(line);
    }

    generateLabel(instruction) {
        if (this.indentLevel > 0) {
            this.indentLevel--;
            this.output.push(`${this.getIndent()}}`);
        }
        const line = `${this.getIndent()}// ${instruction.operands[0]}`;
        this.output.push(line);
    }

    generateFunction(instruction) {
        const [name, paramCount] = instruction.operands;
        this.functionStack.push(name);
        
        const line = `${this.getIndent()}function ${name}() {`;
        this.output.push(line);
        this.indentLevel++;
    }

    generateEndFunction(instruction) {
        this.indentLevel--;
        this.output.push(`${this.getIndent()}}`);
        this.functionStack.pop();
    }

    generateCall(instruction) {
        const [name, argCount] = instruction.operands;
        const line = `${this.getIndent()}let result = ${name}();`;
        this.output.push(line);
    }

    generatePush(instruction) {
        const [value] = instruction.operands;
        const line = `${this.getIndent()}// push ${value}`;
        this.output.push(line);
    }

    generatePop(instruction) {
        const [target] = instruction.operands;
        const line = `${this.getIndent()}// pop to ${target}`;
        this.output.push(line);
    }

    generateReturn(instruction) {
        if (instruction.operands.length > 0) {
            const [value] = instruction.operands;
            const line = `${this.getIndent()}return ${value};`;
            this.output.push(line);
        } else {
            const line = `${this.getIndent()}return;`;
            this.output.push(line);
        }
    }

    generatePrint(instruction) {
        const [value] = instruction.operands;
        const line = `${this.getIndent()}console.log(${value});`;
        this.output.push(line);
    }

    generateShift(instruction, operator) {
        const [target, left, right] = instruction.operands;
        const line = `${this.getIndent()}let ${target} = ${left} ${operator} ${right};`;
        this.output.push(line);
    }

    getIndent() {
        return '  '.repeat(this.indentLevel);
    }
}

module.exports = { CodeGenerator }; 