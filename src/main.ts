import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap()
{
    try
    {
        const app = await NestFactory.create(AppModule);
        app.enableCors();
        await app.listen(3001)
    }
    catch (error)
    {
      console.log(error);
    }
}
bootstrap();
