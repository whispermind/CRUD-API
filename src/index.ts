import { createServer } from 'http';
import * as url from 'url';
import requestHandler, { IResponse } from './requestHandler/index';
import 'dotenv/config'

const server = createServer((req, res) => {
  const parsedUrl = url.parse(req.url!);
  const sendResponse = (responseData: IResponse) => {
    res.statusCode = responseData.status;
    res.statusMessage = responseData.message || '';
    res.end(responseData.payload);
  };

  try{
    if (req.method === 'GET') {
      const responseData = requestHandler.get(parsedUrl);
      sendResponse(responseData);
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const responseData = requestHandler.post(parsedUrl, JSON.parse(body));
        sendResponse(responseData);
      });

      req.on('error', (e) => {
        sendResponse({status: 500, payload: null, message: e.message});
      });
    }

    if(req.method === 'DELETE') {
      const responseData = requestHandler.delete(parsedUrl);
      sendResponse(responseData);
    }
  }
  catch(e){
    if(e instanceof Error) sendResponse({status: 500, payload: null, message: `Server error: ${e.message}`});
  }
});

server.listen(process.env.PORT);
