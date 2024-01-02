import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

//https://rapidapi.com/trueway/api/trueway-geocoding
const geocodeWithTrueWayAPI = async (address) => {
    const options = {
        method: 'GET',
        url: 'https://trueway-geocoding.p.rapidapi.com/Geocode',
        params: {
            address: address,
            language: 'en',
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);

        const coors = { lat: null, long: null };
        if (response?.data?.results.length > 0) {
            coors['lat'] = response.data.results[0].location.lat;
            coors['long'] = response.data.results[0].location.lng;
        }

        return coors;
    } catch (error) {
        console.error(error);
    }
};

const reverseGeocodeWithTrueWayAPI = async (lat, long) => {
    const options = {
        method: 'GET',
        url: 'https://trueway-geocoding.p.rapidapi.com/ReverseGeocode',
        params: {
            // location: '10.767565477790804, 106.69480837318082',
            location: lat + ',' + long,
            language: 'en',
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);
        const listOfAddresses = response?.data?.results;
        return listOfAddresses.length > 0 ? listOfAddresses[0].address : null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// https://rapidapi.com/GeocodeSupport/api/forward-reverse-geocoding
const reverseGeocodingWithForwardReverse = async (lat, long) => {
    const options = {
        method: 'GET',
        url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse',
        params: {
            lat,
            lon: long,
            // 'accept-language': 'en',
            polygon_threshold: '0.0',
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);
        return response?.data ? response.data?.display_name : null;
    } catch (error) {
        console.error(error);
    }
};

// https://rapidapi.com/alexanderxbx/api/maps-data/
const geocodeWithMapData = async (address) => {
    const options = {
        method: 'GET',
        url: 'https://maps-data.p.rapidapi.com/geocoding.php',
        params: {
            query: address,
            lang: 'en',
            country: 'fr',
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'maps-data.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);
        const coors = response?.data
            ? { lat: response.data.data.lat, long: response.data.data.lng }
            : { lat: null, long: null };
        return coors;
    } catch (error) {
        console.error(error);
    }
};

const geocode = async (address) => {
    let data = { lat: null, long: null };
    try {
        data = await geocodeWithTrueWayAPI(address);
    } catch (error) {
        data = await geocodeWithMapData(address);
    }
    return data;
};

const reverseGeocode = async (lat, long) => {
    let data = null;
    try {
        data = await reverseGeocodeWithTrueWayAPI(lat, long);
    } catch (error) {
        console.log('hahahaha');
        data = await reverseGeocodingWithForwardReverse(lat, long);
    }
    return data;
};

// Test
// (async () => {
//     const address =
//         '227 Đ. Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Vietnam';
//     const coors = [10.76261643975305, 106.68233692948039];
//     const result = await reverseGeocode(...coors);
//     console.log(result);
// })();

export { geocode, reverseGeocode };
