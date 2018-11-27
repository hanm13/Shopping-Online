import {ImageLinks} from './image-links.model';
export interface VolumeInfo {
    title?: string;
    imageLinks?: ImageLinks;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    subtitle?: string;
    publisher? : string;
}
