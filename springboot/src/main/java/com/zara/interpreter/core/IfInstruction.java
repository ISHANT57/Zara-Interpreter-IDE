package com.zara.interpreter.core;

public class IfInstruction implements Instruction {
    private final Expression condition;
    private final Instruction thenBranch;
    private final Instruction elseBranch; // may be null

    public Expression getCondition() { return condition; }
    public Instruction getThenBranch() { return thenBranch; }
    public Instruction getElseBranch() { return elseBranch; }

    public IfInstruction(Expression condition, Instruction thenBranch, Instruction elseBranch) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    @Override
    public void execute(Environment env) {
        Object result = condition.evaluate(env);

        boolean conditionValue = false;
        if (result instanceof Boolean) {
            conditionValue = (Boolean) result;
        } else if (result instanceof Double) {
            conditionValue = ((Double) result) != 0;
        } else if (result instanceof String) {
            conditionValue = !((String) result).isEmpty();
        }

        if (conditionValue) {
            thenBranch.execute(env);
        } else if (elseBranch != null) {
            elseBranch.execute(env);
        }
    }
}
