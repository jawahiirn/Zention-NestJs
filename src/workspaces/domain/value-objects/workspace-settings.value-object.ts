import { WorkspacePurpose } from '../enums/workspace-purpose.enum';

export class WorkspaceSettings {
  readonly purpose: WorkspacePurpose;
  readonly integrations: string[];
  readonly [key: string]: unknown;

  constructor(
    purpose: WorkspacePurpose,
    integrations: string[] = [],
    extra: Record<string, unknown> = {},
  ) {
    this.purpose = purpose;
    this.integrations = integrations;
    
    Object.assign(this, extra);
    this.validate();
  }

  private validate(): void {
    if (!this.purpose) {
      throw new Error('Workspace purpose is required');
    }
    if (!Object.values(WorkspacePurpose).includes(this.purpose)) {
      throw new Error(`Invalid workspace purpose: ${this.purpose}`);
    }
    if (this.integrations && !Array.isArray(this.integrations)) {
      throw new Error('Workspace integrations must be an array of strings');
    }
  }

  static fromJSON(json: any): WorkspaceSettings {
    if (!json) {
      throw new Error('JSON is required to build WorkspaceSettings');
    }
    const { purpose, integrations, ...extra } = json;
    return new WorkspaceSettings(purpose, integrations || [], extra);
  }

  toJSON() {
    const { purpose, integrations, ...extra } = this;
    return {
      purpose,
      integrations,
      ...extra,
    };
  }
}
