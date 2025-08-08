import express from  'express'
import axios from 'axios'

const app = express();

const port = process.env.PORT ?? 8000;

app.get('/', (req, res) => {
    return res.json({status : "success"})
})

const cacheStore = {
    totalPageCount : 0
}

app.get('/books', async (req, res) => {
   const response = await axios.get('https://api.freeapi.app/api/v1/public/books')
   return res.json(response.data)
})

app.get('/books/total', async(req, res) => {

    if(cacheStore.totalPageCount) {
        console.log(('Cache Hit'))
        return res.json({totalPageCount : Number(cacheStore.totalPageCount)})
    }

    const response = await axios.get('https://api.freeapi.app/api/v1/public/books')
    const totalPageCount = response?.data?.data?.data?.reduce((acc : number, curr:{volumeInfo?: {pageCount?:number}}) => {
        return !curr.volumeInfo?.pageCount ? acc : curr.volumeInfo.pageCount + acc
    }, 0) 
    
    cacheStore.totalPageCount = Number(totalPageCount);

    console.log('Cache Miss')
    return res.json({totalPageCount})
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})