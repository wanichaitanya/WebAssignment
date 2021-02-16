/* eslint-disable prettier/prettier */
import { Controller, Res } from '@nestjs/common';
import { Post, Get, Delete, Patch, Body } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { Response } from 'express';
import { Feeds } from "../orm/entity/feeds.entity";
@Controller('/feeds')
export class FeedsController
{
    constructor (private readonly feedsService:FeedsService){}

    @Post ('create-feed')
    async createFeed (@Res() response:Response, @Body() {content, location, userId})
    {
        try
        {
            const result:number = await this.feedsService.createFeedRecordInDB (content, location, userId);
            if (result == 200)
            {
                response.status (200).
                json({"response": "POST_CREATED"});   
            }
        }
        catch (error)
        {
            if (error.code == 23503)
            {
                response.status (409).
                json({"response": "FORIEGN_KEY_VIOLATION"});   
            }
            else if (error.code == 23502)
            {
                response.status (422).
                json({"response": "INVALID_DATA_PASSED_TO_DB"});
            }
            else
            {
                response.status (500).
                json({"response": error.message});   
            }
        }
    }

    @Delete ('delete-feed')
    async deleteFeed (@Res() response:Response, @Body() {feedId})
    {
        try 
        {
            const result:number = await this.feedsService.deleteFeedRecordFromDB (feedId);
            if (result > 0)
                response.status (200).json ({"response":"Post deleted"});
            else
                response.status (401).json ({"response":"Invalid Feeds Id"});
        }
        catch (error)
        {
            response.status (error.code).json ({response: error.message});
        }
    }

    @Patch ('update-feed')
    async updateFeed (@Res() response:Response, @Body() {feedId, content})
    {
        try
        {
            const result:number = await this.feedsService.updateFeedRecordInDB (feedId, content);
            if (result > 0)
                response.status (200).json ({"response":"Post Updated"});
            else
                response.status (401).json ({"response":"Invalid Feeds Id"});
        }
        catch (error)
        {
            response.status (500).json ({response: error.message});
        }
    }

    @Get ('get-feeds')
    async getAllFeeds (@Res() response:Response)
    {
        try
        {
            const result:
            {
                feedId : string;
                content : string;
                location : string;
                creationDate : Date;
                updateionDate : Date;
                userId : string;
            }[] = await this.feedsService.getAllFeedsFromDB ();

            response.status (200).
            json({"feeds": result});

        }
        catch (error)
        {
            response.status(500).json ({"response":error})
        }
    }
}