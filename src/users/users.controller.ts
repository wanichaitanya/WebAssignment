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
    sign_up (@Res() response:Response, @Body() {emailId, userName, password})
    {        
        return this.userService.userSignUp(response,emailId, userName, password);
    }

    @Post('login')
    login (@Res() response:Response, @Body() {emailId, password})
    {
        return this.userService.userLogin(response, emailId, password);        
    }

    @Get ('list-users')
    getAllUserIds (@Res() response:Response)
    {
        return this.userService.getAllUsers (response);
    }

}