import BaseHandler from './base.handler.js';
import AdsLocationModel from '../models/adsLocation.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(AdsLocationModel);
    }
}

export default Handler;
