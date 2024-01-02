import RESPONSE from '../constants/response.js';
import { geocode, reverseGeocode } from '../utils/map.js';
const controller = {};

controller.geocode = async (req, res) => {
    const { address } = req.query;
    const result = await geocode(address);
    res.status(200).json(RESPONSE.SUCCESS(result, 'get sucessfully'));
};

controller.reverseGeocode = async (req, res) => {
    const { lat, long } = req.query;
    const result = await reverseGeocode(lat, long);
    res.status(200).json(RESPONSE.SUCCESS(result, 'get sucessfully'));
};

export default controller;
