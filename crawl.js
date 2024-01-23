const {JSDOM } = require('jsdom');
// const fetch = require('node-fetch');

async function crawlPage(baseURL, currentURL, pages = {}){

    // if this is an offsite URL, bail immediately
    const baseDomain = new  URL(baseURL).hostname;
    const currentDomain = new URL(currentURL).hostname;

    if(currentDomain !== baseDomain){
        return pages;
    }

    const normalizedURL = new URL(currentURL);

    // if we have already visited this page
    // just increase the count and dont repeat
    // the http request
    if(pages[normalizedURL] > 0){
        pages[normalizedURL]++;
        return pages;
    }

    // initialize this page in the map since it doesnt exist yet

    pages[normalizedURL] = 1;

    // fetch and parse the html of the currentURL
    console.log(`Crawling ${currentURL}`);

    let html = ' ';

    try {
        const resp = await fetch(currentURL)
        if(resp.status > 399){
            console.log(`Got HTTP error, status code: ${resp.status}`)
            return pages
        }
        const contentType = resp.headers.get('content-type')
        if(!contentType.includes('text/html')){
            console.log(`Got non-html response: ${contentType}`)
            return pages
        }
        htmlBody = await resp.text()
    } catch (err) {
        console.log(err.message)
    }

    const nextURLs = getURLsFromHTML(htmlBody, baseURL)
    for(const nextURL of nextURLs){
        pages = await crawlPage(baseURL, nextURL, pages)
    }
    return pages
}


function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const aElements = dom.window.document.querySelectorAll('a')
    for(const aElement of aElements){
        if(aElement.href.slice(0,1)=== '/'){
            try{
                urls.push(new URL(aElement.href, baseURL).href)
            }catch(err){
                console.log(`${err.message}: ${aElement.href}`)
            }
        } else {
            try {
                urls.push(new URL(aElement.href).href)
            } catch (err){
                console.log(`${err.message}: ${aElement.href}`)
            }
        }
    }
    return urls
}

function normalizeURL(url){
    const urlObj = new URL(url)
    let fullPath = `${urlObj.host}${urlObj.pathname}}`
    if(fullPath.length > 0 && fullPath.slice(-1) === '/'){
        fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}

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
    crawlPage,
    normalizeURL,
    getURLsFromHTML
  }