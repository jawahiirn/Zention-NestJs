import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { WorkspaceMemberEntity } from '../members/entities/workspace-member.entity';

@Entity('workspaces')
export class WorkspaceEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  icon: string | null;

  @Column({ type: 'varchar', nullable: true })
  iconColor: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToMany(() => WorkspaceMemberEntity, (member) => member.workspace)
  members: WorkspaceMemberEntity[];
}
