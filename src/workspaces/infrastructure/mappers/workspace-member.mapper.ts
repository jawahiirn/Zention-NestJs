import { WorkspaceMember } from '../../domain/workspace-member';
import { WorkspaceMemberEntity } from '../entities/workspace-member.entity';

export class WorkspaceMemberMapper {
  static toDomain(entity: WorkspaceMemberEntity): WorkspaceMember {
    return new WorkspaceMember(
      entity.userId,
      entity.workspaceId,
      entity.role,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: WorkspaceMember): WorkspaceMemberEntity {
    const entity = new WorkspaceMemberEntity();
    entity.userId = domain.userId;
    entity.workspaceId = domain.workspaceId;
    entity.role = domain.role;
    entity.status = domain.status;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
