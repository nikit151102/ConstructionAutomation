export interface Avatar {
    fileName: string;
    bytes: string;
    size: number;
}

export interface Permission {
    Id: string; // Guid as string
    Name: string;
    EndpointName: string;
}

export interface Role {
    Id: string; // Guid as string
    Name: string;
    Permissions: Permission[]; 
}

export interface UserFull {
    Id: string;
    FirsName: string;
    LastName: string;
    Patronymic: string;
    Email: string;
    TgUserName: string;
    Hash: string;
    Token: string;
    Banned: boolean;
    BanReason: string;
    avatar: Avatar; // Object of type Avatar
    Role: Role; // Object of type Role
}


export interface UserRegisterDto {
    tg: {
        first_name: string;
        username: string;
        hash: string;
    };
    email: {
        email: string;
        password: string;
    };
}


export interface UserRegisterResponseDto {
    token: string;
    items: Permission[]; // List of permissions
}


export interface UserRequestDto {
    Id: string; // Guid as string
    Token: string;
}

export interface UserProfileResponseDto {
    Id: string; // Guid as string
    FirsName: string;
    LastName: string;
    Patronymic: string;
    Email: string;
    TgUserName: string;
    Role: {
        Id: string; // Guid as string
        Name: string;
    };
    avatar: Avatar; 
   
}

export interface UserUpdateDto {
    Id: string; // Guid as string
    FirsName: string;
    LastName: string;
    Patronymic: string;
    Email: string; // TODO
    TgUserName: string; // TODO
    avatar: Avatar; 
}

export interface UserResponseDto {
    Id: string; // Guid as string
    FirsName: string;
    LastName: string;
    Patronymic: string;
    Email: string;
    TgUserName: string;
    Role: {
        Id: string; // Guid as string
        Name: string;
    };
    avatar: Avatar; 
}




