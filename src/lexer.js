const chalk = require('chalk');

class Token {
    constructor(type, value, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }

    toString() {
        return `${this.type}(${this.value})`;
    }
}

class Lexer {
    constructor(source) {
        this.source = source;
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
    }

    // Token types
    static TOKEN_TYPES = {
        // Banglish Keywords
        DHORE: 'DHORE', // let/var (ধরি -> dhore)
        JODE: 'JODE', // if (যদি -> jode)
        ONNATHAY: 'ONNATHAY', // else (অন্যথায় -> onnathay)
        JOTOKKHON: 'JOTOKKHON', // while (যতক্ষণ -> jotokkhon)
        FUNCTION: 'FUNCTION', // function (ফাংশন -> function)
        FEROT: 'FEROT', // return (ফেরত -> ferot)
        DEKHAO: 'DEKHAO', // print/show (দেখাও -> dekhao)

        // Literals
        NUMBER: 'NUMBER',
        STRING: 'STRING',
        IDENTIFIER: 'IDENTIFIER',

        // Operators
        PLUS: 'PLUS',
        MINUS: 'MINUS',
        MULTIPLY: 'MULTIPLY',
        DIVIDE: 'DIVIDE',
        ASSIGN: 'ASSIGN',
        EQUALS: 'EQUALS',
        NOT_EQUALS: 'NOT_EQUALS',
        LESS_THAN: 'LESS_THAN',
        GREATER_THAN: 'GREATER_THAN',
        LESS_THAN_EQUAL: 'LESS_THAN_EQUAL',
        GREATER_THAN_EQUAL: 'GREATER_THAN_EQUAL',

        // Delimiters
        LPAREN: 'LPAREN',
        RPAREN: 'RPAREN',
        LBRACE: 'LBRACE',
        RBRACE: 'RBRACE',
        SEMICOLON: 'SEMICOLON',
        COMMA: 'COMMA',

        // Special
        EOF: 'EOF'
    };

    // Banglish Keywords mapping
    static KEYWORDS = {
        'dhore': Lexer.TOKEN_TYPES.DHORE,
        'jode': Lexer.TOKEN_TYPES.JODE,
        'onnathay': Lexer.TOKEN_TYPES.ONNATHAY,
        'jotokkhon': Lexer.TOKEN_TYPES.JOTOKKHON,
        'function': Lexer.TOKEN_TYPES.FUNCTION,
        'ferot': Lexer.TOKEN_TYPES.FEROT,
        'dekhao': Lexer.TOKEN_TYPES.DEKHAO
    };

    // Operator mapping
    static OPERATORS = {
        '+': Lexer.TOKEN_TYPES.PLUS,
        '-': Lexer.TOKEN_TYPES.MINUS,
        '*': Lexer.TOKEN_TYPES.MULTIPLY,
        '/': Lexer.TOKEN_TYPES.DIVIDE,
        '=': Lexer.TOKEN_TYPES.ASSIGN,
        '==': Lexer.TOKEN_TYPES.EQUALS,
        '!=': Lexer.TOKEN_TYPES.NOT_EQUALS,
        '<': Lexer.TOKEN_TYPES.LESS_THAN,
        '>': Lexer.TOKEN_TYPES.GREATER_THAN,
        '<=': Lexer.TOKEN_TYPES.LESS_THAN_EQUAL,
        '>=': Lexer.TOKEN_TYPES.GREATER_THAN_EQUAL
    };

    current() {
        return this.position >= this.source.length ? '\0' : this.source[this.position];
    }

    peek() {
        return this.position + 1 >= this.source.length ? '\0' : this.source[this.position + 1];
    }

    peekNext() {
        return this.position + 2 >= this.source.length ? '\0' : this.source[this.position + 2];
    }

