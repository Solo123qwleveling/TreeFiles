// ============================================
// File: src/routes/index.tsx (Updated)
// ============================================
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DashboardLayout, MainFilesLayout } from '../layouts';
import { Home } from '../pages/Home';
import { Analytics } from '../pages/Analytics';
import { Users } from '../pages/Users';
import { Settings } from '../pages/Settings';
import { UserDetail } from '../pages/UserDetail';
import { NotFound } from '../pages/NotFound';
import LocationMap from '../pages/location/locaitonMaps';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'analytics',
        element: <Analytics />
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'user/:id',
        element: <UserDetail />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'FilesTree/:userId',
        element: <MainFilesLayout />
      },
      {
        path: 'location',
        element: <LocationMap />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);

export const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};