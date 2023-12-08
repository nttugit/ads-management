import BaseHandler from './base.handler.js';
import AdsCategoryModel from '../models/adsCategory.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(AdsCategoryModel);
    }
}

export default Handler;
