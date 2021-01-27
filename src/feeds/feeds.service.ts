import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Feeds } from "src/orm/entity/feeds.entity";
import { Response } from 'express';

@Injectable()
export class FeedsService
{
    constructor (
        @InjectRepository(Feeds)
        private feedRepository: Repository<Feeds>
    ) {}

    async createFeedRecordInDB (response:Response,
                                content:string,
                                location:string, 
                                userId:string): Promise<Response>
    {
        try
        {
            const feed:Feeds = this.feedRepository.create ({content,location,userId});
            await feed.save ();
            response.status (201)
            .json({"response": "POST_CREATED"});
        }
        catch (error)
        {
            if (Number(error.code) == 23503)
            {
                response.status (409).
                json({"response": "FORIEGN_KEY_VIOLATION"});   
            }
            else if (Number(error.code) == 23502)
            {
                response.status (422).
                json({"response": "INVALID_DATA_PASSED"});
            }
            else
            {
                response.status (500).
                json({"response": error.message});   
            }
            return response;
        }
    }

    async deleteFeedRecordFromDB (response:Response, feedId:string):Promise<Response>
    {
        try
        {
            await this.feedRepository
            .createQueryBuilder()
            .delete ()
            .from(Feeds)
            .where("id = :id", { id: feedId })
            .execute();
    
            response.status (204).
            json({"response": "POST_DELETED_SUCCESSFULLY"});
        }
        catch (error)
        {
            response.status (500).
            json({"response": "Problem occured while deleting the post"});
        }

        return response;
    }

    async updateFeedRecordInDB (response:Response, feedId:string, content:string):Promise<Response>
    {
        try
        {
            await this.feedRepository
            .createQueryBuilder()
            .update(Feeds)
            .set({ content: content})
            .where("id = :id", { id: feedId })
            .execute();
    
            response.status (204).
            json({"response": "POST_UPDATED_SUCCESSFULLY"});
        }
        catch (error)
        {
            response.status (500).
            json({"response": "Problem occured while updating the post"});
        }
        return response;
    }

    async getAllFeedsFromDB(response:Response):Promise<Response>
    {
        try
        {
            const feeds:Feeds[] = await this.feedRepository.find();
            response.status (200).
            json({"feeds": feeds});
        }
        catch (error)
        {
            response.status (500).
            json({"response": error});
        }

        return response;
    }
}