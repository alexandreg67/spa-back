import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { UtilisateurService } from 'src/utilisateur/utilisateur.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UtilisateurService,
  ) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('signup')
  async signUp(@Body() signupDto: SignupDto): Promise<any> {
    return this.authService.signUp(signupDto);
  }

  @Post('/checktoken')
  async validateUserToken(@Req() req: any): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token non fourni');
    }

    const tokenData = await this.authService.validateToken(token);
    if (tokenData.valid) {
      const userId = tokenData.userId;
      const user = await this.userService.findOne(userId);
      console.log('je suis dans le controller et je log user : ', user);

      if (user && user.deleted_at !== null) {
        // Si l'utilisateur est "soft-deleted"
        return { valid: true, isDeleted: true };
      }
      return { valid: true, isDeleted: false };
    } else {
      throw new UnauthorizedException('Token invalide');
    }
  }
}
