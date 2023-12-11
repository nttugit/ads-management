import BaseHandler from './base.handler.js';
import ImageModel from '../models/image.model.js';

class Handler extends BaseHandler {
    constructor() {
        super(ImageModel);
    }
}

export default Handler;
