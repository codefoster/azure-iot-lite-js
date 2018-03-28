## D2C Messages

``` ts
import { HubClient } from 'hubclient';

let iothub = new HubClient('<connection string>');
await iothub.ready;

iothub.sendMessage("Hi, Azure, I'm HubClient!");
```

## C2D Messages

``` ts
import { HubClient } from 'hubclient';

let iothub = new HubClient('<connection string>');
await iothub.ready;

iothub.handleMessage(message => {
    console.log(`I hear you loud and clear, Azure. You said "${message}"`);
})

```

## Device Twin

## Method Invocation

``` ts
import { HubClient } from 'hubclient';

let iothub = new HubClient('<connection string>');
await iothub.ready;

iothub.addDirectMethod('doMagic', (request, response) => {
    console.log(request.payload);

    response.send(200, 'Input was written to log.', err => {
        //handle error
    });
});

```

I think we should support the former format where a raw function with both `request` and `response` in the signature is defined. We may also want to consider the following to make the calling pattern easier and possibly handle the very common case where the direct method does something simple...

``` ts
import { HubClient } from 'hubclient';

let iothub = new HubClient('<connection string>');
await iothub.ready;

iothub.addDirectMethod('doMagic', async payload => {
    console.log(payload);
    await someAsynchronousTask();
    return "done"; //will be returned as a 200 message to the service
});

```

## Choosing a Protocol

``` ts
import { HubClient, TransportProtocol } from 'hubclient';

let iothub = new HubClient('<connection string>', TransportProtocol.Mqtt);
await iothub.ready;

//do magic

```

