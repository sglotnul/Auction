import { v4 as uuidv4 } from 'uuid';
import {ERROR_CODE_MESSAGES} from "./errorCodes";

class ErrorCode {
    code;
    id;
    
    constructor(code) {
        this.code = code;
        this.id = uuidv4();
    }
    
    message() {
        if (!ERROR_CODE_MESSAGES.hasOwnProperty(this.code)) {
            return 'Unexpected error';
        }
        
        return ERROR_CODE_MESSAGES[this.code];
    }
}

export default ErrorCode;