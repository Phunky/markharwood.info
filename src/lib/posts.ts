export type PostFrontmatter = {
  slug: string;
  title: string;
  date: string;
};

export type PostModule = {
  frontmatter: PostFrontmatter;
  Content: (props?: Record<string, unknown>) => unknown;
};

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
};

const modules = import.meta.glob('../posts/**/*.md', { eager: true }) as Record<string, PostModule>;

function sortByNewestPost(a: PostModule, b: PostModule): number {
  return Date.parse(b.frontmatter.date) - Date.parse(a.frontmatter.date);
}

export const postModules = Object.values(modules).sort(sortByNewestPost);

export const posts: PostSummary[] = postModules.map(({ frontmatter }) => ({
  slug: frontmatter.slug,
  title: frontmatter.title,
  date: frontmatter.date,
}));

export function getPostBySlug(slug: string | undefined): PostModule | undefined {
  if (!slug) return undefined;
  return postModules.find((post) => post.frontmatter.slug === slug);
}

export function getPostStaticPaths() {
  return posts.map((post) => ({
    params: { slug: post.slug },
  }));
}
