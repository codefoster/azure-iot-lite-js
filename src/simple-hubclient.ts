import { HubClient, Twin } from "./azure-iot-lite";
let iothub = new HubClient('{ CONNECTION STRING }');

async function main() {
    await iothub.ready;
    
    iothub.sendMessage('test');

    iothub.handleMessage(message => {
        //handle message
    });

    iothub.addDirectMethod('installFirmware', () => {
        //install firmware
    });

    iothub.twin.on('properties.desired.temperature', delta => {
        //handle desired property change
    });

    iothub.twin.properties.reported.update({ temperature: 72 });
}

