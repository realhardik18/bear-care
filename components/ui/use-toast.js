import { useEffect, useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toasts = new Map()

const useToast = () => {
  const [mounted, setMounted] = useState(false)
  const [toastState, setToastState] = useState(
    Array.from(toasts.values())
  )

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      setToastState(Array.from(toasts.values()))
    }
  }, [mounted, toasts])

  function toast({ ...props }) {
    const id = genId()

    const update = (props) => {
      if (toasts.has(id)) {
        toasts.set(id, { ...toasts.get(id), ...props })
        setToastState(Array.from(toasts.values()))
      }
      return id
    }

    const dismiss = () => {
      toasts.delete(id)
      setToastState(Array.from(toasts.values()))
    }

    toasts.set(id, {
      ...props,
      id,
      dismiss,
      update,
    })
    setToastState(Array.from(toasts.values()))

    // Auto-dismiss after timeout
    setTimeout(() => {
      dismiss()
    }, TOAST_REMOVE_DELAY)

    return {
      id,
      dismiss,
      update,
    }
  }

  return {
    toast,
    toasts: toastState,
    dismiss: (toastId) => {
      toasts.delete(toastId)
      setToastState(Array.from(toasts.values()))
    },
  }
}

export { useToast }
