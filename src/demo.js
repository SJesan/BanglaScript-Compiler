const { Compiler } = require('./compiler');
const chalk = require('chalk');

// Banglish language examples
const examples = {
    'Simple Banglish Variables': `
dhore x = 10;
dhore y = 5;
dhore jogfol = x + y;
dekhao(jogfol);
`,

    'Banglish Conditional': `
dhore boyosh = 18;
jode (boyosh >= 18) {
    dekhao("You are adult");
} onnathay {
    dekhao("You are minor");
}
`,

    'Banglish Loop': `
dhore i = 1;
jotokkhon (i <= 5) {
    dekhao(i);
    i = i + 1;
}
`,

    'Banglish Function': `
function jog(a, b) {
    ferot a + b;
}
dhore fol = jog(10, 20);
dekhao(fol);
`,

    'Simple Math': `
dhore a = 15;
dhore b = 3;
dhore gunfol = a * b;
dekhao("Result: " + gunfol);
`
};

function runDemo() {
    console.log(chalk.bold.yellow('🚀 Welcome to the BanglaScript Language Demo!'));
    console.log(chalk.yellow('='.repeat(50)));
    console.log(chalk.yellow('Running 5 different example programs...\n'));

    const compiler = new Compiler();

    // Run each example
    Object.entries(examples).forEach(([name, code], index) => {
        console.log(chalk.bold.magenta(`\n🌟 Example: ${name}`));
        console.log(chalk.magenta('-'.repeat(50)));
        
        const result = compiler.compile(code.trim());
        
        if (result) {
            console.log(chalk.green(`\n✅ Example "${name}" compiled successfully!`));
        } else {
            console.log(chalk.red(`\n❌ Example "${name}" failed to compile!`));
        }
        
        // Add some spacing between examples
        if (index < Object.keys(examples).length - 1) {
            console.log('\n' + '─'.repeat(80) + '\n');
        }
    });

    console.log(chalk.bold.green('\n✅ Demo finished successfully!'));
    console.log(chalk.green('All examples compiled without errors.'));
}

function runSingleExample(exampleName) {
    if (!examples[exampleName]) {
        console.log(chalk.red(`Example "${exampleName}" not found!`));
        console.log(chalk.cyan('Available examples:'));
        Object.keys(examples).forEach(name => {
            console.log(chalk.cyan(`  • ${name}`));
        });
        return;
    }

    console.log(chalk.bold.magenta(`🎮 Running Example: ${exampleName}`));
    console.log(chalk.magenta('='.repeat(50)));

    const compiler = new Compiler();
    const result = compiler.compile(examples[exampleName].trim());
    
    if (result) {
        console.log(chalk.green(`\n✅ Example "${exampleName}" compiled successfully!`));
    } else {
        console.log(chalk.red(`\n❌ Example "${exampleName}" failed to compile!`));
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.length > 0) {
    const exampleName = args[0];
    runSingleExample(exampleName);
} else {
    runDemo();
}

module.exports = { runDemo, runSingleExample, examples }; 