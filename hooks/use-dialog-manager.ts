"use client"

export function useDialogManager() {
  return {
    isOpen: false,
    open: () => {},
    close: () => {},
  }
}
