'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';

export default function Nav() {
  return (
    <NavigationMenu.Root className="bg-white border-b">
      <NavigationMenu.List className="flex space-x-8 px-6 py-4">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Account
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Search Profile
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/my-jobs" className="text-gray-700 hover:text-gray-900 font-medium">
              Job Listings
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/subscribe" className="text-gray-700 hover:text-gray-900 font-medium">
              Subscriptions
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
