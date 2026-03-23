import { Workspace } from '../../domain/workspace';
import { WorkspaceEntity } from '../entities/workspace.entity';

export class WorkspaceMapper {
  static toDomain(entity: WorkspaceEntity): Workspace {
    if (!entity) return null as any;
    return new Workspace(
      entity.id,
      entity.name,
      entity.icon ?? undefined,
      entity.iconColor ?? undefined,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Workspace): WorkspaceEntity {
    if (!domain) return null as any;
    const entity = new WorkspaceEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.icon = domain.icon ?? null;
    entity.iconColor = domain.iconColor ?? null;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
