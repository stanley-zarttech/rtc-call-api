import { Socket, io } from "socket.io-client";
import { RTC_CALL_API_EVENTS, RTC_CALL_COMMANDS, RTC_CALL_FUNCTIONS } from "./enums/enum";
import { RTCCallApiOptions } from "./types";
import { EventCallback } from "./types/commands.interface";

class RTCCallApi {
    private socketUrl = process.env.SOCKET_URL;
    private socket: Socket;
    private hostContainer: HTMLDivElement;
    private eventListeners: { [eventType: string]: EventCallback[] } = {};

    constructor(private options: RTCCallApiOptions) {
        console.log('socketUrl and token: ', this.socketUrl, process.env.TOKEN)
        const { callId, interfaceConfig, userConfig, containerId } = options;
        console.log('callId: ', callId, 'interfaceConfig: ', interfaceConfig, 'domain: ',);
        this.socket = io(this.socketUrl, {
            transports: ['websocket', 'polling'],
            query: {
                callId: this.options.callId,
                isIframeAPI: true,
                participantId: this.options.userConfig.jobId,
            },
            auth: {
                token: process.env.TOKEN
            }
        });
        this.hostContainer = document.getElementById(containerId) as HTMLDivElement;

        this.socket.on('connect', async () => {
            this.loadDomain();
            console.log('socket is successfully connected: ', this.socket.id);

            const res = await this.sendCommand(RTC_CALL_COMMANDS.JOIN_CALL, {
                callId: this.options.callId,
                participantId: this.options.userConfig.jobId,
                displayName: this.options.userConfig.displayName
            });
            console.log('res: ', res);

            this.socket.on('message', ({ eventType, data }: { eventType: string; data: any }) => {
                console.log('event from server: ', data);
                if (this.eventListeners[eventType]) {
                    this.eventListeners[eventType].forEach(callback => callback(data));
                } else {
                    console.error(`No listeners found for event type: ${eventType}`);
                }
            });
        });
    }

    private loadDomain() {
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100vh';
        iframe.allow = 'camera; microphone';

        if (this.options.interfaceConfig.height) {
            const height = this.options.interfaceConfig.height.replace('%', 'vh');
            if (this.options.interfaceConfig.height.endsWith('%')) {
                this.options.interfaceConfig.height = height;
                iframe.style.height = height;
                this.hostContainer.style.height = height;
            }
        }
        if (this.options.interfaceConfig.width) {
            iframe.style.width = this.options.interfaceConfig.width;
            this.hostContainer.style.width = this.options.interfaceConfig.width;
        }
        if (iframe && this.hostContainer) {
            const domain = process.env.DOMAIN;
            console.log('Domain: ', domain)
            iframe.src = `${domain}?callId=${this.options.callId}&displayName=${this.options.userConfig.displayName}&participantId=${this.options.userConfig.jobId}&title=${this.options.interfaceConfig.title}&subtitle=${this.options.interfaceConfig.subtitle}&muteMic=${this.options.interfaceConfig.muteMic}&muteCamera=${this.options.interfaceConfig.muteCam}&profilePicuteUrl=${this.options.userConfig.profilePicuteUrl}&color=${this.options.userConfig.color}`;
            this.hostContainer.append(iframe);
            console.log('iframe src: ', iframe.src);
        } else {
            console.error('Iframe element not found');
        }
    }

    addEventListener<T = any>(eventType: string, callback: EventCallback<T>): void {
        console.log('adding event listener: ', eventType);
        if (!this.eventListeners[eventType]) {
            this.eventListeners[eventType] = [];
        }
        this.eventListeners[eventType].push(callback as EventCallback);
        console.log('Listeners: ', this.eventListeners);
    }

    removeEventListener<T = any>(eventType: string, callback: EventCallback<T>): void {
        if (this.eventListeners[eventType]) {
            this.eventListeners[eventType] = this.eventListeners[eventType].filter(cb => cb !== callback);
        } else {
            console.error(`No listeners found for event type: ${eventType}`);
        }
    }

    sendCommand(command: RTC_CALL_COMMANDS, data: any) {
        console.log('command: ', command);
        const payload = {
            eventType: command,
            data,
        };
        console.log('Send command: ', payload);
        return new Promise((resolve: any, reject: any) => {
            this.socket.emit('message', payload, (response: any, error: any) => {
                if (!error) {
                    resolve(response);
                } else {
                    reject(error);
                }
            });
        });
    }

    async getCallInfo() {
        return await this.socket.emitWithAck(RTC_CALL_FUNCTIONS.GET_CALL_INFO, { callId: this.options.callId }, (callInfo: any) => callInfo);
    }

    async getParticipantInfo() {
        return await this.socket.emitWithAck(RTC_CALL_FUNCTIONS.GET_PARTICIPANT_INFO, { callId: this.options.callId, jobId: this.options.userConfig.jobId }, (participantInfo: any) => participantInfo);
    }
}

export default RTCCallApi;
