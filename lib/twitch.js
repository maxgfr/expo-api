import { AsyncStorage } from 'react-native';
import { WebBrowser, AuthSession } from 'expo';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET    =  process.env.TWITCH_SECRET_ID;
const TWITCH_REDIRECT_URI= AuthSession.getRedirectUrl();
const TWITCH_BASE_URL="https://api.twitch.tv/kraken/";
const TWITCH_OAUTH_URL="https://id.twitch.tv/oauth2/authorize";
const TWITCH_OAUTH_URL_SERVER="https://id.twitch.tv/oauth2/token";
const TWITCH_SCOPES = "collections_edit%20user_follows_edit%20user_subscriptions%20user_read%20user_subscriptions";
const TWITCH_ACCEPT = "application/vnd.twitchtv.v5+json";

export default class Twitch {

    static myInstance = null;

    /**
    * @returns {Twitch}
    */
    static getInstance() {
        if (Twitch.myInstance == null) {
            Twitch.myInstance = new Twitch();
        }
        return this.myInstance;
    }

    constructor(){
        this.access_token = null;
    }

    getInfo() {
        console.log('-------------- INFORMATIONS --------------');
        console.log('TWITCH : ');
        console.log('   Client id :',TWITCH_CLIENT_ID);
        console.log('   Client id secret :',TWITCH_SECRET);
        console.log('   Redirect URI :',TWITCH_REDIRECT_URI);
        console.log('   Base URL :',TWITCH_BASE_URL);
        console.log('   Oauth 2 URL :',TWITCH_OAUTH_URL);
        console.log('   Scopes :',TWITCH_SCOPES);
        console.log('------------------------------------------');
        console.log('ACCESS TOKEN : ', this.access_token);
    }

    async getUserAccessToken() {

        /* STEP 1 */
        const url = `${TWITCH_OAUTH_URL}?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_REDIRECT_URI}&response_type=code&scope=${TWITCH_SCOPES}&force_verify=true`;
        console.log('Open this URL : ',url);
        var result = await AuthSession.startAsync({ authUrl: `${url}` });
        console.log(result);
        const CODE = result.params.code;
        /* STEP 2 */
        const url_confirm = `${TWITCH_OAUTH_URL_SERVER}?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_SECRET}&redirect_uri=${TWITCH_REDIRECT_URI}&code=${CODE}&grant_type=authorization_code`;
        console.log('Server confirm here : ',url_confirm);
        const response_serv = await fetch(url_confirm, {
            method: 'POST',
            headers: {
                "accept": TWITCH_ACCEPT,
            }
        });
        var result_serv = await response_serv.json();
        console.log(result_serv);
        const token = result_serv.access_token;
        /* STEP 3 */
        var valid = await this.tokenValid(token);
        if(valid) {
            this.access_token = token;
        }
        else {
            console.log("Tant pis on fera mieux la prochaine fois - Alpha Wann");
        }

    }

    async tokenValid(token) {
        try {
            if (!token) {
                token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
            }
            const response = await fetch(`${TWITCH_BASE_URL}?oauth_token=${token}`, {
                method: 'GET',
                headers: {
                    "client-id": TWITCH_CLIENT_ID,
                    "accept": TWITCH_ACCEPT
                }
            });

            result = await response.json();

            console.log(result);

            if (result.token.user_id) {
                AsyncStorage.setItem('TWITCH:USER_INFO:key', JSON.stringify(result.token));
            }

        } catch (error) {
            console.log('Request Error: access_token', token, error)
            result = false;
        }
        return result.token.valid;
    }

    async getTopClipsForUser({trending, cursor="", count=25}) {
        let result = {};
        let token = null;
        try {
            token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
            const response = await fetch(`${TWITCH_BASE_URL}/clips/followed?limit=${count}&trending=${trending}`, {
                method: 'GET',
                headers: {
                    "Client-ID": TWITCH_CLIENT_ID,
                    "Authorization": `OAuth ${token}`,
                    "Accept": TWITCH_ACCEPT,
                    'Content-Type': 'application/json',
                }
            });

            result = await response.json();

            if(response.status === 401) throw result.message;
        } catch (error) {
            console.log('Request Error: access_token', token, error)
            result = false;
        }
        return result;
    }

