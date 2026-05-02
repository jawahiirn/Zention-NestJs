import { WorkspacePurpose } from '../enums/workspace-purpose.enum';

export class WorkspaceSettings {
  purpose: WorkspacePurpose;
  integrations?: string[];
  [key: string]: unknown;
}
