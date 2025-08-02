// Bundle analyzer and project health check

const fs = require('fs');
const path = require('path');

console.log('📊 Analyzing Auto Goal Planner project...');

function analyzeProject() {
  const analysis = {
    timestamp: new Date().toISOString(),
    packageInfo: {},
    fileStructure: {},
    dependencies: {},
    recommendations: [],
  };

  // Analyze package.json
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    analysis.packageInfo = {
      name: packageJson.name,
      version: packageJson.version,
      dependencies: Object.keys(packageJson.dependencies || {}).length,
      devDependencies: Object.keys(packageJson.devDependencies || {}).length,
    };
  } catch (error) {
    analysis.recommendations.push('❌ package.json could not be read');
  }

  // Analyze src structure
  const srcPath = path.join(__dirname, '..', 'src');
  if (fs.existsSync(srcPath)) {
    analysis.fileStructure = analyzeDirectory(srcPath);
  }

  // Check for best practices
  checkBestPractices(analysis);

  return analysis;
}

function analyzeDirectory(dirPath, relativePath = '') {
  const items = fs.readdirSync(dirPath);
  const structure = {
    files: 0,
    directories: 0,
    totalSize: 0,
    types: {},
  };

  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      structure.directories++;
    } else {
      structure.files++;
      structure.totalSize += stat.size;
      
      const ext = path.extname(item);
      structure.types[ext] = (structure.types[ext] || 0) + 1;
    }
  });

  return structure;
}

function checkBestPractices(analysis) {
  const recommendations = [];

  // Check TypeScript usage
  if (analysis.fileStructure.types['.ts'] || analysis.fileStructure.types['.tsx']) {
    recommendations.push('✅ Using TypeScript for type safety');
  } else {
    recommendations.push('⚠️ Consider using TypeScript for better type safety');
  }

  // Check component organization
  if (fs.existsSync('src/components')) {
    recommendations.push('✅ Components are properly organized');
  } else {
    recommendations.push('⚠️ Consider organizing components in src/components');
  }

  // Check for custom hooks
  if (fs.existsSync('src/hooks')) {
    recommendations.push('✅ Custom hooks are organized');
  }

  // Check for utilities
  if (fs.existsSync('src/utils')) {
    recommendations.push('✅ Utility functions are organized');
  }

  // Check for type definitions
  if (fs.existsSync('src/types')) {
    recommendations.push('✅ Type definitions are centralized');
  }

  analysis.recommendations = recommendations;
}

// Run analysis
const analysis = analyzeProject();

console.log('\n📋 Project Analysis Report');
console.log('='.repeat(50));
console.log(`📦 Package: ${analysis.packageInfo.name} v${analysis.packageInfo.version}`);
console.log(`📁 Files: ${analysis.fileStructure.files} files, ${analysis.fileStructure.directories} directories`);
console.log(`📊 Dependencies: ${analysis.packageInfo.dependencies} runtime, ${analysis.packageInfo.devDependencies} dev`);

console.log('\n🔍 File Types:');
Object.entries(analysis.fileStructure.types || {}).forEach(([ext, count]) => {
  console.log(`   ${ext || 'no extension'}: ${count} files`);
});

console.log('\n💡 Recommendations:');
analysis.recommendations.forEach(rec => console.log(`   ${rec}`));

console.log('\n✨ Analysis completed successfully!');

// Write detailed report
const reportPath = path.join(__dirname, '..', 'analysis-report.json');
fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
console.log(`📄 Detailed report saved to ${reportPath}`);

module.exports = { analyzeProject };