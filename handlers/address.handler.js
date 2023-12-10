import BaseHandler from './base.handler.js';
import AddressModel from '../models/address.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(AddressModel);
    }
}

export default Handler;
