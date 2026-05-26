import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { WorkspaceEntity } from '../../entities/workspace.entity';
import { User } from '../../../users/entities/user.entity';
import { WorkspaceMemberRole } from '../../enums/workspace-roles.enum';

@Entity('workspace_members')
export class WorkspaceMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.members)
  @JoinColumn({ name: 'workspaceId' })
  workspace: WorkspaceEntity;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: WorkspaceMemberRole,
    default: WorkspaceMemberRole.MEMBER,
  })
  role: WorkspaceMemberRole;

  @CreateDateColumn()
  joinedAt: Date;
}
