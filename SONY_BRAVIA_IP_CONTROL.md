# Sony BRAVIA Android TV – IP Control & Cross-Platform Remote Guide

> Tested on: Sony BRAVIA KD-43X8000H (Android TV)  
> Network: Local LAN, static IP  
> Auth mode: Pre-Shared Key (PSK)

---

## 1. Overview

Sony BRAVIA Android TVs expose a local network control API intended for automation systems, mobile remotes, and integrations.

Contrary to older or partial documentation:
- There is no default token
- No universal pairing PIN
- No browser-based Web UI
- PSK is the final credential on most consumer Android TV firmwares

Once PSK is enabled, the TV can be controlled reliably via JSON-RPC over HTTP.

---

## 2. Network Discovery (Empirical)

Typical open ports on BRAVIA Android TVs:

| Port | Purpose |
|----|----|
| 80 | Sony REST / JSON-RPC API |
| 443 / 8443 | Secure control (model-dependent) |
| 8008 | Google Cast / DIAL |
| 9000 | Android internal services |

Confirmed via nmap scan on LAN.

---

## 3. Authentication Model (Confirmed)

### Supported on KD-43X8000H
- Pre-Shared Key (PSK)
- No PIN-based pairing
- No token or cookie sessions

TV Settings:
Settings → Network → Home Network → IP Control → Authentication → Pre-Shared Key

Header used on every request:
X-Auth-PSK: <your_key>

---

## 4. Working API (JSON-RPC)

All requests:
- HTTP POST
- JSON body
- Path: /sony/<service>

### Power Status
curl -X POST http://TV_IP/sony/system \
-H "Content-Type: application/json" \
-H "X-Auth-PSK: 1234" \
-d '{ "method": "getPowerStatus", "params": [], "id": 1, "version": "1.0" }'

---

### Volume Control (Relative Only)
curl -X POST http://TV_IP/sony/audio \
-H "Content-Type: application/json" \
-H "X-Auth-PSK: 1234" \
-d '{ "method": "setAudioVolume", "params": [{ "volume": "+1", "ui": "on", "target": "speaker" }], "id": 1, "version": "1.0" }'

---

## 5. Unsupported (Confirmed)

- accessControl PIN pairing
- Auth tokens
- Browser-based pairing
- Default PSK

---

## 6. Official References

- Sony IP Control Overview  
  https://pro-bravia.sony.net/develop/integrate/ip-control/

- REST API Spec  
  https://pro-bravia.sony.net/develop/integrate/rest-api/spec/

- setAudioVolume  
  https://pro-bravia.sony.net/develop/integrate/rest-api/spec/service/audio/v1_0/setAudioVolume/

---

## 7. Community Confirmation

- Reddit /r/bravia
- Home Assistant BRAVIA integration  
  https://www.home-assistant.io/integrations/braviatv/

---

## 8. Cross-Platform Remote App Notes

Architecture:
UI → HTTP JSON-RPC Client → Sony BRAVIA API

Stacks:
- UI: React / Flutter
- Desktop: Tauri / Electron
- Mobile: Flutter / React Native
- Auth: PSK header

Dev Enhancements:
- Command palette
- Macro recording
- Keyboard-first UX
- LAN discovery
- Shared typed API client

---

## 9. Fallback (ADB)

adb connect TV_IP  
adb shell input keyevent 24

---

## 10. Final Takeaway

Sony BRAVIA Android TVs are PSK-first.
No pairing tokens exist on many consumer models.
JSON-RPC is stable, fast, and automation-friendly.
Relative commands matter.
