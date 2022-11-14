import { AuthService } from './auth.service';
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * API login
   * @param userDto (userName, password)
   * @return {jwt token}
   */
  @Post('/login')
  async login(@Body() userDto: CreateUserDto): Promise<{}> {
    return await this.authService.login(userDto);
  }

  /**
   * API registration
   * @param userDto (userName, email, password, fullName)
   * @return {jwt token}
   */
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto): Promise<{}> {
    return this.authService.registration(userDto);
  }
}
