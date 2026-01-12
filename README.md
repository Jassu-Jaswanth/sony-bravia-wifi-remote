# Sony BRAVIA WiFi Remote

A cross-platform remote control app for Sony BRAVIA Android TVs using the official JSON-RPC API.

## Features

- **Full Remote Control** - Power, volume, navigation, media controls
- **NumPad** - Channel numbers and text input
- **Keyboard Input** - Send text directly to TV
- **Input Source Selector** - Switch between HDMI, TV, etc.
- **App Launcher** - Launch installed apps on TV
- **Network Discovery** - Auto-discover TVs on local network

## Platforms

- **Android** (APK)
- **macOS** (DMG)
- **Web** (development)

## Setup

### TV Configuration

1. On your Sony BRAVIA TV, go to **Settings > Network > Home Network Setup > IP Control**
2. Set **Authentication** to **Normal and Pre-Shared Key**
3. Set a **Pre-Shared Key** (e.g., "1234")
4. Note your TV's IP address from **Settings > Network > Network Setup > View Network Status**

### Running the App

1. Enter your TV's IP address
2. Enter the Pre-Shared Key you configured
3. Connect and control!

## Development

```bash
cd app
npm install
npm run dev
```

### Build APK (Android)

```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

### Build DMG (macOS)

```bash
npm run build
npx tauri build
```

## Tech Stack

- React + Vite
- TailwindCSS
- Capacitor (Android)
- Tauri (macOS/Windows)
- Sony BRAVIA JSON-RPC API

## API Reference

The app uses Sony's official REST API:
- `/sony/system` - Power, system info
- `/sony/audio` - Volume control
- `/sony/avContent` - Input sources
- `/sony/appControl` - App management
- `/sony/IRCC` - Remote control commands (SOAP)

## License

MIT
