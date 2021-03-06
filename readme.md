# Azure IoT Lite
This package makes it easier to connect to an Azure IoT Hub. It provides a very simple and sensible asynchronous flow for the client's connection and the creation of a device twin.

So far, this is an **early release**. Expect a lot of missing functionality. Contributions welcome.

## Installation

``` bash
npm i azure-iot-lite
```

## Usage

``` ts
import { HubClient } from 'azure-iot-lite';

let iothub = new HubClient('<connection string>');
await iothub.ready;

iothub.handleMessage(message => {
    console.log(`The cloud sent us ${message}`);
})

iothub.sendMessage("Hi, cloud. I'm a device");
```

You can see this library abstracts away a lot of the difficulty of using the raw Node.js SDK for Azure IoT Hub including:

* No need to import the `azure-iothub-device` and your appropriate protocol specific package (i.e. `azure-iothub-device-amqp`). The default protocol for Azure IoT Lite is AMQP. You can change it though. See below.
* No need to use the callback pattern for opening the connection and getting a twin. Just `await iothub.ready` and trust that everything's set up for you.
* Handling C2D messages and sending D2C messages is syntactically simpler. The Device ID is automatically added to the message payload.
* The Device ID is parsed out of the connection string you provide and made available to you.
* Configuring direct methods is a snap. See below.

## Choosing a Protocol

``` ts
import { HubClient, TransportProtocol } from 'azure-iot-lite';

let iothub = new HubClient('<connection string>', TransportProtocol.Mqtt);
await iothub.ready;

//do magic

```

## Configuring Direct Methods

``` ts
import { HubClient } from 'azure-iot-lite';

let iothub = new HubClient('<connection string>');
await iothub.ready;

iothub.addDirectMethod('updateFirmware', (request, response) => {
    //update the firmware
});
```

Here's a more robust sample that uses a number of IoT Hub functions including twin properties...

``` ts
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
```
