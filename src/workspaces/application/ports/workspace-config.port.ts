import { Injectable } from '@nestjs/common';

export interface WorkspacePurposeMetadata {
  id: string;
  label: string;
  description: string;
}

export interface WorkspaceIntegrationMetadata {
  id: string;
  name: string;
  icon: string;
}

export interface WorkspaceCreationMetadata {
  purposes: WorkspacePurposeMetadata[];
  integrations: WorkspaceIntegrationMetadata[];
}

@Injectable()
export abstract class WorkspaceConfigPort {
  abstract getCreationMetadata(): Promise<WorkspaceCreationMetadata> | WorkspaceCreationMetadata;
}
