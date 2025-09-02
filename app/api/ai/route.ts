import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt, mood } = await req.json();
  // If you don't have a model hooked up yet, return deterministic stub
  const base = (s: string) => s && s.trim().length ? s.trim() : "your idea";
  return NextResponse.json({
    suggestions: [
      { text: `Try a ${mood || "neutral"} angle: ${base(prompt)} as a single vivid scene.` , confidence: 0.72 },
      { text: `Flip POV to the room, not the person. Keep lines short.`, confidence: 0.64 },
      { text: `Anchor with one object (keys, coat hook, receipt) each verse.`, confidence: 0.61 }
    ]
  });
}
