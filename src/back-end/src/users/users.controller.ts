/* eslint-disable prettier/prettier */
import { Res } from '@nestjs/common';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './users.service';
@Controller('/users')
export class UserController
{
    constructor (private readonly userService:UserService)
    {

    }

    @Post ('sign-up')
    async sign_up (@Res() response:Response, @Body() {emailId, userName, password})
    {        
        try
        {
            let result = await this.userService.userSignUp(emailId, userName, password);
            if (result == 409)
                response.status (409).json ({response: "User already registered"});
            else
                response.status (200).json ({response: "User created successfully!"});
        }
        catch (error)
        {
            response.status (500).json ({response: error.message});
        }
    }

    @Post('login')
    async login (@Res() response:Response, @Body() {emailId, password})
    {
        try
        {
            let result:{userId:string} = await this.userService.userLogin(emailId, password);
            if (result !== undefined && result.hasOwnProperty("userId"))
                response.status (200).json ({response: result});
            else
                response.status (401).json ({response: "Invalid Credentials!"});
        }
        catch (error)
        {
            response.status(500).json ({response:error.message});
        }
    }

    @Get ('list-users')
    async getAllUserIds (@Res() response:Response)
    {
        try
        {
            const users:{ userId: string; emailId: string; userName: string; }[] = 
            await this.userService.getAllUsers ();
            response.status (200).json ({users});
        }
        catch (error)
        {
            response.status (500).json({response: error.message})
        }
    }

}