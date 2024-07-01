export namespace User {
  export interface UserInfo {
    pin: string;
    customerId: string;
  }
  export type UserInfoParams = {
    invitationCode?: string;
  };
}
