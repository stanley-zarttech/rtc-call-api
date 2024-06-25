export interface JoinCallInterface {
    callId: string;
    displayName: string;
    jobId: string;
}

export interface EndCallInterface {
    callId: string;
    displayName: string;
    jobId: string;
}

export interface ToggleCamInterface {
    callId: string;
    jobId: string;
    muteCam: boolean;
}

export interface ToggleMicInterface {
    callId: string;
    jobId: string;
    muteMic: boolean;
}

export interface SetAvatarInterface {
    jobId: string;
    callId: string;
    avatarUrl: string;
}

export interface SetDisplayNameInterface {
    jobId: string;
    callId: string;
    displayName: string;
}

export interface SetTitleInterface {
    jobId: string;
    callId: string;
    title: string;
}
export interface SetSubtitleInterface {
    jobId: string;
    callId: string;
    subtitle: string;
}