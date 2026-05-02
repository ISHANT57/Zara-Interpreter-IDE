package com.zara.interpreter.core;

public class AssignInstruction implements Instruction {
    private final String varName;
    private final Expression value;

    public AssignInstruction(String varName, Expression value) {
        this.varName = varName;
        this.value = value;
    }

    @Override
    public void execute(Environment env) {
        Object result = value.evaluate(env);
        env.set(varName, result);
    }

    public String getVarName() { return varName; }
    public Expression getValue() { return value; }
}
