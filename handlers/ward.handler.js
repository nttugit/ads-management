import BaseHandler from './base.handler.js';
import WardModel from '../models/ward.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(WardModel);
    }
}

export default Handler;
