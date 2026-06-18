// src/app/router/index.tsx

import {
  createBrowserRouter,
  isRouteErrorResponse,
  redirect,
  RouterProvider,
  useRouteError,
} from 'react-router';

import { AppLayout } from '@/app/layout';
import { AdminLayout } from '@/widgets/admin-layout';

import { BlogArticlePage } from '@/pages/blog-article';
import { BlogArchivePage } from '@/pages/blog-archive';
import { BlogHomePage } from '@/pages/blog-home';
import { BlogSearchPage } from '@/pages/blog-search';
import { ErrorPreviewPage } from '@/pages/error-preview';
import { HomePage } from '@/pages/home';
import { ProjectStructurePage } from '@/pages/project-structure';

import { AdminLoginPage } from '@/pages/admin-login';
import { AdminDashboardPage } from '@/pages/admin-dashboard';
import { AdminArticlesPage } from '@/pages/admin-articles';
import { AdminCommentsPage } from '@/pages/admin-comments';
import { AdminCategoriesPage } from '@/pages/admin-categories';
import { AdminTagsPage } from '@/pages/admin-tags';
import { AdminUploadsPage } from '@/pages/admin-uploads';
import { AdminSettingsPage } from '@/pages/admin-settings';
import { AdminLinksPage } from '@/pages/admin-links';

import { Error403, Error404, Error500, ErrorRouteCrash } from '@/features/error-feedback';
import { isAuthenticated } from '@/features/admin-auth';

import { getAppEnv } from '@/shared/env';

import { canAccessGame2048Lab, Game2048LabPage } from '@/labs/game-2048';
import { canAccessSandboxPlayground, SandboxPlaygroundPage } from '@/sandbox/playground';

function RouteErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 403) {
      return <Error403 />;
    }

    if (error.status === 404) {
      return <Error404 />;
    }

    if (error.status >= 500) {
      return <Error500 />;
    }
  }

  return <ErrorRouteCrash />;
}

function RouteErrorBoundary() {
  return (
    <AppLayout>
      <RouteErrorPage />
    </AppLayout>
  );
}

function game2048LabLoader() {
  if (!canAccessGame2048Lab(getAppEnv())) {
    throw redirect('/');
  }

  return null;
}

function sandboxPlaygroundLoader() {
  if (!canAccessSandboxPlayground(getAppEnv())) {
    throw redirect('/');
  }

  return null;
}

function adminGuardLoader() {
  if (!isAuthenticated()) {
    throw redirect('/admin/login');
  }

  return null;
}

const router = createBrowserRouter([
  {
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        element: <ProjectStructurePage />,
        path: 'project-structure',
      },
      {
        element: <BlogHomePage />,
        path: 'blog',
      },
      {
        element: <BlogArticlePage />,
        path: 'blog/article/:id',
      },
      {
        element: <BlogSearchPage />,
        path: 'blog/search',
      },
      {
        element: <BlogArchivePage />,
        path: 'blog/archive',
      },
      {
        element: <BlogArchivePage />,
        path: 'blog/archive/:year/:month',
      },
      {
        element: <ErrorPreviewPage />,
        path: 'error-preview',
      },
      {
        element: <Game2048LabPage />,
        loader: game2048LabLoader,
        path: 'labs/game-2048',
      },
      {
        element: <SandboxPlaygroundPage />,
        loader: sandboxPlaygroundLoader,
        path: 'sandbox/playground',
      },
      {
        element: <Error404 />,
        path: '*',
      },
    ],
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    path: '/',
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    loader: adminGuardLoader,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'articles', element: <AdminArticlesPage /> },
      { path: 'comments', element: <AdminCommentsPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'tags', element: <AdminTagsPage /> },
      { path: 'uploads', element: <AdminUploadsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'links', element: <AdminLinksPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