    advance() {
        if (this.current() === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
        this.position++;
    }

    skipWhitespace() {
        while (this.current() === ' ' || this.current() === '\t' || this.current() === '\n' || this.current() === '\r') {
            this.advance();
        }
    }

    readNumber() {
        let value = '';
        while (this.current().match(/[0-9]/)) {
            value += this.current();
            this.advance();
        }
        return parseFloat(value);
    }

    readString() {
        this.advance(); // Skip opening quote
        let value = '';
        while (this.current() !== '"' && this.current() !== '\0') {
            value += this.current();
            this.advance();
        }
        if (this.current() === '"') {
            this.advance(); // Skip closing quote
        }
        return value;
    }

    readIdentifier() {
        let value = '';
        // Allow Bangla characters, English letters, numbers, and underscore
        while (this.current().match(/[a-zA-Z0-9_\u0980-\u09FF]/)) {
            value += this.current();
            this.advance();
        }
        return value;
    }

    addToken(type, value = null) {
        const token = new Token(type, value, this.line, this.column);
        this.tokens.push(token);
        return token;
    }

    tokenize() {
        console.log(chalk.blue.bold('\n🔍 PHASE 1: LEXICAL ANALYSIS'));
        console.log(chalk.blue('Converting Banglish source code into tokens...\n'));

        while (this.position < this.source.length) {
            this.skipWhitespace();

            const char = this.current();
            if (char === '\0') break;

            // Numbers
            if (char.match(/[0-9]/)) {
                const value = this.readNumber();
                this.addToken(Lexer.TOKEN_TYPES.NUMBER, value);
                continue;
            }

            // Strings
            if (char === '"') {
                const value = this.readString();
                this.addToken(Lexer.TOKEN_TYPES.STRING, value);
                continue;
            }

            // Identifiers and Banglish keywords
            if (char.match(/[a-zA-Z_\u0980-\u09FF]/)) {
                const value = this.readIdentifier();
                const type = Lexer.KEYWORDS[value] || Lexer.TOKEN_TYPES.IDENTIFIER;
                this.addToken(type, value);
                continue;
            }

            // Three-character operators
            if (char === '<' && this.peek() === '=') {
                this.advance();
                this.advance();
                this.addToken(Lexer.TOKEN_TYPES.LESS_THAN_EQUAL);
                continue;
            }

            if (char === '>' && this.peek() === '=') {
                this.advance();
                this.advance();
                this.addToken(Lexer.TOKEN_TYPES.GREATER_THAN_EQUAL);
                continue;
            }

            // Two-character operators
            if (char === '=' && this.peek() === '=') {
                this.advance();
                this.advance();
                this.addToken(Lexer.TOKEN_TYPES.EQUALS);
                continue;
            }

            if (char === '!' && this.peek() === '=') {
                this.advance();
                this.advance();
                this.addToken(Lexer.TOKEN_TYPES.NOT_EQUALS);
                continue;
            }

            // Single-character operators and delimiters
            if (char in Lexer.OPERATORS) {
                this.addToken(Lexer.OPERATORS[char]);
                this.advance();
                continue;
            }

            // Delimiters
            switch (char) {
                case '(':
                    this.addToken(Lexer.TOKEN_TYPES.LPAREN);
                    break;
                case ')':
                    this.addToken(Lexer.TOKEN_TYPES.RPAREN);
                    break;
                case '{':
                    this.addToken(Lexer.TOKEN_TYPES.LBRACE);
                    break;
                case '}':
                    this.addToken(Lexer.TOKEN_TYPES.RBRACE);
                    break;
                case ';':
                    this.addToken(Lexer.TOKEN_TYPES.SEMICOLON);
                    break;
                case ',':
                    this.addToken(Lexer.TOKEN_TYPES.COMMA);
                    break;
                default:
                    throw new Error(`Unexpected character: ${char} at line ${this.line}, column ${this.column}`);
            }
            this.advance();
        }

        this.addToken(Lexer.TOKEN_TYPES.EOF);

        // Display tokens
        console.log(chalk.green('✅ Tokens generated:'));
        this.tokens.forEach((token, index) => {
            const color = token.type === 'EOF' ? chalk.gray : chalk.cyan;
            console.log(`  ${index + 1}. ${color(token.toString())} at line ${token.line}, column ${token.column}`);
        });

        return this.tokens;
    }
}

module.exports = { Lexer, Token }; 