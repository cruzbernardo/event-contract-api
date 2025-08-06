export interface RequestRegisterUser {
  email: string;
  firstName: string;
  password: string;
}

export interface ResponseGetUserWithoutPassword {
  id: string;
  email: string;
  firstName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
