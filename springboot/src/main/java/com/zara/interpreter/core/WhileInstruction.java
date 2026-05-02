package com.zara.interpreter.core;

import java.util.List;

public class WhileInstruction implements Instruction {
    private final Expression condition;
    private final List<Instruction> body;

    public Expression getCondition() { return condition; }
    public List<Instruction> getBody() { return body; }

    public WhileInstruction(Expression condition, List<Instruction> body) {
        this.condition = condition;
        this.body = body;
    }

    @Override
    public void execute(Environment env) {
        int safetyLimit = 100_000;
        int iterations = 0;
        while (isTruthy(condition.evaluate(env))) {
            if (++iterations > safetyLimit) {
                throw new RuntimeException("Infinite loop detected (exceeded " + safetyLimit + " iterations)");
            }
            for (Instruction instr : body) {
                instr.execute(env);
            }
        }
    }

    private boolean isTruthy(Object val) {
        if (val instanceof Boolean) return (Boolean) val;
        if (val instanceof Double)  return ((Double) val) != 0;
        if (val instanceof String)  return !((String) val).isEmpty();
        return false;
    }
}
