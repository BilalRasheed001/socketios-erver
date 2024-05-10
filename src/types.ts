type EventOptionType = {
    CONNECTION: string;
    LOGIN: string;
    FROM_SERVER: string;
    END_STREAM_FROM_BOT: string;
    STOP_GENERATING_RESPONSE: string;
    DISCONNECT: string;
};
  
export const EventOption: EventOptionType = {
    CONNECTION: "connection",
    LOGIN: "login",
    FROM_SERVER: "FromServer",
    END_STREAM_FROM_BOT: "endStreamFromBot",
    STOP_GENERATING_RESPONSE: "stop_generating_reponse",
    DISCONNECT: "disconnect"
};

type EventEmitOptionType ={
    TO_CLIENT: string;
    END_STREAM:string;
}

export const EventEmitOption:EventEmitOptionType ={
    TO_CLIENT: "ToClient",
    END_STREAM: "endStream",
}
