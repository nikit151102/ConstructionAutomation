export interface User {
    message: string;
    status: number;
    data: UserData;
}

export interface UserData {
    email: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    id: string;
    roles: Role[];
    token: string | null;
    userName: string;
}

interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

interface Permission {
    id: string;
    name: string;
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
  