package com.zara.interpreter.service;

import com.zara.interpreter.core.*;
import com.zara.interpreter.model.ExecutionResponse;
import com.zara.interpreter.model.ProgramExecution;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InterpreterService {
    private final Map<String, List<ProgramExecution>> sessionHistory = new HashMap<>();
    private final Map<String, ProgramExecution> executionCache = new HashMap<>();

    public ExecutionResponse executeCode(String code, String sessionId) {
        long startTime = System.currentTimeMillis();
        String executionId = UUID.randomUUID().toString();

        OutputCapture capture = new OutputCapture();
        capture.start();
        try {
            Interpreter interpreter = new Interpreter();
            Environment env = interpreter.run(code);
            capture.stop();

            long executionTime = System.currentTimeMillis() - startTime;
            List<String> outputLines = capture.getOutput();
            Map<String, Object> variables = buildVariableMap(env);
            List<String> ast = buildAstDescription(code);

            ProgramExecution execution = new ProgramExecution(executionId, code);
            execution.setOutput(outputLines);
            execution.setStatus("success");
            execution.setExecutionTimeMs(executionTime);
            storeExecution(sessionId, executionId, execution);

            return new ExecutionResponse(true, outputLines, null, executionTime, executionId, variables, ast);

        } catch (Exception e) {
            capture.stop();
            long executionTime = System.currentTimeMillis() - startTime;

            ProgramExecution execution = new ProgramExecution(executionId, code);
            execution.setStatus("error");
            execution.setErrorMessage(e.getMessage());
            execution.setExecutionTimeMs(executionTime);
            storeExecution(sessionId, executionId, execution);

            return new ExecutionResponse(false, new ArrayList<>(), e.getMessage(),
                    executionTime, executionId, new LinkedHashMap<>(), new ArrayList<>());
        }
    }

    private void storeExecution(String sessionId, String executionId, ProgramExecution execution) {
        if (sessionId != null && !sessionId.isEmpty()) {
            sessionHistory.computeIfAbsent(sessionId, k -> new ArrayList<>()).add(execution);
        }
        executionCache.put(executionId, execution);
    }

    private Map<String, Object> buildVariableMap(Environment env) {
        Map<String, Object> result = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : env.getAll().entrySet()) {
            Object val = entry.getValue();
            // Convert Double integers to Long for cleaner JSON display
            if (val instanceof Double) {
                double d = (Double) val;
                if (d == Math.floor(d) && !Double.isInfinite(d)) {
                    result.put(entry.getKey(), (long) d);
                } else {
                    result.put(entry.getKey(), val);
                }
            } else {
                result.put(entry.getKey(), val);
            }
        }
        return result;
    }

    private List<String> buildAstDescription(String code) {
        List<String> ast = new ArrayList<>();
        try {
            Interpreter interpreter = new Interpreter();
            List<Instruction> instructions = interpreter.parse(code);
            int lineNum = 1;
            for (Instruction instr : instructions) {
                ast.add(describeInstruction(instr, lineNum++, 0));
            }
        } catch (Exception ignored) {
            // AST is best-effort — don't fail execution if this fails
        }
        return ast;
    }

    private String describeInstruction(Instruction instr, int lineNum, int depth) {
        String indent = "  ".repeat(depth);
        if (instr instanceof AssignInstruction) {
            AssignInstruction a = (AssignInstruction) instr;
            return indent + "ASSIGN " + a.getVarName() + " = " + describeExpr(a.getValue());
        }
        if (instr instanceof PrintInstruction) {
            PrintInstruction p = (PrintInstruction) instr;
            return indent + "PRINT " + describeExpr(p.getExpr());
        }
        if (instr instanceof IfInstruction) {
            IfInstruction i = (IfInstruction) instr;
            return indent + "WHEN " + describeExpr(i.getCondition());
        }
        if (instr instanceof WhileInstruction) {
            WhileInstruction w = (WhileInstruction) instr;
            return indent + "WHILE " + describeExpr(w.getCondition());
        }
        if (instr instanceof RepeatInstruction) {
            RepeatInstruction r = (RepeatInstruction) instr;
            return indent + "LOOP " + r.getTimes() + " times";
        }
        if (instr instanceof BlockInstruction) {
            return indent + "BLOCK";
        }
        return indent + instr.getClass().getSimpleName();
    }

    private String describeExpr(Expression expr) {
        if (expr == null) return "?";
        if (expr instanceof NumberNode) return String.valueOf(((NumberNode) expr).getValue());
        if (expr instanceof StringNode) return "\"" + ((StringNode) expr).getValue() + "\"";
        if (expr instanceof VariableNode) return ((VariableNode) expr).getName();
        if (expr instanceof BinaryOpNode) {
            BinaryOpNode b = (BinaryOpNode) expr;
            return "(" + describeExpr(b.getLeft()) + " " + b.getOp() + " " + describeExpr(b.getRight()) + ")";
        }
        return expr.getClass().getSimpleName();
    }

    public List<ProgramExecution> getSessionHistory(String sessionId) {
        return sessionHistory.getOrDefault(sessionId, new ArrayList<>());
    }

    public ProgramExecution getExecution(String executionId) {
        return executionCache.get(executionId);
    }

    public void clearSessionHistory(String sessionId) {
        sessionHistory.remove(sessionId);
    }

    public int getSessionCount() {
        return sessionHistory.size();
    }
}
