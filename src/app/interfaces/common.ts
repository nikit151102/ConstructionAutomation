export interface ErrorResponseDto {
    Code: string; // Guid as string
    ErrorType: 'Warning' | 'Error' | 'Message' | string; 
    MessageText: string;
}
