import BaseHandler from './base.handler.js';
import BillboardTypeModel from '../models/billboardType.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(BillboardTypeModel);
    }
}

export default Handler;
