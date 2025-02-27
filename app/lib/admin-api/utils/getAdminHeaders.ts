import {getHeader} from '../cache/request';
import type {CrossRuntimeRequest} from '../cache/request';
import type {AdminHeaders} from '../types';

export function getAdminHeaders(request: CrossRuntimeRequest): AdminHeaders {
  return {
    requestGroupId: getHeader(request, 'request-id'),
    buyerIp: getHeader(request, 'oxygen-buyer-ip'),
    cookie: getHeader(request, 'cookie'),
    purpose: getHeader(request, 'purpose'),
  };
}
