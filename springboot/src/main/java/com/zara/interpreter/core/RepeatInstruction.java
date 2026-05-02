package com.zara.interpreter.core;

import java.util.List;

public class RepeatInstruction implements Instruction {
    private final int times;
    private final Expression timesExpr; // for variable-count loops
    private final List<Instruction> body;

    public int getTimes() { return times; }
    public List<Instruction> getBody() { return body; }

    public RepeatInstruction(int times, List<Instruction> body) {
        this.times = times;
        this.timesExpr = null;
        this.body = body;
    }

    public RepeatInstruction(Expression timesExpr, List<Instruction> body) {
        this.times = -1;
        this.timesExpr = timesExpr;
        this.body = body;
    }

    @Override
    public void execute(Environment env) {
        int count = times;
        if (timesExpr != null) {
            Object val = timesExpr.evaluate(env);
            if (val instanceof Double) {
                count = ((Double) val).intValue();
            } else {
                throw new RuntimeException("Loop count must be a number, got: " + val);
            }
        }
        for (int i = 0; i < count; i++) {
            for (Instruction instr : body) {
                instr.execute(env);
            }
        }
    }
}
