// Expo config plugin: signs the release APK with the keystore supplied by the
// CI environment. All releases MUST be signed with the same key, otherwise
// Android refuses to install an update over the previous version.
//
// Env vars (set by .github/workflows/release.yml from repository secrets):
//   LOGICA_KEYSTORE_PATH, LOGICA_KEYSTORE_PASSWORD, LOGICA_KEY_ALIAS, LOGICA_KEY_PASSWORD
// When they are absent (local dev), the plugin does nothing.
const { withAppBuildGradle } = require('expo/config-plugins');

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (!process.env.LOGICA_KEYSTORE_PATH) return cfg;
    let gradle = cfg.modResults.contents;
    if (gradle.includes('LOGICA_KEYSTORE_PATH')) return cfg;

    const releaseSigning = `
        release {
            storeFile file(System.getenv("LOGICA_KEYSTORE_PATH"))
            storePassword System.getenv("LOGICA_KEYSTORE_PASSWORD")
            keyAlias System.getenv("LOGICA_KEY_ALIAS")
            keyPassword System.getenv("LOGICA_KEY_PASSWORD")
        }`;

    // Add the release signing config next to the existing debug one.
    gradle = gradle.replace(/signingConfigs\s*\{/, `signingConfigs {${releaseSigning}`);

    // Point the release build type at it.
    gradle = gradle.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/,
      '$1signingConfig signingConfigs.release'
    );

    cfg.modResults.contents = gradle;
    return cfg;
  });
};
