import BaseHandler from './base.handler.js';
import ReportTypeModel from '../models/reportType.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(ReportTypeModel);
    }
}

export default Handler;
