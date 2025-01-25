export const tableConfig = {
    endpoint: 'Positions', // Название эндпоинта для запроса данных
    pageTitle: 'Сотрудники', // Название страницы
    tableColumns: [
      { label: 'Код', field: 'code' }, // Поле name из ответа бекенда
      { label: 'Наименование', field: 'name' }, // Поле email из ответа бекенда
    ]
  };