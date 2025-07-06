// DTO (Data Transfer Object)

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UserRegisterResponse {
  message: string;
}
