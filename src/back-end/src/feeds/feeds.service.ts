/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Feeds } from "../orm/entity/feeds.entity";
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { User } from "src/orm/entity/users.entity";

@Injectable()
export class FeedsService
{
    constructor (
        @InjectRepository(Feeds)
        private feedRepository: Repository<Feeds>
    ) {}

    async createFeedRecordInDB (content:string,
                                location:string, 
                                userId:string):Promise<number>
    {
        try
        {
            const feedId:string = uuidv4 ();
            const feed:Feeds = this.feedRepository.create (
                {
                    feedId, 
                    content, 
                    location, 
                    userId
                });
            feed.save ();
            return 200;
        }
        catch (error)
        {
            throw new Error (error);
        }
    }

    async deleteFeedRecordFromDB (feedId:string):Promise<number>
    {
        try
        {
            const result:DeleteResult = 
            await this.feedRepository.delete({feedId:feedId});
            return result.affected;
        }
        catch (error)
        {
            throw new Error (error);
        }
    }

    async updateFeedRecordInDB (feedId:string, content:string):Promise<number>
    {
        try
        {
            const updateResult:UpdateResult =
            await this.feedRepository.update (
            feedId, 
            {
                content: content
            });
            return updateResult.affected;
        }
        catch (error)
        {
            throw new Error (error)
        }
    }

    async getAllFeedsFromDB():
    Promise<Feeds[]>
    {
        let feeds:Feeds[];
        try
        {
            feeds = await this.feedRepository.find({
                    cache: false, 
                    relations: []
                });
        }
        catch (error)
        {            
            throw error;
        }

        return feeds;
    }

    async getFeedFromDB(feedID:string):Promise<Feeds>
    {
        try
        {
            const feed:Feeds = await this.feedRepository
                                .findOne (
                                {
                                    cache: false,
                                    select: ["content", "updateionDate"],
                                    where: 
                                    {
                                        feedId: feedID
                                    }
                                });
            return feed;                    
        }
        catch (error)
        {
            console.log(error);
            
        }
    }

    async clearAllData()
    {
        try
        {
            await this.feedRepository.delete (undefined);
        }
        catch (error)
        {
            console.log(error);
            
        }
    }
}