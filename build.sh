#!/bin/bash
set -e

echo "==> Building React frontend..."
cd frontend
npm install -g pnpm --silent 2>/dev/null || true
pnpm install
pnpm build
cd ..

echo "==> Copying React build into Spring Boot static resources..."
rm -rf springboot/src/main/resources/static
mkdir -p springboot/src/main/resources/static
cp -r frontend/dist/* springboot/src/main/resources/static/

echo "==> Building Spring Boot JAR..."
cd springboot
mvn package -DskipTests
cd ..

echo "==> Build complete!"
