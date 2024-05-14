import {ERROR_CODE_MESSAGES} from "./errorCodes";

class ErrorCode {
    code;
    
    constructor(code) {
        this.code = code;
    }
    
    message() {
        if (!ERROR_CODE_MESSAGES.hasOwnProperty(this.code)) {
            return 'Unexpected error';
        }
        
        return ERROR_CODE_MESSAGES[this.code];
    }
}

export default ErrorCode;