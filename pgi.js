import net from "node:net";

//######################//
// Reminders for myself //
//######################//

// 1:
// BYTES ARE IN LE/HOST ORDER
// INTS ARE IN BE/NETWORK ORDER

// 2:
// After socket connects, must send a startup message

// 3:
// The value types for each message I use will either be an int

//########//
//Helpers//
//#######//

function bufWriteInt(buf, num, bytes){
    if (!buf instanceof Buffer || typeof num !== "number" || typeof bytes !== "number"){
        throw new Error("bufWriteInt expects (Buffer, number, number).");
    }
    switch(bytes){
        case 2:
            buf.writeInt16BE(num);
            break;
        case 4:
            buf.writeInt32BE(num);
            break;
    }
}

const MsgDataType = Object.freeze({
    BYTE: 1,
    INT16: 2,
    INT32: 3,
    BYTEARRAY: INT32+1,
    INT16ARRAY: 4,
    INT32ARRAY: 5,
    STRING: 6
})

const BYTESIZE = 1;
const INT16SIZE = 2;
const INT32SIZE = 4;

// PostgreSQL Frontent/Backend Protocol version numbers
PGFBProtocolVersionMajor = 3;
PGFBProtocolVersionMinor = 0;


// This was the worst part of making this file
const PGMsgType = Object.freeze({
    AuthenticationOk: "R",                  // R
    AuthenticationKerberosV5: "R",          // R
    AuthenticationCleartextPassword: "R",   // R
    AuthenticationMD5Password: "R",         // R
    AuthenticationSCMCredential: "R",       // R
    AuthenticationGSS: "R",                 // R
    AuthenticationGSSContinue: "R",         // R
    AuthenticationSSPI: "R",                // R
    AuthenticationSASL: "R",                // R
    AuthenticationSASLontinue: "R",         // R
    AuthenticationSASLFinal: "R",           // R
    BackendKeyData: "K",                    // K
    Bind: "B",                              // B
    BindComplete: "2",                      // 2
    CancelRequest: 80877102,                // int32(80877102) Cancel request code
    Close: "C",                             // C
    CloseComplete: "3",                     // 3
    CommandComplete: "C",                   // C
    CopyData: "d",                          // d
    CopyDone: "c",                          // c
    CopyFail: "f",                          // f
    CopyInResponse: "G",                    // G
    CopyOutResponse: "H",                   // H
    CopyBothResponse: "W",                  // W
    DataRow: "D",                           // D
    Describe: "D",                          // D
    EmptyQueryResponse: "I",                // I
    ErrorResponse: "E",                     // E
    Execute: "E",                           // E
    Flush: "H",                             // H
    FunctionCall: "F",                      // F
    FunctionCallResponse: "V",              // V
    GSSENCRequest: 80877104,                // int32(80877104) GSSAPI Encryption request code
    GSSResponse: "p",                       // p
    NegotiateProtocolVersion: "v",          // v
    NoData: "n",                            // n
    NoticeResponse: "N",                    // N
    NotificationResponse: "A",              // A
    ParameterDescription: "t",              // t
    ParameterStatus: "S",                   // S
    Parse: "P",                             // P
    ParseComplete: "1",                     // 1
    PasswordMessage: "p",                   // p
    PortalSuspended: "s",                   // s
    Query: "Q",                             // Q
    ReadyForQuery: "Z",                     // Z
    RowDescription: "T",                    // T
    SASLInitialResponse: "p",               // p
    SASLResponse: "p",                      // p
    SSLRequest: 80877103,                   // int32(80877103) SSL Request Code
    StartupMessage: 196608,                 // in32(196608) protocol version number
    Sync: "S",                              // S
    Terminate: "X"                          // X
})


const PGParamFormatCodes = {
    text: 0,
    binary: 1
}

//########################//
//Frontend Message Classes//
//########################//



class PostgresqlMessage{
    
