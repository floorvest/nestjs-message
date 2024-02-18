import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'jobs'
})
export class Job {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'job_key'
    })
    jobKey: string;

    @Column()
    userId: number;

    @Column({
        type: 'longtext',
        nullable: true,
    })
    information: string;

    @Column({
        name: 'triggered_at',
        type: 'datetime'
    })
    triggeredAt: Date;

    @Column()
    attempt: number;

    @CreateDateColumn({
        name: "created_at",
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date


    @UpdateDateColumn({
        name: 'updated_at',
        nullable: true
    })
    updatedAt: Date;
}