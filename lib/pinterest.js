import { AsyncStorage } from 'react-native';
import { WebBrowser, AuthSession } from 'expo';
import { Buffer } from 'buffer';

const PINTEREST_CLIENT_ID = process.env.PINTEREST_CLIENT_ID;
const PINTEREST_SECRET = process.env.PINTEREST_SECRET;
const PINTEREST_REDIRECT_URI= AuthSession.getRedirectUrl();
const PINTEREST_BASE_URL="https://api.pinterest.com/v1";
const PINTEREST_OAUTH_URL="https://api.pinterest.com/oauth";
const PINTEREST_OAUTH_TOKEN="https://api.pinterest.com/v1/oauth/token";
const PINTEREST_SCOPES="read_public,write_public";

export default class Pinterest {

    static myInstance = null;

    /**
    * @returns {Pinterest}
    */
    static getInstance() {
        if (Pinterest.myInstance == null) {
            Pinterest.myInstance = new Pinterest();
        }
        return this.myInstance;
    }

    constructor(){
        this.access_token = null;
    }

    getInfo() {
        console.log('-------------- INFORMATIONS --------------');
        console.log('PINTEREST : ');
        console.log('   Client id :',PINTEREST_CLIENT_ID);
        console.log('   Client id secret :',PINTEREST_SECRET);
        console.log('   Redirect URI :',PINTEREST_REDIRECT_URI);
        console.log('   Base URL :',PINTEREST_BASE_URL);
        console.log('   Token Oauth URL :',PINTEREST_OAUTH_TOKEN);
        console.log('   Scopes :',PINTEREST_SCOPES);
        console.log('------------------------------------------');
        console.log('ACCESS TOKEN : ', this.access_token);
    }

    async getUserAccessToken(callback) {
        /* STEP 1 */
        this.getInfo();
        var myScopes = encodeURIComponent(PINTEREST_SCOPES);
        var myRedirectUri = encodeURIComponent(PINTEREST_REDIRECT_URI);
        const url = `${PINTEREST_OAUTH_URL}?response_type=code&client_id=${PINTEREST_CLIENT_ID}&scope=${myScopes}&redirect_uri=${myRedirectUri}&state=maxime`;
        console.log('Open this URL : ',url);
        var result = await AuthSession.startAsync({ authUrl: `${url}` });
        console.log(result);
        const CODE = result.params.code;
        /* STEP 2 */
        const url_confirm = `${PINTEREST_OAUTH_TOKEN}?grant_type=authorization_code&client_id=${PINTEREST_CLIENT_ID}&client_secret=${PINTEREST_SECRET}&code=${CODE}`;
        console.log('Server confirm here : ',url_confirm);
        const response_serv = await fetch(url_confirm, {
            method: 'POST'
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
        const response = await fetch(`${PINTEREST_BASE_URL}/me?access_token=${token}`, {
            method: 'GET'
        });

        let result = await response.json();

        return result;
    }


}
