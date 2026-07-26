console.log('cwd:', process.cwd());
console.log('app.json exists:', require('fs').existsSync('./app.json'));
try {
  console.log('resolve expo/AppEntry:', require.resolve('expo/AppEntry'));
} catch (error) {
  console.error('resolve error:', error.message);
}
