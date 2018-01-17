import { Client, Message } from 'azure-iot-device';
import { Twin } from 'azure-iot-device/lib/twin';
export { Twin } from 'azure-iot-device/lib/twin';

require('dotenv').config();

export class HubClient {
    private client: Client;
    deviceId: string;
    twin: Twin;
    ready;

    public constructor(private connectionString: string, private protocol: TransportProtocol = TransportProtocol.Amqp) {
        this.connectionString = connectionString;

        //extract the device id from the connection string
        this.deviceId = /DeviceId=([^;]*)/.exec(this.connectionString)[1];
        this.ready = this.initialize();
    }

    async initialize() {
        //import the appropriate protocol package
        let protocolPackageName = 'azure-iot-device-';
        switch(this.protocol) {
            case TransportProtocol.Amqp: protocolPackageName += 'amqp'; break;
            case TransportProtocol.Http: protocolPackageName += 'http'; break;
            case TransportProtocol.Mqtt: protocolPackageName += 'mqtt'; break;
        }
        const protocolPackage = await import(protocolPackageName);
        const clientFromConnectionString = protocolPackage.clientFromConnectionString;

        this.client = clientFromConnectionString(this.connectionString);
        await new Promise((resolve, reject) => {
            this.client.open(err => {
                if (!err) {
                    //get the device twin
                    this.client.getTwin((err, twin) => {
                        if (!err) this.twin = twin;
                        else reject(err);
                    });
                    resolve()
                }
                else
                    reject(err);
            });
        });
        return;
    }

    addDirectMethod(name, action) {
        this.client.onDeviceMethod(name, action);
    }

    /**
     * Sends a D2C message. The deviceId is added to the payload and payload is added to a 'value' property.
     */
    sendMessage(payload: any) {
        let message = new Message(JSON.stringify({
            deviceId: this.deviceId,
            value: payload
        }));
        this.client.sendEvent(message, (err, res) => {
            if (err) console.log(err);
        });
    }

    /**
     * Configure a handler function for a C2D message.
     */
    handleMessage(action) {
        this.client.on('message', msg => action(msg.data));
    }

}

export enum TransportProtocol {
    Http,
    Amqp,
    Mqtt
}
