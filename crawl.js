const {JSDOM } = require('jsdom');
const fetch = require('node-fetch');

async function crawlPage(baseURL, currentURL, pages = {}){

    const baseDomain = new  URL(baseURL).hostname;
    const currentDomain = new URL(currentURL).hostname;

    if(currentDomain !== baseDomain){
        return pages;
    }

    const normalizedURL = new URL(currentURL).href;

    if(pages[normalizedURL]){
        pages[normalizedURL]++;
        return pages;
    }

    pages[normalizedURL] = normalizedURL === baseURL ? 0 : 1;

    const response = await fetch(normalizedURL);
    const html = await response.text();
    const dom = new JSDOM(html);
    const links = dom.window.document.querySelectorAll('a');

    for(let link of links){
        const href = link.getAttribute('href');


        if(!href || href.startsWith('#') || href.toLowerCase().startsWith('javascript')){
            continue;
        }
        const nextURL = new URL(href, normalizedURL).href;
        pages = await crawlPage(baseURL, nextURL, pages);
    }

    return pages;

}

async function main(){
    
}

// function getURLsFromHTML(htmlBody, baseURL){
//     const urls = []
//     const dom = new JSDOM(htmlBody)
//     const aElements = dom.window.document.querySelectorAll('a')
//     for(const aElement of aElements){
//         if(aElement.href.slice(0,1)=== '/'){
//             try{
//                 urls.push(new URL(aElement.href, baseURL).href)
//             }catch(err){
//                 console.log(`${err.message}: ${aElement.href}`)
//             }
//         } else {
//             try {
//                 urls.push(new URL(aElement.href).href)
//             } catch (err){
//                 console.log(`${err.message}: ${aElement.href}`)
//             }
//         }
//     }
//     return urls
// }

// function normalizedURL(url){
//     const urlObj = new URL(url)
//     let fullPath = `${urlObj.host}${urlObj.pathname}}`
//     if(fullPath.length > 0 && fullPath.slice(-1) === '/'){
//         fullPath = fullPath.slice(0, -1)
//     }
//     return fullPath
// }

//  async function crawlPage(baseURL, currentURL, pages){
//     console.log(`Crawling ${url}`)
//      try{
//         const  response = await fetch(url);
        
//         if(response.status > 399){
//             console.warn("HTTP Error:", response.status);
//             return;
//         }

//         const contentType  = response.headers.get('content-type');
        
//          if(!contentType || !contentType.includes("text/html")){
//             console.warn("Invalid content type. We expect text/html, but received:", contentType);
//             return;
//          }

//         const body = await  response.text();
//         console.log(body) 

//     } catch(error){
//         console.error('An error occured: ', error);
//     }
//  }

module.exports = {
    normalizedURL,
    getURLsFromHTML,
    crawlPage
}