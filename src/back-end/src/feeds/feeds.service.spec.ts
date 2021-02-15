import { FeedsService} from './feeds.service';
import { Test, TestingModule} from '@nestjs/testing';
import {TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {User} from '../orm/entity/users.entity';
import { Feeds } from '../orm/entity/feeds.entity';
import { Connection, getConnection} from 'typeorm';
import { UserService } from '../users/users.service';

describe ('Feeds service', () =>
{
    let userService: UserService;
    let feedsService: FeedsService;
    let userId:string;
    const emailId:string = "cwani@yahoo.com";
    const content1:string = `1st post from ${emailId}`;
    const content2:string = `1st post from ${emailId}`;
    const location:string = "India";
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
                    TypeOrmModule.forFeature([User, Feeds]),
                ],
                providers: [UserService, FeedsService],
            }).compile();
    
            userService = await module.get (UserService);
            feedsService = await module.get (FeedsService);

            const userName:string = "CPW";
            const password:string = "Asdf@1234";
            await userService.userSignUp (emailId, userName, password);
            const resultUserService:User = 
            await userService.userLogin (emailId, password);
            userId = resultUserService.userId;
        }
        catch (error)
        {
            console.log(error.message);
        }
    });

    test ("Should create a feed in DB for given user", async () =>
    {
        try
        {
            const resultFeedsService:number =
            await feedsService.createFeedRecordInDB (content1, location, userId);
            expect (resultFeedsService).toBe (200);   
        }
        catch (error)
        {
            console.log(error.message);
        }
    });

    describe ("Update, Delete, Retrive feeds", () =>
    {
        let feeds:Feeds[];
        beforeEach (async () =>
        {
            try
            {
                await feedsService.createFeedRecordInDB (content1, location, userId);
                await feedsService.createFeedRecordInDB (content2, location, userId);
                feeds = await feedsService.getAllFeedsFromDB ();
            }
            catch (error)
            {
                console.log(error);          
            }
        });

        test ("get all feeds from feeds table", async () =>
        {
            try
            {
                const feeds:Feeds[] = await feedsService.getAllFeedsFromDB ();
                expect (feeds).toBeDefined ();
                expect (feeds.length).toBeGreaterThan (0);
            }
            catch (error)
            {
                console.log(error);         
            }
        });

        test ("delete the feed from database", async () =>
        {
            try
            {
                const result:number = await feedsService.deleteFeedRecordFromDB (feeds[0].feedId)
                expect (result).toBe (204);
            }
            catch (error)
            {
                console.log(error);
            }
        });

        test ("Update the feed for given feedId", async () =>
        {
            try
            {
                const updateResult:number = await feedsService.updateFeedRecordInDB (feeds[0].feedId, "This is updated post");
                const feedResult:Feeds = await feedsService.getFeedFromDB (feeds[0].feedId);
                expect (updateResult).toBe (204);
                expect (feedResult).toBeDefined ();
                expect (feedResult.updateionDate).not.toBe (feeds[0].updateionDate);
                expect (feedResult.content).not.toBe (feeds[0].content);
            }
            catch (error)
            {
                console.log(error);
            }
        });
    });
});