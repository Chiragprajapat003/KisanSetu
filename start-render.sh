#!/bin/sh
set -e

echo "🌱 Starting KisanSetu Backend Services on Render..."

# Start background microservices
echo "Starting Auth Service (5001)..."
node /app/services/auth/server.js &

echo "Starting User Service (5002)..."
node /app/services/user/server.js &

echo "Starting Product Service (5003)..."
node /app/services/product/server.js &

echo "Starting Order Service (5004)..."
node /app/services/order/server.js &

echo "Starting Communication Service (5005)..."
node /app/services/communication/server.js &

echo "Starting Feedback Service (5006)..."
node /app/services/feedback/server.js &

echo "Starting Payment Service (5007)..."
node /app/services/payment/server.js &

echo "Starting AI & Voice Agent Service (5008)..."
uvicorn main:app --app-dir /app/services/ai_connection --host 0.0.0.0 --port 5008 &

# Allow background services a few seconds to initialize
sleep 4

echo "🚀 Starting API Gateway on Port ${PORT:-8000}..."
exec node /app/services/gateway/server.js
