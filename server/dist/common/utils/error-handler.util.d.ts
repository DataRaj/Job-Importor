export declare class ErrorHandler {
    private static readonly logger;
    static handleDatabaseError(error: any, context: string): never;
    static handleServiceError(error: any, context: string): never;
    static handleImportError(error: any): never;
    static validatePagination(page: number, limit: number): void;
}
