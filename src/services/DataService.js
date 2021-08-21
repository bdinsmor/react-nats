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

    async getConfigurationsForModelId(modelId){
        const response = await axios.get(API_URL + '/analyst/taxonomy/configurations', { headers: authHeader(), params: {modelId: modelId}})
        return response.data;
    },

    async getAliasesForModelId(modelId){
        const response = await axios.get(API_URL + '/analyst/model-aliases', { headers: authHeader(), params: {modelId: modelId}})
        return response.data;
    },

    async getAliasesForManufacturerId(manufacturerId){
        const response = await axios.get(API_URL + '/analyst/manufacturer-aliases', { headers: authHeader(), params: {manufacturerId: manufacturerId}})
        return response.data;
    },

    async getClassifications(){
        const response = await axios.get(API_URL + '/analyst/taxonomy/classifications', { headers: authHeader()})
        return response.data;
    },

    async getCategories(classificationId){
        const response = await axios.get(API_URL + '/analyst/taxonomy/categories', { headers: authHeader(), params: {"classificationId": classificationId}})
        return response.data;
    },

    async getSubtypes(classificationId, categoryId){
        const response = await axios.get(API_URL + '/analyst/taxonomy/subtypes', { headers: authHeader(), params: {"classificationId": classificationId, "categoryId": categoryId}})
        return response.data;
    },

    async getSizeClasses(classificationId, categoryId, subtypeId){
        const response = await axios.get(API_URL + '/analyst/taxonomy/sizes', { headers: authHeader(), params: {"classificationId": classificationId, "categoryId": categoryId, "subtypeId": subtypeId}})
        return response.data;
    },

    async getManufacturersForSizeClassId(sizeClassId){
        const response = await axios.get(API_URL + '/analyst/taxonomy/manufacturers', { headers: authHeader(), params: {"sizeClassId": sizeClassId}})
        return response.data;
    },

    async getTaxonomyModels(sizeClassId, manufacturerId){
        const response = await axios.get(API_URL + '/analyst/taxonomy/models', { headers: authHeader(), params: {manufacturerId: manufacturerId, sizeClassId: sizeClassId}})
        return response.data;
    },

    async getConfigurationById(configurationId){
        const response = await axios.get(API_URL + '/analyst/taxonomy/configurations', { headers: authHeader(), params: {configurationId: configurationId}})
        return response.data;
    },

    async getVINsForManufacturer(manufacturerId) {
        const response = await axios.get(API_URL + '/analyst/manufacturer-vins', { headers: authHeader(), params: {manufacturerId: manufacturerId}})
        return response.data;
    },

    async getOptions(sizeClassId, modelYear) {
        const response = await axios.get(API_URL + '/analyst/options', { headers: authHeader(), params: {modelYear: modelYear, sizeClassId: sizeClassId}})
        return response.data;
    },

    async getSpecs(configurationId) {
        const response = await axios.get(API_URL + '/analyst/specs', { headers: authHeader(), params: {configurationId: configurationId}})
        return response.data;
    },

    async getAttachments(subtypeId){
        const response = await axios.get(API_URL + '/analyst/attachments', { headers: authHeader(), params: {subtypeId: subtypeId}})
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
