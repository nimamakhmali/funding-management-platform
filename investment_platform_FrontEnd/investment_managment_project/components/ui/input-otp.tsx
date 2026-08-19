"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <div className="w-full flex justify-center" dir="ltr">
      <OTPInput

        textAlign="left"
        dir="ltr"
        style={{
          direction: "ltr",
          unicodeBidi: "isolate",
        }}
        data-slot="input-otp"
        containerClassName={cn(
          "flex items-center gap-2 justify-center",
          containerClassName
        )}
        spellCheck={false}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      />
    </div>
  )
}

function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center gap-2 rounded-xl justify-center",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } =
    inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-12 w-10 items-center justify-center",
        "rounded-lg border border-gray-200 bg-white text-base font-medium",
        "transition-all duration-200",
        "data-[active=true]:border-violet-500 data-[active=true]:ring-2 data-[active=true]:ring-violet-200",
        "dark:border-zinc-700 dark:bg-zinc-900",
        className
      )}
      {...props}
    >
      {char}

      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-[2px] animate-pulse bg-violet-500" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      className="mx-2 text-gray-400"
      {...props}
    >
      <MinusIcon className="h-4 w-4" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }