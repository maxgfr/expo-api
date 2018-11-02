import { AsyncStorage } from 'react-native';
import { WebBrowser, AuthSession } from 'expo';
import { Buffer } from 'buffer';

const MEDIUM_CLIENT_ID = process.env.MEDIUM_CLIENT_ID;
const MEDIUM_SECRET = process.env.MEDIUM_SECRET;
const MEDIUM_REDIRECT_URI= AuthSession.getRedirectUrl();
const MEDIUM_BASE_URL="https://api.medium.com/v1";
const MEDIUM_OAUTH_URL="https://medium.com/m/oauth/authorize";
const MEDIUM_OAUTH_URL_SERVER="https://api.medium.com/v1/tokens";
const MEDIUM_SCOPES="basicProfile,publishPost";

export default class Medium {

    static myInstance = null;

    /**
    * @returns {Medium}
    */
    static getInstance() {
        if (Medium.myInstance == null) {
            Medium.myInstance = new Medium();
        }
        return this.myInstance;
    }

    constructor(){
        this.access_token = null;
    }

    getInfo() {
        console.log('-------------- INFORMATIONS --------------');
        console.log('MEDIUM : ');
        console.log('   Client id :',MEDIUM_CLIENT_ID);
        console.log('   Client id secret :',MEDIUM_SECRET);
        console.log('   Redirect URI :',MEDIUM_REDIRECT_URI);
        console.log('   Base URL :',MEDIUM_BASE_URL);
        console.log('   Token Oauth URL :',MEDIUM_OAUTH_URL_SERVER);
        console.log('   Scopes :',MEDIUM_SCOPES);
        console.log('------------------------------------------');
        console.log('ACCESS TOKEN : ', this.access_token);
    }

    async getUserAccessToken(callback) {
        /* STEP 1 */
        this.getInfo();
        const url = `${MEDIUM_OAUTH_URL}?client_id=${MEDIUM_CLIENT_ID}&state=max&redirect_uri=${MEDIUM_REDIRECT_URI}&response_type=code&scope=${MEDIUM_SCOPES}`;
        console.log('Open this URL : ',url);
        var result = await AuthSession.startAsync({ authUrl: `${url}` });
        console.log(result);
        const CODE = result.params.code;
        /* STEP 2 */
        const url_confirm = `${MEDIUM_OAUTH_URL_SERVER}`;
        console.log('Server confirm here : ',url_confirm);
        const response_serv = await fetch(url_confirm, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            body: `grant_type=authorization_code&code=${CODE}&redirect_uri=${MEDIUM_REDIRECT_URI}&client_id=${MEDIUM_CLIENT_ID}&client_secret=${MEDIUM_SECRET}`
        });
        var result_serv = await response_serv.json();
        console.log(result_serv);
        if(result_serv.access_token) {
            this.access_token = result_serv.access_token;
            /* GET POST */
            var getInfo = await this.myInformation(this.access_token);
            //console.log(getInfo);
            callback(getInfo);
        }
        else {
            console.log("Tant pis on fera mieux la prochaine fois - Alpha Wann");
        }
    }

    async myInformation (token) {
        const response = await fetch(`${MEDIUM_BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
              },
        });

        let result = await response.json();

        return result;
    }


}
