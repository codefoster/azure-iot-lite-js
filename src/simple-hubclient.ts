import { HubClient, Twin } from "./azure-iot-lite";
let iothub = new HubClient(process.env.DEVICE_CONN_STRING);

main();

async function main() {
    console.log('starting iot hub...');
    await iothub.ready;
    console.log('hub ready...');
    
    console.log('sending message...');
    iothub.sendMessage(`Hi, cloud. I'm a device!`);
    
    iothub.handleMessage(message => {
        console.log(`The cloud sent us ${message}`);
    });

    iothub.addDirectMethod('installFirmware', () => {
        //install firmware
    });

    iothub.twin.on('properties.desired.propety1', delta => {
        //handle desired property change
    });

    // iothub.twin.properties.reported.update({ property1: 72 });

    process.exit();
}