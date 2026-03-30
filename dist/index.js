// src/ble.ts
import { BleClient } from "@capacitor-community/bluetooth-le";
import { Capacitor } from "@capacitor/core";
var TIMEOUT_WRITE = 1e5;
var CHUNK_SIZE = 16;
var Ble = class {
  constructor() {
    this.devices = [];
    if (Capacitor.isNativePlatform()) {
      this.init().then(() => {
      });
    } else {
      throw new Error("This plugin only works on native platforms");
    }
  }
  async init() {
    await BleClient.initialize({ androidNeverForLocation: true });
    while (!await BleClient.isEnabled()) {
      await BleClient.requestEnable();
    }
  }
  async scan(services) {
    this.devices = [];
    await BleClient.requestLEScan({
      services
    }, ((_result) => {
      this.devices.push(_result.device);
      console.log(_result);
      console.log(this.devices);
    }));
  }
  async stopScan() {
    await BleClient.stopLEScan();
  }
  static async connected(device) {
    const devices = await BleClient.getConnectedDevices([]);
    const found = devices.find((dvc) => dvc.deviceId === device.deviceId);
    return found ? true : false;
  }
  static async connect(device) {
    await BleClient.connect(device.deviceId);
  }
  static async disconnect(device) {
    await BleClient.disconnect(device.deviceId);
  }
  static async send(device, svc_target, chr_target, raw, timeout = TIMEOUT_WRITE) {
    let svcs = await BleClient.getServices(device.deviceId);
    let svc = svcs.find((s) => s.uuid == svc_target);
    if (!svc) {
      throw new Error("Service not found");
    }
    let chr = svc?.characteristics.find((c) => c.uuid.includes(chr_target));
    if (!chr) {
      throw new Error("Characteristic not found");
    }
    for (let i = 0; i < raw.length; i += CHUNK_SIZE) {
      const chunk = raw.slice(i, i + CHUNK_SIZE);
      const encoder = new TextEncoder();
      const data = encoder.encode(chunk.join(""));
      await BleClient.write(device.deviceId, svc.uuid, chr.uuid, new DataView(data.buffer), { timeout });
      await this._delay(50);
    }
  }
  static _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};

// src/printer.ts
import QRCode from "qrcode";
var _ESCPOSCOMMANDS = class _ESCPOSCOMMANDS {
};
_ESCPOSCOMMANDS.LineFeed = "\n";
_ESCPOSCOMMANDS.FontNormal = "\x1BE\0";
_ESCPOSCOMMANDS.FontBold = "\x1BE";
_ESCPOSCOMMANDS.TextNoUnderline = "\x1B-\0";
_ESCPOSCOMMANDS.TextUnderline = "\x1B-";
_ESCPOSCOMMANDS.TextLargeUnderline = "\x1B-";
_ESCPOSCOMMANDS.Cut = "V\0";
_ESCPOSCOMMANDS.AlignLeft = "\x1Ba\0";
_ESCPOSCOMMANDS.AlignCenter = "\x1Ba";
_ESCPOSCOMMANDS.AlignRight = "\x1Ba";
_ESCPOSCOMMANDS.FontA = "\x1BM\0";
_ESCPOSCOMMANDS.FontB = "\x1BM";
_ESCPOSCOMMANDS.FontC = "\x1BM";
_ESCPOSCOMMANDS.FontD = "\x1BM";
_ESCPOSCOMMANDS.FontE = "\x1BM";
_ESCPOSCOMMANDS.EmphasizeOn = "\x1BE";
_ESCPOSCOMMANDS.EmphasizeOff = "\x1BE\0";
_ESCPOSCOMMANDS.DoubleHeightOn = "\x1B!";
_ESCPOSCOMMANDS.DoubleHeightOff = "\x1B!\0";
_ESCPOSCOMMANDS.DoubleWidthOn = "\x1B! ";
_ESCPOSCOMMANDS.DoubleWidthOff = "\x1B!\0";
_ESCPOSCOMMANDS.UpsideDownOn = "\x1B{";
_ESCPOSCOMMANDS.UpsideDownOff = "\x1B{\0";
// Image Commands
_ESCPOSCOMMANDS.ESC = "\x1B";
_ESCPOSCOMMANDS.GS = "";
_ESCPOSCOMMANDS.StartImage = `${_ESCPOSCOMMANDS.GS}v0`;
var ESCPOSCOMMANDS = _ESCPOSCOMMANDS;
var THERMAL_PRINTER_SERVICE = "000018f0-0000-1000-8000-00805f9b34fb";
var THERMAL_PRINTER_CHR_0 = "2af0";
var THERMAL_PRINTER_CHR_1 = "2af1";
var PrinterBLE = class {
  constructor(device) {
    this.device = device;
  }
  async print(raw) {
    if (!await Ble.connected(this.device)) {
      throw new Error("Printer not connected");
    }
    await Ble.send(this.device, THERMAL_PRINTER_SERVICE, THERMAL_PRINTER_CHR_1, raw);
  }
  /** Print a qrcode based on text */
  async printQrCode(raw, width = 200) {
    const qrcodeBase64 = await QRCode.toDataURL(raw, { errorCorrectionLevel: "H", width });
    const base64Data = qrcodeBase64.split(",")[1];
    const binaryData = atob(base64Data);
    const uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    await this.printImage(uint8Array);
  }
  /** Print a image based on Uint8Array*/
  //@ts-ignore
  async printImage(raw) {
    let commands = [];
    commands.push(`${ESCPOSCOMMANDS.StartImage}${raw}`);
    await this.print(commands);
  }
};
var PrinterUtils = class {
  // static async parseUrlImageToBase64(url: string): Promise<string> {
  // }
};
export {
  Ble,
  ESCPOSCOMMANDS,
  PrinterBLE,
  PrinterUtils,
  THERMAL_PRINTER_CHR_0,
  THERMAL_PRINTER_CHR_1,
  THERMAL_PRINTER_SERVICE
};
//# sourceMappingURL=index.js.map