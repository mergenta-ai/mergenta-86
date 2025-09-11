import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7931a10ec90f48cabe026273c897fe38',
  appName: 'mergenta-86',
  webDir: 'dist',
  server: {
    url: 'https://7931a10e-c90f-48ca-be02-6273c897fe38.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#F3EAFE',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  }
};

export default config;