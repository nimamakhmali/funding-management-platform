import Image from "next/image";

export default function ApproachImage() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-lg">

      <div className="relative aspect-video overflow-hidden rounded-xl">

        <Image
          src="/images/img-1.png "
          alt="Dashboard"
          fill
          className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
        />

      </div>

    </div>
  );
}