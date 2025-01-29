import { userI } from "../models/User";

export type UserLoginRequest = Pick<userI, 'email' | 'password'>;

