import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { WorkspaceRole } from '../../domain/enums/workspace-role.enum';
import { WorkspaceMemberStatus } from '../../domain/enums/workspace-member-status.enum';
import { UserEntity } from '../../../users/infrastructure/entities/user.entity';
import { WorkspaceEntity } from './workspace.entity';

@Entity('workspace_members')
export class WorkspaceMemberEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint' })
  userId: string;

  @Column({ type: 'bigint' })
  workspaceId: string;

  @Column({
    type: 'enum',
    enum: WorkspaceRole,
    default: WorkspaceRole.MEMBER,
  })
  role: WorkspaceRole;

  @Column({
    type: 'enum',
    enum: WorkspaceMemberStatus,
    default: WorkspaceMemberStatus.PENDING,
  })
  status: WorkspaceMemberStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => WorkspaceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: WorkspaceEntity;
}
