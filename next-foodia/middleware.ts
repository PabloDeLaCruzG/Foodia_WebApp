import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Obtén la URL solicitada
  const { pathname } = req.nextUrl;

  // Si la solicitud es para la raíz o para archivos estáticos, se permite
  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // Obtén la cookie 'token'
  const token = req.cookies.get("token")?.value;

  // Si no hay token, redirige a la raíz
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Si existe el token, permite el acceso
  return NextResponse.next();
}

// Define las rutas donde se aplicará este middleware (todas excepto la raíz)
export const config = {
  matcher: ["/home/:path*"],
};
