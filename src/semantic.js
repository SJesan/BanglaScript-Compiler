const chalk = require('chalk');

class Symbol {
    constructor(name, type, kind, scope) {
        this.name = name;
        this.type = type;
        this.kind = kind; // 'variable', 'function', 'parameter'
        this.scope = scope;
        this.initialized = false;
    }
}

class SymbolTable {
    constructor() {
        this.symbols = new Map();
        this.scopes = ['global'];
        this.currentScope = 'global';
    }

    enterScope(scopeName) {
        this.scopes.push(scopeName);
        this.currentScope = scopeName;
    }

    exitScope() {
        this.scopes.pop();
        this.currentScope = this.scopes[this.scopes.length - 1];
    }

    declare(name, type, kind = 'variable') {
        const symbol = new Symbol(name, type, kind, this.currentScope);
        this.symbols.set(name, symbol);
        return symbol;
    }

    lookup(name) {
        return this.symbols.get(name);
    }

    updateSymbol(name, updates) {
        const symbol = this.symbols.get(name);
        if (symbol) {
            Object.assign(symbol, updates);
        }
    }

    reset() {
        this.symbols.clear();
        this.scopes = ['global'];
        this.currentScope = 'global';
    }

    print() {
        console.log(chalk.cyan('  Symbol Table:'));
        if (this.symbols.size === 0) {
            console.log(chalk.gray('    (empty)'));
            return;
        }
        
        this.symbols.forEach((symbol, name) => {
            const status = symbol.initialized ? '✓' : '⚠';
            const color = symbol.initialized ? chalk.green : chalk.yellow;
            console.log(color(`    ${status} ${name}: ${symbol.type} (${symbol.kind}) in scope '${symbol.scope}'`));
        });
    }
}

class SemanticAnalyzer {
    constructor() {
        this.symbolTable = new SymbolTable();
        this.errors = [];
        this.warnings = [];
    }

    analyze(ast) {
        console.log(chalk.blue.bold('\n🔍 PHASE 3: SEMANTIC ANALYSIS'));
        console.log(chalk.blue('Performing type checking and validation...\n'));

        // Reset symbol table for new compilation
        this.symbolTable.reset();
        this.errors = [];
        this.warnings = [];

        this.visitNode(ast);

        // Print results
        this.printResults();

        return {
            isValid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
            symbolTable: this.symbolTable
        };
    }

    visitNode(node) {
        if (!node) return 'error';

        switch (node.type) {
            case 'Program':
                return this.visitProgram(node);
            case 'VariableDeclaration':
                return this.visitVariableDeclaration(node);
            case 'Assignment':
                return this.visitAssignment(node);
            case 'BinaryExpression':
                return this.visitBinaryExpression(node);
            case 'Identifier':
                return this.visitIdentifier(node);
            case 'Literal':
                return this.visitLiteral(node);
            case 'IfStatement':
                return this.visitIfStatement(node);
            case 'WhileStatement':
                return this.visitWhileStatement(node);
            case 'BlockStatement':
                return this.visitBlockStatement(node);
            case 'FunctionDeclaration':
                return this.visitFunctionDeclaration(node);
            case 'FunctionCall':
                return this.visitFunctionCall(node);
            case 'ReturnStatement':
                return this.visitReturnStatement(node);
            case 'PrintStatement':
                return this.visitPrintStatement(node);
            default:
                this.addError(`Unknown node type: ${node.type}`);
                return 'error';
        }
    }

    visitProgram(node) {
        node.statements.forEach(stmt => {
            this.visitNode(stmt);
        });
        return 'void';
    }

    visitVariableDeclaration(node) {
        const initializerType = this.visitNode(node.initializer);
        const symbol = this.symbolTable.lookup(node.name);
        
        if (symbol) {
            this.addError(`Variable '${node.name}' is already defined in scope '${symbol.scope}'`);
            return 'error';
        }

        this.symbolTable.declare(node.name, initializerType);
        this.symbolTable.updateSymbol(node.name, { initialized: true });
        
        console.log(chalk.green(`  ✓ Variable '${node.name}' declared with type '${initializerType}'`));
        return initializerType;
    }

    visitAssignment(node) {
        const valueType = this.visitNode(node.value);
        const symbol = this.symbolTable.lookup(node.name);
        
        if (!symbol) {
            this.addError(`Variable '${node.name}' is not defined`);
            return 'error';
        }

        if (valueType !== symbol.type && valueType !== 'any') {
            this.addError(`Cannot assign value of type '${valueType}' to variable '${node.name}' of type '${symbol.type}'`);
            return 'error';
        }

        this.symbolTable.updateSymbol(node.name, { initialized: true });
        console.log(chalk.green(`  ✓ Assignment to '${node.name}' (${symbol.type})`));
        return symbol.type;
    }

