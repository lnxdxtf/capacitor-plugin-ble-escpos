<template>
  <!-- @vue-skip -->
  <div>
    <div class="w-screen h-screen flex flex-col gap-4 bg-neutral-800 p-4">

      <div class="w-full h-fit grid grid-cols-2 text-white bg-black bg-opacity-75 p-4 rounded-md">
        <div class="w-full text-center col-span-2 border-b">
          State
        </div>
        <div class="flex flex-col gap-2 items-center">
          <span>Connection Status</span>
          <span class="p-2 rounded-full"
            :class="{ 'bg-red-500': !printer || !printer.device, 'bg-green-500': printer && printer.device }"></span>
        </div>
        <div v-if="printer" class="flex flex-col gap-2 items-center">
          <span>Name Device</span>
          <span>{{ printer.device.name ?? printer.device.deviceId }}</span>
        </div>
      </div>

      <div v-if="ble && !printer"
        class="w-full h-fit flex flex-col p-4 bg-black bg-opacity-75 rounded-md mt-20 text-white">
        <div class="w-full flex justify-between items-center border-b pb-6">
          <span>Devices</span>
        </div>
        <div class="w-full h-[500px] overflow-auto" :class="{ 'skeleton': ble.devices.length <= 0 }">
          <div v-for="device in ble.devices" :key="device.deviceId"
            class="relative w-full flex justify-between items-center border-b border-primary py-2">

            <div class="badge badge-info absolute -top-2 right-0">
              BLE
            </div>

            <div class="flex flex-col">
              <span>{{ device.name ?? 'Unknown' }}</span>
              <span>{{ device.deviceId }}</span>
              <span>{{ device.uuids }}</span>
            </div>

            <div v-if="printer && printer.device.deviceId == device.deviceId" @click="disconnect()"
              class="btn btn-outline btn-error">Disconnect</div>
            <div v-else @click="connect(device)" class="btn btn-outline btn-info">Connect</div>
          </div>
        </div>
      </div>

      <div v-if="ble && printer" class="w-full h-full flex flex-col gap-4 p-2">
        <div class="btn btn-outline btn-accent w-full" @click="printText">print text</div>
        <div class="btn btn-outline btn-accent w-full" @click="printQrcode">print qrcode</div>
        <div class="btn btn-outline btn-accent w-full btn-disabled" @click="printImage">print image</div>
        <div class="btn btn-error w-full p-4 my-4" @click="disconnect()">Disconnect</div>

      </div>

    </div>
  </div>
</template>

<script lang="ts">
//@ts-ignore
import { BleDevice } from '@capacitor-community/bluetooth-le';
//@ts-ignore
import { Ble, ESCPOSCOMMANDS, PrinterBLE, } from "capacitor-plugin-ble-escpos"


export default {

  data() {
    let data: {
      ble: Ble | null,
      printer: PrinterBLE | null,
    } = {
      ble: null,
      printer: null,
    }
    return data
  },

  methods: {

    async connect(device: BleDevice) {
      //@ts-ignore
      if (this.printer) {
        await this.disconnect()
      }
      await Ble.connect(device)

      //@ts-ignore
      this.printer = new PrinterBLE(device)
    },

    async disconnect() {
      //@ts-ignore
      if (this.printer) {
        //@ts-ignore
        await Ble.disconnect(this.printer!.device)
        //@ts-ignore
        this.printer = null
      }
    },

    async printText() {
      function randomStr(len: number) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        let result = ''
        for (let i = 0; i < len; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        result += ' '
        return result
      }

      const a1 = Array.from({ length: 10 }, (_, idx) => `${idx} ${randomStr(5).repeat(5)} ${ESCPOSCOMMANDS.LineFeed}`)
      const data = [...a1, ESCPOSCOMMANDS.LineFeed, ESCPOSCOMMANDS.LineFeed, ESCPOSCOMMANDS.LineFeed]
      console.log(data);
      //@ts-ignore
      await this.printer.print(data);
    },

    async printQrcode() {
      //@ts-ignore
      await this.printer!.printQrCode("test qrcode")
    },
    async printImage() {
      return
      const response = await fetch('/img/img-test.png');
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      const base64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });

      // @ts-ignore
      await this.printer!.printImage(base64);
    }

  },
  async mounted() {
    //@ts-ignore
    this.ble = new Ble()
    //@ts-ignore
    this.ble!.scan([])
  }
}


</script>