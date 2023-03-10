export async function flatten2dLists(arr: any){
    var flat: any = [];

    for(let i = 0; i < arr.length ; i++){
        flat = flat.concat(arr[i]);
    }

    return flat;
}