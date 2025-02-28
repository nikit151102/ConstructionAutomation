import { Validators } from "@angular/forms";

export type ConfigType = 'comparativeStatement' | 'materialSpecification' | 'workSpecification' | 'actHideWorksRequest';


export function getFormConfig(type: keyof typeof formConfig) {
  return formConfig[type];
}

export const formConfig = {
  comparativeStatement: {
    nameDoc: 'Cопоставительная ведомость',
    fileInstruction:'comparativeStatement.html',
    endpoint: 'ComparativeStatement',
    price:'4500',
    controls: [
      {
        name: 'planFileListName',
        type: 'dropdown',
        label: 'Выберите лист',
        options: [],
        validators: [Validators.required],
        isFileInput: true,
        order: 0
      },
      {
        name: 'summaryFileListName',
        type: 'dropdown',
        label: 'Выберите лист',
        options: [],
        validators: [Validators.required],
        isFileInput: true,
        order: 0
      },
      {
        name: 'planFile',
        type: 'file',
        label: 'Локальная смета',
        accept: '.xls, .xlsx',
        validators: [Validators.required],
        order: 1,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
      {
        name: 'summaryFile',
        type: 'file',
        label: 'КС-2',
        accept: '.xls, .xlsx',
        validators: [Validators.required],
        order: 2,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
    ],
  },






  materialSpecification: {
    nameDoc: 'Спецификация на метериалы',
    endpoint: 'MaterialSpecification',
    fileInstruction:'materialSpecification.html',
    price:'1150',
    controls: [
      {
        name: 'SummaryFileListName',
        type: 'dropdown',
        label: 'Выберите лист',
        options: [],
        validators: [Validators.required],
        isFileInput: true,
        order: 0
      },
      {
        name: 'SummaryFile',
        type: 'file',
        label: 'КС-2',
        accept: '.xls, .xlsx',
        validators: [Validators.required],
        order: 1,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
    ],
  },





  workSpecification: {
    nameDoc: 'Ведомость объемов работ',
    endpoint: 'WorkSpecification',
    fileInstruction:'workSpecification.html',
    price:'1150',
    controls: [
      {
        name: 'SummaryFileListName',
        type: 'dropdown',
        label: 'Выберите лист',
        options: [],
        validators: [Validators.required],
        isFileInput: true,
        order: 0
      },
      {
        name: 'SummaryFile',
        type: 'file',
        label: 'КС-2',
        accept: '.xls, .xlsx',
        validators: [Validators.required],
        order: 1,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
      
    ],
  }, 







  actHideWorksRequest: {
    nameDoc: 'Акты освидетельствования скрытых работ',
    endpoint: 'ActHideWorks',
    fileInstruction:'ActHideWorks.html',
    price:'8500',
    controls: [
      {
        name: 'SummaryFile',
        type: 'file',
        label: 'КС-2',
        accept: '.xls, .xlsx',
        validators: [Validators.required],
        order: 1,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
      {
        name: 'SummaryFileListName',
        type: 'dropdown',
        label: 'Выберите лист',
        options: [],
        validators: [Validators.required],
        isFileInput: true,
        order: 0
      },
      {
        name: 'Inn',
        type: 'text',
        label: 'ИНН',
        options: [],
        validators: [Validators.required,
          Validators.pattern('^[0-9]+$')],
        order: 2,
        tooltip: {
          isVisible: true,
          text: 'Ваш ИНН (10 или 12 цифр) необходим для автоматического заполнения большого количества полей документа, относящихся к Вашему юридическому лицу. Вы можете заполнить это поле в профиле, чтобы оно заполнялось автоматически!'
        }
      },
      {
        name: 'registerNumber',
        type: 'text',
        label: 'СРО по проектированию',
        options: [],
        validators: [Validators.required],
        order: 3,
        tooltip: {
          isVisible: true,
          text: 'Регистрационный номер члена в реестре членов саморегулируемой организации - СРО по проектированию. Вы можете заполнить это поле в профиле, чтобы оно заполнялось автоматически!'
        }
      },
      {
        name: 'registerNumberBuilder',
        type: 'text',
        label: 'СРО по строительным работам',
        options: [],
        validators: [Validators.required],
        order: 4,
        tooltip: {
          isVisible: true,
          text: 'Регистрационный номер члена в реестре членов саморегулируемой организации - СРО по строительным работам. Вы можете заполнить это поле в профиле, чтобы оно заполнялось автоматически!'
        }
      },
      {
        name: 'beginDateTime',
        type: 'date',
        label: 'Дата начала работ',
        validators: [Validators.required],
        order: 5,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
      {
        name: 'endDateTime',
        type: 'date',
        label: 'Дата окончания работ',
        validators: [Validators.required],
        order: 6,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
      {
        name: 'CustomerBuidingManagerId',
        type: 'reference',
        label: 'Представитель технического заказчика по вопросам строительного контроля',
        endpoint:'/api/Profile/UserEntities/Organization/Employees',
        fields:[
          'lastName',
          'firstName',
          'patronymic',
          'position.name',
        ],
        validators: [Validators.required],
        order: 7,
        tooltip: {
          isVisible: true,
          text: 'Представитель добавляется в разделе Справочники - Сотрудники. После создания записи, она появится в выпадающем списке. Также для Сотрудников вы можете добавлять уникальные Должности в соответствующем разделе.'
        }
      },
      {
        name: 'BuiderPersonId',
        type: 'reference',
        label: 'Представитель лица, осуществляющего строительство',
        endpoint:'/api/Profile/UserEntities/Organization/Employees',
        fields:[
          'lastName',
          'firstName',
          'patronymic',
          'position.name',
        ],
        validators: [Validators.required],
        order: 8,
        tooltip: {
          isVisible: true,
          text: 'Представитель добавляется в разделе Справочники - Сотрудники. После создания записи, она появится в выпадающем списке. Также для Сотрудников вы можете добавлять уникальные Должности в соответствующем разделе.'
        }
      },
      {
        name: 'DocumentWriterId',
        type: 'reference',
        label: 'Представитель лица, осуществляющего подготовку проектной документации',
        endpoint:'/api/Profile/UserEntities/Organization/Employees',
        fields:[
          'lastName',
          'firstName',
          'patronymic',
          'position.name',
        ],
        validators: [Validators.required],
        order: 9,
        tooltip: {
          isVisible: true,
          text: 'Представитель добавляется в разделе Справочники - Сотрудники. После создания записи, она появится в выпадающем списке. Также для Сотрудников вы можете добавлять уникальные Должности в соответствующем разделе.'
        }
      },
    ],
  },








  
  journalGeneral: {
    nameDoc: 'Журналы работ',
    endpoint: 'JournalGeneral',
    fileInstruction:'ActHideWorks.html',
    price:'5700',
    controls: [
      {
        name: 'SummaryFile',
        type: 'file',
        label: 'КС-2',
        accept: '.xls, .xlsx',
        validators: [Validators.required],
        order: 1,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
      {
        name: 'SummaryFileListName',
        type: 'dropdown',
        label: 'Выберите лист',
        options: [],
        validators: [Validators.required],
        isFileInput: true,
        order: 0
      },
      {
        name: 'Inn',
        type: 'text',
        label: 'ИНН',
        options: [],
        validators: [Validators.required,
          Validators.pattern('^[0-9]+$')],
        order: 2,
        tooltip: {
          isVisible: true,
          text: 'Ваш ИНН (10 или 12 цифр) необходим для автоматического заполнения большого количества полей документа, относящихся к Вашему юридическому лицу. Вы можете заполнить это поле в профиле, чтобы оно заполнялось автоматически!'
        }
      },
      {
        name: 'InnExecutor',
        type: 'text',
        label: 'ИНН организации, осуществляющей работы',
        options: [],
        validators: [Validators.required,
          Validators.pattern('^[0-9]+$')],
        order: 3,
        tooltip: {
          isVisible: true,
          text: 'Ваш ИНН (10 или 12 цифр) необходим для автоматического заполнения большого количества полей документа, относящихся к Вашему юридическому лицу. Вы можете заполнить это поле в профиле, чтобы оно заполнялось автоматически!'
        }
      },
      {
        name: 'InnCustomer',
        type: 'text',
        label: 'ИНН Заказчика',
        options: [],
        validators: [Validators.required,
          Validators.pattern('^[0-9]+$')],
        order: 4,
        tooltip: {
          isVisible: true,
          text: 'Ваш ИНН (10 или 12 цифр) необходим для автоматического заполнения большого количества полей документа, относящихся к Вашему юридическому лицу. Вы можете заполнить это поле в профиле, чтобы оно заполнялось автоматически!'
        }
      },
      {
        name: 'examinationPassing',
        type: 'text',
        label: 'Прохождение экспертизы',
        options: [],
        validators: [Validators.required],
        order: 5,
        tooltip: {
          isVisible: true,
          text: ''
        }
      },
      {
        name: 'ContractBeginDateTime',
        type: 'date',
        label: 'Дата начала периода контракта',
        validators: [Validators.required],
        order: 6,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
      {
        name: 'ContractEndDateTime',
        type: 'date',
        label: 'Дата окончания периода контракта',
        validators: [Validators.required],
        order: 7,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
      {
        name: 'BeginDateTime',
        type: 'date',
        label: 'Дата начала работ',
        validators: [Validators.required],
        order: 8,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
      {
        name: 'EndDateTime',
        type: 'date',
        label: 'Дата окончания работ',
        validators: [Validators.required],
        order: 9,
        tooltip: {
          isVisible: true,
          text: 'tooltip text'
        }
      },
      
      {
        name: 'Builder',
        type: 'reference',
        label: 'Представитель уполномоченного представителя застройщика',
        endpoint:'/api/Profile/UserEntities/Organization/Employees',
        fields:[
          'lastName',
          'firstName',
          'patronymic',
          'position.name',
        ],
        validators: [Validators.required],
        order: 10,
        tooltip: {
          isVisible: true,
          text: 'Id Уполномоченного представителя застройщика'
        }
      },

      {
        name: 'BuilderExecutor',
        type: 'reference',
        label: 'Представитель уполномоченного представителя лица, осуществляющего строительство',
        endpoint:'/api/Profile/UserEntities/Organization/Employees',
        fields:[
          'lastName',
          'firstName',
          'patronymic',
          'position.name',
        ],
        validators: [Validators.required],
        order: 11,
        tooltip: {
          isVisible: true,
          text: 'Id Уполномоченного представителя лица, осуществляющего строительство'
        }
      },
      {
        name: 'BuilderController',
        type: 'reference',
        label: 'Представитель уполномоченного представителя застройщика или заказчика по вопросам строительного контроля',
        endpoint:'/api/Profile/UserEntities/Organization/Employees',
        fields:[
          'lastName',
          'firstName',
          'patronymic',
          'position.name',
        ],
        validators: [Validators.required],
        order: 12,
        tooltip: {
          isVisible: true,
          text: ' Id Уполномоченного представителя застройщика или заказчика по вопросам строительного контроля'
        }
      },
      {
        name: 'Customer',
        type: 'reference',
        label: 'Представитель уполномоченного представителя заказчика',
        endpoint:'/api/Profile/UserEntities/Organization/Employees',
        fields:[
          'lastName',
          'firstName',
          'patronymic',
          'position.name',
        ],
        validators: [Validators.required],
        order: 13,
        tooltip: {
          isVisible: true,
          text: 'Id Уполномоченного представителя заказчика'
        }
      },
      {
        name: 'CustomerExecutor',
        type: 'reference',
        label: 'Представитель уполномоченного представителя лица, осуществляющего строительство по вопросам строительного контроля',
        endpoint:'/api/Profile/UserEntities/Organization/Employees',
        fields:[
          'lastName',
          'firstName',
          'patronymic',
          'position.name',
        ],
        validators: [Validators.required],
        order: 14,
        tooltip: {
          isVisible: true,
          text: 'Id Уполномоченного представителя лица, осуществляющего строительство по вопросам строительного контроля'
        }
      },
    ],
  },
};
