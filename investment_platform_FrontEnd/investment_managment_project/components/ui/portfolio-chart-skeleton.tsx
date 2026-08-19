"use client";

import { Skeleton } from "@/components/ui/skeleton";


const points = [
  { left: "5%", bottom: "35%" },
  { left: "20%", bottom: "50%" },
  { left: "35%", bottom: "42%" },
  { left: "50%", bottom: "65%" },
  { left: "65%", bottom: "55%" },
  { left: "80%", bottom: "75%" },
  { left: "95%", bottom: "68%" },
];


export default function PortfolioChartSkeleton() {
  return (
    <section
      className="
        bg-white
        border
        border-gray-100
        rounded-2xl
        shadow-sm
        p-6
      "
    >

      {/* Title */}

      <div className="mb-8">

        <Skeleton
          className="
            h-7
            w-48
          "
        />

        <Skeleton
          className="
            mt-3
            h-4
            w-72
          "
        />

      </div>



      {/* Chart Container */}

      <div
        className="
          relative
          h-[300px]
          w-full
          overflow-hidden
          rounded-xl
          bg-gray-50
        "
      >


        {/* Grid */}

        <div
          className="
            absolute
            inset-x-8
            top-8
            bottom-10
            flex
            flex-col
            justify-between
          "
        >

          {[1, 2, 3, 4].map((item) => (
            <Skeleton
              key={item}
              className="
                h-px
                w-full
              "
            />
          ))}

        </div>



        {/* Fake Area */}

        <div
          className="
            absolute
            inset-x-8
            bottom-10
            top-8
          "
        >

          <div
            className="
              absolute
              inset-0
              animate-pulse
              bg-gray-200/70
            "
            style={{
              clipPath:
                "polygon(0% 70%, 15% 55%, 30% 62%, 45% 35%, 60% 48%, 75% 25%, 90% 40%, 100% 20%, 100% 100%, 0% 100%)",
            }}
          />



          {/* Chart Line */}

          <div
            className="
              absolute
              inset-0
              animate-pulse
            "
            style={{
              clipPath:
                "polygon(0% 70%, 15% 55%, 30% 62%, 45% 35%, 60% 48%, 75% 25%, 90% 40%, 100% 20%, 100% 22%, 90% 42%, 75% 27%, 60% 50%, 45% 37%, 30% 64%, 15% 57%, 0% 72%)",
              backgroundColor: "rgb(209 213 219)",
            }}
          />



          {/* Points */}

          {points.map((point, index) => (
            <Skeleton
              key={index}
              className="
                absolute
                h-3
                w-3
                rounded-full
              "
              style={{
                left: point.left,
                bottom: point.bottom,
              }}
            />
          ))}


        </div>




        {/* X Axis */}

        <Skeleton
          className="
            absolute
            bottom-8
            left-8
            right-8
            h-px
          "
        />


        {/* Y Axis */}

        <Skeleton
          className="
            absolute
            left-8
            top-8
            bottom-8
            w-px
          "
        />


      </div>


    </section>
  );
}