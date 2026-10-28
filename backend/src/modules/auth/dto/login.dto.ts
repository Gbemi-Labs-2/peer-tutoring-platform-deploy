import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'student@university.edu' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecureP@ss123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  // Older clients may include registration form fields in login requests.
  // Accept gender for compatibility; authentication does not use this value.
  @ApiPropertyOptional({ enum: ['Male', 'Female'] })
  @IsOptional()
  @IsString()
  gender?: string;
}
