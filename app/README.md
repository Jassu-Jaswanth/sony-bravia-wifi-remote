# Sony BRAVIA Remote Control

Cross-platform remote control app for Sony BRAVIA Android TVs.

## Features

- **Network Discovery** - Scan local network to find Sony TVs automatically
- **Power Control** - Turn TV on/off
- **Volume Control** - Adjust volume, mute/unmute
- **Navigation** - D-pad navigation with OK/Back/Home/Exit
- **Media Controls** - Play, Pause, Stop, Rewind, Fast Forward, Record
- **Number Pad** - Direct channel input
- **Color Buttons** - Red, Green, Yellow, Blue
- **Quick Actions** - Home, Guide, Input, Settings, Favorites, Help
- **Keyboard Input** - Send text to TV
- **Voice Input** - Speech-to-text for voice commands
- **Input Sources** - Switch between HDMI and other inputs
- **App Launcher** - Launch Netflix, YouTube, and other apps

## Prerequisites

### TV Setup
1. Go to **Settings → Network → Home Network → IP Control**
2. Set **Simple IP Control** to **On**
3. Set **Authentication** to **Pre-Shared Key**
4. Create a PSK (e.g., `1234`)
5. Note your TV's IP address from Network Settings

## Development

### Web UI (Development)

```bash
cd app
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

> **Note**: Due to CORS restrictions, the web version works best when:
> - Running on the same network as your TV
> - Using a CORS browser extension for development
> - Or building as a native app (Android/Desktop)

## Building for Platforms

### Android APK (Capacitor)

Prerequisites:
- Node.js 18+
- Android Studio with SDK

```bash
cd app
npm install
npm run build

# Initialize Capacitor Android
npx cap add android
npx cap sync

# Open in Android Studio
npx cap open android
```

In Android Studio:
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. APK will be in `android/app/build/outputs/apk/debug/`

### macOS / Windows (Tauri)

Prerequisites:
- Node.js 18+
- Rust (https://rustup.rs/)
- For Windows: Visual Studio Build Tools
- For macOS: Xcode Command Line Tools

```bash
cd app
npm install

# Development
npm run tauri:dev

# Build for current platform
npm run tauri:build
```

Binaries will be in:
- macOS: `src-tauri/target/release/bundle/dmg/`
- Windows: `src-tauri/target/release/bundle/msi/`
- Linux: `src-tauri/target/release/bundle/deb/` or `appimage/`

## Project Structure

```
app/
├── src/
│   ├── api/
│   │   └── sonyBravia.js    # Sony TV API client
│   ├── components/
│   │   ├── SetupScreen.jsx   # Connection setup
│   │   ├── RemoteControl.jsx # Main remote interface
│   │   └── remote/
│   │       ├── PowerVolume.jsx
│   │       ├── Navigation.jsx
│   │       ├── MediaControls.jsx
│   │       ├── NumPad.jsx
│   │       ├── QuickActions.jsx
│   │       ├── ColorButtons.jsx
│   │       ├── KeyboardInput.jsx
│   │       ├── InputSource.jsx
│   │       └── AppLauncher.jsx
│   ├── store/
│   │   └── tvStore.js        # Zustand state management
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── src-tauri/                 # Tauri (Desktop) config
├── capacitor.config.json      # Capacitor (Android) config
└── package.json
```

## API Reference

The app uses Sony's JSON-RPC API over HTTP with PSK authentication.

### Endpoints
- `/sony/system` - System info, power control
- `/sony/audio` - Volume control
- `/sony/avContent` - Input sources, content info
- `/sony/appControl` - App management
- `/sony/IRCC` - Remote control commands (SOAP)

### Authentication
All requests include the header:
```
X-Auth-PSK: <your-psk>
```

## Troubleshooting

### Connection Failed
- Ensure TV is on and connected to the same network
- Verify IP Control is enabled in TV settings
- Check that PSK matches what's set on the TV
- Try power cycling the TV

### Commands Not Working
- Some commands may not be supported on all TV models
- Check if the TV firmware is up to date
- IRCC codes may vary between models

### Network Scan Not Finding TV
- TV must be powered on (not in deep standby)
- Ensure devices are on the same subnet
- Try entering IP address manually

## License

MIT
