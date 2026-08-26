import { NextResponse } from "next/server";
import { requireManagementAuth } from "@/lib/api/requireManagementAuth";
import { bindVolcenginePlansFromConsoleCredentials } from "@/lib/providers/volcenginePlanBinding";
import { sanitizeErrorMessage } from "@omniroute/open-sse/utils/error.ts";

/**
 * POST /api/providers/volcengine-plan/connect/[sessionId]/code
 * Submit the SMS verification code (plus image captcha when required) for an
 * auto phone login session. Returns the session view; binding runs lazily on
 * the next status poll once credentials are extracted.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse> {
  const auth = await requireManagementAuth(request);
  if (auth) return auth;

  const { sessionId } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    const { volcengineConsoleAutoLoginService } =
      await import("@omniroute/open-sse/services/volcengineConsoleAutoLogin.ts");

    if (!volcengineConsoleAutoLoginService.getStatus(sessionId)) {
      return NextResponse.json(
        { success: false, error: "Unknown or expired Volcano login session" },
        { status: 404 }
      );
    }

    const timeout = typeof body.timeout === "number" ? body.timeout : undefined;
    const session = await volcengineConsoleAutoLoginService.submitCode(
      sessionId,
      String(body.code ?? ""),
      typeof body.captcha === "string" ? body.captcha : undefined,
      { timeout }
    );
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unknown or expired Volcano login session" },
        { status: 404 }
      );
    }

    // Credentials ready → bind immediately so the response carries the outcome.
    if (session.phase === "success") {
      const bound = await volcengineConsoleAutoLoginService.withBinding(sessionId, (credentials) =>
        bindVolcenginePlansFromConsoleCredentials(credentials)
      );
      return NextResponse.json({ success: true, session: bound ?? session });
    }

    return NextResponse.json({ success: false, session });
  } catch (error) {
    const message = sanitizeErrorMessage(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, error: `Volcano code submission failed: ${message}` },
      { status: 500 }
    );
  }
}
