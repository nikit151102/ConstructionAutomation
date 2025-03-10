export const referenceConfig = [
    {
        typeId: '030521',
        endpoint: 'Positions',
        pageTitle: 'Должности',
        tableColumns: [
            { label: 'Код', field: 'code' },
            { label: 'Наименование', field: 'name' },
            { label: '', field: '' },
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
            { label: 'Фамилия', field: 'lastName' },
            { label: 'Имя', field: 'firstName' },
            { label: 'Отчество', field: 'patronymic' },
            { label: 'Дожность', field: 'position.name' },
            { label: 'Документ о представительстве', field: 'representationOrder' },
            { label: '', field: '' },
        ],
        formFields: [
            { label: 'Фамилия', field: 'lastName', type: 'text' },
            { label: 'Имя', field: 'firstName', type: 'text' },
            { label: 'Отчество', field: 'patronymic', type: 'text' },
            { label: 'Документ о представительстве', field: 'representationOrder', type: 'text' },
        ],
        connectionReference: { typeId: '030521', label: 'Должность', fieldName: 'position', field: 'positionId', }
    },
    {
        typeId: '815012',
        endpoint: 'ConcreteMark',
        pageTitle: 'Марки бетона',
        tableColumns: [
            { label: 'Код', field: 'code' },
            { label: 'Наименование', field: 'name' },
            { label: '', field: '' },
        ],
        formFields: [
            { label: 'Код', field: 'code', type: 'text' },
            { label: 'Наименование', field: 'name', type: 'text' },
        ],

    },
]

