// src/utils/CustomError.js

export class CustomError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
