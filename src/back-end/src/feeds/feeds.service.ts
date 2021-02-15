/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Feeds } from "../orm/entity/feeds.entity";
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

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
            await this.feedRepository.
                        createQueryBuilder().
                        insert ().
                        into (Feeds).
                        values ({feedId, content, location, userId}).
                        execute(); 
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
            await this.feedRepository
            .createQueryBuilder()
            .delete ()
            .from(Feeds)
            .where("feedId = :feedId", { feedId: feedId })
            .execute();
    
            return 204;
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
            await this.feedRepository
            .createQueryBuilder()
            .update(Feeds)
            .set({ content: content})
            .where("feedId = :feedId", { feedId: feedId })
            .execute();
            return 204;
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
            feeds = await this.feedRepository.find({relations: []});
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
                                .createQueryBuilder()
                                .select ("Feeds.content")
                                .addSelect ("Feeds.updateionDate")
                                .where("Feeds.feedId = :feedId", { feedId: feedID })
                                .getOne ();
            return feed;                    
        }
        catch (error)
        {
            console.log(error);
            
        }
    }
}