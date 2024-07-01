import { debounce } from 'lodash'

const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor (callback: any) {
    callback = debounce(callback, 16)
    super(callback)
  }
}
