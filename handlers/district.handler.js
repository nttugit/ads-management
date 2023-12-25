import BaseHandler from './base.handler.js';
import DistrictModel from '../models/district.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(DistrictModel);
    }
}

export default Handler;
