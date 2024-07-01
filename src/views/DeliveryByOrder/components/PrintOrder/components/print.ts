import mitt, { Emitter } from 'mitt'
import dayjs from 'dayjs'
import { SocketStateKeys, CloudPlugin, PrintEvent } from './print.d'
import { PrintNamespace } from '@/interfaces/print'
import _ from 'lodash'

const DEFAULT_URL = process.env.VUE_APP_PRINT_SOCKET_URL

const emitter: Emitter<PrintEvent> = mitt()

const getTime = () => {
  return dayjs().format('HH:mm:ss')
}

export class PrintBase {
  // 链接对象
  private socket: WebSocket = new WebSocket(DEFAULT_URL);
  // 组件链接状态
  private state = 0 as SocketStateKeys;
  // 组件链接枚举
  private stateMap = {
    0: '正在连接',
    1: '已建立连接',
    2: '正在关闭连接',
    3: '已关闭连接',
  };

  // 链接地址
  private url = DEFAULT_URL;
  // 打印机名称
  private printName = '';
  private printNameList: string[] = [];
  // 上一次打印的数据
  private cache = '';
  // 消息日志
  private message: string[] = [];
  private errorMessage = '';
  private responseText = '';
  // 曾经是否链接成功过
  private connected = false;
  // 重连次数
  private reConnectCount = 0;
  public on = emitter.on;
  public emit = emitter.emit;
  public off = emitter.off;
  // constructor () {
  //   this.createSocket()
  // }

  // 获取上次选中的打印机名称
  getPrevPrintName () {
    const printName = localStorage.getItem('add-print/printName')
    if (printName) {
      this.printName = printName
      this.printNameList = [printName]
      this.emit('set-print-name', printName)
      this.toast(`上次打印机名称：${printName}`)
    }
  }

  setPrintName (name: string) {
    this.printName = name
    this.printNameList = [name]
    localStorage.setItem('add-print/printName', name)
    this.toast(`设置打印机名称：${name}`)
  }

  // 连接
  onConnect () {
    this.toast('开始链接打印组件')
    if (this.socket) {
      try {
        if (this.socket.readyState === 1) {
          this.connected = true
          this.toast('socket链接已建立')
        }
      } catch (e) {
        this.createSocket()
      }
    } else {
      this.createSocket()
    }
  }

  onOpen () {
    this.toast('链接成功')
    this.refreshState()
    this.getVersion()
    this.getPrints()
    this.getPrevPrintName()
    if (this.cache) {
      if (this.printName) {
        this.socket.send(this.cache)
      } else {
        this.emit('print-error', '请选择打印机')
      }
      this.cache = ''
    }
  }

  onMessage (e: MessageEvent) {
    try {
      console.log(e)
      const data = e.data
      if (data) {
        this.callbackDataHandler(JSON.parse(data))
      } else {
        this.toast('E:组件返回数据不存在')
      }
    } catch (error) {
      console.log('error', error)
      this.toast('E:组件返回数据解析错误')
    }
    this.refreshState()
  }

  onError (err: Event) {
    this.toast('E:链接失败')
    console.log(err)
  }

  onClose () {
    this.toast('E:链接断开')
    // 链接成功前最多重试5次，链接成功后无限重试
    if (this.reConnectCount < 4 || this.connected) {
      this.reConnectCount++
      this.toast('开始重新连接' + this.reConnectCount)
      // 断线重连
      this.createSocket()
    }
  }

  refreshState () {
    try {
      this.toast(
        '刷新链接状态：' +
          this.stateMap[this.socket.readyState as SocketStateKeys],
      )
      this.state = this.socket.readyState as SocketStateKeys
    } catch (e) {
      console.log('链接状态获取失败', e)
    }
  }

  createSocket () {
    this.toast('创建soket链接：' + this.url)
    const socket = new WebSocket(this.url)
    socket.onopen = this.onOpen.bind(this)
    socket.onmessage = this.onMessage.bind(this)
    socket.onerror = this.onError.bind(this)
    socket.onclose = this.onClose.bind(this)
    this.socket = socket
  }

