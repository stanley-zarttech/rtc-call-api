export enum RTC_CALL_API_EVENTS {
    CALL_JOINED = 'CALL_JOINED',
    PARTICIPANT_JOINED = 'participantJoined',
    PARTICIPANT_LEFT = 'participantLeft',
    LEFT_CALL = 'leftCall',
    CALL_ENDED = 'CALL_ENDED'
}

export enum RTC_CALL_COMMANDS {
    JOIN_CALL = 'joinCall',
    END_CALL = 'endCALL',
    LEAVE_CALL = 'leaveCall',
    TOGGLE_MIC = 'TOGGLE_MIC',
    TOGGLE_CAM = 'TOGGLE_CAM',
    SET_AVATAR = 'SET_AVATAR',
    SET_DISPLAY_NAME = 'SET_DISPLAY_NAME',
    SET_TITLE = 'SET_TITLE',
    SET_SUBTITLE = 'SET_SUBTITLE',
    NEW_PEER = 'newPeer',
    IS_REJOINING = 'isRejoining',
    GET_CALL_INFO = "getCallInfo"
}
export enum RTC_CALL_FUNCTIONS {
    GET_CALL_INFO = 'getCallInfo',
    GET_PARTICIPANT_INFO = 'GET_PARTICIPANT_INFO',
    GET_PARTICIPANT_AVATAR_URL = 'GET_PARTICIPANT_AVATAR_URL'
}         