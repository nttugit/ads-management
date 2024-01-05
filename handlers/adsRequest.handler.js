import BaseHandler from './base.handler.js';
import Model from '../models/adsRequest.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(Model);
    }
}

export default Handler;
