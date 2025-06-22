const chalk = require('chalk');

class IRInstruction {
    constructor(opcode, operands = []) {
        this.opcode = opcode;
        this.operands = operands;
        this.label = null;
    }

    setLabel(label) {
        this.label = label;
    }

    toString() {
        const labelStr = this.label ? `${this.label}: ` : '';
        const operandsStr = this.operands.join(', ');
        return `${labelStr}${this.opcode} ${operandsStr}`;
    }
}

class IRGenerator {
    constructor() {
        this.instructions = [];
        this.tempCounter = 0;
        this.labelCounter = 0;
        this.symbolTable = new Map();
        this.currentFunction = null;
    }

    generateTemp() {
        return `t${++this.tempCounter}`;
    }

    generateLabel() {
        return `L${++this.labelCounter}`;
    }

    addInstruction(instruction) {
        this.instructions.push(instruction);
        return instruction;
    }

    generate(ast) {
        console.log(chalk.blue.bold('\n⚙️  PHASE 4: INTERMEDIATE CODE GENERATION'));
        console.log(chalk.blue('Generating three-address code...\n'));

        // Reset for new compilation
        this.instructions = [];
        this.tempCounter = 0;
        this.labelCounter = 0;

        this.visitProgram(ast);

        console.log(chalk.green('✅ Intermediate code generated:'));
        this.instructions.forEach((instruction, index) => {
            const color = instruction.label ? chalk.yellow : chalk.cyan;
            console.log(chalk.cyan(`  ${index + 1}. ${color(instruction.toString())}`));
        });

        return this.instructions;
    }

    visitProgram(program) {
        program.statements.forEach(statement => {
            this.visit(statement);
        });
    }

    visit(node) {
        if (!node) return null;

        const methodName = `visit${node.constructor.name}`;
        if (this[methodName]) {
            return this[methodName](node);
        } else {
            throw new Error(`No visitor method for ${node.constructor.name}`);
        }
    }

    visitVariableDeclaration(node) {
        const value = this.visit(node.initializer);
        this.symbolTable.set(node.name, value);
        
        if (value && value !== node.name) {
            this.addInstruction(new IRInstruction('ASSIGN', [node.name, value]));
        }
        
        return node.name;
    }

    visitAssignment(node) {
        const value = this.visit(node.value);
        this.symbolTable.set(node.name, value);
        
        this.addInstruction(new IRInstruction('ASSIGN', [node.name, value]));
        return node.name;
    }

    visitBinaryExpression(node) {
        const left = this.visit(node.left);
        const right = this.visit(node.right);
        const result = this.generateTemp();

        let opcode;
        switch (node.operator) {
            case 'PLUS':
                opcode = 'ADD';
                break;
            case 'MINUS':
                opcode = 'SUB';
                break;
            case 'MULTIPLY':
                opcode = 'MUL';
                break;
            case 'DIVIDE':
                opcode = 'DIV';
                break;
            case 'EQUALS':
                opcode = 'EQ';
                break;
            case 'NOT_EQUALS':
                opcode = 'NE';
                break;
            case 'LESS_THAN':
                opcode = 'LT';
                break;
            case 'GREATER_THAN':
                opcode = 'GT';
                break;
            case 'LESS_THAN_EQUAL':
                opcode = 'LE';
                break;
            case 'GREATER_THAN_EQUAL':
                opcode = 'GE';
                break;
            default:
                throw new Error(`Unknown operator: ${node.operator}`);
        }

        this.addInstruction(new IRInstruction(opcode, [result, left, right]));
        return result;
    }

    visitIdentifier(node) {
        return node.name;
    }

    visitLiteral(node) {
        return node.value.toString();
    }

    visitIfStatement(node) {
        const condition = this.visit(node.condition);
        const thenLabel = this.generateLabel();
        const endLabel = this.generateLabel();

        // Jump to then block if condition is true
        this.addInstruction(new IRInstruction('IF', [condition, thenLabel]));

        // Then block
        const thenInstruction = this.addInstruction(new IRInstruction('LABEL', [thenLabel]));
        thenInstruction.setLabel(thenLabel);
        this.visit(node.thenBranch);

        if (node.elseBranch) {
            const elseLabel = this.generateLabel();
            
            // Jump to end after then block
            this.addInstruction(new IRInstruction('GOTO', [endLabel]));
            
            // Else block
            const elseInstruction = this.addInstruction(new IRInstruction('LABEL', [elseLabel]));
            elseInstruction.setLabel(elseLabel);
            this.visit(node.elseBranch);
        }

        // End label
        const endInstruction = this.addInstruction(new IRInstruction('LABEL', [endLabel]));
        endInstruction.setLabel(endLabel);
    }

    visitWhileStatement(node) {
        const startLabel = this.generateLabel();
        const bodyLabel = this.generateLabel();
        const endLabel = this.generateLabel();

        // Start of loop
        const startInstruction = this.addInstruction(new IRInstruction('LABEL', [startLabel]));
        startInstruction.setLabel(startLabel);

        // Check condition
        const condition = this.visit(node.condition);
        this.addInstruction(new IRInstruction('IF', [condition, bodyLabel]));

        // Body
        const bodyInstruction = this.addInstruction(new IRInstruction('LABEL', [bodyLabel]));
        bodyInstruction.setLabel(bodyLabel);
        this.visit(node.body);

        // Jump back to start
        this.addInstruction(new IRInstruction('GOTO', [startLabel]));

        // End of loop
        const endInstruction = this.addInstruction(new IRInstruction('LABEL', [endLabel]));
        endInstruction.setLabel(endLabel);
    }

    visitBlockStatement(node) {
        node.statements.forEach(statement => {
            this.visit(statement);
        });
    }

    visitFunctionDeclaration(node) {
        const functionLabel = this.generateLabel();
        this.currentFunction = node.name;
        
        // Function label
        const labelInstruction = this.addInstruction(new IRInstruction('LABEL', [functionLabel]));
        labelInstruction.setLabel(functionLabel);
        
        // Function header
        this.addInstruction(new IRInstruction('FUNCTION', [node.name, node.parameters.length.toString()]));

        // Add parameters to symbol table
        node.parameters.forEach((param, index) => {
            this.symbolTable.set(param, `param${index}`);
        });

        // Function body
        this.visit(node.body);

        // Function end
        this.addInstruction(new IRInstruction('ENDFUNCTION', [node.name]));
        this.currentFunction = null;
    }

    visitFunctionCall(node) {
        const args = node.arguments.map(arg => this.visit(arg));
        const result = this.generateTemp();

        // Push arguments
        args.forEach(arg => {
            this.addInstruction(new IRInstruction('PUSH', [arg]));
        });

        // Call function
        this.addInstruction(new IRInstruction('CALL', [node.name, args.length.toString()]));

        // Get return value
        this.addInstruction(new IRInstruction('POP', [result]));

        return result;
    }

    visitReturnStatement(node) {
        if (node.value) {
            const value = this.visit(node.value);
            this.addInstruction(new IRInstruction('RETURN', [value]));
        } else {
            this.addInstruction(new IRInstruction('RETURN', []));
        }
    }

    visitPrintStatement(node) {
        const value = this.visit(node.expression);
        this.addInstruction(new IRInstruction('PRINT', [value]));
    }
}

module.exports = { IRGenerator, IRInstruction }; 