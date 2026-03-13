"use client"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function LoginButton() {
  return (
    <a
      href={`${API_URL}/auth/steam`}
      className={cn(
        buttonVariants({ variant: "default", size: "default" }),
        "gap-2"
      )}
    >
      <SteamIcon className="h-4 w-4" />
      Login with Steam
    </a>
  )
}

function SteamIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11.979 0C5.359 0 0 5.36 0 11.979c0 2.393.701 4.629 1.907 6.501l-1.875 5.344 5.476-1.434c1.761.995 3.799 1.566 5.971 1.566 6.62 0 11.979-5.36 11.979-11.979C23.958 5.36 18.599 0 11.979 0zm0 21.645c-1.993 0-3.849-.59-5.404-1.604l-.378-.248-3.894 1.02 1.008-2.878-.267-.4A9.566 9.566 0 0 1 2.413 11.98c0-5.284 4.282-9.566 9.566-9.566s9.566 4.282 9.566 9.566-4.282 9.566-9.566 9.566zm5.221-8.673c-.28-.699-1.064-1.073-1.75-.83-.38.132-.653.171-1.024.085-.651-.148-1.217-.474-1.648-.966a4.283 4.283 0 0 1-.946-1.656 2.16 2.16 0 0 1 .085-1.023c.24-.688-.132-1.472-.83-1.751-.7-.28-1.48-.118-1.895.386-.408.494-.497 1.167-.23 1.764.668 1.473 1.704 2.683 3.01 3.506 1.305.823 2.814 1.23 4.371 1.154.668-.034 1.246-.398 1.518-.92.274-.52.188-1.16-.252-1.589-.44-.428-1.062-.51-1.589-.26z" />
    </svg>
  )
}
