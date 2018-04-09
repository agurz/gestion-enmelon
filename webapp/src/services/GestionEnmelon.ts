import axios from 'axios';

const API_URL = 'https://gestion-enmelon.herokuapp.com/api';

export default class GestionEnmelon {

    static login(username: string, password: string) {
        let req = this._request({
            method: 'POST',
            url: `${API_URL}/login`,
            data: {
                username: username,
                password: password
            }
        });

        req.then(res => {
            localStorage.setItem('gestion-enmelon-token', res.data);
        });

        return req;
    }

    static logout() {
        localStorage.removeItem('gestion-enmelon-token');
        return Promise.resolve();
    }

    static careerSubjectsGraph(careerId: string) {
        return this._request({
            method: 'GET',
            url: `${API_URL}/careerSubjectsGraph?careerId=${careerId}`
        });
    }

    static tokenExists() {
        let token = localStorage.getItem('gestion-enmelon-token');
        return token != null && token.length > 0;
    }

    private static _request(options: any) {
        let token = localStorage.getItem('gestion-enmelon-token');

        if (token != null && token.length > 0) {
            options.headers = {
                'x-gestion-enmelon-token': token
            };
        }
        
        let req = axios(options);

        req.catch(err => {
            if (err.response.data === 'Invalid token') {
                this.logout();
            }
        });

        return req;
    }

}