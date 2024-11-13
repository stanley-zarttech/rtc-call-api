import { Socket, io } from "socket.io-client";
import { RTC_CALL_API_EVENTS, RTC_CALL_COMMANDS, RTC_CALL_FUNCTIONS } from "./enums/enum";
import { RTCCallApiOptions } from "./types";
import { EventCallback } from "./types/commands.interface";

class RTCCallApi {
    private socketUrl = process.env.SOCKET_URL || 'https://webrtcapi.pactocoin.com'; //'
    private socket: Socket;
    private hostContainer: HTMLDivElement;
    private eventListeners: { [eventType: string]: EventCallback[] } = {};
    token: string;

    constructor(private options: RTCCallApiOptions) {
        this.token = process.env.TOKEN;
        console.log('socketUrl and token: ', this.socketUrl, this.token);
        const { callId, interfaceConfig, userConfig, containerId } = options;
        console.log('container id: ', containerId)
        console.log('callId: ', callId, 'interfaceConfig: ', interfaceConfig, 'domain: ', process.env.DOMAIN, ' TOKEN: ', this.token);
        this.socket = io(this.socketUrl, {
            // transports: ['websocket', 'polling'],
            query: {
                meetingId: this.options.callId,
                // isIframeAPI: true,
                peerId: this.options.userConfig.jobId,
            },
            auth: {
                token: process.env.TOKEN
            }
        });
        console.log('socket: ', this.socket.io)
        this.hostContainer = document.getElementById(containerId) as HTMLDivElement;

        this.socket.on('connect', async () => {
            this.hostContainer.childNodes.item(0)?.remove()
            this.loadDomain();
            console.log('socket is successfully connected: ', this.socket.id);

            const res = await this.sendCommand(RTC_CALL_COMMANDS.JOIN_CALL, {
                meetingId: this.options.callId,
                peerId: this.options.userConfig.jobId,
                peerName: this.options.userConfig.displayName
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
        this.socket.on('connect_error', (error) => {
            this.hostContainer?.childNodes?.item(0)?.remove();
            const errorContainer = document.createElement('div');
            errorContainer.id = 'error-container';
            errorContainer.style.display = 'flex';
            errorContainer.style.flexDirection = 'column';
            errorContainer.style.color = 'red';
            errorContainer.style.justifyContent = 'center';
            errorContainer.style.alignItems = 'center';
            errorContainer.style.height = '100%';

            const button = document.createElement('button');
            button.style.backgroundColor = 'red';
            button.style.color = 'white';
            button.style.width = 'fit-content';
            button.style.padding = '10px 20px'
            button.style.height = '100%';
            button.style.border = 'none';
            button.style.borderRadius = '10px';

            button.id = 'submit';
            button.value = 'Leave Call';
            button.innerHTML = 'Leave Call'

            const h1 = document.createElement('h3');
            h1.innerText = 'Sorry, we could not connect you to the call.';
            errorContainer.append(h1);
            errorContainer.append(button);
            if (!document.getElementById('error-container'))
                this.hostContainer.append(errorContainer);

            button.addEventListener('click', () => {
                console.log('leaving the call because of error');
                (this.eventListeners[RTC_CALL_COMMANDS.LEAVE_CALL] ?? []).forEach(callback => callback(error))

            })
        })
    }
    private loadDomain() {
        const iframe = document.createElement('iframe');
        iframe.id = 'call-iframe'
        iframe.width = '100%';
        iframe.height = '100vh';
        iframe.allow = 'camera; microphone;fullscreen; autoplay;display-capture;';
        iframe.style.border = 'none';

        if (this.options.interfaceConfig.height) {
            // const height = this.options.interfaceConfig.height.replace('%', 'vh');
            // if (this.options.interfaceConfig.height.endsWith('%')) {
            //     this.options.interfaceConfig.height = height;
            iframe.style.height = this.options.interfaceConfig.height;
            //     this.hostContainer.style.height = height;
            // }
        }
        if (this.options.interfaceConfig.width) {
            iframe.style.width = this.options.interfaceConfig.width;
            // this.hostContainer.style.width = this.options.interfaceConfig.width;
        }
        console.log('iframe width: ', iframe.width, ' iframe height: ', iframe.height)
        if (iframe && this.hostContainer) {
            const domain = process.env.DOMAIN || 'https://rtcall.pactocoin.com';
            console.log('Domain: ', domain)
            iframe.src = `${domain}?meetingId=${this.options.callId}&name=${this.options.userConfig.displayName}&peerId=${this.options.userConfig.jobId}&title=${this.options.interfaceConfig.title}&subtitle=${this.options.interfaceConfig.subtitle}&muteMic=${this.options.interfaceConfig.muteMic}&muteCamera=${this.options.interfaceConfig.muteCam}&profilePicuteUrl=${this.options.userConfig.profilePicuteUrl}&color=${this.options.userConfig.color}&backgroundColor=${this.options.interfaceConfig.backgroundColor}&textColor=${this.options.interfaceConfig.textColor}`;
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
        // console.log('command: ', command);
        const payload = {
            eventType: command,
            data,
        };
        console.log('Send command: ', payload);
        return new Promise((resolve: any, reject: any) => {
            this.socket.emit('message', payload, (error: any, response: any) => {
                if (error) {
                    // console.log('Command error: ', error)
                    reject(error);
                } else {
                    // console.log('Command Response: ', response)
                    resolve(response);
                }
            });
        });
    }

    async getCallInfo() {

        const payload = {
            eventType: RTC_CALL_FUNCTIONS.GET_CALL_INFO,
            data: {},
        };
        return this.sendCommand(RTC_CALL_COMMANDS.GET_CALL_INFO, {})
    }

    async getParticipantInfo() {
        return await this.socket.emitWithAck(RTC_CALL_FUNCTIONS.GET_PARTICIPANT_INFO, { callId: this.options.callId, jobId: this.options.userConfig.jobId }, (participantInfo: any) => participantInfo);
    }
}

export default RTCCallApi;
