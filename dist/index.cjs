var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var index_exports = {};
__export(index_exports, {
  Ble: () => Ble,
  ESCPOSCOMMANDS: () => ESCPOSCOMMANDS,
  PrinterBLE: () => PrinterBLE,
  PrinterUtils: () => PrinterUtils,
  THERMAL_PRINTER_CHR_0: () => THERMAL_PRINTER_CHR_0,
  THERMAL_PRINTER_CHR_1: () => THERMAL_PRINTER_CHR_1,
  THERMAL_PRINTER_SERVICE: () => THERMAL_PRINTER_SERVICE
});
module.exports = __toCommonJS(index_exports);

// src/ble.ts
var import_bluetooth_le = require("@capacitor-community/bluetooth-le");
var import_core = require("@capacitor/core");
var TIMEOUT_WRITE = 1e5;
var CHUNK_SIZE = 16;
var Ble = class {
  constructor() {
    this.devices = [];
    if (import_core.Capacitor.isNativePlatform()) {
      this.init().then(() => {
      });
    } else {
      throw new Error("This plugin only works on native platforms");
    }
  }
  async init() {
    await import_bluetooth_le.BleClient.initialize({ androidNeverForLocation: true });
    while (!await import_bluetooth_le.BleClient.isEnabled()) {
      await import_bluetooth_le.BleClient.requestEnable();
    }
  }
  async scan(services) {
    this.devices = [];
    await import_bluetooth_le.BleClient.requestLEScan({
      services
    }, ((_result) => {
      this.devices.push(_result.device);
      console.log(_result);
      console.log(this.devices);
    }));
  }
  async stopScan() {
    await import_bluetooth_le.BleClient.stopLEScan();
  }
  static async connected(device) {
    const devices = await import_bluetooth_le.BleClient.getConnectedDevices([]);
    const found = devices.find((dvc) => dvc.deviceId === device.deviceId);
    return found ? true : false;
  }
  static async connect(device) {
    await import_bluetooth_le.BleClient.connect(device.deviceId);
  }
  static async disconnect(device) {
    await import_bluetooth_le.BleClient.disconnect(device.deviceId);
  }
  static async send(device, svc_target, chr_target, raw, timeout = TIMEOUT_WRITE) {
    let svcs = await import_bluetooth_le.BleClient.getServices(device.deviceId);
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
      await import_bluetooth_le.BleClient.write(device.deviceId, svc.uuid, chr.uuid, new DataView(data.buffer), { timeout });
      await this._delay(50);
    }
  }
  static _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};

// src/printer.ts
var import_qrcode = __toESM(require("qrcode"), 1);
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
    const qrcodeBase64 = await import_qrcode.default.toDataURL(raw, { errorCorrectionLevel: "H", width });
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Ble,
  ESCPOSCOMMANDS,
  PrinterBLE,
  PrinterUtils,
  THERMAL_PRINTER_CHR_0,
  THERMAL_PRINTER_CHR_1,
  THERMAL_PRINTER_SERVICE
});
//# sourceMappingURL=index.cjs.map