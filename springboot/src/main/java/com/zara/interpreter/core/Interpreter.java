package com.zara.interpreter.core;

import java.util.List;
import java.util.Map;

public class Interpreter {

    /**
     * Runs the given ZARA source code and returns the final environment
     * (variable state after execution).
     */
    public Environment run(String sourceCode) {
        // Step 1: Tokenize
        Tokenizer tokenizer = new Tokenizer(sourceCode);
        List<Token> tokens = tokenizer.tokenize();

        // Step 2: Parse
        Parser parser = new Parser(tokens);
        List<Instruction> instructions = parser.parse();

        // Step 3: Execute
        Environment env = new Environment();
        for (Instruction instr : instructions) {
            instr.execute(env);
        }

        return env;
    }

    /**
     * Parses source code and returns an AST description without executing.
     */
    public List<Instruction> parse(String sourceCode) {
        Tokenizer tokenizer = new Tokenizer(sourceCode);
        List<Token> tokens = tokenizer.tokenize();
        Parser parser = new Parser(tokens);
        return parser.parse();
    }
}
