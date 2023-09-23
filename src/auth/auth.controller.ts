import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private utilisateurService: UtilisateurService,
  ) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('signup')
  async signUp(@Body() signupDto: SignupDto): Promise<any> {
    return this.authService.signUp(signupDto);
  }
}
