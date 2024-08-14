import { BleClient, type BleDevice, type ScanResult } from "@capacitor-community/bluetooth-le";
import { Capacitor } from "@capacitor/core";

export class Ble {

    public devices: BleDevice[] = []
    public loading: boolean = false
    public device: BleDevice | null = null
    public connected: boolean = false
    
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

    private async _connected():Promise<boolean> {
        const devices:BleDevice[] = await BleClient.getConnectedDevices([]);
        const found = devices.find((device:BleDevice) => device.deviceId === this.device?.deviceId)
        return found ? true : false
    }

    public async connect(device: BleDevice) {
        await BleClient.connect(device.deviceId, (deviceId:string) => {
            this.device = null
            
            console.log('Devices disconnected: ' + deviceId)
        });
        this.device = device
        this.connected = await this._connected()
    }   

    public async disconnect() {
        if (this.device) {
            await BleClient.disconnect(this.device.deviceId)
            this.device = null
            this.connected = await this._connected()
        }
    }
    
    
}
