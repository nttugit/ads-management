import BaseHandler from './base.handler.js';
import Model from '../models/adsEditRequest.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(Model);
    }
}

export default Handler;
