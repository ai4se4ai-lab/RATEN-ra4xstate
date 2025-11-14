#!/bin/bash

# Test script for Docker build and run

echo "=== Building Docker Image ==="
docker build -t raten-xstate:latest .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo ""
echo "=== Running Container ==="
docker run --rm raten-xstate:latest

if [ $? -ne 0 ]; then
    echo "❌ Docker run failed!"
    exit 1
fi

echo ""
echo "=== Testing RATEN Package Import ==="
docker run --rm raten-xstate:latest node -e "
const raten = require('./lib/index.js');
const xstate = require('xstate');
console.log('✓ RATEN package:', Object.keys(raten).join(', '));
console.log('✓ xstate available:', typeof xstate.createMachine === 'function');
"

echo ""
echo "✅ All tests passed!"

