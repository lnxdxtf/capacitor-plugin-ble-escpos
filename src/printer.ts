import { type BleDevice } from "@capacitor-community/bluetooth-le"
import { Ble } from "./ble"

//COMMANDS ESC/POS
export const ESCPOS_LineFeed:string = "\x0A"

export const ESCPOS_FontNormal:string = "\x1B\x45\x00"
export const ESCPOS_FontBold:string = "\x1B\x45\x01"

export const ESCPOS_TextNoUnderline:string = "\x1B\x2D\x00"
export const ESCPOS_TextUnderline:string = "\x1B\x2D\x01"
export const ESCPOS_TextLargeUnderline:string = "\x1B\x2D\x02"

export const ESCPOS_Cut:string = "\x1D\x56\x00"

export const ESCPOS_AlignLeft:string = "\x1B\x61\x00"
export const ESCPOS_AlignCenter:string = "\x1B\x61\x01"
export const ESCPOS_AlignRight:string = "\x1B\x61\x02"

export const ESCPOS_FontA:string = "\x1B\x4D\x00"
export const ESCPOS_FontB:string = "\x1B\x4D\x01"
export const ESCPOS_FontC:string = "\x1B\x4D\x01"
export const ESCPOS_FontD:string = "\x1B\x4D\x01"
export const ESCPOS_FontE:string = "\x1B\x4D\x01"


export const ESCPOS_EmphasizeOn:string = "\x1B\x45\x01"
export const ESCPOS_EmphasizeOff:string = "\x1B\x45\x00"

export const ESCPOS_DoubleHeightOn:string = "\x1B\x21\x10"
export const ESCPOS_DoubleHeightOff:string = "\x1B\x21\x00"

export const ESCPOS_DoubleWidthOn:string = "\x1B\x21\x20"
export const ESCPOS_DoubleWidthOff:string = "\x1B\x21\x00"

export const ESCPOS_UpsideDownOn:string = "\x1B\x7B\x01"
export const ESCPOS_UpsideDownOff:string = "\x1B\x7B\x00"

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

}	