import * as React from 'react';
import BlogPostClient from './BlogPostClient';

export function generateStaticParams() {
  return [{ slug: 'the-alchemy-of-cold-process-curing' }];
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}
