const express = require('express');
const path = require('path');
const { Compiler } = require('./src/compiler');

const app = express();
const PORT = 3001;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('.'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to compile BanglaScript code
app.post('/api/compile', (req, res) => {
    try {
        const { sourceCode } = req.body;
        
        if (!sourceCode) {
            return res.status(400).json({ 
                success: false,
                error: 'Source code is required' 
            });
        }

        console.log('Compiling BanglaScript code:', sourceCode);

        // Create compiler instance and compile
        const compiler = new Compiler();
        const result = compiler.compile(sourceCode);

        if (result) {
            // Convert symbolTable.symbols Map to array for frontend compatibility
            let semanticResult = result.semanticResult || { isValid: false, symbolTable: { symbols: [] } };
            if (semanticResult.symbolTable && semanticResult.symbolTable.symbols && typeof semanticResult.symbolTable.symbols.entries === 'function') {
                semanticResult = {
                    ...semanticResult,
                    symbolTable: {
                        ...semanticResult.symbolTable,
                        symbols: Array.from(semanticResult.symbolTable.symbols.entries())
                    }
                };
            }
            const webResult = {
                sourceCode: sourceCode,
                tokens: result.tokens || [],
                ast: result.ast || null,
                semanticResult: semanticResult,
                intermediateCode: result.intermediateCode || [],
                optimizedCode: result.optimizedCode || [],
                generatedCode: result.generatedCode || '',
                success: true
            };
            
            console.log('Compilation successful');
            res.json({
                success: true,
                result: webResult
            });
        } else {
            console.log('Compilation failed');
            res.json({
                success: false,
                error: 'Compilation failed - check your BanglaScript syntax',
                result: {
                    sourceCode: sourceCode,
                    tokens: [],
                    ast: null,
                    semanticResult: { isValid: false, symbolTable: { symbols: [] } },
                    intermediateCode: [],
                    optimizedCode: [],
                    generatedCode: '',
                    success: false
                }
            });
        }

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            result: {
                sourceCode: req.body.sourceCode || '',
                tokens: [],
                ast: null,
                semanticResult: { isValid: false, symbolTable: { symbols: [] } },
                intermediateCode: [],
                optimizedCode: [],
                generatedCode: '',
                success: false
            }
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'BanglaScript Compiler API is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 BanglaScript Compiler Web UI is running on http://localhost:${PORT}`);
    console.log(`📝 API endpoint: http://localhost:${PORT}/api/compile`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
}); 