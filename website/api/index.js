import { handleRequest } from '../server.js';

export default function vercelHandler(request, response) {
  return handleRequest(request, response);
}
