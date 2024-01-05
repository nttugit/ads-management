import BaseHandler from './base.handler.js';
import LocationReportModel from '../models/locationReport.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(LocationReportModel);
    }
}

export default Handler;
