const fs = require('fs');

const p = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\expo-modules-core@57.0._n6ahvxya4tgsdqwz4mnlbyizpm\\node_modules\\expo-modules-core\\android\\cmake\\variables.cmake';
if (fs.existsSync(p)) console.log(fs.readFileSync(p, 'utf8'));
