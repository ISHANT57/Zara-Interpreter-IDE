package com.zara.interpreter.core;

public class BinaryOpNode implements Expression {
    private final Expression left;
    private final Expression right;
    private final String op;

    public BinaryOpNode(Expression left, String op, Expression right) {
        this.left = left;
        this.op = op;
        this.right = right;
    }

    @Override
    public Object evaluate(Environment env) {
        Object l = left.evaluate(env);
        Object r = right.evaluate(env);

        // Numeric operations
        if (l instanceof Double && r instanceof Double) {
            double ld = (Double) l, rd = (Double) r;
            switch (op) {
                case "+":  return ld + rd;
                case "-":  return ld - rd;
                case "*":  return ld * rd;
                case "/":
                    if (rd == 0) throw new RuntimeException("Division by zero");
                    return ld / rd;
                case ">":  return ld > rd;
                case "<":  return ld < rd;
                case ">=": return ld >= rd;
                case "<=": return ld <= rd;
                case "==": return ld == rd;
                case "!=": return ld != rd;
            }
        }

        // String concatenation / comparison
        if (op.equals("+")) return l.toString() + r.toString();
        if (op.equals("==")) return l.equals(r);
        if (op.equals("!=")) return !l.equals(r);

        // Mixed number + string comparison
        if (op.equals(">") || op.equals("<") || op.equals(">=") || op.equals("<=")) {
            try {
                double ld = Double.parseDouble(l.toString());
                double rd = Double.parseDouble(r.toString());
                switch (op) {
                    case ">":  return ld > rd;
                    case "<":  return ld < rd;
                    case ">=": return ld >= rd;
                    case "<=": return ld <= rd;
                }
            } catch (NumberFormatException e) {
                // Fall through to string comparison
                int cmp = l.toString().compareTo(r.toString());
                switch (op) {
                    case ">":  return cmp > 0;
                    case "<":  return cmp < 0;
                    case ">=": return cmp >= 0;
                    case "<=": return cmp <= 0;
                }
            }
        }

        throw new RuntimeException("Operator '" + op + "' cannot be applied to: " + l + " and " + r);
    }

    public Expression getLeft() { return left; }
    public Expression getRight() { return right; }
    public String getOp() { return op; }
}
