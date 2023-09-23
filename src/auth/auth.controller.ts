import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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

  @Get('en-attente')
  async getUsersInAttente() {
    return this.utilisateurService.getUsersInAttente();
  }

  @Patch(':id/approve')
  async approveUser(@Param('id') id: number) {
    return this.utilisateurService.approveUser(id);
  }

  @Post('create-superadmin')
  async createSuperAdmin(@Body() signupDto: SignupDto): Promise<any> {
    return this.authService.createSuperAdmin(signupDto);
  }
}
