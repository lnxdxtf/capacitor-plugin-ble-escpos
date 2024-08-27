import { BleClient, textToDataView, type BleCharacteristic, type BleDevice, type BleService, type ScanResult } from "@capacitor-community/bluetooth-le";
import { Capacitor } from "@capacitor/core";

const TIMEOUT_WRITE = 100000
const CHUNK_SIZE = 16
export class Ble {

    public devices: BleDevice[] = []
    
    constructor() {
        if (Capacitor.isNativePlatform()) {
            this.init().then(() => {})
        } else {
            throw new Error("This plugin only works on native platforms")
        }
    }

    private async init() {
        await BleClient.initialize({androidNeverForLocation: true});
        while (!await BleClient.isEnabled()) {
            await BleClient.requestEnable()
        }
        
    }

    public async scan(services: string[]) {
        this.devices = [];
        await BleClient.requestLEScan({
            services: services
        }, ((_result:ScanResult) => {
            this.devices.push(_result.device)
            console.log(_result);
            console.log(this.devices);
        }))
    }

    public async stopScan() {
        await BleClient.stopLEScan()
    }    

    public static async connected(device: BleDevice):Promise<boolean> {
        const devices:BleDevice[] = await BleClient.getConnectedDevices([]);
        const found = devices.find((dvc:BleDevice) => dvc.deviceId === device.deviceId)
        return found ? true : false
    }

    public static async connect(device: BleDevice) {
        await BleClient.connect(device.deviceId);
    }   

    public static async disconnect(device: BleDevice) {
        await BleClient.disconnect(device.deviceId)
    }
    
    public static async send(device: BleDevice, svc_target: string, chr_target:string, raw: string[], timeout: number = TIMEOUT_WRITE): Promise<void> {
        let svcs = await BleClient.getServices(device.deviceId)
        let svc = svcs.find((s: BleService) => s.uuid == svc_target)
        if (!svc) {
            throw new Error("Service not found")
        }
        console.log(svc);
        let chr = svc?.characteristics.find((c: BleCharacteristic) => c.uuid.includes(chr_target))
        console.log(chr);
        
        if (!chr) {
            throw new Error("Characteristic not found")
        }     
        for (let i = 0; i <= raw.length; i += CHUNK_SIZE) {
            const chunk = raw.slice(i, i + CHUNK_SIZE)
            const data = textToDataView(chunk.join(''))
            await BleClient.write(device.deviceId, svc.uuid, chr.uuid, data, {timeout: timeout}) 
            await this._delay(50)
        }

    }
    
    private static _delay(ms:number): Promise<void> {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}
