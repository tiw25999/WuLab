import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-change-this-in-production-min32chars"
);

const COOKIE = "admin_token";

export async function signAdminToken(adminId: string) {
  return new SignJWT({ sub: adminId, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function setAdminCookie(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}

export function clearAdminCookie() {
  return { name: COOKIE, value: "", maxAge: 0, path: "/" };
}
