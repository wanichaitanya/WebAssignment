import
{
    Entity, 
    Column, 
    BaseEntity, 
    PrimaryColumn, 
    BeforeInsert, 
    Unique, 
    CreateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity({name: "User"})
@Unique("unique-emailId", ["emailId"])
export class User extends BaseEntity
{
    public response = 
    {
        responseStatus : 200,
        responseJson: {}
    };

    @PrimaryColumn("uuid")
    id:string;

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
        this.id = uuidv4();
    }
}

