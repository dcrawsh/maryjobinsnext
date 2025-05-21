"use client";

import { MDXProvider } from "@mdx-js/react";
import type { ReactNode } from "react";

// Tailwind overrides for every MDX file
const components = {
  a: (props: any) => (
    <a
      {...props}
      className="text-primary-600 underline-offset-2 hover:underline"
    />
  ),
  img: (props: any) => (
    <img {...props} className="rounded-lg shadow-md my-6" />
  ),
};

export default function MDXClientProvider({ children }: { children: ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
