export interface UploadData {
    id: string;
    statusCode: number;
    fileName: string;
    fileSize: number;
    documentType: number;
    initDate: string;
    documentPdfId: string;
    documentXlsxId: string;
}


export interface TransactionResponse {
    balance: number;
    changeDateTime: string;
    createDateTime: string;
    documentPdfId: string;
    documentPdfShortId: string;
    documentType: number;
    documentXlsxId: string;
    fileName: string;
    fileSize: number;
    id: string;
    initDate: string;
    statusCode: number;
    statusDescription: string;
}


export interface DocumentQueueItem {
    id: string;
    balance: number;
    changeDateTime: string;
    createDateTime: string;
    documentPdfId: string;
    documentPdfShortId: string;
    documentType: number;
    documentXlsxId: string;
    fileName: string;
    fileSize: number;
    initDate: string;
    statusCode: number;
    statusDescription: string;
}

export interface DocumentQueueResponse {
    data: DocumentQueueItem[];
}


export interface TypeDoc {
    name: string;
    code: string;
}

export interface Button {
    label: string;
    onClick: () => void;
}

export interface MenuItem {
    label: string;
    icon: string;
    class: string;
    command: () => void;
}
