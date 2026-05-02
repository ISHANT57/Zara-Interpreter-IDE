package com.zara.interpreter.core;

import java.util.ArrayList;
import java.util.List;

public class Tokenizer {
    private final String source;
    private int pos;
    private int line;

    public Tokenizer(String source) {
        this.source = source;
        this.pos = 0;
        this.line = 1;
    }

    public List<Token> tokenize() {
        List<Token> tokens = new ArrayList<>();
        List<Integer> indentStack = new ArrayList<>();
        indentStack.add(0);

        boolean atLineStart = true;

        while (pos < source.length()) {
            char current = source.charAt(pos);

            // --- Process indentation at the start of each line ---
            if (atLineStart) {
                int indent = 0;
                int tempPos = pos;
                while (tempPos < source.length() && source.charAt(tempPos) == ' ') {
                    indent++;
                    tempPos++;
                }

                // Skip blank lines and comment-only lines
                char nextChar = (tempPos < source.length()) ? source.charAt(tempPos) : '\0';
                if (nextChar == '\n' || nextChar == '\r' || nextChar == '#' || nextChar == '\0') {
                    if (nextChar == '#') {
                        pos = tempPos;
                        while (pos < source.length() && source.charAt(pos) != '\n') pos++;
                    } else {
                        pos = tempPos;
                    }
                    if (pos < source.length() && source.charAt(pos) == '\n') {
                        line++;
                        pos++;
                    }
                    continue;
                }

                // Emit INDENT / DEDENT tokens based on indentation change
                int topIndent = indentStack.get(indentStack.size() - 1);
                if (indent > topIndent) {
                    indentStack.add(indent);
                    tokens.add(new Token(TokenType.INDENT, "", line));
                } else if (indent < topIndent) {
                    while (indentStack.size() > 1 && indentStack.get(indentStack.size() - 1) > indent) {
                        indentStack.remove(indentStack.size() - 1);
                        tokens.add(new Token(TokenType.DEDENT, "", line));
                    }
                }

                pos = tempPos;
                atLineStart = false;
                continue;
            }

            // --- End of line ---
            if (current == '\n') {
                // Emit NEWLINE only if the last token is not already a NEWLINE
                if (!tokens.isEmpty() && tokens.get(tokens.size() - 1).getType() != TokenType.NEWLINE) {
                    tokens.add(new Token(TokenType.NEWLINE, "\n", line));
                }
                line++;
                pos++;
                atLineStart = true;
                continue;
            }

            if (current == '\r') {
                pos++;
                continue;
            }

            // --- Inline comment ---
            if (current == '#') {
                while (pos < source.length() && source.charAt(pos) != '\n') pos++;
                continue;
            }

            // --- Skip non-newline whitespace within a line ---
            if (current == ' ' || current == '\t') {
                pos++;
                continue;
            }

            if (Character.isDigit(current)) {
                tokens.add(readNumber());
                continue;
            }

            if (current == '"') {
                tokens.add(readString());
                continue;
            }

            if (Character.isLetter(current) || current == '_') {
                tokens.add(readIdentifierOrKeyword());
                continue;
            }

            tokens.add(readSymbol());
        }

        // Flush trailing NEWLINE and remaining DEDENTs
        if (!tokens.isEmpty() && tokens.get(tokens.size() - 1).getType() != TokenType.NEWLINE) {
            tokens.add(new Token(TokenType.NEWLINE, "\n", line));
        }
        while (indentStack.size() > 1) {
            indentStack.remove(indentStack.size() - 1);
            tokens.add(new Token(TokenType.DEDENT, "", line));
        }

        tokens.add(new Token(TokenType.EOF, "", line));
        return tokens;
    }

    private Token readNumber() {
        int start = pos;
        while (pos < source.length() &&
                (Character.isDigit(source.charAt(pos)) || source.charAt(pos) == '.')) {
            pos++;
        }
        return new Token(TokenType.NUMBER, source.substring(start, pos), line);
    }

    private Token readString() {
        pos++; // consume opening quote
        int start = pos;
        while (pos < source.length() && source.charAt(pos) != '"') {
            if (source.charAt(pos) == '\n') line++;
            pos++;
        }
        String text = source.substring(start, pos);
        if (pos < source.length()) pos++; // consume closing quote
        return new Token(TokenType.STRING, text, line);
    }

    private Token readIdentifierOrKeyword() {
        int start = pos;
        while (pos < source.length() &&
                (Character.isLetterOrDigit(source.charAt(pos)) || source.charAt(pos) == '_')) {
            pos++;
        }
        String word = source.substring(start, pos);
        switch (word) {
            case "set":  return new Token(TokenType.SET,        word, line);
            case "show": return new Token(TokenType.SHOW,       word, line);
            case "when": return new Token(TokenType.WHEN,       word, line);
            case "loop":      return new Token(TokenType.LOOP,      word, line);
            case "while":     return new Token(TokenType.WHILE,     word, line);
            case "otherwise": return new Token(TokenType.OTHERWISE, word, line);
            default:     return new Token(TokenType.IDENTIFIER, word, line);
        }
    }

    private Token readSymbol() {
        char current = source.charAt(pos);
        char next    = (pos + 1 < source.length()) ? source.charAt(pos + 1) : '\0';

        if (current == '+') { pos++; return new Token(TokenType.PLUS,     "+", line); }
        if (current == '-') { pos++; return new Token(TokenType.MINUS,    "-", line); }
        if (current == '*') { pos++; return new Token(TokenType.MULTIPLY, "*", line); }
        if (current == '/') {
            // Check for single-line comment //
            if (next == '/') {
                while (pos < source.length() && source.charAt(pos) != '\n') pos++;
                return readSymbol(); // recurse after skipping comment (will hit other logic)
            }
            pos++;
            return new Token(TokenType.DIVIDE, "/", line);
        }
        if (current == '=') {
            if (next == '=') { pos += 2; return new Token(TokenType.EQEQ,   "==", line); }
            pos++;
            return new Token(TokenType.EQUALS, "=", line);
        }
        if (current == '>') {
            if (next == '=') { pos += 2; return new Token(TokenType.GTE, ">=", line); }
            pos++;
            return new Token(TokenType.GT, ">", line);
        }
        if (current == '<') {
            if (next == '=') { pos += 2; return new Token(TokenType.LTE, "<=", line); }
            pos++;
            return new Token(TokenType.LT, "<", line);
        }
        if (current == '!') {
            if (next == '=') { pos += 2; return new Token(TokenType.EQEQ, "!=", line); }
        }
        if (current == ':') { pos++; return new Token(TokenType.COLON,  ":", line); }
        if (current == '{') { pos++; return new Token(TokenType.LBRACE, "{", line); }
        if (current == '}') { pos++; return new Token(TokenType.RBRACE, "}", line); }
        if (current == '(') { pos++; return new Token(TokenType.LPAREN, "(", line); }
        if (current == ')') { pos++; return new Token(TokenType.RPAREN, ")", line); }

        throw new RuntimeException("Unknown character: '" + current + "' at line " + line);
    }
}
