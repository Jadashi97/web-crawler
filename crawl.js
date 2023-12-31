// const normalizedURL = ()=>{
//     console.log("Yay gotcha!!");
// };

function normalizedURL(url){
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}}`
    if(fullPath.length > 0 && fullPath.slice(-1) === '/'){
        fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}

module.exports = {
    normalizedURL
}