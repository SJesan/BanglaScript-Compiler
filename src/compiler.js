const chalk = require('chalk');
const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const { SemanticAnalyzer } = require('./semantic');
const { IRGenerator } = require('./intermediate');
const { Optimizer } = require('./optimizer');
const { CodeGenerator } = require('./codegen');

class Compiler {
    constructor() {
        this.lexer = null;
        this.parser = null;
        this.semanticAnalyzer = new SemanticAnalyzer();
        this.irGenerator = new IRGenerator();
        this.optimizer = new Optimizer();
        this.codeGenerator = new CodeGenerator();
    }

    compile(sourceCode) {
        console.log(chalk.bold.cyan('🚀 BanglaScript Programming Language Compiler'));
        console.log(chalk.cyan('='.repeat(50)));
        console.log(chalk.cyan('Source Code:'));
        console.log(chalk.white('```'));
        console.log(chalk.white(sourceCode));
        console.log(chalk.white('```\n'));

        try {
            // Phase 1: Lexical Analysis
            console.log(chalk.bold.blue('📝 Starting compilation process...\n'));
            this.lexer = new Lexer(sourceCode);
            const tokens = this.lexer.tokenize();

            // Phase 2: Syntactic Analysis (Parsing)
            this.parser = new Parser(tokens);
            const ast = this.parser.parse();

            // Phase 3: Semantic Analysis
            const semanticResult = this.semanticAnalyzer.analyze(ast);
            
            if (!semanticResult.isValid) {
                console.log(chalk.red.bold('\n❌ Compilation failed due to semantic errors!'));
                return null;
            }

            // Phase 4: Intermediate Code Generation
            const intermediateCode = this.irGenerator.generate(ast);

            // Phase 5: Code Optimization
            const optimizedCode = this.optimizer.optimize(intermediateCode);

            // Phase 6: Code Generation
            const generatedCode = this.codeGenerator.generate(optimizedCode);

            // Summary
            this.printSummary(tokens, ast, semanticResult, intermediateCode, optimizedCode, generatedCode);

            return {
                tokens,
                ast,
                semanticResult,
                intermediateCode,
                optimizedCode,
                generatedCode
            };

        } catch (error) {
            console.log(chalk.red.bold('\n❌ Compilation failed!'));
            console.log(chalk.red(`Error: ${error.message}`));
            return null;
        }
    }

    printSummary(tokens, ast, semanticResult, intermediateCode, optimizedCode, generatedCode) {
        console.log(chalk.bold.green('\n🎉 COMPILATION SUMMARY'));
        console.log(chalk.green('='.repeat(50)));
        
        console.log(chalk.cyan(`📊 Statistics:`));
        console.log(chalk.cyan(`  • Tokens generated: ${tokens.length - 1}`)); // Exclude EOF
        console.log(chalk.cyan(`  • AST nodes: ${this.countASTNodes(ast)}`));
        console.log(chalk.cyan(`  • Variables declared: ${semanticResult.symbolTable.symbols.size}`));
        console.log(chalk.cyan(`  • Intermediate instructions: ${intermediateCode.length}`));
        console.log(chalk.cyan(`  • Optimized instructions: ${optimizedCode.length}`));
        console.log(chalk.cyan(`  • Generated code lines: ${generatedCode.split('\n').length}`));
        
        const optimizationSavings = intermediateCode.length - optimizedCode.length;
        if (optimizationSavings > 0) {
            console.log(chalk.green(`  • Instructions optimized away: ${optimizationSavings}`));
        }

        console.log(chalk.cyan(`\n✅ Compilation completed successfully!`));
        console.log(chalk.cyan(`📁 Output: JavaScript code ready for execution`));
    }

    countASTNodes(node) {
        if (!node) return 0;
        
        let count = 1;
        if (node.statements) {
            node.statements.forEach(stmt => count += this.countASTNodes(stmt));
        }
        if (node.left) count += this.countASTNodes(node.left);
        if (node.right) count += this.countASTNodes(node.right);
        if (node.condition) count += this.countASTNodes(node.condition);
        if (node.thenBranch) count += this.countASTNodes(node.thenBranch);
        if (node.elseBranch) count += this.countASTNodes(node.elseBranch);
        if (node.body) count += this.countASTNodes(node.body);
        if (node.initializer) count += this.countASTNodes(node.initializer);
        if (node.value) count += this.countASTNodes(node.value);
        if (node.expression) count += this.countASTNodes(node.expression);
        if (node.arguments) {
            node.arguments.forEach(arg => count += this.countASTNodes(arg));
        }
        
        return count;
    }
}

module.exports = { Compiler }; 