import net from "node:net";

//######################//
// Reminders for myself //
//######################//

// 1:
// BYTES ARE IN LE/HOST ORDER
// INTS ARE IN BE/NETWORK ORDER

// 2:
// After socket connects, must send a startup message


// This sucks, I hate utf-16
const PGMsgType {
    AuthenticationOk: 82,                   // R
    AuthenticationKerberosV5: 82,           // R
    AuthenticationCleartextPassword: 82,    // R
    AuthenticationMD5Password: 82,          // R
    AuthenticationSCMCredential: 82,        // R
    AuthenticationGSS: 82,                  // R
    AuthenticationGSSContinue: 82,          // R
    AuthenticationSSPI: 82,                 // R
    AuthenticationSASL: 82,                 // R
    AuthenticationSASLontinue: 82,          // R
    AuthenticationSASLFinal: 82,            // R
    BackendKeyData: 75,                     // K
    Bind: 66,                               // B
    BindComplete: 50,                       // 2
    CancelRequest: 80877102,                // int32(80877102) Cancel request code
    Close: 67,                              // C
    CloseComplete: 51,                      // 3
    CommandComplete: 67,                    // C
    CopyData: 100,                          // d
    CopyDone: 99,                           // c
    CopyFail: 102,                          // f
    CopyInResponse: 71,                     // G
    CopyOutResponse: 72,                    // H
    CopyBothResponse: 87,                   // W
    DataRow: 68,                            // D
    Describe: 68,                           // D
    EmptyQueryResponse: 73,                 // I
    ErrorResponse: 69,                      // E
    Execute: 69,                            // E
    Flush: 72,                              // H
    FunctionCall: 70,                       // F
    FunctionCallResponse: 86,               // V
    GSSENCRequest: 80877104,                // int32(80877104) GSSAPI Encryption request code
    GSSResponse: 112,                       // p
    NegotiateProtocolVersion: 118,          // v
    NoData: 110,                            // n
    NoticeResponse: 78,                     // N
    NotificationResponse: 65,               // A
    ParameterDescription: 116,              // t
    ParameterStatus: 83,                    // S
    Parse: 80,                              // P
    ParseComplete: 49,                      // 1
    PasswordMessage: 112,                   // p
    PortalSuspended: 115,                   // s
    Query: 81,                              // Q
    ReadyForQuery: 90,                      // Z
    RowDescription: 84,                     // T
    SASLInitialResponse: 112,               // p
    SASLResponse: 112,                      // p
    SSLRequest: 80877103,                   // int32(80877103) SSL Request Code
    StartupMessage: 196608,                 // in32(196608) protocol version number
    Sync: 83,                               // S
    Terminate: 88                           // X
}


const PGParamFormatCodes{
    text: 0,
    binary: 1
}

//########################//
//Frontend Message Classes//
//########################//

//--UNFINISHED--//
class PGCMD_Bind {
    type = PGMsgType["Bind"];           // 1 byte
    length = 2;                         // int 32
    destinationPortal = "\0";           // C-String
    sourcePreparedStatement = "\0";     // C-String
    parameterFormatCodesCount = 0;      // int 16
    parameterFormatCodes = [];          // int 16 array
    parameterValuesCount = 0;           // int 16
    parameterValuesLengths[];           // int 32 array
    parameterValues = [];               // 2D Array of nbytes, n determined in above array
    resultColumnFormatCodesCount = 0    // int 16
    resultColumnFormatCodes = [];       // 16 bit int array
    
    constructor(destPortal, srcStmnt, paramsFmtValPair, resFmtCodes){
        this.destinationPortal = destPortal ?? "\0";
        this.sourcePreparedStatement = srcStmnt ?? "\0";
        this.parameterFormatCodes = paramFmtCodes ?? [];
        this.resultColumnFormatCodesCount = resFmtCodes ?? [];
    }

}

//--UNFINISHED--//
class PGCMD_CancelRequest {
    // This may look weird as it has no "type" but the length + cancelCode act together as the type
    length = PGMsgType["CancelRequest"];    // int 32
    cancelCode = 80877102;                  // int 32
    processID = 0;                          // int 32
    key = 0                                 // int 32

    constructor() {

    }
}


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
