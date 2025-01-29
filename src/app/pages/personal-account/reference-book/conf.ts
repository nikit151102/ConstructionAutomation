export const referenceConfig = [
    {
        typeId: '030521',
        endpoint: 'Positions',
        pageTitle: 'Должности',
        tableColumns: [
            { label: 'Код', field: 'code' },
            { label: 'Наименование', field: 'name' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text' },
            { label: 'Наименование', field: 'name', type: 'text' },
        ],

    },
    {
        typeId: '161283',
        endpoint: 'Employees',
        pageTitle: 'Сотрудники',
        tableColumns: [
            { label: 'Имя', field: 'firstName' },
            { label: 'Фамилия', field: 'lastName' },
            { label: 'Отчество', field: 'patronymic' },
            { label: 'Дожность', field: 'position.name' },
            { label: 'Документ о представительстве', field: 'representationOrder' },
            { label: '', field: '' },
        ],
        formFields: [
            { label: 'Имя', field: 'firstName', type: 'text' },
            { label: 'Фамилия', field: 'lastName', type: 'text' },
            { label: 'Отчество', field: 'patronymic', type: 'text' },
            { label: 'Документ о представительстве', field: 'representationOrder', type: 'text' },
        ],
        connectionReference: { typeId: '030521', label: 'Должность', fieldName: 'position', field: 'positionId', }
    }
]

