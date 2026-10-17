import { getChatGPTUser, chatGPTSignInPath } from "../../chatgpt-auth";
export const dynamic = "force-dynamic";
export async function GET() {
  const user = await getChatGPTUser();
  const headers = { "Cache-Control": "private, no-store, max-age=0", "Vary": "Cookie" };
  if (!user) return Response.json({ user: null, signIn: chatGPTSignInPath("/") }, { status: 401, headers });
  return Response.json({ user: { id: user.userId, name: user.fullName?.trim().slice(0, 100) || "Detetive" } }, { headers });
}
