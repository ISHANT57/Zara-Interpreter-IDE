package com.zara.interpreter.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public class ExecutionResponse {
    @JsonProperty("success")
    private boolean success;

    @JsonProperty("output")
    private List<String> output;

    @JsonProperty("error")
    private String error;

    @JsonProperty("executionTimeMs")
    private long executionTimeMs;

    @JsonProperty("executionId")
    private String executionId;

    @JsonProperty("variables")
    private Map<String, Object> variables;

    @JsonProperty("ast")
    private List<String> ast;

    public ExecutionResponse() {}

    public ExecutionResponse(boolean success, List<String> output, String error,
                             long executionTimeMs, String executionId,
                             Map<String, Object> variables, List<String> ast) {
        this.success = success;
        this.output = output;
        this.error = error;
        this.executionTimeMs = executionTimeMs;
        this.executionId = executionId;
        this.variables = variables;
        this.ast = ast;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public List<String> getOutput() { return output; }
    public void setOutput(List<String> output) { this.output = output; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(long executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public String getExecutionId() { return executionId; }
    public void setExecutionId(String executionId) { this.executionId = executionId; }

    public Map<String, Object> getVariables() { return variables; }
    public void setVariables(Map<String, Object> variables) { this.variables = variables; }

    public List<String> getAst() { return ast; }
    public void setAst(List<String> ast) { this.ast = ast; }
}
