export class APIError extends Error { // Extends Error to keep HTTP status code to use when necessary
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, APIError.prototype); // ensures APIError inherits from Error
    }
}