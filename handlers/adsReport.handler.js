import BaseHandler from './base.handler.js';
import AdsReportModel from '../models/adsReport.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(AdsReportModel);
    }
}

export default Handler;
