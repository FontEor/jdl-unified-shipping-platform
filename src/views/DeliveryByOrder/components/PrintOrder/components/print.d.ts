export type SocketStateKeys = 0 | 1 | 2 | 3;

export interface PrintEvent extends Record<string | symbol, unknown> {
  'print-list-res': string[];
  'set-print-name': string;
  'print-response': string;
  'print-error': string;
  'print-log': string;
}

/**
 * 插件对接文档
 * @see @link https://joyspace.jd.com/page/IuALy8yY5zboCMVsdJgs
 */
export namespace CloudPlugin {
  export type OrderType =
    | 'PRE_View'
    | 'PRE_View:multi'
    | 'GET_Printers'
    | 'PRINT';

  export interface OutputConfig01 {
    outputType: 0;
    printerName: string;
  }

  export interface OutputConfig02 {
    outputType: 1;
    fileType: 'PDF' | 'PNG' | 'JPG';
    filePath: string;
    fileRatio: 1 | 2 | 3 | 4 | 5; // 清晰度
  }

  export interface ArgumentDocument {
    documentId: string; // 标识
    templateCode: string; // 模版编码
    templateVersion?: string; // 模版版本
    printData: string;
    dataType: 'encrypt' | 'plain';
    customizedPrintData?: Record<string, any>;
  }

  export interface ArgumentParams {
    callSystem: 'DB';
    printLocation: string; // 站点ID
    operator: string; // ERP;
    // 同时输出多份 既打印成文档 又同时打印给打印机
    outputConfig: (OutputConfig01 | OutputConfig02)[];
    documents: ArgumentDocument[];
  }

  export interface Argument {
    cmd: OrderType;
    requestId: string;
    version: '3';
    task?: ArgumentParams;
  }

  export enum ResultDataCode {
    '1000' = '面单打印成功',
    '1001' = '部分失败，失败**条',
    '2001' = 'xxx 入参不能为空',
    '2002' = 'xxx 入参不合法2010运单数量超过上限（200单）',
    '4000' = '系统异常',
  }

  export type ResultDataCodeKeys = keyof typeof ResultDataCode;

  export interface ResultDataDetailOutput01 {
    outputType: 0;
    printer: string;
  }

  export interface ResultDataDetailOutput02 {
    outputType: 1;
    code: 1 | -1;
    fileType: string;
    filePath: string;
    message: string;
  }

  export interface ResultDataDetailOutput03 {
    outputType: 2;
    printer: string;
    code: 1 | -1;
    fileType: string;
    fileData: string;
    message: string;
  }

  export interface ResultDataDetailError {
    documentId: string;
    message: string;
  }

  export type ResultDataDetailOutput =
    | ResultDataDetailOutput01[]
    | ResultDataDetailOutput02[]
    | ResultDataDetailOutput03[];
  export interface ResultDataDetail {
    output: ResultDataDetailOutput;
    errors: ResultDataDetailError[];
  }

  export interface ResultDataDetailGetPrinter {
    printers: string[];
    errors: ResultDataDetailError[];
  }

  export type ResultData01 = {
    requestID: string;
    cmd: 'get_printers';
    code: ResultDataCodeKeys;
    message: string;
    detail: ResultDataDetailGetPrinter;
  };

  export interface ResultDataDetailGetVersion {
    version: string;
    errors: ResultDataDetailError[];
  }

  export type ResultData02 = {
    requestID: string;
    cmd: 'get_version';
    code: ResultDataCodeKeys;
    message: string;
    detail: ResultDataDetailGetVersion;
  };

  export type ResultData03 = {
    requestId: string;
    cmd: OrderType | 'print';
    code: ResultDataCodeKeys;
    message: string;
    detail: ResultDataDetail;
  };

  export type ResultData = ResultData01 | ResultData02 | ResultData03;
}
