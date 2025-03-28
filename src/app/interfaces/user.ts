export interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    email: string;
    inn: string;
    registerNumber: string;
    registerNumberBuilder: string;
    roles: Role[];
    createDateTime: string;
    changeDateTime: string;
    balance: number;
    refreshToken: string;
    storageInfo: StorageInfo;
    tgUserName: string | null;
    hoursOffset?: string,
    examinationPassing?: string,
}

export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

export interface Permission {
    id: string;
    name: string;
}

export interface StorageInfo {
    storageVolumeCopacity: number; // Общая вместимость хранилища
    storageVolumeUsage: number;   // Используемый объём хранилища
}


export interface UserUpdateRequest {
    id: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    email: string;
    userName: string;
    roleIds: string[];
}


