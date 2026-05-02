package com.zara.interpreter.core;

import java.util.ArrayList;
import java.util.List;

public class Parser {
    private final List<Token> tokens;
    private int pos;

    public Parser(List<Token> tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }

    // ─── token helpers ───────────────────────────────────────────────────────

    private Token current() {
        return tokens.get(pos);
    }

    private Token consume(TokenType expected) {
        Token t = current();
        if (t.getType() != expected) {
            throw new RuntimeException(
                "Syntax Error at line " + t.getLine() +
                ": Expected " + expected +
                " but got '" + t.getValue() + "' (" + t.getType() + ")"
            );
        }
        pos++;
        return t;
    }

    /** Consume a token only if it matches — used for optional colons. */
    private void consumeOptional(TokenType type) {
        if (current().getType() == type) pos++;
    }

    private void skipNewlines() {
        while (current().getType() == TokenType.NEWLINE) pos++;
    }

    // ─── top-level parse ─────────────────────────────────────────────────────

    public List<Instruction> parse() {
        List<Instruction> instructions = new ArrayList<>();
        skipNewlines();
        while (current().getType() != TokenType.EOF) {
            instructions.add(parseInstruction());
            skipNewlines();
        }
        return instructions;
    }

    // ─── block parsing (indented body) ───────────────────────────────────────

    private List<Instruction> parseBlock() {
        skipNewlines();
        consume(TokenType.INDENT);
        skipNewlines();

        List<Instruction> body = new ArrayList<>();
        while (current().getType() != TokenType.DEDENT &&
               current().getType() != TokenType.EOF) {
            body.add(parseInstruction());
            skipNewlines();
        }

        if (current().getType() == TokenType.DEDENT) pos++;
        return body;
    }

    // ─── instructions ────────────────────────────────────────────────────────

    private Instruction parseInstruction() {
        skipNewlines();
        Token t = current();
        if (t.getType() == TokenType.SET)  return parseAssign();
        if (t.getType() == TokenType.SHOW) return parsePrint();
        if (t.getType() == TokenType.WHEN) return parseIf();
        if (t.getType() == TokenType.LOOP) return parseLoop();
        throw new RuntimeException(
            "Unknown instruction '" + t.getValue() + "' at line " + t.getLine()
        );
    }

    private Instruction parseAssign() {
        consume(TokenType.SET);
        String name = consume(TokenType.IDENTIFIER).getValue();
        consume(TokenType.EQUALS);
        Expression expr = parseExpression();
        return new AssignInstruction(name, expr);
    }

    private Instruction parsePrint() {
        consume(TokenType.SHOW);
        Expression expr = parseExpression();
        return new PrintInstruction(expr);
    }

    /**
     * when <condition> [:]
     *     <body>
     * [when <condition> [:]   -- chained else-if]
     * [otherwise [:]          -- else]
     */
    private Instruction parseIf() {
        consume(TokenType.WHEN);
        Expression condition = parseExpression();
        consumeOptional(TokenType.COLON);   // colon is optional

        List<Instruction> thenBody = parseBlock();
        Instruction thenBranch = new BlockInstruction(thenBody);

        skipNewlines();
        Instruction elseBranch = null;
        if (current().getType() == TokenType.WHEN) {
            elseBranch = parseIf();                 // chained when
        } else if (current().getType() == TokenType.OTHERWISE) {
            pos++;                                  // consume 'otherwise'
            consumeOptional(TokenType.COLON);
            List<Instruction> elseBody = parseBlock();
            elseBranch = new BlockInstruction(elseBody);
        }

        return new IfInstruction(condition, thenBranch, elseBranch);
    }

    /**
     * loop while <condition> [:]
     *     <body>
     *
     * loop <count> [:]
     *     <body>
     */
    private Instruction parseLoop() {
        int loopLine = current().getLine();
        consume(TokenType.LOOP);

        // loop while <condition>
        if (current().getType() == TokenType.WHILE) {
            pos++;                                  // consume 'while'
            Expression condition = parseExpression();
            consumeOptional(TokenType.COLON);
            List<Instruction> body = parseBlock();
            return new WhileInstruction(condition, body);
        }

        // loop <number> [times]
        if (current().getType() == TokenType.NUMBER) {
            int times = (int) Double.parseDouble(current().getValue());
            pos++;
            // skip optional 'times' identifier
            if (current().getType() == TokenType.IDENTIFIER &&
                current().getValue().equals("times")) {
                pos++;
            }
            consumeOptional(TokenType.COLON);
            List<Instruction> body = parseBlock();
            return new RepeatInstruction(times, body);
        }

        // loop <variable/expression>
        if (current().getType() == TokenType.IDENTIFIER) {
            Expression countExpr = parsePrimary();
            consumeOptional(TokenType.COLON);
            List<Instruction> body = parseBlock();
            return new RepeatInstruction(countExpr, body);
        }

        throw new RuntimeException("Expected 'while', a number, or a variable after 'loop' at line " + loopLine);
    }

    // ─── expressions ─────────────────────────────────────────────────────────

    private Expression parseExpression() {
        Expression left = parseTerm();

        while (current().getType() == TokenType.PLUS   ||
               current().getType() == TokenType.MINUS  ||
               current().getType() == TokenType.GT     ||
               current().getType() == TokenType.LT     ||
               current().getType() == TokenType.GTE    ||
               current().getType() == TokenType.LTE    ||
               current().getType() == TokenType.EQEQ) {

            String op = current().getValue();
            pos++;
            Expression right = parseTerm();
            left = new BinaryOpNode(left, op, right);
        }

        return left;
    }

    private Expression parseTerm() {
        Expression left = parseUnary();

        while (current().getType() == TokenType.MULTIPLY ||
               current().getType() == TokenType.DIVIDE) {
            String op = current().getValue();
            pos++;
            Expression right = parseUnary();
            left = new BinaryOpNode(left, op, right);
        }

        return left;
    }

    private Expression parseUnary() {
        if (current().getType() == TokenType.MINUS) {
            pos++;
            Expression operand = parsePrimary();
            return new BinaryOpNode(new NumberNode(0), "-", operand);
        }
        return parsePrimary();
    }

    private Expression parsePrimary() {
        Token t = current();

        if (t.getType() == TokenType.NUMBER) {
            pos++;
            return new NumberNode(Double.parseDouble(t.getValue()));
        }

        if (t.getType() == TokenType.STRING) {
            pos++;
            return new StringNode(t.getValue());
        }

        if (t.getType() == TokenType.IDENTIFIER) {
            pos++;
            return new VariableNode(t.getValue());
        }

        if (t.getType() == TokenType.LPAREN) {
            pos++;
            Expression expr = parseExpression();
            consume(TokenType.RPAREN);
            return expr;
        }

        throw new RuntimeException(
            "Unexpected token '" + t.getValue() + "' (" + t.getType() + ") at line " + t.getLine()
        );
    }
}
