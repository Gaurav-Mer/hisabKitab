export const rand = () => {
    return Math.random().toString(36).substring(2)
}

export const randomID = () => {
    let t = new Date().getTime()
    return rand() + rand() + t.toString()
}


export const priceFormat = (number) => {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR', // Specify the currency code (e.g., USD for US dollars)
    }).format(number);
    return currencyFormatter
}

export const capitalizeFirst = (str) => {
    if(!str){
        return ""
    }
    return `${str[0]?.toUpperCase()}${str.slice(1, str?.length)}`
}