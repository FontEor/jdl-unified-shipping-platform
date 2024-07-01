export interface MenuItem {
  id?: string|number,
  icon?: string,
  code?: string,
  level?: number,
  key?: string|number,
  name: string,
  path: string,
  children: Array,
  meta: {
    title?: string
  }
}
