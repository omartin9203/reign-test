export type NewsDto = {
  id: string;
  createdAt: Date;
  author: string;
  title?: string;
  storyTitle?: string;
  storyUrl?: string;
  url?: string;
  active: boolean;
  externalId?: string;
  createdAtTS?: number;
}
