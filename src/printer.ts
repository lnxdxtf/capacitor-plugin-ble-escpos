import { BleCharacteristic, BleClient, BleDevice, BleService, textToDataView } from "@capacitor-community/bluetooth-le"

//COMMANDS ESC/POS
export const ESCPOS_LineFeed:string = "\n"

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
    private _device: BleDevice 
    
    constructor(device:BleDevice) {
        this._device = device
    }


    private async _connected():Promise<boolean> {
        const devices:BleDevice[] = await BleClient.getConnectedDevices([]);
        const found = devices.find((device:BleDevice) => device.deviceId === this._device?.deviceId)
        return found ? true : false
    }

    public async print(raw: string[]) {
        if (!await this._connected) {
            throw new Error("Printer not connected")
        }

        const data:DataView = textToDataView(raw.join(''))
        const services:BleService[] = await BleClient.getServices(this._device.deviceId)
        const service = services.find((s: BleService) => s.uuid === THERMAL_PRINTER_SERVICE );
        
        const chr = service?.characteristics.find((c:BleCharacteristic) => c.uuid.includes(THERMAL_PRINTER_CHR_1))

        await BleClient.write(this._device.deviceId, service!.uuid, chr!.uuid, data)
    }

}	