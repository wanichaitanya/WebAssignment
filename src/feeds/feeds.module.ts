import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Feeds } from "../orm/entity/feeds.entity";
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';

@Module
({
    imports: [TypeOrmModule.forFeature ([Feeds])],
    controllers: [FeedsController],
    providers: [FeedsService],
})
export class FeedsModule
{

}