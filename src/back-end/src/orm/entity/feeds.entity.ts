/* eslint-disable prettier/prettier */
import
{
    Entity,
    Column, 
    BaseEntity, 
    PrimaryColumn, 
    BeforeInsert, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne,
    JoinColumn
} from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { User } from './users.entity';

@Entity('Feeds')
export class Feeds extends BaseEntity
{
    @PrimaryColumn("uuid")
    feedId:string;

    @Column ("text")
    content:string;
    
    @Column()
    location:string;

    @CreateDateColumn()
    creationDate:Date;

    @UpdateDateColumn()
    updateionDate:Date;

    @BeforeInsert ()
    addUUId ()
    {
        this.feedId = uuidv4();
    }

    @Column()
    userId:string;

    @ManyToOne(() => User, (user:User) => user.feeds)
    @JoinColumn ({name:"userId"})
    user: User;
}

