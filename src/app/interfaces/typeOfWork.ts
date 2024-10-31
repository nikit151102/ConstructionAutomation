export interface TypeOfWorkResponseDto {
    Id: string; // Guid as string
    Name: string;
    MeasurementUnits: string;
}

export interface TypeOfWorkCreateDto {
    Name: string;
    MeasurementUnits: string;
}

export interface TypeOfWorkUpdateDto {
    Id: string; // Guid as string
    Name: string;
    MeasurementUnits: string;
}

export interface TypeOfWorkResponseDtoList {
    typesOfWork: TypeOfWorkResponseDto[];
}
