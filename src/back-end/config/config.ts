import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default ():TypeOrmModuleOptions => (
    {
        type:"postgres",
        host:"localhost",
        port:5432,
        username:"postgres",
        password:"test",
        synchronize:true,
        dropSchema: (process.env.NODE_ENV === "development") ? false : true,
        entities: ["../dist/orm/entity/**/*.js"],
        database: (process.env.NODE_ENV === "development") ? "NewsLetter" : "NewsLetter-test"
    }
);