export async function GET() {
    const response = new Response(
      JSON.stringify({ message: "Đăng xuất thành công!" }),
      { status: 200 }
    );
  
    // Xóa cookie bằng cách đặt Max-Age=0
    response.headers.append("Set-Cookie", "authToken=; Path=/; HttpOnly; Secure; Max-Age=0");
  
    return response;
  }
  