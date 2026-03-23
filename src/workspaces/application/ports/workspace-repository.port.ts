import { Injectable } from '@nestjs/common';
import { Workspace } from '../../domain/workspace';
import { WorkspaceMember } from '../../domain/workspace-member';

@Injectable()
export abstract class WorkspaceRepositoryPort {
  abstract save(workspace: Workspace): Promise<void>;
  abstract findById(userId: string, workspaceId: string): Promise<Workspace>;
  abstract findAllByUserId(userId: string): Promise<Workspace[]>;
  abstract saveMember(member: WorkspaceMember): Promise<void>;
  abstract findMember(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMember>;
  abstract remove(workspaceId: string): Promise<void>;
}
