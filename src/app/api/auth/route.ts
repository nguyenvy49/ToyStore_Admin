export async function POST(request: Request) {
  const body = await request.json()
  const sessionToken = body.sessionToken as string
  const expiresAt = body.expiresAt as string
  const roleUser = body.roleUser as string

  if (!sessionToken) {
    return Response.json({ message: "Không nhận được sessionToken" }, { status: 400 })
  }

  const expiresDate = new Date(expiresAt)
  const cookieOptions = `path=/; expires=${expiresDate.toUTCString()}; sameSite=lax; secure=true`

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Set-Cookie": [
        `sessionToken=${encodeURIComponent(sessionToken)}; ${cookieOptions}`,
        `roleUser=${encodeURIComponent(roleUser)}; ${cookieOptions}`
      ].join(", "),
      "Content-Type": "application/json"
    }
  })
}
