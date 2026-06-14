import { ICategory } from './category';

export type IPostProps = {
  category: ICategory;
  content: string;
  date_created: string;
  date_updated: string;
  description: string;
  id: string;
  slug: string;
  sort: string;
  status: string;
  thumbnail: {
    charset: string;
    description: string;
    duration: string;
    embed: string;
    filename_disk: string;
    filename_download: string;
    filesize: string;
    folder: string;
    height: number;
    id: string;
    location: string;
    metadata: {};
    modified_by: string;
    modified_on: string;
    storage: string;
    tags: string;
    title: string;
    type: string;
    uploaded_by: string;
    uploaded_on: string;
    width: number;
  };
  title: string;
  user_created: string;
  user_updated: string;
};
