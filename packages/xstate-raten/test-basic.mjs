/**
 * Basic functionality test for RATEN
 * Tests that all files can be loaded and basic structure is correct
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing RATEN package structure...\n');

const requiredFiles = [
  'src/index.ts',
  'src/raten.ts',
  'src/preprocessing.ts',
  'src/costComputation.ts',
  'src/btCost.ts',
  'src/rcSteps.ts',
  'src/configuration.ts',
  'src/costExtraction.ts',
  'src/traceReplay.ts',
  'src/testEnhancement.ts',
  'src/utils.ts',
  'src/types.ts',
  'package.json',
  'tsconfig.json',
  'rollup.config.js',
  'jest.config.js',
  'README.md'
];

let allPassed = true;

for (const file of requiredFiles) {
  const filePath = join(__dirname, file);
  if (existsSync(filePath)) {
    console.log(`✓ ${file}`);
  } else {
    console.log(`✗ ${file} - MISSING`);
    allPassed = false;
  }
}

console.log('\nChecking file contents...\n');

// Check that key exports exist in index.ts
try {
  const indexContent = readFileSync(join(__dirname, 'src/index.ts'), 'utf-8');
  const requiredExports = ['RATEN', 'RATENConfig', 'RobustnessResult'];
  for (const exportName of requiredExports) {
    if (indexContent.includes(exportName)) {
      console.log(`✓ Export '${exportName}' found in index.ts`);
    } else {
      console.log(`✗ Export '${exportName}' NOT found in index.ts`);
      allPassed = false;
    }
  }
} catch (error) {
  console.log(`✗ Error reading index.ts: ${error.message}`);
  allPassed = false;
}

// Check that RATEN class exists
try {
  const ratenContent = readFileSync(join(__dirname, 'src/raten.ts'), 'utf-8');
  if (ratenContent.includes('export class RATEN')) {
    console.log('✓ RATEN class found');
  } else {
    console.log('✗ RATEN class NOT found');
    allPassed = false;
  }
  
  if (ratenContent.includes('analyze(')) {
    console.log('✓ analyze() method found');
  } else {
    console.log('✗ analyze() method NOT found');
    allPassed = false;
  }
} catch (error) {
  console.log(`✗ Error reading raten.ts: ${error.message}`);
  allPassed = false;
}

console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ All basic checks passed!');
  console.log('\nThe RATEN package is properly structured.');
  console.log('To build and test:');
  console.log('  1. Install dependencies: npm install --legacy-peer-deps');
  console.log('  2. Build: cd packages/xstate-raten && npm run build');
  console.log('  3. Test: npm test');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please review the errors above.');
  process.exit(1);
}

