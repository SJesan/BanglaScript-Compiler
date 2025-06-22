const { Compiler } = require('./src/compiler');
const chalk = require('chalk');

// Test BanglaScript code
const sourceCode = `
dhori x = 10;
dhori y = 5;
dhori jogfol = x + y;
dekhao(jogfol);

jodi (x > y) {
    dekhao("x is greater");
} othoba {
    dekhao("y is greater");
}
`;

console.log(chalk.bold.magenta('🎮 BanglaScript Programming Language Test'));
console.log(chalk.magenta('='.repeat(50)));

const compiler = new Compiler();
const result = compiler.compile(sourceCode);

if (result) {
    console.log(chalk.green.bold('\n✅ Success! Your BanglaScript language is working!'));
    console.log(chalk.cyan('\n📝 You can now write programs like this:'));
    console.log(chalk.white('```'));
    console.log(chalk.white('dhori x = 10;'));
    console.log(chalk.white('dhori y = 5;'));
    console.log(chalk.white('dhori jogfol = x + y;'));
    console.log(chalk.white('dekhao(jogfol);'));
    console.log(chalk.white('```'));
    
    console.log(chalk.cyan('\n🔤 BanglaScript Keywords:'));
    console.log(chalk.cyan('  • dhori = let/var'));
    console.log(chalk.cyan('  • jodi = if'));
    console.log(chalk.cyan('  • othoba = else'));
    console.log(chalk.cyan('  • jotokkhon = while'));
    console.log(chalk.cyan('  • function = function'));
    console.log(chalk.cyan('  • ferot = return'));
    console.log(chalk.cyan('  • dekhao = print/show'));
    
    console.log(chalk.green('\n🎓 Perfect for your university compiler project!'));
} else {
    console.log(chalk.red.bold('\n❌ Test failed!'));
} 