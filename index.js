var ssdp = require("peer-ssdp");
var peer = ssdp.createPeer();
var interval;
/**
 * handle peer ready event. This event will be emitted after `peer.start()` is called.
 */
peer.on("ready", function () {
    console.log("Ready");
    // handle ready event
    // send ssdp:alive messages every 1s
    // {{networkInterfaceAddress}} will be replaced before
    // sending the SSDP message with the actual IP Address of the corresponding
    // Network interface. This is helpful for example in UPnP for LOCATION value
    interval = setInterval(function () {
        peer.alive({
            ST: "urn:schemas-upnp-org:device:MediaRenderer:1",
            SERVER: "...",
            USN: "...",
            LOCATION: "http://{{networkInterfaceAddress}}/device-desc.xml",
        });
    }, 1000);
    // shutdown peer after 10 s and send a ssdp:byebye message before
    setTimeout(function () {
        clearInterval(interval);
        // Close peer. Afer peer is closed the `close` event will be emitted.
        peer.close();
    }, 10000);
});

// handle SSDP NOTIFY messages.
// param headers is JSON object containing the headers of the SSDP NOTIFY message as key-value-pair.
// param address is the socket address of the sender
peer.on("notify", function (headers, address) {
    // handle notify event
});

// handle SSDP M-SEARCH messages.
// param headers is JSON object containing the headers of the SSDP M-SEARCH message as key-value-pair.
// param address is the socket address of the sender
peer.on("search", function (headers, address) {

    console.log("headers: ", headers);
    console.log("address: ", address);
    // handle search request
    // reply to search request
    // Also here the {{networkInterfaceAddress}} will be replaced before
    // sending the SSDP message with the actual IP Address of the corresponding
    // Network interface.
    peer.reply({
        "CACHE-CONTROL" : "max-age=60",
        "EXT": "",
        LOCATION: "http://{{networkInterfaceAddress}}/device-desc.xml",
        SERVER: "osx/10 UPnP/1.1",
        ST: headers.ST,
        USN: "...",
    }, address);
});

// handle SSDP HTTP 200 OK messages.
// param headers is JSON object containing the headers of the SSDP HTTP 200 OK  message as key-value-pair.
// param address is the socket address of the sender
peer.on("found", function (headers, address) {
    // handle found event
});

// handle peer close event. This event will be emitted after `peer.close()` is called.
peer.on("close", function () {
    // handle close event
});

// Start peer. Afer peer is ready the `ready` event will be emitted.
peer.start();