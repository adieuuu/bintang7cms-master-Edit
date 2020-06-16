export const numberToCurrency = (str, symbol, withDecimal) => {
    const withSymbol = symbol ? `${symbol} ` : ''
    return (
        withDecimal ?
            `${
                withSymbol + str
                    .toFixed(2) // always two decimal digits
                    .replace('.', ',') // replace decimal point character with ,
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
            }`
            :
            `${
                withSymbol + str
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
            }`
      )
}