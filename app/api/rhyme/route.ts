import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  if (!q) return NextResponse.json({ perfect: [], near: [], assonance: [] });

  const endpoint = (rel: string) =>
    `https://api.datamuse.com/words?max=50&${rel}=${encodeURIComponent(q)}`;

  try {
    const [perfect, near, assonance] = await Promise.all([
      fetch(endpoint("rel_rhy")).then(r => r.json()).catch(() => []),
      fetch(endpoint("rel_nry")).then(r => r.json()).catch(() => []),
      fetch(endpoint("sl")).then(r => r.json()).catch(() => []),
    ]);
    const pick = (arr: any[]) => [...new Set(arr.map(x => x.word))];
    return NextResponse.json({
      perfect: pick(perfect),
      near: pick(near),
      assonance: pick(assonance),
    });
  } catch {
    return NextResponse.json({ perfect: [], near: [], assonance: [] });
  }
}
