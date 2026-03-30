import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ default: '' })
  fullName: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true, unique: true })
  googleId: string | null;

  @Column({ default: false })
  isPending: boolean;
}
