const chalk = require('chalk');

class Optimizer {
    constructor() {
        this.optimizations = [
            'constant folding',
            'dead code elimination',
            'common subexpression elimination',
            'strength reduction'
        ];
    }

    optimize(instructions) {
        console.log(chalk.green.bold('\n🚀 PHASE 5: CODE OPTIMIZATION'));
        console.log(chalk.green('Applying optimizations...\n'));

        let optimizedInstructions = [...instructions];
        let optimizationCount = 0;

        // Apply each optimization
        this.optimizations.forEach(optimization => {
            const beforeCount = optimizedInstructions.length;
            optimizedInstructions = this.applyOptimization(optimizedInstructions, optimization);
            const afterCount = optimizedInstructions.length;
            
            if (beforeCount !== afterCount) {
                optimizationCount += beforeCount - afterCount;
                console.log(chalk.cyan(`  ✓ ${optimization}: removed ${beforeCount - afterCount} instructions`));
            }
        });

        if (optimizationCount > 0) {
            console.log(chalk.green(`\n✅ Optimization completed! Removed ${optimizationCount} instructions total.`));
        } else {
            console.log(chalk.yellow('\n⚠️  No optimizations applied - code is already optimal.'));
        }

        console.log(chalk.green('\n✅ Optimized intermediate code:'));
        optimizedInstructions.forEach((instruction, index) => {
            const color = instruction.label ? chalk.yellow : chalk.cyan;
            console.log(chalk.cyan(`  ${index + 1}. ${color(instruction.toString())}`));
        });

        return optimizedInstructions;
    }

    applyOptimization(instructions, optimizationType) {
        switch (optimizationType) {
            case 'constant folding':
                return this.constantFolding(instructions);
            case 'dead code elimination':
                return this.deadCodeElimination(instructions);
            case 'common subexpression elimination':
                return this.commonSubexpressionElimination(instructions);
            case 'strength reduction':
                return this.strengthReduction(instructions);
            default:
                return instructions;
        }
    }

    constantFolding(instructions) {
        const optimized = [];
        const constants = new Map();

        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            
            // Check if this is a constant arithmetic operation
            if (this.isConstantArithmetic(instruction)) {
                const result = this.evaluateConstantExpression(instruction);
                if (result !== null) {
                    constants.set(instruction.operands[0], result);
                    optimized.push(new (instruction.constructor)('ASSIGN', [instruction.operands[0], result.toString()]));
                    continue;
                }
            }

            // Replace constant variables with their values
            if (instruction.opcode === 'ASSIGN' && constants.has(instruction.operands[1])) {
                instruction.operands[1] = constants.get(instruction.operands[1]).toString();
            }

            optimized.push(instruction);
        }

        return optimized;
    }

    isConstantArithmetic(instruction) {
        const arithmeticOps = ['ADD', 'SUB', 'MUL', 'DIV'];
        return arithmeticOps.includes(instruction.opcode) && 
               this.isNumeric(instruction.operands[1]) && 
               this.isNumeric(instruction.operands[2]);
    }

    isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    evaluateConstantExpression(instruction) {
        const left = parseFloat(instruction.operands[1]);
        const right = parseFloat(instruction.operands[2]);
        
        switch (instruction.opcode) {
            case 'ADD':
                return left + right;
            case 'SUB':
                return left - right;
            case 'MUL':
                return left * right;
            case 'DIV':
                return right !== 0 ? left / right : null;
            default:
                return null;
        }
    }

    deadCodeElimination(instructions) {
        const optimized = [];
        const usedVariables = new Set();
        const definedVariables = new Map();

        // First pass: find all used variables
        for (let i = instructions.length - 1; i >= 0; i--) {
            const instruction = instructions[i];
            
            // Add operands to used set
            instruction.operands.forEach(operand => {
                if (this.isVariable(operand)) {
                    usedVariables.add(operand);
                }
            });
        }

        // Second pass: keep only instructions that define used variables or have side effects
        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            
            if (this.hasSideEffects(instruction)) {
                optimized.push(instruction);
            } else if (instruction.opcode === 'ASSIGN' && instruction.operands.length >= 2) {
                const target = instruction.operands[0];
                if (usedVariables.has(target) || this.isVariable(instruction.operands[1])) {
                    optimized.push(instruction);
                }
            } else {
                optimized.push(instruction);
            }
        }

        return optimized;
    }

    isVariable(operand) {
        return operand && operand.startsWith('t') && !isNaN(parseInt(operand.substring(1)));
    }

    hasSideEffects(instruction) {
        const sideEffectOps = ['PRINT', 'CALL', 'PUSH', 'POP', 'RETURN', 'FUNCTION', 'ENDFUNCTION'];
        return sideEffectOps.includes(instruction.opcode) || instruction.label !== null;
    }

    commonSubexpressionElimination(instructions) {
        const optimized = [];
        const expressions = new Map();

        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            
            if (this.isArithmeticOperation(instruction)) {
                const exprKey = this.getExpressionKey(instruction);
                
                if (expressions.has(exprKey)) {
                    // Replace with existing result
                    const existingTemp = expressions.get(exprKey);
                    optimized.push(new (instruction.constructor)('ASSIGN', [instruction.operands[0], existingTemp]));
                } else {
                    // Store new expression
                    expressions.set(exprKey, instruction.operands[0]);
                    optimized.push(instruction);
                }
            } else {
                optimized.push(instruction);
            }
        }

        return optimized;
    }

    isArithmeticOperation(instruction) {
        const arithmeticOps = ['ADD', 'SUB', 'MUL', 'DIV'];
        return arithmeticOps.includes(instruction.opcode);
    }

    getExpressionKey(instruction) {
        const op = instruction.opcode;
        const left = instruction.operands[1];
        const right = instruction.operands[2];
        
        // Normalize commutative operations
        if (op === 'ADD' || op === 'MUL') {
            return `${op}:${Math.min(left, right)}:${Math.max(left, right)}`;
        }
        
        return `${op}:${left}:${right}`;
    }

    strengthReduction(instructions) {
        const optimized = [];

        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            
            if (instruction.opcode === 'MUL' && this.isPowerOfTwo(instruction.operands[2])) {
                // Replace multiplication by power of 2 with left shift
                const power = Math.log2(parseInt(instruction.operands[2]));
                optimized.push(new (instruction.constructor)('SHL', [instruction.operands[0], instruction.operands[1], power.toString()]));
            } else if (instruction.opcode === 'DIV' && this.isPowerOfTwo(instruction.operands[2])) {
                // Replace division by power of 2 with right shift
                const power = Math.log2(parseInt(instruction.operands[2]));
                optimized.push(new (instruction.constructor)('SHR', [instruction.operands[0], instruction.operands[1], power.toString()]));
            } else {
                optimized.push(instruction);
            }
        }

        return optimized;
    }

    isPowerOfTwo(value) {
        const num = parseInt(value);
        return num > 0 && (num & (num - 1)) === 0;
    }
}

module.exports = { Optimizer }; 