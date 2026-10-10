const fs = require('fs');
const path = require('path');

const workletsDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-worklets@0_kz3euctiiz7rdykx4niiese5qe\\node_modules\\react-native-worklets';
const toolsDir = path.join(workletsDir, 'android\\c\\worklets\\Tools');
const redundantDir = path.join(workletsDir, 'android\\src\\main\\cpp\\worklets');

if (fs.existsSync(redundantDir)) {
  fs.rmSync('\\\\?\\' + redundantDir, { recursive: true, force: true });
  console.log('Cleaned redundant ' + redundantDir);
}

if (!fs.existsSync(toolsDir)) {
  fs.mkdirSync(toolsDir, { recursive: true });
}

const loggerSource = `#include <worklets/Tools/PlatformLogger.h>
#include <android/log.h>

namespace worklets {

void PlatformLogger::log(const char *str) {
  __android_log_print(ANDROID_LOG_INFO, "worklets", "%s", str);
}

void PlatformLogger::log(const std::string &str) {
  log(str.c_str());
}

void PlatformLogger::log(const double d) {
  __android_log_print(ANDROID_LOG_INFO, "worklets", "%lf", d);
}

void PlatformLogger::log(const int i) {
  __android_log_print(ANDROID_LOG_INFO, "worklets", "%d", i);
}

void PlatformLogger::log(const bool b) {
  log(b ? "true" : "false");
}

} // namespace worklets
`;

fs.writeFileSync(path.join(toolsDir, 'PlatformLogger.cpp'), loggerSource, 'utf8');
console.log('Successfully wrote single PlatformLogger.cpp to ' + path.join(toolsDir, 'PlatformLogger.cpp'));
