import { Injectable } from '@nestjs/common';
import { WorkspaceMember } from '../../domain/workspace-member';
import { Workspace } from '../../domain/workspace';

@Injectable()
export abstract class WorkspaceMemberRepositoryPort {
  abstract updateMember(membership: WorkspaceMember): Promise<void>;
  abstract deleteMember(userId: string, workspaceId: string): Promise<void>;
  abstract findMembersByWorkspace(
    workspaceId: string,
  ): Promise<WorkspaceMember[]>;
  abstract saveMember(member: WorkspaceMember): Promise<void>;
  abstract findMember(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMember>;
}
