import { IsEmail, IsNotEmpty, MinLength, IsString } from "class-validator";

 export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: "Username is required" })
  @MinLength(3, { message: "Username must be at least 3 characters" })
  username: string;

  @IsString()
  @IsEmail({}, { message: "Invalid email format" }) 
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password: string;
}