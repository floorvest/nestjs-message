import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({
    name: 'users'
})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: "first_name"
    })
    firstName: string;

    @Column({
        name: "last_name"
    })
    lastName: string;

    @Column({
        unique: true
    })
    email: string;

    @Column({
        name: "birth_date",
        type: "date",
    })
    birthDate: Date;

    @Column()
    timezone: string;

    @Column()
    location: string;

    @Column({
        name: 'last_announce_birthday',
        default: 0
    })
    lastAnnounceBirthday: number;

    @Column({
        name: 'is_married',
        default: false
    })
    isMarried: boolean;

    @Column({
        name: 'marriage_date',
        nullable: true,
        type: 'datetime'
    })
    marriageDate: Date;


}

