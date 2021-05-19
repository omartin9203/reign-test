export interface ResponseData<T> {
    success: boolean;
    message?: string;
    result?: T;
}