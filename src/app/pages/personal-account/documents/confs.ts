import { Validators } from "@angular/forms";

export type ConfigType = 'comparativeStatement' | 'materialSpecification' | 'workSpecification';


export function getFormConfig(type: keyof typeof formConfig) {
  return formConfig[type];
}

export const formConfig = {
  comparativeStatement: {
    endpoint: 'ComparativeStatement',
    controls: [
      // {
      //   name: 'contractorName',
      //   type: 'text',
      //   label: 'Наименование подрядной организации',
      //   validators: [Validators.required],
      // },
      // {
      //   name: 'statementDate',
      //   type: 'date',
      //   label: 'Дата составления',
      //   defaultValue: new Date(),
      //   validators: [Validators.required],
      // },
      // {
      //   name: 'system',
      //   type: 'text',
      //   label: 'Система',
      //   validators: [Validators.required],
      // },

      {
        name: 'planFileListName',
        type: 'dropdown',
        label: 'Выберите лист',
        options: [],
        validators: [Validators.required],
      },
      {
        name: 'summaryFileListName',
        type: 'dropdown',
        label: 'Выберите лист',
        options: [],
        validators: [Validators.required],
      },
    ],
    fileInputs: [
      {
        key: 'planFile',
        label: 'Локальная смета',
        accept: '.xls, .xlsx',
      },
      {
        key: 'summaryFile',
        label: 'КС-2',
        accept: '.xls, .xlsx',
      },
    ],
  },
  materialSpecification: {
    endpoint: 'MaterialSpecification',
    controls: [
      {
        name: 'SummaryFileListName',
        type: 'dropdown',
        label: 'Выберите лист',
        options: [],
        validators: [Validators.required],
      },
    ],
    fileInputs: [
      {
        key: 'SummaryFile',
        label: 'КС-2',
        accept: '.xls, .xlsx',
      },
    ],
  },
  workSpecification: {

    endpoint: 'WorkSpecification',
    controls: [
      {
        name: 'SummaryFileListName',
        type: 'dropdown',
        label: 'Выберите лист',
        options: [],
        validators: [Validators.required],
      },
    ],
    fileInputs: [
      {
        key: 'SummaryFile',
        label: 'КС-2',
        accept: '.xls, .xlsx',
      },
    ],
  }


};