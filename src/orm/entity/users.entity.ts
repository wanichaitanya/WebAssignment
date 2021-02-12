/* eslint-disable prettier/prettier */
import
{
    Entity, 
    Column, 
    BaseEntity, 
    PrimaryColumn, 
    BeforeInsert, 
    Unique, 
    CreateDateColumn,
    OneToMany,
} from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { Feeds } from "./feeds.entity";

@Entity({name: "User"})
@Unique("unique-emailId", ["emailId"])
export class User extends BaseEntity
{
    @PrimaryColumn("uuid")
    userId:string;

    @Column("varchar", {length: 255})
    emailId: string;
    
    @Column()
    userName: string;

    @Column("text")
    password: string;

    @CreateDateColumn()
    accountCreationDate: Date;

    @BeforeInsert ()
    addUUId ()
    {
        this.userId = uuidv4();
    }

    @OneToMany (() => Feeds, (feed:Feeds) => feed.user)
    feeds:Feeds[];
}

