export interface AuthMenu {
  id: number,
  name?: string,
  code: string,
  level: number,
  type: number, // 0:菜单， 1：按钮 ， 2： 其他
  ext1: string,
  ext2: string,
  ext3: string,
  children?: Array,
  [prop: string]: any;
}

export interface menu {
  key: string|number
}
