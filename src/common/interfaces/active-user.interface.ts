export interface ActiveUserInterface {
  /*
   * The "subjet"of the token. The value of this property is the user ID
   * that is granted this token
   * */
  sub: string;

  /*
   * The subject's (user) email
   * */
  email: string;
}
