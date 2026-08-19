"use client";


import { Skeleton } from "@/components/ui/skeleton";
import { useSkeleton } from "@/lib/hooks/useSkeleton";


type ProjectSkeletonProps = {
  count?: number;
};



export default function ProjectSkeleton({
  count = 6,
}: ProjectSkeletonProps) {


  const skeletons = useSkeleton(count);



  return (

    <section
      className="
        mt-8
        grid
        grid-cols-1
        gap-8
        md:grid-cols-2
        xl:grid-cols-3
      "
    >

      {skeletons.map((_, index) => (

        <div
          key={index}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-surface
            shadow-sm
          "
        >


          {/* Image */}

          <Skeleton
            className="
              h-48
              w-full
            "
          />



          <div className="p-6">


            {/* Title */}

            <Skeleton
              className="
                h-6
                w-3/4
                rounded-lg
              "
            />



            {/* Industry */}

            <Skeleton
              className="
                mt-3
                h-4
                w-1/3
              "
            />



            {/* Description */}

            <div className="mt-4 space-y-2">

              <Skeleton
                className="h-4 w-full"
              />


              <Skeleton
                className="h-4 w-5/6"
              />

            </div>





            {/* Symbol + Profit */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
              "
            >

              <Skeleton
                className="
                  h-7
                  w-16
                  rounded-lg
                "
              />


              <Skeleton
                className="
                  h-5
                  w-20
                "
              />

            </div>





            {/* Stats */}

            <div
              className="
                mt-7
                flex
                justify-between
              "
            >

              <Skeleton
                className="
                  h-20
                  w-20
                  rounded-xl
                "
              />


              <Skeleton
                className="
                  h-20
                  w-20
                  rounded-xl
                "
              />


              <Skeleton
                className="
                  h-20
                  w-20
                  rounded-xl
                "
              />

            </div>





            {/* Progress bar */}

            <Skeleton
              className="
                mt-6
                h-2
                w-full
                rounded-full
              "
            />





            {/* Button */}

            <Skeleton
              className="
                mt-6
                h-12
                w-full
                rounded-xl
              "
            />



          </div>


        </div>


      ))}


    </section>

  );
}