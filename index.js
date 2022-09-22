const axios = require("axios");
const cheerio = require("cheerio")
const express = require('express')
var cors = require('cors');
const app = express()
const port = Number(process.env.PORT || 3000);
app.get('/', (req, res, next) => {
res.status(200).json({
        status: 'success',
        data: {
            name: 'Hello World',
            version: '0.1.0'
        }
    });
})

app.get('/nullphpscript/all', (req, res, next) => {

axios.get("https://nullphpscript.com/").then(data => {
  //console.log(data)
  let ch = cheerio.load(data.data)
  let dataToSend = [];
  let titles = ch('.entry-title')
  titles.each(function(){
   let title = ch(this)[0].children[0]
   if(title.name == "a"){
     
     dataToSend.push({
       title:title.attribs.title,
       href:title.attribs.href, 
       source:"nullphpscript.com"
     })
     
   }
  })
  res.status(200).json({
    status:"success",
    data:dataToSend
  })
})
})
app.get('/nullphpscript/post', (req, res, next) => {
let url = req.query.url
  axios.get(url).then(response=> {
    let ch = cheerio.load(response.data);
    let dataToSend = {}
    ch('.td-a-rec').each(function(){
      ch(this).remove();
    })
    ch('script').each(function(){
      ch(this).remove();
    })
    ch('.td-g-rec').each(function(){
      ch(this).remove();
    })
    let aCount = 0;
    
    console.log("----")
    let title = ch('.entry-title');
    let postdate = ch('.entry-date');
    
    let postThumbnail = ch('.td-post-content').find('img').each(function(){
      
    })
    ch('.td-post-content').find('a').each(function(){
    let href = ch(this)[0].attribs.href
    if(href.includes('wp.com')){
      ch(this).remove()
    }else if(href.includes("https://nullphpscript.com")){
      ch(this)[0].attribs.href = href.replace("nullphpscript","nullez")
    }
    })
    dataToSend.date = postdate[0].children[0].data
    dataToSend.dateTime = postdate[0].attribs.datetime
    dataToSend.title = title[0].children[0].data
  //  console.log(postContent[0].children)
    let imgUrl = postThumbnail[0].attribs['data-lazy-src']
    imgUrl = imgUrl.split('?')
    imgUrl = imgUrl[0]
    dataToSend.imgUrl = imgUrl;
    ch('.td-post-featured-image').each(function(){
      ch(this).remove();
    })
    ch('noscript').each(function(){
      ch(this).remove();
    })
    let postContent = ch('.td-post-content')
    dataToSend.content = ch.html('.td-post-content')
    res.status(200).json({
  status:"success",
  data:dataToSend
})
  })
})
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
