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
} from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { User } from './users.entity';

@Entity('Feeds')
export class Feeds extends BaseEntity
{
    @PrimaryColumn("uuid")
    id:string;

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
        this.id = uuidv4();
    }

    @ManyToOne(() => User, (user:User) => user.id)
    userId: string;
}

