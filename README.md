# PBRE

[![Pull Request CI](https://github.com/josephburt/PBRE/actions/workflows/pull-request-ci.yml/badge.svg)](https://github.com/josephburt/PBRE/actions/workflows/pull-request-ci.yml)
[![Deploy](https://github.com/josephburt/PBRE/actions/workflows/deploy.yml/badge.svg)](https://github.com/josephburt/PBRE/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<img src="docs/images/icon.svg" alt="PBRE icon" width="128" />

**Puffing Bluetooth Re-Engineered** is an open source controller for **Pax 3** vaporizers. It talks to the device over Bluetooth from a web browser or a desktop app — no official Pax app required.

[**Open the live demo**](https://pbre.burtlabs.org/) · [Original pax-romana project](https://github.com/evertonstz/pax-romana)

Use Chrome or Edge for the demo. Web Bluetooth does not work in Safari or Firefox. You will need the serial number printed on the back of the Pax.

## What it does

PBRE is a local remote for a Pax 3 already in your hand. It can:

- Connect over Bluetooth after you enter the device serial
- Detect your physical **Shell Color** (Onyx Black, Silver, Rose Gold, Sage Teal, Burgundy) and dynamically tint the UI
- Choose from 5 **Dynamic Heating Modes / Profiles**:
  - **Standard**: Balanced heat and idle cooldown
  - **Boost**: Aggressive heat ramp-up & dense vapor with minimal cooldown
  - **Efficiency**: Auto-increases oven temperature (+1°C/min) throughout session
  - **Stealth**: Dimmed LED petals and rapid cooldown between hits for low odor
  - **Flavor**: Fast cooling between draws to preserve terpenes and taste
- Show oven temperature, heating state, and battery percent
- Set the oven temperature (Celsius by default, one click to Fahrenheit)
- Change brightness, vibration strength, and the device color theme
- Label a hit as **Inhaling** (the lip-detect boost), not a blank or N/A state

It runs in two ways:

| | How you use it |
|---|---|
| **Web app** | Open the [live demo](https://pbre.burtlabs.org/) or run it locally |
| **Desktop app** | Download standalone installers for [macOS, Windows, and Linux](https://github.com/josephburt/PBRE/releases/latest) |

Writes (temperature, lights, vibration) work on macOS. Other operating systems can usually read device state; changing settings may be limited by the OS Bluetooth stack.

## How to use it

1. Shake the Pax until the pairing light is blue.
2. Add the serial from the back of the device. PBRE uses that serial to encrypt the Bluetooth traffic.
3. Connect when the browser or app asks for a Bluetooth device.
4. Adjust temperature, brightness, vibration, and theme from the screen.

## Run the web app locally

```bash
git clone https://github.com/josephburt/PBRE.git
cd PBRE
nvm install   # Node v21.6.1 from .nvmrc
nvm use
corepack enable
corepack prepare pnpm@8.15.4 --activate
pnpm install
pnpm dev
```

Then open [http://localhost:5173](http://localhost:5173). Web Bluetooth only works on `localhost` or HTTPS.

## Desktop app

```bash
pnpm desktop              # Electron window against the local Vite server
pnpm desktop:build        # Package for this computer
pnpm desktop:build:mac    # Mac .dmg / .zip
pnpm desktop:build:win    # Windows .zip (unzip and run PBRE.exe)
pnpm desktop:build:linux  # Linux AppImage + tar.gz
```

Builds land in `release/`. Unsigned Mac builds may need **Right-click → Open** the first time. macOS will ask for Bluetooth permission.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Local web app at `http://localhost:5173` |
| `pnpm test` | Unit tests |
| `pnpm run lint` | ESLint + Prettier |
| `pnpm run build` | Production web build |
| `pnpm run build:pages` | Production build for GitHub Pages |
| `pnpm desktop` | Standalone Electron app |
| `pnpm desktop:build` | Package a downloadable app for this OS |

## Protocol

Bluetooth encode/decode lives in `src/pax`. The Web Bluetooth connection is in `src/hooks/usePaxBluetoothServices/useBluetooth/useBluetooth.ts`.

## Troubleshooting

- **Device not showing in Bluetooth chooser**: Make sure you shake the Pax until the four petals glow blue (pairing mode). If it has connected to a phone recently, turn off Bluetooth on the phone.
- **Web Bluetooth in Browser**: Web Bluetooth requires Chrome, Chromium, or Edge over HTTPS or `localhost`. Safari and Firefox do not support Web Bluetooth.
- **Desktop Bluetooth Permission (macOS)**: When first launching the desktop build, macOS will prompt for Bluetooth access. Ensure it is allowed in **System Settings → Privacy & Security → Bluetooth**.

## Credits

This PBRE work — the desktop app, temperature controls, unit toggle, pairing cleanup, and GitHub Pages packaging — was built with **Grok** using the **Grok 4.6** model from [xAI](https://x.ai).

This repository continues [evertonstz/pax-romana](https://github.com/evertonstz/pax-romana) (MIT). That license and copyright notice are preserved in `LICENSE`. Original demo: https://evertonstz.github.io/pax-romana
