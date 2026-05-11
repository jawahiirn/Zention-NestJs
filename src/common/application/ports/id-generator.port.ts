export interface IdGeneratorPort {
  generate(): string;
}

export const IdGeneratorPort = Symbol('IdGeneratorPort');
