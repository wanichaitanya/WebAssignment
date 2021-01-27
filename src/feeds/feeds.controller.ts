import { Controller, Res } from '@nestjs/common';
import { Post, Get, Delete, Patch, Body } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { Response } from 'express';

@Controller('/feeds')
export class FeedsController
{
    constructor (private readonly feedsService:FeedsService){}

    @Post ('create-feed')
    createFeed (@Res() response:Response, @Body() {content, location, userId})
    {
        return this.feedsService.createFeedRecordInDB (response, content, location, userId);
    }

    @Delete ('delete-feed')
    deleteFeed (@Res() response:Response, @Body() {feedId})
    {
        return this.feedsService.deleteFeedRecordFromDB (response, feedId);
    }

    @Patch ('update-feed')
    updateFeed (@Res() response:Response, @Body() {feedId, content})
    {
        return this.feedsService.updateFeedRecordInDB (response, feedId, content);
    }

    @Get ('get-feeds')
    getAllFeeds (@Res() response:Response)
    {
        return this.feedsService.getAllFeedsFromDB (response);
    }
}