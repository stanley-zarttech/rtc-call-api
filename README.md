import { Socket, io } from "socket.io-client";
import { RTC_CALL_API_EVENTS, RTC_CALL_COMMANDS, RTC_CALL_FUNCTIONS } from "./enums/enum";
import { RTCCallApiOptions } from "./types";

class RTCCallApi {
    private socketUrl = 'chats.pactocoin.com';
    private domain: 'https://rtc.jobpro.app/kld-14so-0ng';
    private socket: Socket;
    private hostContainer: HTMLIFrameElement;

    constructor(private options: RTCCallApiOptions) {
        const { callId, interfaceConfig, userConfig, containerId } = options;
        console.log('callId: ', callId, 'interfaceConfig: ', interfaceConfig, 'domain: ',);
        this.socket = io(this.socketUrl);
        this.hostContainer = document.getElementById(containerId) as HTMLIFrameElement;
        this.loadDomain();
        // ... other initialization code ...
    }

    private loadDomain() {
        // /kld-14so-0ng?dispala=turnofcam
        const iframe = document.createElement('iframe');
        iframe.width = '100%'
        iframe.height = '100%'

        // if (this.options.interfaceConfig.height) {
        //     iframe.style.height = this.options.interfaceConfig.height;
        //     this.hostContainer.style.height = this.options.interfaceConfig.height;
        // }
        // if (this.options.interfaceConfig.width) {
        //     iframe.style.width = this.options.interfaceConfig.width;
        //     this.hostContainer.style.width = this.options.interfaceConfig.width;
        // }

        if (iframe && this.hostContainer) {
            this.hostContainer.src = `https://instantpower.com.ng?displayName=${this.options.userConfig.displayName}&jobId=${this.options.userConfig.jobId}&width=${this.options.interfaceConfig.width}&height=${this.options.interfaceConfig.height}&title=${this.options.interfaceConfig.title}&subtitle=${this.options.interfaceConfig.subtitle}`; //+ this.options.callId;

            // this.hostContainer.append(iframe)
        } else {
            console.error('Iframe element not found');
        }
    }

    addEventListener(eventName: RTC_CALL_API_EVENTS, callback: () => void) {
        this.socket.on(eventName, callback);
    }

    sendCommand(command: RTC_CALL_COMMANDS, data: any) {
        this.socket.emit(command, data);
    }
    async getCallInfo() {
        return await this.socket.emitWithAck(RTC_CALL_FUNCTIONS.GET_CALL_INFO, { callId: this.options.callId }, (callInfo: any) => callInfo);
    }
    async getParticipantInfo() {
        return await this.socket.emitWithAck(RTC_CALL_FUNCTIONS.GET_PARTICIPANT_INFO, ({ callId: this.options.callId, jobId: this.options.userConfig.jobId }), (participantInfo: any) => participantInfo);
    }
}

export default RTCCallApi;

