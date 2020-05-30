const observers: any[] = []

export const setSnack = (snack: String) => {
    observers.forEach(callback => callback(snack))
}

export const addSnackObserver = (observerCallback: any) => {
    observers.push(observerCallback)
}