    visitBinaryExpression(node) {
        const leftType = this.visitNode(node.left);
        const rightType = this.visitNode(node.right);

        // Handle string concatenation
        if (node.operator === 'PLUS' && (leftType === 'string' || rightType === 'string')) {
            return 'string';
        }

        // Handle arithmetic operations
        if (['PLUS', 'MINUS', 'MULTIPLY', 'DIVIDE'].includes(node.operator)) {
            if (leftType === 'number' && rightType === 'number') {
                return 'number';
            } else if (leftType === 'any' || rightType === 'any') {
                return 'any';
            } else {
                this.addError(`Arithmetic operation '${node.operator}' requires numeric operands, got '${leftType}' and '${rightType}'`);
                return 'error';
            }
        }

        // Handle comparison operations
        if (['EQUALS', 'NOT_EQUALS', 'LESS_THAN', 'GREATER_THAN', 'LESS_THAN_EQUAL', 'GREATER_THAN_EQUAL'].includes(node.operator)) {
            if (leftType === rightType || leftType === 'any' || rightType === 'any') {
                return 'boolean';
            } else {
                this.addError(`Comparison operation '${node.operator}' requires operands of the same type, got '${leftType}' and '${rightType}'`);
                return 'error';
            }
        }

        return 'error';
    }

    visitIdentifier(node) {
        const symbol = this.symbolTable.lookup(node.name);
        
        if (!symbol) {
            // Check if it's a boolean literal
            if (node.name === 'true' || node.name === 'false') {
                return 'boolean';
            }
            
            this.addError(`Variable '${node.name}' is not defined`);
            return 'error';
        }

        if (!symbol.initialized) {
            this.addWarning(`Variable '${node.name}' is used before initialization`);
        }

        return symbol.type;
    }

    visitLiteral(node) {
        if (typeof node.value === 'number') {
            return 'number';
        } else if (typeof node.value === 'string') {
            return 'string';
        } else if (typeof node.value === 'boolean') {
            return 'boolean';
        }
        return 'any';
    }

    visitIfStatement(node) {
        const conditionType = this.visitNode(node.condition);
        
        if (conditionType !== 'boolean' && conditionType !== 'any') {
            this.addError(`If condition must be boolean, got '${conditionType}'`);
        }

        this.visitNode(node.thenBranch);
        if (node.elseBranch) {
            this.visitNode(node.elseBranch);
        }

        return 'void';
    }

    visitWhileStatement(node) {
        const conditionType = this.visitNode(node.condition);
        
        if (conditionType !== 'boolean' && conditionType !== 'any') {
            this.addError(`While condition must be boolean, got '${conditionType}'`);
        }

        this.visitNode(node.body);
        return 'void';
    }

    visitBlockStatement(node) {
        this.symbolTable.enterScope(`block_${Date.now()}`);
        
        node.statements.forEach(stmt => {
            this.visitNode(stmt);
        });
        
        this.symbolTable.exitScope();
        return 'void';
    }

    visitFunctionDeclaration(node) {
        const symbol = this.symbolTable.lookup(node.name);
        
        if (symbol) {
            this.addError(`Function '${node.name}' is already defined`);
            return 'error';
        }

        this.symbolTable.declare(node.name, 'function');
        console.log(chalk.green(`  ✓ Function '${node.name}' declared with ${node.parameters.length} parameters`));
        
        this.symbolTable.enterScope(`function_${node.name}`);
        
        // Add parameters to symbol table
        node.parameters.forEach(param => {
            this.symbolTable.declare(param, 'any', 'parameter');
        });
        
        this.visitNode(node.body);
        this.symbolTable.exitScope();
        
        return 'void';
    }

    visitFunctionCall(node) {
        const symbol = this.symbolTable.lookup(node.name);
        
        if (!symbol || symbol.kind !== 'function') {
            this.addError(`Function '${node.name}' is not defined`);
            return 'error';
        }

        // Check arguments
        node.arguments.forEach((arg, index) => {
            const argType = this.visitNode(arg);
            console.log(chalk.green(`  ✓ Function call argument ${index + 1}: ${argType}`));
        });

        return 'any'; // Function return type
    }

    visitReturnStatement(node) {
        if (node.value) {
            const returnType = this.visitNode(node.value);
            console.log(chalk.green(`  ✓ Return statement in function: ${returnType}`));
        } else {
            console.log(chalk.green(`  ✓ Return statement in function: void`));
        }
        return 'void';
    }

    visitPrintStatement(node) {
        const expressionType = this.visitNode(node.expression);
        console.log(chalk.green(`  ✓ Print statement: ${expressionType}`));
        return 'void';
    }

    addError(message) {
        this.errors.push(message);
    }

    addWarning(message) {
        this.warnings.push(message);
    }

    printResults() {
        if (this.errors.length === 0) {
            console.log(chalk.green('✅ Semantic analysis completed successfully!'));
        } else {
            console.log(chalk.red(`❌ Semantic errors found:`));
            this.errors.forEach(error => {
                console.log(chalk.red(`  - ${error}`));
            });
        }

        if (this.warnings.length > 0) {
            console.log(chalk.yellow(`⚠️  Warnings:`));
            this.warnings.forEach(warning => {
                console.log(chalk.yellow(`  - ${warning}`));
            });
        }

        this.symbolTable.print();
    }
}

module.exports = { SemanticAnalyzer, SymbolTable, Symbol }; 