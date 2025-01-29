
export const orderCost ={
    rainFee:20,
    platformFee:10,
    deliveryFee:50,
    subTotal:0,
    get cartFee (){
        return this.subTotal > 500 ? 50 : 0
    },
    get totalCost(){
        return Number((this.subTotal + this.rainFee + this.deliveryFee +this.cartFee + this.platformFee).toFixed(2))
    },
}
