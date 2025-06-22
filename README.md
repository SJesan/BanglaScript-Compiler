# 🚀 BanglaScript Programming Language Compiler

A complete compiler implementation for the **BanglaScript** programming language, demonstrating all 6 phases of language compilation. This project showcases a comprehensive understanding of compiler design principles, language processing, and modern software engineering concepts, complete with a professional web interface.

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🔤 BanglaScript Language](#-banglascript-language)
- [🏗️ Compiler Architecture](#️-compiler-architecture)
- [🚀 Quick Start](#-quick-start)
- [🌐 Web Interface](#-web-interface)
- [🧪 Testing](#-testing)
- [📁 Project Structure](#-project-structure)
- [🎓 Academic Value](#-academic-value)

## 🎯 Project Overview

This project implements a complete compiler for **BanglaScript**, a custom programming language that uses English-based keywords inspired by Bengali pronunciation. The compiler demonstrates all six phases of language processing and is presented through a sleek, modern web interface.

### ✨ Key Features

- **Full 6-Phase Compiler**: Implements lexical analysis, parsing, semantic analysis, intermediate code generation, optimization, and code generation.
- **Modern Web UI**: A professional and attractive user interface built with modern web technologies for easy interaction and demonstration.
- **Interactive Examples**: Comes with 8 built-in examples that can be loaded with a single click.
- **Detailed Analysis Window**: A "View Full Analysis" button opens a new tab with a detailed, phase-by-phase breakdown of the compilation process.
- **Private & Deployable**: Ready for live deployment on platforms like Vercel while keeping the source code private.
- **Comprehensive Documentation**: Includes detailed README files explaining the project structure, language syntax, and setup instructions.

## 🔤 BanglaScript Language

BanglaScript is a programming language that uses English-based keywords inspired by Bengali pronunciation, making it accessible and intuitive for Bengali speakers while maintaining a familiar C-style syntax.

### Keywords

| BanglaScript | English Equivalent | Example Usage |
|--------------|--------------------|-------------------------|
| `dhore`      | `let` / `var`      | `dhore x = 10;`         |
| `dekhao`     | `print` / `log`    | `dekhao("Hello");`      |
| `jode`       | `if`               | `jode (x > 5) { ... }`  |
| `onnathay`   | `else`             | `} onnathay { ... }`    |
| `jotokkhon`  | `while`            | `jotokkhon (i < 10) { ... }` |
| `function`   | `function`         | `function add(a, b) { ... }` |
| `ferot`      | `return`           | `ferot a + b;`          |

### Example Programs

#### Basic Variables & Arithmetic
```banglascript
dhore x = 10;
dhore y = 5;
dhore jogfol = x + y;
dekhao(jogfol);
```

#### Conditional Statements
```banglascript
dhore boyosh = 18;
jode (boyosh >= 18) {
    dekhao("You are an adult");
} onnathay {
    dekhao("You are a minor");
}
```

## 🏗️ Compiler Architecture

The compiler is built with a modular architecture, with each phase implemented as a separate module in the `src/` directory:

```
src/
├── lexer.js          # Lexical Analysis
├── parser.js         # Parsing & AST Generation
├── semantic.js       # Semantic Analysis
├── intermediate.js   # Intermediate Code Generation
├── optimizer.js      # Code Optimization
├── codegen.js        # Code Generation
├── compiler.js       # Main Compiler Orchestrator
└── demo.js           # Command-line Demo Examples
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Installation
1. **Clone or download** the project.
2. **Navigate** to the project directory in your terminal.
3. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Compiler

#### Web Interface (Recommended)
This is the best way to interact with the compiler.
```bash
npm run web
```
Then open **`http://localhost:3001`** in your browser.

#### Command Line Tests
```bash
# Run a simple test case
npm test

# Run the comprehensive test suite
node comprehensive_test.js

# Run the command-line demo
npm run demo
```

## 🌐 Web Interface

The project includes a professional web interface that provides:
- **Real-time compilation** with a sleek, modern UI.
- **Compact summary view** of compilation stats.
- **"View Full Analysis" button** that opens a detailed phase-by-phase breakdown in a new tab.
- **Syntax highlighting** for better readability.
- **8 interactive examples** ready to use with one click.
- **Professional presentation** perfect for academic purposes.

## 🧪 Testing

The project includes multiple layers of testing to ensure correctness:
- **Basic Test (`npm test`)**: A single script (`test_banglascript.js`) to verify core functionality.
- **Comprehensive Tests (`comprehensive_test.js`)**: A suite of 8 automated test cases covering variables, arithmetic, conditionals, loops, and error handling.
- **Interactive UI Tests**: 8 built-in examples in the web interface for easy manual testing and demonstration.

## 📁 Project Structure

```
banglascript-compiler/
├── 📄 index.html              # Main web interface
├── 📄 server.js               # Express web server
├── 📄 package.json            # Project configuration
├── 📄 README.md               # This file
├── 📄 run.md                  # Detailed running instructions
├── 📄 WEB_UI_README.md        # Web interface documentation
├── 📄 test_banglascript.js    # Basic test script
├── 📄 comprehensive_test.js   # Comprehensive test suite
├── 📁 src/                    # Compiler source code
└── 📁 node_modules/           # Dependencies
```

## 🎓 Academic Value

This project is an excellent submission for a university-level compiler design course, demonstrating a comprehensive understanding of:

- **Computer Science Concepts**: All 6 phases of compilation, language processing, data structures (AST, symbol tables), and algorithms.
- **Software Engineering**: Modular design, robust testing practices, and a clean project structure.
- **Modern Web Technologies**: A professional frontend built with HTML/CSS/JavaScript and a Node.js/Express backend.
- **UI/UX Design**: An intuitive and attractive user interface designed for a great user experience.
- **Professional Documentation**: Clear and comprehensive documentation.

## 🤝 Contributing

This is a university project demonstrating compiler design principles. The code is well-documented and structured for educational purposes.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🎓 Perfect for University Compiler Design Course!**

This project showcases a complete understanding of compiler design principles, modern web technologies, and professional software development practices. It's ready for academic submission and demonstrates real-world software engineering skills. 