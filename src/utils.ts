export const getIsMobileDevice = () => {
  return 'share' in navigator
}

export const getIsTeslaBrowser = () => navigator.userAgent.includes('Tesla')
