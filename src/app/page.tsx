import { SorteioClient } from "@/components/sorteio/SorteioClient";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SorteioClient />
    </div>
  );
}
