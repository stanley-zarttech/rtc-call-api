"use strict";
define("api/api", ["require", "exports", "../../node_modules/socket.io-client/build/esm/index"], function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RTCCallApi {
        constructor(options) {
            const { callId, displayName, domain, socketUrl } = options;
            this.socket = (0, index_1.io)(socketUrl);
            this.iframe = document.getElementById(domain);
            // ... other initialization code ...
        }
        addEventListener(eventName, callback) {
            this.socket.on(eventName, callback);
        }
        sendCommand(command, data) {
            this.socket.emit(command, data);
        }
    }
    exports.default = RTCCallApi;
});
