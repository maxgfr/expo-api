import { AsyncStorage } from 'react-native';
import { WebBrowser, AuthSession } from 'expo';

const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_SECRET = process.env.INSTAGRAM_SECRET;
const INSTAGRAM_REDIRECT_URI= AuthSession.getRedirectUrl();
const INSTAGRAM_BASE_URL="https://api.instagram.com/v1";
const INSTAGRAM_OAUTH_URL="https://api.instagram.com/oauth/authorize";
const INSTAGRAM_OAUTH_URL_SERVER="https://api.instagram.com/oauth/access_token";
const INSTAGRAM_SCOPES="public_content";

export default class Instagram {

    static myInstance = null;

    /**
    * @returns {Instagram}
    */
    static getInstance() {
        if (Instagram.myInstance == null) {
            Instagram.myInstance = new Instagram();
        }
        return this.myInstance;
    }

    constructor(){
        this.access_token = null;
    }

    getInfo() {
        console.log('-------------- INFORMATIONS --------------');
        console.log('INSTAGRAM : ');
        console.log('   Client id :',INSTAGRAM_CLIENT_ID);
        console.log('   Client id secret :',INSTAGRAM_SECRET);
        console.log('   Redirect URI :',INSTAGRAM_REDIRECT_URI);
        console.log('   Base URL :',INSTAGRAM_BASE_URL);
        console.log('   Oauth 2 URL :',INSTAGRAM_OAUTH_URL);
        console.log('   Scopes :',INSTAGRAM_SCOPES);
        console.log('------------------------------------------');
        console.log('ACCESS TOKEN : ', this.access_token);
    }

    async getUserAccessToken(callback) {
        /* STEP 1 */
        this.getInfo();
        const url = `${INSTAGRAM_OAUTH_URL}?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URI}&response_type=code&scope=${INSTAGRAM_SCOPES}`;
        console.log('Open this URL : ',url);
        var result = await AuthSession.startAsync({ authUrl: `${url}` });
        console.log(result);
        const CODE = result.params.code;
        /* STEP 2 */
        const url_confirm = `${INSTAGRAM_OAUTH_URL_SERVER}`;
        console.log('Server confirm here : ',url_confirm);
        var body = new FormData();
        body.append('client_secret', INSTAGRAM_SECRET);
        body.append('client_id', INSTAGRAM_CLIENT_ID);
        body.append('grant_type', "authorization_code");
        body.append('redirect_uri', INSTAGRAM_REDIRECT_URI);
        body.append('code', CODE);
        const response_serv = await fetch(url_confirm, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: body
        });
        var result_serv = await response_serv.json();
        console.log(result_serv);
        if(result_serv.access_token) {
            this.access_token = result_serv.access_token;
            /* GET POST */
            var getPost = await this.myLastPost(this.access_token);
            //console.log(getPost);
            callback(getPost);
        }
        else {
            console.log("Tant pis on fera mieux la prochaine fois - Alpha Wann");
        }
    }

    async myLastPost (token) {
        const response = await fetch(`${INSTAGRAM_BASE_URL}/users/self/media/recent?access_token=${token}`, {
            method: 'GET'
        });

        let result = await response.json();

        return result;
    }


}
