/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../orm/entity/users.entity';
import * as md5  from 'md5';

@Injectable ()
export class UserService
{
    private readonly saltRound:number = 10;
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
      ) {}

    async userSignUp (emailId:string, userName:string, non_hashed_password:string):Promise<number>
    {
        let result:number;
        try
        {   
            const password:string = md5(non_hashed_password);
            const user:User = await this.userRepository.create ({emailId,userName,password});
            await user.save ();
            result = 200;
        }
        catch (error)
        {
            if (error.code == 23505)
            {
                result = 409;
                return result;
            }
            else
                throw new Error(error);
        }

        return result;
    }

    async userLogin (emailId:string, password:string):Promise<User>
    {
        try
        {    
             const user:User = await this.userRepository.findOne (
            {
                cache: false,
                select: ["userId"],
                where: 
                {
                    emailId: emailId,
                    password: md5(password)
                }
            });
            return user;
        }
        catch (error)
        {
            throw new Error(error);
        }
    }

    async getAllUsers ():Promise<{ userId: string; emailId: string; userName: string; }[]>
    {
        try
        {
            const users:User[] = await this.userRepository
            .find (
            {
                cache: false,
                select: ["userId", "userName", "emailId"]
            });
            return users;                
        }
        catch (error)
        {
            throw new Error(error);
        }   
    }

    async clearAllData ()
    {
        try
        {
            await this.userRepository.delete (undefined);
        }
        catch (error)
        {
            console.log(error);
            
        }
    }
}