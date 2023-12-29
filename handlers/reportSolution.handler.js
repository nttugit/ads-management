import BaseHandler from './base.handler.js';
import ReportSolutionModel from '../models/reportSolution.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(ReportSolutionModel);
    }
}

export default Handler;
