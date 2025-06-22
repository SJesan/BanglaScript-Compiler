const chalk = require('chalk');

// AST Node classes
class ASTNode {
    constructor(type) {
        this.type = type;
    }
}

class Program extends ASTNode {
    constructor(statements) {
        super('Program');
        this.statements = statements;
    }
}

class VariableDeclaration extends ASTNode {
    constructor(name, initializer) {
        super('VariableDeclaration');
        this.name = name;
        this.initializer = initializer;
    }
}

class Assignment extends ASTNode {
    constructor(name, value) {
        super('Assignment');
        this.name = name;
        this.value = value;
    }
}

class BinaryExpression extends ASTNode {
    constructor(operator, left, right) {
        super('BinaryExpression');
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

class Identifier extends ASTNode {
    constructor(name) {
        super('Identifier');
        this.name = name;
    }
}

class Literal extends ASTNode {
    constructor(value) {
        super('Literal');
        this.value = value;
    }
}

class IfStatement extends ASTNode {
    constructor(condition, thenBranch, elseBranch) {
        super('IfStatement');
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }
}

class WhileStatement extends ASTNode {
    constructor(condition, body) {
        super('WhileStatement');
        this.condition = condition;
        this.body = body;
    }
}

class BlockStatement extends ASTNode {
    constructor(statements) {
        super('BlockStatement');
        this.statements = statements;
    }
}

class FunctionDeclaration extends ASTNode {
    constructor(name, parameters, body) {
        super('FunctionDeclaration');
        this.name = name;
        this.parameters = parameters;
        this.body = body;
    }
}

class FunctionCall extends ASTNode {
    constructor(name, arguments_) {
        super('FunctionCall');
        this.name = name;
        this.arguments = arguments_;
    }
}

class ReturnStatement extends ASTNode {
    constructor(value) {
        super('ReturnStatement');
        this.value = value;
    }
}

class PrintStatement extends ASTNode {
    constructor(expression) {
        super('PrintStatement');
        this.expression = expression;
    }
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    currentToken() {
        return this.tokens[this.current];
    }

    peek() {
        return this.tokens[this.current + 1];
    }

    advance() {
        this.current++;
        return this.tokens[this.current - 1];
    }

    match(type) {
        if (this.currentToken().type === type) {
            return this.advance();
        }
        throw new Error(`Expected ${type}, got ${this.currentToken().type}`);
    }

    parse() {
        console.log(chalk.yellow.bold('\n🌳 PHASE 2: SYNTACTIC ANALYSIS (PARSING)'));
        console.log(chalk.yellow('Building Abstract Syntax Tree (AST)...\n'));

        const statements = [];
        while (this.currentToken().type !== 'EOF') {
            statements.push(this.parseStatement());
        }

        const program = new Program(statements);
        
        console.log(chalk.green('✅ AST generated:'));
        this.printAST(program, 0);
        
        return program;
    }

    parseStatement() {
        const token = this.currentToken();

        switch (token.type) {
            case 'DHORE':
                return this.parseVariableDeclaration();
            case 'JODE':
                return this.parseIfStatement();
            case 'JOTOKKHON':
                return this.parseWhileStatement();
            case 'FUNCTION':
                return this.parseFunctionDeclaration();
            case 'FEROT':
                return this.parseReturnStatement();
            case 'DEKHAO':
                return this.parsePrintStatement();
            case 'IDENTIFIER':
                if (this.peek().type === 'ASSIGN') {
                    return this.parseAssignment();
                }
                return this.parseExpressionStatement();
            default:
                return this.parseExpressionStatement();
        }
    }

    parseVariableDeclaration() {
        this.match('DHORE');
        const name = this.match('IDENTIFIER').value;
        this.match('ASSIGN');
        const initializer = this.parseExpression();
        this.match('SEMICOLON');
        return new VariableDeclaration(name, initializer);
    }

    parseAssignment() {
        const name = this.match('IDENTIFIER').value;
        this.match('ASSIGN');
        const value = this.parseExpression();
        this.match('SEMICOLON');
        return new Assignment(name, value);
    }

    parseIfStatement() {
        this.match('JODE');
        this.match('LPAREN');
        const condition = this.parseExpression();
        this.match('RPAREN');
        const thenBranch = this.parseBlockStatement();
        
        let elseBranch = null;
        if (this.currentToken().type === 'ONNATHAY') {
            this.match('ONNATHAY');
            elseBranch = this.parseBlockStatement();
        }
        
        return new IfStatement(condition, thenBranch, elseBranch);
    }

    parseWhileStatement() {
        this.match('JOTOKKHON');
        this.match('LPAREN');
        const condition = this.parseExpression();
        this.match('RPAREN');
        const body = this.parseBlockStatement();
        return new WhileStatement(condition, body);
    }

    parseFunctionDeclaration() {
        this.match('FUNCTION');
        const name = this.match('IDENTIFIER').value;
        this.match('LPAREN');
        
        const parameters = [];
        if (this.currentToken().type !== 'RPAREN') {
            parameters.push(this.match('IDENTIFIER').value);
            while (this.currentToken().type === 'COMMA') {
                this.match('COMMA');
                parameters.push(this.match('IDENTIFIER').value);
            }
        }
        this.match('RPAREN');
        
        const body = this.parseBlockStatement();
        return new FunctionDeclaration(name, parameters, body);
    }

    parseReturnStatement() {
        this.match('FEROT');
        const value = this.parseExpression();
        this.match('SEMICOLON');
        return new ReturnStatement(value);
    }

    parsePrintStatement() {
        this.match('DEKHAO');
        this.match('LPAREN');
        const expression = this.parseExpression();
        this.match('RPAREN');
        this.match('SEMICOLON');
        return new PrintStatement(expression);
    }

    parseBlockStatement() {
        this.match('LBRACE');
        const statements = [];
        while (this.currentToken().type !== 'RBRACE' && this.currentToken().type !== 'EOF') {
            statements.push(this.parseStatement());
        }
        this.match('RBRACE');
        return new BlockStatement(statements);
    }

    parseExpressionStatement() {
        const expression = this.parseExpression();
        this.match('SEMICOLON');
        return expression;
    }

    parseExpression() {
        return this.parseEquality();
    }

    parseEquality() {
        let left = this.parseComparison();

        while (this.currentToken().type === 'EQUALS' || this.currentToken().type === 'NOT_EQUALS') {
            const operator = this.advance().type;
            const right = this.parseComparison();
            left = new BinaryExpression(operator, left, right);
        }

        return left;
    }

    parseComparison() {
        let left = this.parseTerm();

        while (this.currentToken().type === 'LESS_THAN' || 
               this.currentToken().type === 'GREATER_THAN' ||
               this.currentToken().type === 'LESS_THAN_EQUAL' ||
               this.currentToken().type === 'GREATER_THAN_EQUAL') {
            const operator = this.advance().type;
            const right = this.parseTerm();
            left = new BinaryExpression(operator, left, right);
        }

        return left;
    }

    parseTerm() {
        let left = this.parseFactor();

        while (this.currentToken().type === 'PLUS' || this.currentToken().type === 'MINUS') {
            const operator = this.advance().type;
            const right = this.parseFactor();
            left = new BinaryExpression(operator, left, right);
        }

        return left;
    }

    parseFactor() {
        let left = this.parsePrimary();

        while (this.currentToken().type === 'MULTIPLY' || this.currentToken().type === 'DIVIDE') {
            const operator = this.advance().type;
            const right = this.parsePrimary();
            left = new BinaryExpression(operator, left, right);
        }

        return left;
    }

    parsePrimary() {
        const token = this.currentToken();

        switch (token.type) {
            case 'NUMBER':
                this.advance();
                return new Literal(token.value);
            case 'STRING':
                this.advance();
                return new Literal(token.value);
            case 'IDENTIFIER':
                const name = this.advance().value;
                if (this.currentToken().type === 'LPAREN') {
                    return this.parseFunctionCall(name);
                }
                return new Identifier(name);
            case 'LPAREN':
                this.match('LPAREN');
                const expression = this.parseExpression();
                this.match('RPAREN');
                return expression;
            default:
                throw new Error(`Unexpected token: ${token.type}`);
        }
    }

    parseFunctionCall(name) {
        this.match('LPAREN');
        const arguments_ = [];
        
        if (this.currentToken().type !== 'RPAREN') {
            arguments_.push(this.parseExpression());
            while (this.currentToken().type === 'COMMA') {
                this.match('COMMA');
                arguments_.push(this.parseExpression());
            }
        }
        
        this.match('RPAREN');
        return new FunctionCall(name, arguments_);
    }

    printAST(node, depth = 0) {
        const indent = '  '.repeat(depth);
        const color = chalk.cyan;
        
        if (node instanceof Program) {
            console.log(`${indent}${color('Program')}`);
            node.statements.forEach(stmt => this.printAST(stmt, depth + 1));
        } else if (node instanceof VariableDeclaration) {
            console.log(`${indent}${color('VariableDeclaration')} ${chalk.yellow(node.name)}`);
            if (node.initializer) {
                this.printAST(node.initializer, depth + 1);
            }
        } else if (node instanceof Assignment) {
            console.log(`${indent}${color('Assignment')} ${chalk.yellow(node.name)}`);
            this.printAST(node.value, depth + 1);
        } else if (node instanceof BinaryExpression) {
            console.log(`${indent}${color('BinaryExpression')} ${chalk.magenta(node.operator)}`);
            this.printAST(node.left, depth + 1);
            this.printAST(node.right, depth + 1);
        } else if (node instanceof Identifier) {
            console.log(`${indent}${color('Identifier')} ${chalk.yellow(node.name)}`);
        } else if (node instanceof Literal) {
            console.log(`${indent}${color('Literal')} ${chalk.green(node.value)}`);
        } else if (node instanceof IfStatement) {
            console.log(`${indent}${color('IfStatement')}`);
            console.log(`${indent}  ${color('Condition:')}`);
            this.printAST(node.condition, depth + 2);
            console.log(`${indent}  ${color('Then:')}`);
            this.printAST(node.thenBranch, depth + 2);
            if (node.elseBranch) {
                console.log(`${indent}  ${color('Else:')}`);
                this.printAST(node.elseBranch, depth + 2);
            }
        } else if (node instanceof WhileStatement) {
            console.log(`${indent}${color('WhileStatement')}`);
            console.log(`${indent}  ${color('Condition:')}`);
            this.printAST(node.condition, depth + 2);
            console.log(`${indent}  ${color('Body:')}`);
            this.printAST(node.body, depth + 2);
        } else if (node instanceof BlockStatement) {
            console.log(`${indent}${color('BlockStatement')}`);
            node.statements.forEach(stmt => this.printAST(stmt, depth + 1));
        } else if (node instanceof FunctionDeclaration) {
            console.log(`${indent}${color('FunctionDeclaration')} ${chalk.yellow(node.name)}`);
            console.log(`${indent}  ${color('Parameters:')} ${chalk.blue(node.parameters.join(', '))}`);
            this.printAST(node.body, depth + 1);
        } else if (node instanceof FunctionCall) {
            console.log(`${indent}${color('FunctionCall')} ${chalk.yellow(node.name)}`);
            node.arguments.forEach(arg => this.printAST(arg, depth + 1));
        } else if (node instanceof ReturnStatement) {
            console.log(`${indent}${color('ReturnStatement')}`);
            if (node.value) {
                this.printAST(node.value, depth + 1);
            }
        } else if (node instanceof PrintStatement) {
            console.log(`${indent}${color('PrintStatement')}`);
            this.printAST(node.expression, depth + 1);
        }
    }
}

module.exports = {
    Parser,
    ASTNode,
    Program,
    VariableDeclaration,
    Assignment,
    BinaryExpression,
    Identifier,
    Literal,
    IfStatement,
    WhileStatement,
    BlockStatement,
    FunctionDeclaration,
    FunctionCall,
    ReturnStatement,
    PrintStatement
}; 