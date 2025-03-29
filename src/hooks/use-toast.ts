
import {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"
import {
  useToast as useToastOriginal,
} from "@/components/ui/use-toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Fix circular dependency issue
export const useToast = () => {
  return useToastOriginal()
}

// Create a standalone toast function that doesn't rely on the hook
export const toast = (props: Omit<ToasterToast, "id">) => {
  const { toast: toastFn } = useToastOriginal()
  return toastFn(props)
}
