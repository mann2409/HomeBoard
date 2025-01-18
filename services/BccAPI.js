import axios from 'axios';
import moment from 'moment';

const BASE_URL = "https://brisbane.waste-info.com.au/api/v1";

// Get list of suburbs
export async function getSuburbList() {
    const response = await axios.get(`${BASE_URL}/localities.json`);
    return response.data;
}

// Get list of streets for a given suburb ID
export async function getStreetList(suburbId) {
    const response = await axios.get(`${BASE_URL}/streets.json?locality=${suburbId}`);
    return response.data;
}

// Get list of properties for a given street ID
export async function getPropertiesList(streetId) {
    const response = await axios.get(`${BASE_URL}/properties.json?street=${streetId}`);
    return response.data;
}

// Get collection schedule for a given property ID
export async function getCollectionSchedule(propertyId) {
    const startDate = moment().startOf('month').toISOString();
    const endDate = moment().endOf('month').toISOString();

    const response = await axios.get(`${BASE_URL}/properties/${propertyId}.json`, {
        params: {
            start: startDate,
            end: endDate
        }
    });
    return response.data;
}

// Example usage
(async () => {
    try {
        // Step 1: Get suburb list
        const suburbs = await getSuburbList();
        console.log("Suburbs:", suburbs);

        // Select a suburb ID (e.g., 259 for example)
        const suburbId = 259;

        // Step 2: Get street list for the suburb
        const streets = await getStreetList(suburbId);
        console.log("Streets:", streets);

        // Select a street ID (e.g., 20609 for example)
        const streetId = 20609;

        // Step 3: Get properties for the street
        const properties = await getPropertiesList(streetId);
        console.log("Properties:", properties);

        // Select a property ID (e.g., 821125 for example)
        const propertyId = 821125;

        // Step 4: Get collection schedule for the property
        const schedule = await getCollectionSchedule(propertyId);
        console.log("Collection Schedule:", schedule);

    } catch (error) {
        console.error("Error:", error);
    }
})();
