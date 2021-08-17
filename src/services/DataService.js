import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = process.env.REACT_APP_API_URL;

const DataService = {

    async getManufacturers(searchTerm) {
        const response = await axios.get(API_URL + '/analyst/search/manufacturers', { headers: authHeader(), params: {manufacturer: searchTerm}})
        return response.data;
    },

    async getModelsForManufacturer(manuId, searchTerm) {
        const response = await axios.get(API_URL + '/analyst/search/models', { headers: authHeader(), params:  {manufacturerId: manuId, model: searchTerm }})
        return response.data;
    },

    async getConfigurationsForModel(modelId){
        const response = await axios.get(API_URL + '/analyst/taxonomy/configurations', { headers: authHeader(), params: {modelId: modelId}})
        return response.data;
    },

    async getConfigurationById(configurationId){
        const response = await axios.get(API_URL + '/analyst/taxonomy/configurations', { headers: authHeader(), params: {configurationId: configurationId}})
        return response.data;
    },

    async getUsers() {
        const response = await axios.get(API_URL + '/users/get', { headers: authHeader() })
        return response.data;
    },

    async getRoles() {
        const response = await axios.get(API_URL + '/users/roles', { headers: authHeader() })
        return response.data.roles;
    },

    async createUser(data) {
        const response = await axios.post(API_URL + '/users/create', data, { headers: authHeader() });
        return response.data;
    },

    async updateUser(data) {
        const response = await axios.put(API_URL + '/users/update', data, { headers: authHeader() });
        return response.data;
    },

}

export default DataService;
