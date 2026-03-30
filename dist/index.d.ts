import { BleDevice } from '@capacitor-community/bluetooth-le';

declare class Ble {
    devices: BleDevice[];
    constructor();
    private init;
    scan(services: string[]): Promise<void>;
    stopScan(): Promise<void>;
    static connected(device: BleDevice): Promise<boolean>;
    static connect(device: BleDevice): Promise<void>;
    static disconnect(device: BleDevice): Promise<void>;
    static send(device: BleDevice, svc_target: string, chr_target: string, raw: string[], timeout?: number): Promise<void>;
    private static _delay;
}

declare class ESCPOSCOMMANDS {
    static LineFeed: string;
    static FontNormal: string;
    static FontBold: string;
    static TextNoUnderline: string;
    static TextUnderline: string;
    static TextLargeUnderline: string;
    static Cut: string;
    static AlignLeft: string;
    static AlignCenter: string;
    static AlignRight: string;
    static FontA: string;
    static FontB: string;
    static FontC: string;
    static FontD: string;
    static FontE: string;
    static EmphasizeOn: string;
    static EmphasizeOff: string;
    static DoubleHeightOn: string;
    static DoubleHeightOff: string;
    static DoubleWidthOn: string;
    static DoubleWidthOff: string;
    static UpsideDownOn: string;
    static UpsideDownOff: string;
    static ESC: string;
    static GS: string;
    static StartImage: string;
}
declare const THERMAL_PRINTER_SERVICE: string;
declare const THERMAL_PRINTER_CHR_0: string;
declare const THERMAL_PRINTER_CHR_1: string;
declare class PrinterBLE {
    device: BleDevice;
    constructor(device: BleDevice);
    print(raw: string[]): Promise<void>;
    /** Print a qrcode based on text */
    printQrCode(raw: string, width?: number): Promise<void>;
    /** Print a image based on Uint8Array*/
    printImage(raw: Uint8Array): Promise<void>;
}
declare class PrinterUtils {
}

export { Ble, ESCPOSCOMMANDS, PrinterBLE, PrinterUtils, THERMAL_PRINTER_CHR_0, THERMAL_PRINTER_CHR_1, THERMAL_PRINTER_SERVICE };
