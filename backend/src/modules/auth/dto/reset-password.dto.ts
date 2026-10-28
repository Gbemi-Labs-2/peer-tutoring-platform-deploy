import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Short-lived token returned after password-reset OTP verification' })
  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @ApiProperty({ minLength: 6, example: 'NewSecureP@ss123' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
