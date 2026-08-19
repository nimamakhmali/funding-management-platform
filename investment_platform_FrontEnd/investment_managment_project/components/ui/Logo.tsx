import Link from "next/link"
import { Infinity } from "lucide-react";


type Props = {
  href?: string
}

export default function Logo({ href = '/' }: Props) {


  return <Link
    href={href}
    className="flex items-center gap-2 group"
  >
    <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center text-white group-hover:bg-primary-dark transition-colors">
      <Infinity />
    </div>

    <span className="text-base font-semibold text-text-main group-hover:text-primary transition-colors">
      لگو
    </span>
  </Link>
}