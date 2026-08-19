import Image from "next/image";

export default function MissionImage() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-2xl">
      <Image
        src="/images/img-1.png"
        alt="Mission"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}