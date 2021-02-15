import { UserService} from './users.service';
import { Test, TestingModule} from '@nestjs/testing';
import {TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {User} from '../orm/entity/users.entity';
import { Feeds } from '../orm/entity/feeds.entity';
import { Connection, getConnection } from 'typeorm';

describe ('User service', () =>
{
    let userService: UserService;
    afterEach (async () =>
    {
        const connection:Connection = getConnection ();
        try
        {
            await connection
            .createQueryBuilder()
            .delete()
            .from (Feeds)
            .execute ();

            await connection
            .createQueryBuilder()
            .delete()
            .from (User)
            .execute ();

            await connection.close ();
        }
        catch (error)
        {
            console.log(error);
        }
    });

    beforeEach (async () =>
    {
        const ConnectionOptions:TypeOrmModuleOptions = 
        {
            type:"postgres",
            host:"localhost",
            port:5432,
            username:"postgres",
            password:"test",
            synchronize:true,
            dropSchema: true,
            logging: false,
            entities: [User, Feeds],
            database: "NewsLetter-test"
        }

        try
        {
            const module:TestingModule = await Test.createTestingModule(
            {
                imports:
                [
                    TypeOrmModule.forRoot (ConnectionOptions),
                    TypeOrmModule.forFeature([User]),
                ],
                providers: [UserService],
            }).compile();
    
            userService = await module.get(UserService);
        }
        catch (error)
        {
            console.log(error);
        }
    });

    test ('create user with provided userData', async () =>
    {
        try
        {
            let result:number = await userService.userSignUp ("cwani@ptc.com", 
                                                              "Chaitanya", 
                                                              "Asdf@1234");
            let result1:number = await userService.userSignUp ("cwani@ptc.com", 
                                                              "Chaitanya", 
                                                              "Asdf@1234");
            expect (result).toBe(200);  
            expect (result1).toBe(409);  
        }
        catch (error)
        {
            console.log(error);
        }
    });

    test ('get userId of user for provided credentials', async () =>
    {
        let result:number = await userService.userSignUp ("cwani@gmail.com", 
                                                          "Chaitanya", 
                                                          "Asdf@1234");

        let user1:User = await userService.userLogin ("cwani@gmail.com", "aAsdf@1234");
        expect (user1).toBeUndefined();

        let user2:User = await userService.userLogin ("cwani@gmail.com", "Asdf@1234");
        expect (user2).toBeDefined();
    });

    test ('get all user records available in database', async () =>
    {
        await userService.userSignUp ("cwani@yahoo.com", 
                                      "Chaitanya", 
                                      "Asdf@1234");
        await userService.userSignUp ("cwani@outlook.com", 
                                      "Wani", 
                                      "Asdf@1234");
        let users:
        {
            userId: string;
            emailId: string;
            userName: string;
        }[] = await userService.getAllUsers ();

        expect(users).toBeDefined();
        expect(users.length).toBeGreaterThan(0);
    });
});