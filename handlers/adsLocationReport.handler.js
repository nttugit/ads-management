import BaseHandler from './base.handler.js';
import AdsLocationReportModel from '../models/adsLocationReport.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(AdsLocationReportModel);
    }
}

export default Handler;
