import { type BleDevice } from "@capacitor-community/bluetooth-le"
import { Ble } from "./ble"
import QRCode from "qrcode"


export class ESCPOSCOMMANDS {
    static LineFeed:string = "\x0A"
    static FontNormal:string = "\x1B\x45\x00"
    static FontBold:string = "\x1B\x45\x01"
    static TextNoUnderline:string = "\x1B\x2D\x00"
    static TextUnderline:string = "\x1B\x2D\x01"
    static TextLargeUnderline:string = "\x1B\x2D\x02"
    static Cut:string = "\x1D\x56\x00"
    static AlignLeft:string = "\x1B\x61\x00"
    static AlignCenter:string = "\x1B\x61\x01"
    static AlignRight:string = "\x1B\x61\x02"
    static FontA:string = "\x1B\x4D\x00"
    static FontB:string = "\x1B\x4D\x01"
    static FontC:string = "\x1B\x4D\x01"
    static FontD:string = "\x1B\x4D\x01"
    static FontE:string = "\x1B\x4D\x01"
    static EmphasizeOn:string = "\x1B\x45\x01"
    static EmphasizeOff:string = "\x1B\x45\x00"
    static DoubleHeightOn:string = "\x1B\x21\x10"
    static DoubleHeightOff:string = "\x1B\x21\x00"
    static DoubleWidthOn:string = "\x1B\x21\x20"
    static DoubleWidthOff:string = "\x1B\x21\x00"
    static UpsideDownOn:string = "\x1B\x7B\x01"
    static UpsideDownOff:string = "\x1B\x7B\x00"

    // Image Commands
    static ESC:string = "\x1B"
    static GS:string = "\x1D"
    static StartImage:string = `${ESCPOSCOMMANDS.GS}v0`
}
//COMMANDS ESC/POS


export const THERMAL_PRINTER_SERVICE: string = "000018f0-0000-1000-8000-00805f9b34fb"
export const THERMAL_PRINTER_CHR_0: string = "2af0"
export const THERMAL_PRINTER_CHR_1: string = "2af1"

export class PrinterBLE {
    public device: BleDevice 
    
    constructor(device:BleDevice) {
        this.device = device
        
    }

    public async print(raw: string[]) {
        if (!await Ble.connected(this.device)) {
            throw new Error("Printer not connected")
        }   
        await Ble.send(this.device, THERMAL_PRINTER_SERVICE, THERMAL_PRINTER_CHR_1, raw)
    }

    /** Print a qrcode based on text */
    public async printQrCode(raw: string, width: number = 200) {
        const qrcodeBase64 = await QRCode.toDataURL(raw, { errorCorrectionLevel: 'H', width: width });
        const base64Data = qrcodeBase64.split(',')[1]; 
        const binaryData = atob(base64Data);
        const uint8Array = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
        }
        await this.printImage(uint8Array)
    }

    /** Print a image based on Uint8Array*/
    //@ts-ignore
    public async printImage(raw: Uint8Array) {
        let commands:string[] = []

        commands.push(`${ESCPOSCOMMANDS.StartImage}${raw}`)

        await this.print(commands)
    }

}	

export class PrinterUtils {
    // static async parseUrlImageToBase64(url: string): Promise<string> {

    // }
}