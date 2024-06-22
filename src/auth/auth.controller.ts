import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  //auth service is automatically created when initializing the controller
  constructor(private authService: AuthService) {}

  @Post('register') //register a new user
  register(@Body() body: AuthDTO) {
    console.log(body);
    return this.authService.register(body);
  }

  @Post('login') //login account
  login(@Body() body: AuthDTO) {
    return this.authService.login(body);
  }
}
