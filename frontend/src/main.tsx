import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import {
  init, miniApp, viewport, retrieveLaunchParams,
  requestContentSafeAreaInsets,
} from '@telegram-apps/sdk';

const MOBILE_PLATFORMS = ['ios', 'android'];

const initializeTelegramSDK = async () => {
  try {
    await init();

    const { tgWebAppPlatform: platform } = retrieveLaunchParams();
    const isMobile = MOBILE_PLATFORMS.includes(platform ?? '');

    if (viewport.mount.isAvailable()) {
      await viewport.mount();

      if (viewport.bindCssVars.isAvailable()) {
        viewport.bindCssVars(key =>
          key === 'contentSafeAreaInsetTop' ? '--tg-content-safe-area-inset-top' : null
        );
      }
    }

    if (isMobile) {
      // Immersive fullscreen on mobile
      if (viewport.requestFullscreen.isAvailable()) {
        await viewport.requestFullscreen();
      }

      // Ask Telegram to send fresh content safe area insets (Telegram >= v8.0)
      if (requestContentSafeAreaInsets.isAvailable()) {
        requestContentSafeAreaInsets().catch(() => {});
      }

      // Fallback for older Telegram clients that never set the variable:
      // wait for the SDK to propagate any value, then apply ~50 px if still 0.
      // 50 px covers the standard Telegram overlay button bar height on iOS/Android.
      setTimeout(() => {
        const current = parseFloat(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--tg-content-safe-area-inset-top') || '0'
        );
        if (!current) {
          document.documentElement.style.setProperty(
            '--tg-content-safe-area-inset-top',
            '50px',
          );
        }
      }, 500);

    }

    if (miniApp.ready.isAvailable()) {
      miniApp.ready();
    }

  } catch (error) {
    console.error('Telegram SDK init error:', error);
  }
};

initializeTelegramSDK();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