    msgIdent = "";
    msgContent = []; // Each of these can either be an object, string or array
    // If we have a number, it needs to be an object of the form:
    //  {
    //      bytes: 2,
    //      val: 5635
    //  }
    //
    //  Where the bytes will only ever be 2 or 4 (postgresql only deals with 16 and 32 bit numbers)

    constructor (ident, content){
        this.msgIdent = ident;
        this.msgContent = content;
    }

    push(data, type){
        if (data == null || typeof type !== "number"){
            throw new Error("Incorrect arguments to PostgresqlMessage.push()");
        }
        switch(type){
            case MsgDataType.BYTE:
                if (this.)
                break;
        }
    }

    // Returns a buffer object of all the data of the message to be sent
    toBuf(){
        let len = msgContent.reduce(this.msgReducer, 0);
        let buf = Buffer.alloc(len);
        
        return buf;
    }

    msgReducer(acc, el){
        if (typeof el === "string"){
            return acc + el.length + 1; // Extra byte for null terminator
        }
        else if (Array.isArray(el)){
            return acc + el.reduce(this.msgReducer, 0);
        }
        else if (typeof el === "object"){
            if (Object.keys(el).has("bytes")){
                return acc + el.bytes; // Gets the byte count
            }
        }
        throw new Error(`Invalid datatype in PostgresqlMessage.msgContent: ${val}`);
    }

    
    appendBuf(obj, type, arrLen)

    contentFlat()
}

//--UNFINISHED--//
class PGMSG_Bind extends PostgresqlMessage {

    msgIdent = PGMsgType["Bind"];       // 1 byte
    length = 2;                         // int 32
    destinationPortal = "\0";           // C-String
    sourcePreparedStatement = "\0";     // C-String
    parameterFormatCodesCount = 0;      // int 16
    parameterFormatCodes = [];          // int 16 array
    parameterValuesCount = 0;           // int 16
    parameterValuesLengths = [];        // int 32 array
    parameterValues = [];               // 2D Array of nbytes, n determined in above array
    resultColumnFormatCodesCount = 0    // int 16
    resultColumnFormatCodes = [];       // 16 bit int array
    
    constructor(destPortal, srcStmnt, paramsFmtValPair, resFmtCodes){
        this.destinationPortal = destPortal ?? "\0";
        this.sourcePreparedStatement = srcStmnt ?? "\0";
        this.parameterFormatCodes = paramFmtCodes ?? [];
        this.resultColumnFormatCodesCount = resFmtCodes ?? [];
    }

    toBuf(){
        
    }

}


//--UNFINISHED--//
class PGMSG_CancelRequest {
    // This may look weird as it has no "type" but the length + cancelCode act together as the type
    length = PGMsgType["CancelRequest"];    // int 32
    cancelCode = 80877102;                  // int 32
    processID = 0;                          // int 32
    key = 0;                                // int 32

    constructor(cancelCode) {
        this.cancelCode = cancelCode;
    }
}

//--UNFINISHED--//
class PGMSG_Close {

}

//--UNFINISHED--//
class PGMSG_CopyData {}

//--UNFINISHED--//
class PGMSG_CopyDone {}

//--UNFINISHED--//
class PGMSG_CopyFail {}

//--UNFINISHED--//
class PGMSG_Describe {}

//--UNFINISHED--//
class PGMSG_Execute {}

//--UNFINISHED--//
class PGMSG_Flush {}

//--UNFINISHED--//
class PGMSG_FunctionCall {}

//--UNFINISHED--//
class PGMSG_GSSENCRequest {}

//--UNFINISHED--//
class PGMSG_GSSResponse {}

//--UNFINISHED--//
class PGMSG_Parse {}

//--UNFINISHED--//
class PGMSG_PasswordMessage {}

//--UNFINISHED--//
class PGMSG_Query {}

//--UNFINISHED--//
class PGMSG_SASLInitialResponse {}

//--UNFINISHED--//
class PGMSG_SASLResponse {}

//--UNFINISHED--//
class PGMSG_SSLRequest {}

