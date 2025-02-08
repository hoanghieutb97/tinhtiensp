// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const token = req.cookies.get("authToken"); // Lấy token từ cookie

//   // Danh sách các trang yêu cầu đăng nhập
//   const protectedRoutes = ["/dashboard", "/profile", "/settings"];

//   if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url)); // Chuyển hướng về login nếu chưa đăng nhập
//     }
//   }

//   return NextResponse.next(); // Tiếp tục render nếu đã đăng nhập
// }

// // Chỉ áp dụng middleware cho các route cụ thể
// export const config = {
//   matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"], // Các trang cần kiểm tra đăng nhập
// };


import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("authToken"); // Lấy token từ cookie

  // Các route công khai không yêu cầu đăng nhập
  const publicRoutes = ["/login", "/api/auth/login", "/api/auth/logout"];

  // Bỏ qua các file tĩnh (CSS, JS, Images)
  if (
    req.nextUrl.pathname.startsWith("/_next/") || 
    req.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Nếu chưa đăng nhập và truy cập trang không công khai -> Chuyển hướng đến login
  if (!publicRoutes.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // Tiếp tục nếu hợp lệ
}

// Áp dụng middleware cho tất cả route
export const config = {
  matcher: "/:path*", // Chặn tất cả trang (trừ những trang được loại trừ)
};
