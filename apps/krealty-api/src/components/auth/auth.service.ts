import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Member } from '../../libs/dto/member/member';
import { T } from '../../libs/types/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    public async hashPassword(memberPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(memberPassword, salt);
    }

    public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    public async createToken(member: Member): Promise<string> {
        const payload: T = {};

        // member ning barcha maydonlarini payload ga qo'shamiz
        Object.keys(member['_doc'] ? member['_doc'] : member).map((ele) => { 
            // _doc mongoose document dan o'qish uchun
            // ele bu yerda member ning har bir maydoni
            // payload[ele] = member[ele]; bu syntax ishlamaydi
            // shuning uchun `${ele}` qilib yozamiz
            payload[`${ele}`] = member[`${ele}`];
        });
        delete payload.memberPassword; 
        console.log('payload:', payload); 
        // token ichiga parolni qo'shmang
        // signAsync - bu JWT tokenini yaratish uchun ishlatiladigan metod bo'lib,
        // u asinxron tarzda ishlaydi va token yaratish jarayonida
        // vaqt talab qiladigan operatsiyalarni bajaradi.
        return await this.jwtService.signAsync(payload); // payload bu token ichidagi ma'lumotlar va bu yerda
        
    }


    public async verifyToken(token: string): Promise<Member> {
        const member = await this.jwtService.verifyAsync(token);
        return member;
    }


}
