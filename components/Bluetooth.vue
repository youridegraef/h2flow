<template>
  <div class="flex items-center space-x-4">
    <div class="flex flex-row gap-2">
        <img v-if="status == 'Status: Disconnected'" src="~/assets/StatusSymbolRed.svg" />
        <img v-else="status == 'Status: Connected'" src="~/assets/StatusSymbolGreen.svg" />
        <img v-else="" src="~/assets/StatusSymbolOrange.svg" />
        <p>{{ status }}</p>
    </div>
    <button class="bg-blue-700 px-6 py-1 rounded-lg text-white uppercase" @click="connect">Connect</button>
    <button class="bg-green-700 px-6 py-1 rounded-lg text-white uppercase" @click="test">Refresh</button>
    <button class="bg-blue-700 px-6 py-1 rounded-lg text-white uppercase hidden" @click="ping">Ping</button>
    <button v-if="bleCharacteristic" @click="calibrate">Calibrate</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const status = ref("Status: Disconnected");
    const bleCharacteristic = ref<BLECharacteristic | null>(null);
    const encoder = new TextEncoder();
    let receivedChunks: string[] = [];
    let calibrationStep = 0;

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    interface BLECharacteristic {
      writeValue(value: ArrayBuffer): Promise<void>;
    }

    const writeToCharacteristic = async (characteristic: BLECharacteristic, data: string): Promise<void> => {
      try {
        const encoded = encoder.encode(data);
        if (encoded.length > 20) {
          throw new Error(`Data too long: ${encoded.length} bytes (max 20 bytes)`);
        }
        const value = new Uint8Array(20);
        value.set(encoded);
        await characteristic.writeValue(value.buffer);
        console.log("Write successful:", data);
      } catch (error) {
        console.error("Write failed:", error instanceof Error ? error.message : String(error));
        throw error;
      }
    };

    const connect = async () => {
      try {
        const serviceUuid = "19b10000-e8f2-537e-4f6c-d104768a1214";
        const characteristicUuid = "19b10001-e8f2-537e-4f6c-d104768a1214";

        const device = await (navigator as any).bluetooth.requestDevice({
          filters: [{ services: [serviceUuid] }],
        });

        console.log("Device selected:", device);
        await delay(100);

        const server = await device.gatt.connect();
        console.log("GATT server connected:", server);
        await delay(100);

        const service = await server.getPrimaryService(serviceUuid);
        console.log("Primary service obtained:", service);
        await delay(100);

        const characteristic = await service.getCharacteristic(characteristicUuid);
        console.log("Characteristic obtained:", characteristic);
        await delay(100);

        await characteristic.startNotifications();
        bleCharacteristic.value = characteristic;
        status.value = "Status: Connected";

        const now = new Date();
        const currentTime = Math.round(now.getTime() / 1000);
        await writeToCharacteristic(characteristic, "TIME:" + currentTime.toString());
        console.log("Current time sent:", currentTime);

        characteristic.addEventListener("characteristicvaluechanged", (event: any) => {
          try {
            const value = new Uint8Array(event.target.value.buffer);
            const decoder = new TextDecoder();
            const text = decoder.decode(value);

            console.log("Received chunk:", text);

            if (text.includes("\n")) {
              console.log("Complete entries found:", receivedChunks);

              const processedData = receivedChunks
                .map((chunk) => {
                  const [timestamp, value] = chunk.split(":");
                  if (!timestamp || !value) return null;

                  const date = new Date(parseInt(timestamp) * 1000);
                  const formattedDate = date.toISOString().replace("T", " ").split(".")[0];

                  return {
                    user_id: 1,
                    date: formattedDate,
                    weight: value.trim(),
                  };
                })
                .filter((entry) => entry !== null);

              console.log("Processed data:", processedData);

              // Uncomment and adjust the following lines to send data to your API
            //   fetch("https://192.168.123.16/api/sensor-data", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify(processedData),
            // //   mode: "no-cors",
            // })
            //   .then((response) => {
            //     // if (!response.ok) throw new Error("Network response was not ok");
            //     return response.json();
            //   })
            //   .then((data) => console.log("API response:", data))
            //   .catch((error) => console.error("Error:", error));
                const { data } = useFetch('https://192.168.123.16/api/sensor-data', {
                    method: "POST",
                    headers: {
                "Content-Type": "application/json",
              },
                    body: {
                        data: processedData,
                    },
                })
                
              receivedChunks = [];
            } else {
              receivedChunks.push(text.trim());
            }
          } catch (error) {
            console.error("Error processing BLE data:", error);
            receivedChunks = [];
          }
        });
      } catch (error) {
        console.error("Error:", error);
        status.value = "Status: Error";
      }
    };

    const test = () =>{
        const { data } = useFetch('https://192.168.123.16/api/sensor-data', {
                    method: "POST",
                    headers: {
                "Content-Type": "application/json",
              },
                    body: {
                        data: [
        {
            "user_id": 1,
            "date": "2024-11-13T12:22:33",
            "weight": 20
        },
        {
            "user_id": 1,
            "date": "2024-11-13T12:22:33",
            "weight":19
        }
    ],
                    },
                })
    }

    const calibrate = async () => {
      const characteristic = bleCharacteristic.value;
      if (!characteristic) {
        console.error("Not connected to device");
        return;
      }

      try {
        await writeToCharacteristic(characteristic, `CAL:${calibrationStep}`);
        console.log("Calibration step sent:", calibrationStep);
        calibrationStep++;
      } catch (error) {
        console.error("Error sending calibration step:", error);
      }
    };

    const ping = async () => {
      const characteristic = bleCharacteristic.value;
      if (!characteristic) {
        console.error("Not connected to device");
        return;
      }

      try {
        await writeToCharacteristic(characteristic, "CMD:ping");
        console.log("Ping sent");
      } catch (error) {
        console.error("Error sending ping:", error);
      }
    };

    return {
      status,
      bleCharacteristic,
      connect,
      calibrate,
      ping,
      test
    };
  },
});
</script>

<style scoped>
/* Add any additional styles here */
</style>