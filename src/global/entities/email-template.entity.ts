import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'email_templates'
})
export class EmailTemplates {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'name'
    })
    name: string;

    @Column({
        type: 'text'
    })
    message: string;

    @Column({
        name: 'keywords',
        nullable: true
    })
    keywords: string;

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