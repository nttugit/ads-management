import BaseHandler from './base.handler.js';
import AdsModel from '../models/ads.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(AdsModel);
    }
}

export default Handler;
