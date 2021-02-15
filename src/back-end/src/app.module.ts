import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedsModule } from './feeds/feeds.module';
import { UserModule } from './users/users.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/config';

const ConnectionOptions:TypeOrmModuleOptions = 
{
  type:"postgres",
  host:"localhost",
  port:5432,
  username:"postgres",
  password:"test",
  synchronize:true,
  dropSchema: (process.env.NODE_ENV === "development") ? false : true,
  entities: ["dist/orm/entity/**/*.js"],
  database: (process.env.NODE_ENV === "development") ? "NewsLetter" : "NewsLetter-test"
}

@Module({
  imports:
  [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRoot (ConnectionOptions),
    UserModule,
    FeedsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
