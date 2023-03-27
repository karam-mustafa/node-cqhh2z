export interface UserEntry {
  username: string;
  email: string;
  type: "user" | "admin";
  salt: string;
  passwordhash: string;
}
