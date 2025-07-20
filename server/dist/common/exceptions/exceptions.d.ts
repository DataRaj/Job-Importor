import { HttpException } from '@nestjs/common';
export declare class DatabaseConnectionException extends HttpException {
    constructor(message?: string);
}
export declare class ValidationException extends HttpException {
    constructor(message?: string);
}
export declare class PaginationException extends HttpException {
    constructor();
}
export declare class UnexpectedException extends HttpException {
    constructor(message?: string);
}
export declare class ImportProcessException extends HttpException {
    constructor(message?: string);
}
