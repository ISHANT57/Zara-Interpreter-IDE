# ZARA Interpreter Engine

A browser-based IDE for the custom ZARA programming language, built with Spring Boot.

## Architecture

- **Backend**: Spring Boot 3.2.0 web application (Java 17 target, running on GraalVM 19)
- **Frontend**: Single-page HTML/CSS/JS served as static resources from Spring Boot
- **Port**: 5000 (configured via `--server.port=5000` or `PORT` environment variable)

## Project Structure

```
springboot/                  # Spring Boot application
├── src/main/java/com/zara/interpreter/
│   ├── ZaraInterpreterApplication.java   # Entry point + CORS config
│   ├── controller/
│   │   ├── InterpreterController.java    # REST API (/api/*)
│   │   └── UIController.java             # Serves index.html, docs.html
│   ├── core/                             # ZARA language interpreter engine
│   │   ├── Tokenizer.java, Parser.java, Interpreter.java
│   │   ├── AST nodes: BinaryOpNode, NumberNode, StringNode, VariableNode
│   │   └── Instructions: AssignInstruction, IfInstruction, PrintInstruction, RepeatInstruction
│   ├── model/                            # Request/Response models
│   └── service/InterpreterService.java   # Execution service
├── src/main/resources/
│   ├── application.properties            # server.port=${PORT:5000}
│   └── static/
│       ├── index.html                    # ZARA IDE (code editor + output panel)
│       └── docs.html                     # Documentation page
└── target/zara-interpreter-1.0.0.jar    # Built artifact

src/                         # Original standalone Java source files (non-Spring)
examples/                    # Sample .zara programs
```

## ZARA Language Syntax

| Feature      | Syntax                  | Example              |
|--------------|-------------------------|----------------------|
| Variables    | `set name = value`      | `set x = 10`         |
| Arithmetic   | `+ - * /`               | `set r = x + y * 2`  |
| Strings      | `"text"`                | `set name = "Hello"` |
| Output       | `show value`            | `show result`        |
| Conditionals | `when condition:`       | `when score > 50:`   |
| Loops        | `loop count:`           | `loop 4:`            |

## API Endpoints

- `POST /api/execute` — Execute ZARA code, returns output + variable state + AST
- `GET /api/health` — Health check
- `GET /api/stats` — Session stats
- `GET /api/history/{sessionId}` — Execution history
- `DELETE /api/history/{sessionId}` — Clear session

## Running

The workflow runs: `cd springboot && java -Xmx300m -Xms75m -jar target/zara-interpreter-1.0.0.jar --server.port=5000`

To rebuild after code changes:
```bash
cd springboot && mvn clean package -DskipTests
```

## Deployment

Configured as `autoscale` deployment with:
- **Build**: `cd springboot && mvn clean package -DskipTests`
- **Run**: `cd springboot && java -Xmx300m -Xms75m -jar target/zara-interpreter-1.0.0.jar --server.port=5000`