  getVersion () {
    const data = {
      cmd: 'GET_Version',
      version: '3',
      requestId: Date.now(),
    }
    this.socket.send(JSON.stringify(data))
  }

  getPrints () {
    this.toast('获取打印机列表')
    const data: CloudPlugin.Argument = {
      cmd: 'GET_Printers',
      requestId: getTime(),
      version: '3',
    }
    this.socket.send(JSON.stringify(data))
  }

  startPrint (data: CloudPlugin.Argument) {
    if (!this.printName) {
      return this.emit('print-error', '请选择打印机')
    }
    this.toast('准备发送至组件')
    try {
      const inArgs = JSON.stringify(data)
      if (this.socket && this.socket.readyState === 1) {
        this.toast('开始打印')
        this.socket.send(inArgs)
      } else {
        this.toast('组件链接状态错误')
        this.cache = inArgs
        this.createSocket()
      }
    } catch (e) {
      console.log(e)
      this.toast('E:解析数据失败')
    }
  }

  callbackDataHandler (data: CloudPlugin.ResultData) {
    console.log('callbackDataHandler data', data)
    if (data.code !== '1000') {
      this.toast('E:打印失败')
      this.responseText = JSON.stringify(data, undefined, 2)
      const message = data.detail.errors.map((err) => err.message).join(',')
      this.errorMessage = message
      this.toast('E:打印失败' + message)
      this.emit('print-response', this.responseText)
      this.emit('print-error', message)
      return
    }
    switch (data.cmd) {
      // 打印机列表
      case 'get_printers':
        if (data.detail.printers && data.detail.printers.length) {
          this.printNameList = data.detail.printers || []
          console.log('this.printNameList', this.printNameList)
          this.emit('print-list-res', this.printNameList)
          this.toast('打印机列表获取成功: ' + this.printNameList.join(','))
        } else {
          this.toast('查询不到打印机')
        }
        break
      case 'get_version':
        if (!data.detail.version) {
          this.toast('获取版本失败')
        }
        this.toast('版本号：' + data.detail.version)
        break
      case 'print':
        this.responseText = JSON.stringify(data, undefined, 2)
        this.emit('print-response', this.responseText)
        this.toast('P:打印成功')
        this.errorMessage = ''
        break
      default:
        this.responseText = JSON.stringify(data, undefined, 2)
        this.emit('print-response', this.responseText)
        this.errorMessage = data.message
        this.toast('E:预料之外的数据返回')
        break
    }
  }

  toast (str = '') {
    console.log('toast', str)
    const time = getTime()
    const message = time + ' ' + str
    this.message.unshift(message)
    this.emit('print-log', message)
    if (this.message.length >= 200) {
      this.message.length = 200
    }
  }

  connect (url: string) {
    this.toast(`开始连接打印组件: ${url}`)
    this.url = url
    this.createSocket()
  }

  // 打印数据格式化
  formatPrintData (
    datas: PrintNamespace.PrintLocalResponseData[],
    params: any,
  ): CloudPlugin.Argument {
    this.toast('开始格式化打印数据')
    const { id, templateObj } = params
    const documents: CloudPlugin.ArgumentDocument[] = []
    _.forEach(datas, data => {
      _.forEach(data.printDatas,
        (item) => {
          const templateCode = _.get(templateObj, `${data.providerCode}.templateSelectSize`)
          documents.push({
            documentId: data.billCodeValue, // 标识-运单
            templateCode, // 模版编码
            printData: item.encryptionData, // 打印数据;
            dataType: 'encrypt',
          })
        },
      )
    })
    return {
      cmd: 'PRINT',
      requestId: id,
      version: '3',
      task: {
        callSystem: 'DB',
        printLocation: '',
        operator: 'DB',
        // 同时输出多份 既打印成文档 又同时打印给打印机
        outputConfig: [
          {
            outputType: 0,
            printerName: this.printName,
          },
        ],
        documents: documents,
      },
    }
  }
}

export default new PrintBase()
