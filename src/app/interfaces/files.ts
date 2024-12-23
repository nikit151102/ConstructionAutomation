export interface SelectedFiles {
    planFile: File;
    summaryFile: File;
    planFileListName: string;
    summaryFileListName: string;
    contractorName: string;
    statementDate: string;
    system: string;
}

export interface dataDocs {
    id?: string,
    statusCode: number,
    fileName: string,
    fileSize: number,
    documentType: number,
    initDate: Date,
    documentPdfId: string,
    documentXlsxId: string
}