//--UNFINISHED--//
class PGMSG_StartupMessage {
    // Int32
    length = 0;

    // Int32(196608)
    protocolVersion = 196608;
    
    // String pairs
    parameters = {
        user: "",
        database: ""
    };

    constructor(user, database){
        if (user == null || database == null){
            console.error("User and Database must not be null!");
            return;
        }

        parameters.user = user;
        parameters.database = database;

    }

    measure(){
        let len = 0;
        len += INT32SIZE; // Length
        len += INT32SIZE; // ProtocolVersion
        for ([key, value] of Object.entries(this.parameters)){
            len += key.length;
            len += value.length;
            len += 1; // For the null terminator
        }
        this.length = length;
    }

    toMessage(){
        let buf = Buffer.alloc(len);
        let writenSize = 0;
        writenSize += buf.writeInt32BE(this.length);
        writenSize += buf.writeInt32BE(this.protocolVersion);
        for ([key, value] of Object.entries(this.parameters)){
            writenSize += buf.write(key + " " + value + "\0");
        }
        console.log(`Expected size: ${len}\n Real size: ${writenSize}`);
    }
}

//--UNFINISHED--//
class PGMSG_Sync {}

//--UNFINISHED--//
class PGMSG_Terminate extends PostgresqlMessage {
    msgIdent = PGMsgType["Terminate"];  // byte
    msgLength = 4;  // int32

    toBuf() {
        let buf = Buffer.alloc(msgLength + BYTESIZE);  // Extra byte for ident
        buf.writeInt8(msgIdent);
        buf.writeInt32BE(msgLength);
        return buf;
    }


}


//#######//
//Network//
//#######//

export const PGSQL_PORT = 5432;
let PGSocket = null;
const textEnc = new TextEncoder();

export class PGResult {
    error = 0;
    errorMsg = "";
    data = {};

    constructor(data, errType, errMsg){
        this.data = data ?? {};
        this.error = errType ?? 0;
        this.errMsg = errMsg ?? "";
    }

    set_error(errType, errMsg){
        this.error = errType;
        this.errorMsg = errMsg;
    }
}



function init_PGSocket(){
    PGSocket = net.createConnection(PGSQL_PORT, "localhost");
    PGSocket.on("ready", () => {
        console.log("Connected to PostgreSQL!");

        const user = "portfolio";
        const database = "blogposts";
        const messageLength = 8 + Buffer.byteLength(user, "utf8") + 1;
        const firstMessage = user + "\0" + database;

    });

    PGSocket.on("error", (err) =>{
        console.log(`PostgreSQL error: ${err}`);
    });

    PGSocket.on("close", () => {
        PGSocket = null;
        console.log("PostgreSQL connection has closed.");
    });

    PGSocket.on("data", (data) => {
        if (typeof data == "string"){
            console.log(`Received data string: ${data}`);
            console.error("We shouldn't receive a string type from the postgresql server...");
            return;
        }
        else {
            console.log(`Received data buffer: ${data.toString()}`);
            let msgType = data[0];
            switch (msgType){
                case 0x52:
                    console.log("Server asked for authentication.");
                    return;
                case 0x4b:
                    console.log("Server send cancellation key data");
                    return;
                case 0x42:
                    console.log("I don't know!");
                    return;
                default:
                    console.log(`default case: ${msgType}`);
            }
        }
    });
}


function getPGSocket(){
    if (PGSocket == null){
        init_PGSocket();
    }
    return PGSocket;
}


export function pg_run_statement(statement){
    if (typeof statement != "string"){
        let err = new PGResult(null, 1, "Argument to pg_run_statement() must be string.");
        return err;
    }
    const pgsock = getPGSocket();
    
}

const pgLenLen = 4; // It always needs a 32 bit int as the second argument (length)

const s = getPGSocket();

let obuf = new Buffer();

let query = "SELECT * FROM blogposts;"

obuf.write("Q");
obuf.writeInt32BE(query.length + pgLenLen);

s.write();


await new Promise(r => setTimeout(r, 10000));
