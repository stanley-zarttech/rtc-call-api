export interface RTCCallApiOptions {
    callId: string;
    containerId: string;
    userConfig: UserConfig,
    interfaceConfig: InterfaceConfig
}

export interface InterfaceConfig {
    width: string;
    height: string,
    title: string,
    subtitle: string;
    muteMic: boolean;
    muteCam: boolean;
}

export interface UserConfig {
    color: string;
    profilePicuteUrl: string;
    displayName: string;
    jobId: string;
}