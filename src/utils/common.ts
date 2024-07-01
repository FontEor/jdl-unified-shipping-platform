import _ from 'lodash'
// 数字千分位展示
export function toThousand (num: string|number) {
  if (!Number.isFinite(Number(num))) { return num }
  // 先提取整数部分
  return num.toString().replace(/\d+/, (n) => n.replace(/(\d)(?=(\d{3})+$)/g, ($1: string) => `${$1},`))
}

// 获取导航参数
export function getQueryString (name: string, str = window.location.href) {
  try {
    const urlStr = str ? str.split('?')[1] : ''
    const urlSearchParams = new URLSearchParams(urlStr)
    const result = Object.fromEntries(urlSearchParams.entries())
    return result[name]
  } catch (error) {
    return null
  }
}

// 复制一段文字到剪切板
export function copy (text: string) {
  if (navigator.clipboard) {
    // clipboard api 复制
    navigator.clipboard.writeText(text)
  } else {
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    // 隐藏此输入框
    textarea.style.position = 'fixed'
    textarea.style.clip = 'rect(0 0 0 0)'
    textarea.style.top = '10px'
    // 赋值
    textarea.value = text
    // 选中
    textarea.select()
    // 复制
    document.execCommand('copy', true)
    // 移除输入框
    document.body.removeChild(textarea)
  }
}

// 手机号
export const mobileReg = /^1[3-9]\d{9}$/
// 手机电话号
export const phoneReg = /^(\d{3})(\d|-){1,}(\d{4})$/
// 手机电话号中间四位 * 展示
export function phoneEncode (str: string) {
  // const reg = /^((\d|\-){3})\d(\d{4})$/;
  if (str) {
    return str.replace(phoneReg, '$1****$3')
  }
  return str
}

// 邮箱 * 展示
export function emailEncode (email: string) {
  if (String(email).indexOf('@') > 0) {
    const str = email.split('@'); let _s = ''
    if (str[0].length > 4) {
      _s = str[0].substr(0, 4)
      for (let i = 0; i < str[0].length - 4; i++) {
        _s += '*'
      }
    } else {
      _s = str[0].substr(0, 1)
      for (let i = 0; i < str[0].length - 1; i++) {
        _s += '*'
      }
    }
    return _s + '@' + str[1]
  } else {
    return email
  }
}

// str：要进行隐藏的变量  frontLen: 前面需要保留几位    endLen: 后面需要保留几位
export function hidden (str: string, frontLen: number, endLen: number, maxStar: number) {
  const len = str.length - frontLen - endLen
  let xing = ''
  for (let i = 0; i < len; i++) {
    xing += '*'
  }
  const maxStarLength = maxStar || xing.length
  return str.substring(0, frontLen) + xing.substring(0, maxStarLength) + str.substring(str.length - endLen)
}

export function formatUri (path: string, params: any) {
  const str = Object.keys(params).filter(key => {
    return params[key] !== undefined
  }).map(key => {
    return `${key}=${(params[key] === null) ? '' : params[key]}`
  }).join('&')
  return `${path}?${str}`
}

export function downloadFile (path: string, params: object) {
  const url = formatUri(path, params)
  window.open(url, '_blank')
}

export function downloadExcel (data: any, filename: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()

  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export function getSysEnv () {
  const userAgent = navigator.userAgent.toLowerCase()
  let name = ''
  if (userAgent.indexOf('win') > -1) {
    name = 'Windows'
  } else if (userAgent.indexOf('iphone') > -1) {
    name = 'iphone'
  } else if (userAgent.indexOf('ipod') > -1) {
    name = 'ipod'
  } else if (userAgent.indexOf('ipad') > -1) {
    name = 'ipad'
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac'
  } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
    name = 'Unix'
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android'
    } else {
      name = 'Linux'
    }
  } else {
    name = 'Unknown'
  }
  return name
}

export function uniq (arr: any, key: string) {
  const obj: {
    [key: string]: any;
  } = {}
  const res: any[] = []
  _.forEach(arr, element => {
    const keyvalue = element[key]
    if (!obj[keyvalue]) {
      obj[keyvalue] = 1
      res.push(element)
    }
  })
  return res
}
