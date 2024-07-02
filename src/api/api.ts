import { Socket, io } from "socket.io-client";
import { RTC_CALL_API_EVENTS, RTC_CALL_COMMANDS, RTC_CALL_FUNCTIONS } from "./enums/enum";
import { RTCCallApiOptions } from "./types";
import { EndCallInterface, JoinCallInterface, SetAvatarInterface, SetDisplayNameInterface, SetSubtitleInterface, SetTitleInterface, ToggleCamInterface, ToggleMicInterface } from "./types/commands.interface";

class RTCCallApi {
    private socketUrl = 'https://webrtcapi.pactocoin.com';
    private domain: 'https://rtcall.pactocoin.com';
    private socket: Socket;
    private hostContainer: HTMLDivElement;

    constructor(private options: RTCCallApiOptions) {
        const { callId, interfaceConfig, userConfig, containerId } = options;
        console.log('callId: ', callId, 'interfaceConfig: ', interfaceConfig, 'domain: ',);
        this.socket = io(this.socketUrl, {
            transports: ['websocket', 'polling'],
            query: {
                callId: this.options.callId,
                isFrameAPI: true,
                participantId: this.options.userConfig.jobId,
            },
            auth: {
                token: '55b3f0b526ee7a9b69571af059536e1e4672dc5ccc1c0044'
            }
        });
        this.hostContainer = document.getElementById(containerId) as HTMLDivElement;
        this.loadDomain();
        // ... other initialization code ...
    }

    private loadDomain() {
        // /kld-14so-0ng?dispala=turnofcam
        const iframe = document.createElement('iframe');
        iframe.width = '100%'
        iframe.height = '100vh';
        iframe.allow = 'camera';
        iframe.allow = 'microphone';

        if (this.options.interfaceConfig.height) {
            const height = this.options.interfaceConfig.height.replace('%', 'vh')
            if (this.options.interfaceConfig.height.charAt(this.options.interfaceConfig.height.length - 1) == '%') {
                this.options.interfaceConfig.height = height;
                console.log('interface config: ', this.options.interfaceConfig)
                iframe.style.height = this.options.interfaceConfig.height;
                this.hostContainer.style.height = this.options.interfaceConfig.height;
            }
        }
        if (this.options.interfaceConfig.width) {
            iframe.style.width = this.options.interfaceConfig.width;
            this.hostContainer.style.width = this.options.interfaceConfig.width;
        }
        if (iframe && this.hostContainer) {
            iframe.src = `https://rtcall.pactocoin.com?callId=${this.options.callId}&displayName=${this.options.userConfig.displayName}&participantId=${this.options.userConfig.jobId}&title=${this.options.interfaceConfig.title}&subtitle=${this.options.interfaceConfig.subtitle}&muteMic=${this.options.interfaceConfig.muteMic}&muteCamera=${this.options.interfaceConfig.muteCam}&profilePicuteUrl=${this.options.userConfig.profilePicuteUrl}&color=${this.options.userConfig.color}`; //+ this.options.callId;

            this.hostContainer.append(iframe)
            console.log('iframe src: ', iframe.src)
        } else {
            console.error('Iframe element not found');
        }

        this.sendCommand(RTC_CALL_COMMANDS.JOIN_CALL, ({ callId: this.options.callId, jobId: this.options.userConfig.jobId, displayName: this.options.userConfig.displayName }));
    }

    addEventListener(eventName: RTC_CALL_API_EVENTS, callback: (data: any) => {}) {
        this.socket.on('message', ({ eventType, data }: { eventType: RTC_CALL_API_EVENTS; data: any }) => {
            if (eventType === eventName) {
                callback(data);
            }
        });
    }

    sendCommand(command: RTC_CALL_COMMANDS, data: JoinCallInterface | EndCallInterface | ToggleMicInterface | ToggleCamInterface | SetDisplayNameInterface | SetAvatarInterface | SetTitleInterface | SetSubtitleInterface) {
        const payload = {
            eventType: command,
            data,
        }
        this.socket.emit('meesage', payload);
    }
    async getCallInfo() {
        return await this.socket.emitWithAck(RTC_CALL_FUNCTIONS.GET_CALL_INFO, { callId: this.options.callId }, (callInfo: any) => callInfo);
    }
    async getParticipantInfo() {
        return await this.socket.emitWithAck(RTC_CALL_FUNCTIONS.GET_PARTICIPANT_INFO, ({ callId: this.options.callId, jobId: this.options.userConfig.jobId }), (participantInfo: any) => participantInfo);
    }
}

export default RTCCallApi;

