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

    async userSignUp (response:Response, emailId:string, userName:string, non_hashed_password:string):Promise<Response>
    {
        try
        {   
            const password:string = md5(non_hashed_password);
            const user = this.userRepository.create ({emailId,userName,password});
            await user.save ();
            response.status (201)
            .json ({"response": "USER_CREATED_SUCCESSFULLY"})
            .send();                           
        }
        catch (error)
        {
            if (Number(error.code) == 23505)
            {
                response.status (409)
                .json ({"response": "USER_ALREADY_REGISTERED"})
            }
            else
            {
                response.status (500)
                .json ({"response": error.message})
            }
        }
        return response;
    }

    async userLogin (response:Response, emailId:string, password:string):Promise<Response>
    {
        try
        {    
            const user:User = await this.userRepository
            .createQueryBuilder("User")
            .where("User.emailId = :emailId", { emailId: emailId })
            .andWhere ("User.password = :password", {password : md5(password)})
            .getOne();

            if (user != null)
            {
                response.status (200)
                .json ({"response": "LOGIN_SUCCESSFUL"});
            }
            else
            {
                response.status (401)
                .json ({"response": "INVALID_CREDENTIALS"});
            }
        }
        catch (error)
        {
            response.status (401)
            .json ({"response": error.message})
        }

        return response;
    }

    async getAllUsers (response:Response):Promise<Response>
    {
        try
        {
            const users:User[] = await this.userRepository.query(`select U."id", U."userName", U."emailId" from public."User" as U`);
            response.json (users);               
        }
        catch (error)
        {
            response.status (500)
            .json ({"response": error.message})
        }
        return response;    
    }
}