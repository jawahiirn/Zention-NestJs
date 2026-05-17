import { Workspace } from '../../domain/workspace';
import { WorkspaceEntity } from '../entities/workspace.entity';
import { WorkspaceSettings } from '../../domain/value-objects/workspace-settings.value-object';

export class WorkspaceMapper {
  static toDomain(entity: WorkspaceEntity): Workspace {
    if (!entity) return null as any;
    return new Workspace(
      entity.id,
      entity.name,
      entity.settings ? WorkspaceSettings.fromJSON(entity.settings) : (null as any),
      entity.icon ?? undefined,
      entity.iconColor ?? undefined,
      entity.createdAt,
      entity.updatedAt,
      entity.isActive,
    );
  }

  static toPersistence(domain: Workspace): WorkspaceEntity {
    if (!domain) return null as any;
    const entity = new WorkspaceEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.settings = domain.settings ? domain.settings.toJSON() : {};
    entity.icon = domain.icon ?? null;
    entity.iconColor = domain.iconColor ?? null;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
