#!/usr/bin/env node

/**
 * Verification script for Docker container
 * Tests that RATEN package is properly built and functional
 */

console.log('=== RATEN Docker Verification ===\n');

// Test 1: Package can be required
console.log('1. Testing package import...');
try {
  const raten = require('./lib/index.js');
  console.log('   ✓ RATEN package imported successfully');
  console.log('   ✓ Available exports:', Object.keys(raten).join(', '));
} catch (error) {
  console.error('   ✗ Failed to import RATEN:', error.message);
  process.exit(1);
}

// Test 2: xstate dependency is available
console.log('\n2. Testing xstate dependency...');
try {
  const xstate = require('xstate');
  console.log('   ✓ xstate is available');
  console.log('   ✓ createMachine function:', typeof xstate.createMachine === 'function' ? 'available' : 'missing');
} catch (error) {
  console.error('   ✗ xstate not found:', error.message);
  console.error('   Note: xstate should be available via yarn workspaces');
  process.exit(1);
}

// Test 3: RATEN can be instantiated (basic test)
console.log('\n3. Testing RATEN instantiation...');
try {
  const { RATEN } = require('./lib/index.js');
  const { createMachine } = require('xstate');
  
  // Create simple machines
  const behavioralModel = createMachine({
    id: 'test',
    initial: 'idle',
    states: {
      idle: { on: { START: 'active' } },
      active: { on: { STOP: 'idle' } }
    }
  });
  
  const propertyModel = createMachine({
    id: 'property',
    initial: 'good',
    states: {
      good: { tags: ['Good'] },
      bad: { tags: ['Bad'] }
    }
  });
  
  const ratenInstance = new RATEN(behavioralModel, propertyModel);
  console.log('   ✓ RATEN instance created successfully');
  console.log('   ✓ Configuration:', ratenInstance.config ? 'loaded' : 'default');
} catch (error) {
  console.error('   ✗ Failed to create RATEN instance:', error.message);
  process.exit(1);
}

// Test 4: Package info
console.log('\n4. Package information...');
try {
  const pkg = require('./package.json');
  console.log('   ✓ Package name:', pkg.name);
  console.log('   ✓ Version:', pkg.version);
  console.log('   ✓ Description:', pkg.description);
} catch (error) {
  console.error('   ✗ Failed to read package.json:', error.message);
  process.exit(1);
}

console.log('\n✅ All verification tests passed!');
console.log('RATEN package is ready to use.\n');

