import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '', // Root route
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'userlogin',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'usersignup',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'singlemovie/:id', // Dynamic route
    renderMode: RenderMode.Server, // Use server-side rendering
  },
  {
    path: '**', // Catch-all for unmatched routes
    renderMode: RenderMode.Prerender,
  },
];
