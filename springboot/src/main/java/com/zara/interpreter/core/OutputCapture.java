package com.zara.interpreter.core;

import java.util.ArrayList;
import java.util.List;

/**
 * Thread-safe output capture using a ThreadLocal.
 * PrintInstruction writes to this capture when active.
 */
public class OutputCapture {

    /** ThreadLocal so concurrent requests don't interfere with each other. */
    public static final ThreadLocal<List<String>> CURRENT = new ThreadLocal<>();

    private final List<String> lines = new ArrayList<>();

    public void start() {
        lines.clear();
        CURRENT.set(lines);
    }

    public void stop() {
        CURRENT.remove();
    }

    public List<String> getOutput() {
        return new ArrayList<>(lines);
    }

    /** Called by PrintInstruction to add a line of output. */
    public static void addLine(String line) {
        List<String> capture = CURRENT.get();
        if (capture != null) {
            capture.add(line);
        }
    }
}
