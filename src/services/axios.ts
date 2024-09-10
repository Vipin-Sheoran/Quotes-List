import Axios from 'axios';

export const axios = Axios.create({
    baseURL: 'https://assignment.stage.crafto.app',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});