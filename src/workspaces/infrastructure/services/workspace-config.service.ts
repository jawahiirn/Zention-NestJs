import { Injectable } from '@nestjs/common';
import { WorkspaceConfigPort, WorkspaceCreationMetadata } from '../../application/ports/workspace-config.port';
import { WorkspacePurpose } from '../../domain/enums/workspace-purpose.enum';

@Injectable()
export class WorkspaceConfigService implements WorkspaceConfigPort {
  getCreationMetadata(): WorkspaceCreationMetadata {
    return {
      purposes: [
        {
          id: WorkspacePurpose.WORK,
          label: 'Work',
          description: 'Project management and team collaboration',
        },
        {
          id: WorkspacePurpose.SCHOOL,
          label: 'School',
          description: 'Assignments, notes and study groups',
        },
        {
          id: WorkspacePurpose.PERSONAL,
          label: 'Personal',
          description: 'Individual tasks and private projects',
        },
      ],
      integrations: [
        { id: 'slack', name: 'Slack', icon: 'slack-icon-url' },
        { id: 'github', name: 'GitHub', icon: 'github-icon-url' },
      ],
    };
  }
}
