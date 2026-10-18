// Single source of truth for the app version is package.json.
// versionCode is derived from it so every release is strictly increasing,
// which Android requires to install an APK over an existing install.
const pkg = require('./package.json');

const [major, minor, patch] = pkg.version.split('.').map((n) => parseInt(n, 10) || 0);
const versionCode = major * 1000000 + minor * 1000 + patch;

module.exports = {
  expo: {
    name: 'Logica',
    slug: 'logica',
    version: pkg.version,
    scheme: 'logica',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    backgroundColor: '#0E0B1F',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0E0B1F',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.techbytesdesign.logica',
    },
    android: {
      package: 'com.techbytesdesign.logica',
      versionCode,
      adaptiveIcon: {
        backgroundColor: '#0E0B1F',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
      // not needed by this app; keeps the install prompt short
      blockedPermissions: [
        'android.permission.SYSTEM_ALERT_WINDOW',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
      ],
      permissions: [
        'REQUEST_INSTALL_PACKAGES',
        'POST_NOTIFICATIONS',
        'VIBRATE',
        'INTERNET',
        'ACCESS_NETWORK_STATE',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      'expo-router',
      'expo-font',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#0E0B1F',
          image: './assets/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
        },
      ],
      [
        'expo-notifications',
        {
          color: '#7C83FF',
        },
      ],
      './plugins/withReleaseSigning',
    ],
    extra: {
      // Where the in-app updater looks for new releases (GitHub Releases).
      github: {
        owner: process.env.LOGICA_GH_OWNER || 'techbytesdesign',
        repo: process.env.LOGICA_GH_REPO || 'logica',
      },
    },
  },
};
