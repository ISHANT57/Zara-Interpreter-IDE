package com.zara.interpreter.core;

public class PrintInstruction implements Instruction {
    private final Expression expr;

    public PrintInstruction(Expression expr) {
        this.expr = expr;
    }

    @Override
    public void execute(Environment env) {
        Object result = expr.evaluate(env);
        String line = formatValue(result);
        OutputCapture.addLine(line);
    }

    public Expression getExpr() { return expr; }

    private String formatValue(Object value) {
        if (value instanceof Double) {
            double d = (Double) value;
            // Display integers without decimal point
            if (d == Math.floor(d) && !Double.isInfinite(d)) {
                return String.valueOf((long) d);
            }
            return String.valueOf(d);
        }
        if (value == null) return "null";
        return value.toString();
    }
}
