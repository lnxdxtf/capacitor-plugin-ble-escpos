# capacitor-plugin-ble-escpos

A simple and efficient library to integrate Bluetooth thermal printers with mobile apps using Capacitor. 

**Note:** This library is currently only supported on Android devices.

## Overview

The `capacitor-plugin-ble-escpos` library allows you to easily connect to Bluetooth-enabled thermal printers and send print commands using the ESC/POS protocol. This library is particularly useful for point-of-sale (POS) systems, receipt printing, and other scenarios where mobile printing is required.

### Inspiration

This project was inspired by my previous work in Rust:

- [eco_print](https://github.com/lnxdxtf/eco_print)
- [tauri-plugin-escpos](https://github.com/lnxdxtf/tauri-plugin-escpos)

## Installation

To install the library directly from the GitHub repository, use the following command:

```bash
bun install git+https://github.com/lnxdxtf/capacitor-plugin-ble-escpos.git
```
and this
```bash
bunx cap sync
```

### Usage
```ts
import { Ble, ESCPOS_LineFeed, ESCPOS_AlignLeft, ESCPOS_AlignCenter, ESCPOS_AlignRight, PrinterBLE } from "capacitor-plugin-ble-escpos";

async function main() {
    // Array of Bluetooth service UUIDs to filter scanned devices
    const services: string[] = [];
    const ble = new Ble();

    // Scan for Bluetooth devices
    await ble.scan(services);

    // Select a device (for simplicity, choosing the first one)
    const device = devices[0];

    // Connect to the selected device
    await ble.connect(device);

    // Initialize the PrinterBLE instance
    const printer = new PrinterBLE(device);

    // Build your print job using ESC/POS commands
    const raw: string[] = [
        ESCPOS_LineFeed.repeat(2),
        ESCPOS_AlignCenter,
        "HELLO WORLD CENTER",
        ESCPOS_LineFeed.repeat(2),
        ESCPOS_AlignRight,
        "HELLO WORLD RIGHT",
        ESCPOS_LineFeed.repeat(2),
        ESCPOS_AlignLeft,
        "HELLO WORLD LEFT",
        ESCPOS_LineFeed.repeat(2),
    ];

    // Send the print job to the printer
    await printer.print(raw);
}

// Execute the main function
main();

```

### Examples
To see the library in action, check out the sample app:
- <a href="/example/ble-cap/">ble-cap example</a>