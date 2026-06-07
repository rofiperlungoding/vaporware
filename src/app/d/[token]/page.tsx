import PaintedDoorClient from "@/components/PaintedDoorClient";
import { getDoorIdea } from "@/lib/painted-door";

export default async function PaintedDoorPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const idea = await getDoorIdea(token);
  return <PaintedDoorClient token={token} idea={idea} />;
}
