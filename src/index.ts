import { createServer } from 'http';
import * as url from 'url';
import requestHandler, { IResponse } from './requestHandler/index';

const PORT = 8000;

const server = createServer((req, res) => {
  const parsedUrl = url.parse(req.url!);
  const sendResponse = (responseData: IResponse) => {
    res.statusCode = responseData.status;
    res.statusMessage = responseData.message || '';
    res.end(responseData.payload);
  };

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
  }
});

server.listen(PORT);
