export async function priceCalculation(unitPrice: number, ctmAmt: number, totalBookTime: number){
    return unitPrice * ctmAmt * totalBookTime;
}