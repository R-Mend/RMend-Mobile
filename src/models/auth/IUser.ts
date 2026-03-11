/**
 * User shape required by the auth layer. Implementations of IAuthClient
 * must produce and accept objects conforming to this interface.
 */
export default interface IUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
}