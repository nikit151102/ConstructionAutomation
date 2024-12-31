export interface ErrorResponseDto {
    Code: string; // Guid as string
    ErrorType: 'Warning' | 'Error' | 'Message' | string; 
    MessageText: string;
}

export interface Response<T = any> {
    message: string;
    status: number;
    data: T;
}