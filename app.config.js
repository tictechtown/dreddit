const IS_PROD = process.env.APP_VARIANT === 'prod';

export default {
  expo: {
    name: IS_PROD ? 'Dreddit' : '[Debug] Dreddit',
    slug: 'dreddit',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    backgroundColor: '#000000',
    assetBundlePatterns: ['**/*'],
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.tictechtown.app.dreddit',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        monochromeImage: './assets/monochrone-icon.png',
      },
      package: IS_PROD ? 'com.tictechtown.app.dreddit' : 'com.tictechtown.app.dreddit.dev',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-screen-orientation',
        {
          initialOrientation: 'DEFAULT',
        },
      ],
    ],
    scheme: 'dreddit',
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '6e6862bb-965e-40e0-9c36-f0a3b01899dc',
      },
    },
  },
};
