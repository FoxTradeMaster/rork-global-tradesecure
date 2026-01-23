export default ({ config }) => ({
  ...config,
  name: "Fox Trade Master",
  slug: "fox-trade-master",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "foxtrademaster",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "app.foxtrademaster.global",
    infoPlist: {
      NSPhotoLibraryUsageDescription: "Allow $(PRODUCT_NAME) to access your photos",
      NSCameraUsageDescription: "Allow $(PRODUCT_NAME) to access your camera",
      NSMicrophoneUsageDescription: "Allow $(PRODUCT_NAME) to access your microphone"
    },
    usesIcloudStorage: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "app.foxtrademaster.global",
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "INTERNET"
    ]
  },
  web: {
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
    output: "static",
    build: {
      babel: {
        include: ["@rork-ai/toolkit-sdk"]
      }
    }
  },
  plugins: [
    [
      "expo-router",
      {
        origin: "https://foxtrademaster.app/"
      }
    ],
    "expo-font",
    "expo-web-browser",
    [
      "expo-image-picker",
      {
        photosPermission: "The app accesses your photos to let you share them with your friends."
      }
    ],
    [
      "expo-document-picker",
      {
        iCloudContainerEnvironment: "Production"
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  }
});
