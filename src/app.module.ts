import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedsModule } from './feeds/feeds.module';
import { UserModule } from './users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import { User } from './orm/entity/users.entity';
import { Feeds } from './orm/entity/feeds.entity';

@Module({
  imports:
  [
    TypeOrmModule.forRoot (
      {
        type: "postgres",
			  host: "localhost",
			  port: 5432,
			  username: "postgres",
			  password: "test",
        database: "NewsLetter",
        entities: [User, Feeds],
			  synchronize: true
      }
    ),
    UserModule,
    FeedsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
