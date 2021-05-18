import { Document } from 'mongoose';
import { IPersistentEntity } from 'src/shared/core/interfaces/IPersistentEntity';

export abstract class PersistentEntity extends Document
  implements IPersistentEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
