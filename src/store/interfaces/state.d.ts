import { User } from '@/interfaces/user'
import { MenuItem } from '@/interfaces/menu'

// 为 store state 声明类型
export interface IState {
  userInfo: User.UserInfo,
  menuList: Array<MenuItem>,
  isLogin: boolean,
  sysError: boolean
}
