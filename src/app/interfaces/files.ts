export interface SelectedFiles {
    planFile: File;
    summaryFile: File;
    planFileListName: string;
    summaryFileListName: string;
    contractorName: string;
    statementDate: string;
    system: string;
}

export interface DataDoc{
    id?: string,
    statusCode: number,
    statusDescription: string
    fileName: string,
    fileSize: number,
    documentType: number,
    balance: number
    initDate: Date,
    documentPdfId: string,
    DocumentPdfShortId: string,
    documentXlsxId: string,
    createDateTime: string,
    changeDateTime: string,
}

