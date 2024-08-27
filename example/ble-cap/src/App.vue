<template>
  <!-- @vue-skip -->
  <div>
    <div class="w-screen h-screen bg-neutral-800 p-4">

      <div class="w-full h-fit grid grid-cols-2 text-white bg-black bg-opacity-75 p-4 rounded-md">
        <div class="w-full text-center col-span-2 border-b">
          State
        </div>
        <div class="flex flex-col gap-2 items-center">
          <span>Connected</span>
          <span class="p-2 rounded-full"
            :class="{ 'bg-red-500': !ble.connected, 'bg-green-500': ble.connected }"></span>
        </div>
        <div v-if="ble.device" class="flex flex-col gap-2 items-center">
          <span>Name Device</span>
          <span>{{ ble.device.name ?? ble.device.deviceId }}</span>
        </div>
      </div>

      <div class="w-full h-fit flex flex-col p-4 bg-black bg-opacity-75 rounded-md mt-20 text-white">
        <div class="w-full flex justify-between items-center border-b pb-6">
          <span>Devices</span>
          <div @click="scan" class="btn btn-outline btn-primary btn-sm">Scan</div>
        </div>
        <div class="w-full h-[500px] overflow-auto " :class="{ 'skeleton': ble.devices.length <= 0 }">
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

            <div @click="connect(device)" class="btn btn-outline btn-info">Connect</div>
          </div>
        </div>


      </div>


    </div>
  </div>
</template>

<script lang="ts">
//@ts-ignore
import { BleDevice } from '@capacitor-community/bluetooth-le';
import { Ble, ESCPOS_LineFeed, PrinterBLE, } from "capacitor-plugin-ble-escpos"

export default {

  data() {
    return {
      ble: null,
    }
  },

  methods: {

    async connect(device: BleDevice) {
      await Ble.connect(device)
      let printer = new PrinterBLE(device)
      function randomStr(len: number) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        let result = ''
        for (let i = 0; i < len; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        result += ' '
        return result
      }

      const a1 = Array.from({ length: 100 }, (_, idx) => `${idx} ${randomStr(5).repeat(5)} ${ESCPOS_LineFeed}`)
      const data = [...a1, ESCPOS_LineFeed, ESCPOS_LineFeed, ESCPOS_LineFeed]
      console.log(data);

      await printer.print(data);
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