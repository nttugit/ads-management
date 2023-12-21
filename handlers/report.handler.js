import BaseHandler from './base.handler.js';
import ReportModel from '../models/report.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(ReportModel);
    }
}

export default Handler;
