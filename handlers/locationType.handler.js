import BaseHandler from './base.handler.js';
import LocationTypeModel from '../models/locationType.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(LocationTypeModel);
    }
}

export default Handler;
