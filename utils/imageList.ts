export const imageList = (result: [], attribName: string) => result.reduce((accumulator, current, index) => {
    if (current[attribName]) accumulator.push(current[attribName]);
    return accumulator; 
}, []);