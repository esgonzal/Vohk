export interface User {
  username: string;
  password: string;
  confirmPassword: string;
  email:string;
  nickname:string;
}

export interface GetAccessTokenResponse {
  //valid response
  access_token: string;
  expires_in: number;
  openid: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  uid: number;
  //invalida response
  description: string;
  errcode: number;
  errmsg: string;
}

export interface ResetPasswordResponse {
  description: string;
  errcode: number;
  errmsg: string;
}
export interface UserRegisterResponse {
  description: string;
  errcode: number;
  errmsg: string;
  username: string;
}