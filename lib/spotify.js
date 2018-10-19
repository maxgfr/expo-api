import { AsyncStorage } from 'react-native';
import { WebBrowser, AuthSession } from 'expo';
import { Buffer } from 'buffer';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;
const SPOTIFY_REDIRECT_URI= AuthSession.getRedirectUrl();
const SPOTIFY_BASE_URL="https://api.spotify.com/v1";
const SPOTIFY_OAUTH_URL="https://accounts.spotify.com/authorize";
const SPOTIFY_OAUTH_URL_SERVER="https://accounts.spotify.com/api/token";
const SPOTIFY_SCOPES="user-read-private user-read-email";

export default class Spotify {

    static myInstance = null;

    /**
    * @returns {Spotify}
    */
    static getInstance() {
        if (Spotify.myInstance == null) {
            Spotify.myInstance = new Spotify();
        }
        return this.myInstance;
    }

    constructor(){
        this.access_token = null;
    }

    getInfo() {
        console.log('-------------- INFORMATIONS --------------');
        console.log('SPOTIFY : ');
        console.log('   Client id :',SPOTIFY_CLIENT_ID);
        console.log('   Client id secret :',SPOTIFY_SECRET);
        console.log('   Redirect URI :',SPOTIFY_REDIRECT_URI);
        console.log('   Base URL :',SPOTIFY_BASE_URL);
        console.log('   Oauth 2 URL :',SPOTIFY_OAUTH_URL);
        console.log('   Scopes :',SPOTIFY_SCOPES);
        console.log('------------------------------------------');
        console.log('ACCESS TOKEN : ', this.access_token);
    }

    async getUserAccessToken(callback) {
        /* STEP 1 */
        this.getInfo();
        var myScopes = encodeURIComponent(SPOTIFY_SCOPES);
        var myRedirectUri = encodeURIComponent(SPOTIFY_REDIRECT_URI);
        const url = `${SPOTIFY_OAUTH_URL}?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${myScopes}&redirect_uri=${myRedirectUri}`;
        console.log('Open this URL : ',url);
        var result = await AuthSession.startAsync({ authUrl: `${url}` });
        console.log(result);
        const CODE = result.params.code;
        /* STEP 2 */
        const url_confirm = `${SPOTIFY_OAUTH_URL_SERVER}`;
        console.log('Server confirm here : ',url_confirm);
        var body = new FormData();
        /*body.append('client_id', SPOTIFY_CLIENT_ID);
        body.append('client_secret', SPOTIFY_SECRET);*/
        body.append('grant_type', "authorization_code");
        body.append('code', CODE);
        body.append('redirect_uri', SPOTIFY_REDIRECT_URI);
        const response_serv = await fetch(url_confirm, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            body: `grant_type=authorization_code&code=${CODE}&redirect_uri=${SPOTIFY_REDIRECT_URI}`,
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
        const response = await fetch(`${SPOTIFY_BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
              },
        });

        let result = await response.json();

        return result;
    }


}
