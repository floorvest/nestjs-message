import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'failed_jobs'
})
export class FailedJob {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'job_key'
    })
    jobKey: string;

    @Column()
    userId: number;

    @Column({
        type: 'text',
        nullable: true,
    })
    information: string;

    @Column({
        name: "failed_reason",
        type: 'text',
        nullable: true
    })
    failedReason: string;

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