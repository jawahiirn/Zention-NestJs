import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ type: 'varchar', nullable: true })
  fullName: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  joinedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true, unique: true })
  googleId: string | null;

  @Column({ default: true }) // Changed to true to indicate placeholder status
  isPending: boolean;
}
