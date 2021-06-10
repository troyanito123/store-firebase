export class User {
  static fromFirebase({ email, uid, name, role }) {
    return new User(uid, name, email, role);
  }
  constructor(
    public uid: string,
    public name: string,
    public email: string,
    public role: userRole
  ) {}
}

export enum userRole {
  user = 'USER',
  admin = 'ADMIN',
}
