import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
  '/event(.*)',  // all event pages public by default
]);

// Routes we want to **force protect**, even though they match public patterns
const explicitlyProtectedRoutes = ['/dashboard', '/event-registration'];

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = new URL(req.url).pathname;

  const isExplicitlyProtected = explicitlyProtectedRoutes.includes(pathname);
  const isActuallyPublic = isPublicRoute(req) && !isExplicitlyProtected;

  // ✅ If user is logged in and accessing a public route, redirect to /dashboard
  if (userId && isActuallyPublic) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // ❌ If user is NOT logged in and trying to access a protected route
  if (!userId && !isActuallyPublic) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
