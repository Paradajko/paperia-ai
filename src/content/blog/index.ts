import type { ComponentType } from 'react';

export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  keywords: string;
  Content: ComponentType;
};

export const blogArticles: BlogArticle[] = [];

export function getBlogArticle(slug?: string) {
  return blogArticles.find((article) => article.slug === slug);
}