    async v5fetchUsersInfo(user_id) {
        const response = await fetch(`${TWITCH_BASE_URL}/channels/${user_id}`, {
            method: 'GET',
            headers: {
                "client-id": TWITCH_CLIENT_ID,
                "accept": TWITCH_ACCEPT
            }
        });

        let result = await response.json();

        return result;
    }

    async v5getChannelFollowers(channel_id, cursor='') {
        const response = await fetch(`${TWITCH_BASE_URL}/channels/${channel_id}/follows?limit=100&cursor=${cursor}`, {
            method: 'GET',
            headers: {
                "client-id": TWITCH_CLIENT_ID,
                "accept": TWITCH_ACCEPT
            }
        });

        let result = await response.json();

        return(result);
    }

    async v5getUsersFollow(offset=0) {
        let userInfo = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
        let { user_id } = JSON.parse(userInfo);
        const response = await fetch(`${TWITCH_BASE_URL}/users/${user_id}/follows/channels?limit=100&offset=${offset}`, {
            method: 'GET',
            headers: {
                "client-id": TWITCH_CLIENT_ID,
                "accept": TWITCH_ACCEPT
            }
        });

        let result = await response.json();
        console.log(result);
        return(result);
    }

    async v5getTopClips({channel_name, period='month', cursor=''}) {
        let userInfo = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
        let { user_id } = JSON.parse(userInfo);
        const response = await fetch(`${TWITCH_BASE_URL}/clips/top?channel=${channel_name}&limit=25&period=${period}&cursor=${cursor}`, {
            method: 'GET',
            headers: {
                "client-id": TWITCH_CLIENT_ID,
                "accept": TWITCH_ACCEPT
            }
        });

        let result = await response.json();
        if (result.status === 400) {
            alert('Sorry Something Went Wrong :(');
        }
        return(result);
    }

    async v5getChannelVideos({channel_id, sort='time ', offset=0}) {
        const response = await fetch(`${TWITCH_BASE_URL}/channels/${channel_id}/videos?limit=25&offset=${offset}`, {
            method: 'GET',
            headers: {
                "client-id": TWITCH_CLIENT_ID,
                "accept": TWITCH_ACCEPT
            }
        });

        let result = await response.json();

        return(result);
    }

    async fetchLiveUsers(user_ids) {
        const params = user_ids.map((user_id) => `user_id=${user_id}` );

        const response = await fetch(`https://api.twitch.tv/helix/streams?${params.join('&')}&type%20=live&first=100`, {
            method: 'GET',
            headers: {
                "client-id": TWITCH_CLIENT_ID,
            }
        });

        let result = await response.json();

        return(result.data);
    }

    async fetchVodcastUsers(user_ids) {
        const params = user_ids.map((user_id) => `user_id=${user_id}` );

        const response = await fetch(`https://api.twitch.tv/helix/streams?${params.join('&')}&type=vodcast&first=100`, {
            method: 'GET',
            headers: {
                "client-id": TWITCH_CLIENT_ID,
            }
        });

        let result = await response.json();

        return(result.data);
    }

    async getUsersFollow(user_id) {
        const response = await fetch(`https://api.twitch.tv/helix/users/follows?from_id=${user_id}&first=100`, {
            method: 'GET',
            headers: {
                "client-id": TWITCH_CLIENT_ID,
            }
        });

        let result = await response.json();

        const followed = result.data.map((item) => {
            return item.to_id;
        });

        return(followed);
    }

    async currentUserInfo() {
        let token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
        const response = await fetch(`${TWITCH_OAUTH_URL}/user`, {
            method: 'GET',
            headers: {
                "accept": TWITCH_ACCEPT,
                "authorization": `OAuth ${token}`,
                "client-id": TWITCH_CLIENT_ID,
            }
        });

        let result = await response.json();

        return result.data;
    }
}
