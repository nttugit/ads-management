import BaseHandler from './base.handler.js';
import StaffModel from '../models/staff.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(StaffModel);
    }
}

export default Handler;
