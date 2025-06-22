# 🚀 How to Run the BanglaScript Compiler

This guide provides step-by-step instructions to get your BanglaScript compiler up and running. The recommended way to use this project is through the modern web interface.

---

### ✅ Step 1: Prerequisites

1.  **Node.js**: Ensure you have Node.js (version 14 or higher) installed. You can download it from [nodejs.org](https://nodejs.org/).
2.  **npm**: This is the Node.js package manager and comes included with Node.js.

---

### ✅ Step 2: Installation

1.  **Open your terminal** or command prompt.
2.  **Navigate** to the project directory:
    ```bash
    cd path/to/your/banglascript-compiler
    ```
3.  **Install the required dependencies** by running:
    ```bash
    npm install
    ```
    This will create a `node_modules` folder with all the necessary packages.

---

### ✅ Step 3: Running the Web Interface (Recommended)

This is the main and easiest way to use the compiler.

1.  In your terminal, from the project root, run the following command:
    ```bash
    npm run web
    ```
2.  Your terminal should display a message confirming that the server is running:
    ```
    🚀 BanglaScript Compiler Web UI is running on http://localhost:3001
    ```
3.  **Open your web browser** and navigate to:
    > **http://localhost:3001**

You can now use the interactive web UI to write code, run examples, and see the full compilation analysis.

---

### ✅ Optional: Running Command-Line Tests

If you want to run the automated tests directly from your terminal, you can use these commands:

| Command                      | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| `npm test`                   | Runs the basic test script (`test_banglascript.js`). |
| `node comprehensive_test.js` | Runs the full suite of 8 automated test cases.   |
| `npm run demo`               | Runs the command-line demo with 5 examples.        |

---

### 🔤 Example BanglaScript Code

Try these examples in the web interface:

**Basic Variables:**
```banglascript
dhori x = 10;
dhori y = 5;
dhori jogfol = x + y;
dekhao(jogfol);
```

**Conditional Statements:**
```banglascript
dhori boyosh = 18;
jodi (boyosh >= 18) {
    dekhao("You are an adult");
} othoba {
    dekhao("You are a minor");
}
```

---

###  Troubleshooting

-   **`EADDRINUSE` Error**: If you see an error that the address is already in use, it means another application (or a previous instance of this server) is already running on port `3001`. Stop the other process and try again.
-   **"Module not found" Error**: This usually means the dependencies were not installed correctly. Make sure you are in the correct project directory and run `npm install` again.

Enjoy compiling with BanglaScript! 🎓 