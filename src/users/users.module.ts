import { Module } from "@nestjs/common";
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../orm/entity/users.entity';

@Module
({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [TypeOrmModule]
})
export class UserModule {}