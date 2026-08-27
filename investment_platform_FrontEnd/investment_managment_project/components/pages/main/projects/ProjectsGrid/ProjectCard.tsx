"use client";

import Link from "next/link";
import Image from "next/image";
import { Lock, Target, TrendingUp, Users } from "lucide-react";

import { Project } from "@/lib/types/project";

const statusConfig = {
  active: {
    label: "پذیره‌نویسی فعال",
  },

  funded: {
    label: "تکمیل تأمین مالی",
  },

  closed: {
    label: "بسته شده",
  },
};

type Props = {
  project: Project;
  detailsHref?: string;
};

export default function ProjectCard({
  project,
  detailsHref,
}: Props) {
  const status = statusConfig[project.status];

  const fundedPercent =
    (project.fundedAmount / project.targetAmount) * 100;

  const formattedTargetAmount =
    project.targetAmount.toLocaleString("fa-IR");

  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-border
        bg-surface
        shadow-sm
        transition-all
        hover:-translate-y-1
        hover:shadow-lg
        overflow-hidden
      "
    >
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            // fallback اگر تصویر لود نشد
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== "/images/img-1.png") {
                target.src = "/images/img-1.png";
              }
            }}
            unoptimized={
              // برای URLهای خارجی که ممکن است مشکل داشته باشند
              project.image.startsWith("http://")
            }
          />
          
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />


        {/* Status */}
        <div
          className="
            absolute
            top-3
            right-3
            bg-white/80
            backdrop-blur
            px-3
            py-1
            rounded-xl
            text-[10px]
            font-bold
            text-gray-800
          "
        >
          {status.label}
        </div>


        {/* Category */}
        <div
          className="
            absolute
            bottom-3
            right-3
            bg-primary/90
            text-white
            px-3
            py-1
            rounded-xl
            text-[10px]
            font-bold
          "
        >
          {project.category}
        </div>

      </div>



      <div className="p-6">

        <h3 className="text-xl font-bold text-text-main">
          {project.title}
        </h3>


        <p className="mt-1 text-xs text-muted-foreground">
          {project.industry}
        </p>

        <p className="mt-3 text-sm text-gray-500 line-clamp-2">
          {project.description}
        </p>



        <div className="mt-4 flex items-center justify-between">

          <span
            className="
              rounded-lg
              border
              border-border
              bg-muted
              px-2
              py-1
              text-xs
              text-muted-foreground
            "
          >
            {project.symbol}
          </span>


          <span className="text-sm font-bold text-primary">
            سود {project.profit}%
          </span>

        </div>



        <div className="mt-7 flex items-center text-sm text-text-muted">


          <div className="flex flex-col items-center flex-1">

            <Target className="mb-2 h-5 w-5 text-primary" />

            <span>
              هدف
            </span>

            <span
              className="
                font-bold
                text-text-main
                text-center
              "
            >
              {formattedTargetAmount} تومان
            </span>

          </div>



          <div className="w-px h-10 bg-gray-200 mx-3" />



          <div className="flex flex-col items-center flex-1">

            <TrendingUp className="mb-2 h-5 w-5 text-primary" />

            <span>
              تأمین شده
            </span>

            <span className="font-bold text-primary">
              {fundedPercent.toFixed(0)}%
            </span>

          </div>




          <div className="w-px h-10 bg-gray-200 mx-3" />




          <div className="flex flex-col items-center flex-1">

            <Users className="mb-2 h-5 w-5 text-primary" />

            <span>
              مشارکت‌کننده
            </span>

            <span className="font-bold text-text-main">
              {project.investors} نفر
            </span>

          </div>


        </div>




        <div className="mt-6">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-sm text-text-muted">
              میزان تامین مالی
            </span>


            <span className="text-sm font-bold text-primary">
              {fundedPercent.toFixed(0)}%
            </span>

          </div>



          <div className="h-2 overflow-hidden rounded-full bg-gray-200">

            <div
              className="
                h-full
                rounded-full
                bg-primary
              "
              style={{
                width: `${fundedPercent}%`,
              }}
            />

          </div>

        </div>




        {/* Button */}
        {project.status === "closed" ? (

          <button
            disabled
            className="
              mt-6
              w-full
              rounded-xl
              bg-gray-300
              py-3
              font-bold
              text-white
            "
          >
            <Lock className="inline h-4 w-4 ml-2" />
            بسته شده
          </button>


        ) : (

          <Link href={detailsHref ?? `/projects/${project.id}`}>
            <button
              className="
                mt-6
                w-full
                rounded-xl
                bg-primary
                py-3
                font-bold
                text-white
                transition-all
                hover:bg-primary-dark
              "
            >
              مشاهده جزئیات
            </button>

          </Link>

        )}


      </div>

    </div>
  );
}