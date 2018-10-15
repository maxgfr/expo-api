import { Platform, Linking, AsyncStorage } from 'react-native';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET    =  process.env.TWITCH_SECRET_ID;
const TWITCH_REDIRECT_URI="app://localhost/reactapi"
const TWITCH_BASE_URL="https://api.twitch.tv/helix/"
const TWITCH_OAUTH_URL="https://id.twitch.tv/oauth2/authorize"
const TWITCH_SCOPES = 'user_subscriptions';

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
        console.log('   Oauth 2 URL:',TWITCH_OAUTH_URL);
        console.log('   Scopes :',TWITCH_SCOPES);
        console.log('------------------------------------------');
    }


    getUserAccessToken() {

        return new Promise(function (resolve, reject) {
            const url = `${TWITCH_OAUTH_URL}?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_REDIRECT_URI}&response_type=code&scope=${TWITCH_SCOPES}&force_verify=true`;
            console.log('Open this URL : ',url);

            Linking.openURL(url).catch(err => alert('An error occurred', err));

            Linking.addEventListener('url', async (event) => {
                console.log('sisisi');
              const access_token = event.url.toString().match( /access_token=([^&]+)/ );
              let valid = false;
              // Check for issue with Kindle Fire Tablet

            });

         /*
            Linking.addEventListener('url', async (event) => {
                let valid = false;
                const access_token = event.url.toString().match( /code=([^&]+)/ );
                console.log('Access token : ',access_token);

                // Check for issue with Kindle Fire Tablet
                if (Array.isArray(access_token) && access_token.length === 2) {
                    this.access_token = access_token[1];
                    AsyncStorage.setItem('TWITCH:ACCESS_TOKEN:key',  this.access_token);
                    valid = await this.tokenValid();
                } else if(access_token) {
                    this.access_token = access_token;
                    AsyncStorage.setItem('TWITCH:ACCESS_TOKEN:key',  this.access_token);
                    valid = await this.tokenValid();
                } else {
                    valid = false;
                }
                    console.log('Valid token : ', valid);
                    //return valid;
                });
            */

        });
    }


    async tokenValid(token) {
      try {
        if (!token) {
          token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
        }
        const response = await fetch(`${TWITCH_BASE_URL}?oauth_token=${token}`, {
          method: 'GET',
          headers: {
            "client-id": CLIENT_ID,
            "accept": TWITCH_ACCEPT
          }
        });

        result = await response.json();

        if (result.token.user_id) {
          AsyncStorage.setItem('TWITCH:USER_INFO:key', JSON.stringify(result.token));
        }

      } catch (error) {
        console.log('Request Error: access_token', token, error)
        result = false;
      }
      return result.token.valid;
    }

    static async getTopClipsForUser({trending, cursor="", count=25}) {
      let result = {};
      let token = null;
      try {
        token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
        const response = await fetch(`${TWITCH_BASE_URL}/clips/followed?limit=${count}&trending=${trending}`, {
          method: 'GET',
          headers: {
            "Client-ID": CLIENT_ID,
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

    static async v5fetchUsersInfo(user_id) {
        const response = await fetch(`${TWITCH_BASE_URL}/channels/${user_id}`, {
          method: 'GET',
          headers: {
            "client-id": CLIENT_ID,
            "accept": TWITCH_ACCEPT
          }
        });

        let result = await response.json();

        return result;
    }

    static async v5getChannelFollowers(channel_id, cursor='') {
      const response = await fetch(`${TWITCH_BASE_URL}/channels/${channel_id}/follows?limit=100&cursor=${cursor}`, {
          method: 'GET',
          headers: {
            "client-id": CLIENT_ID,
            "accept": TWITCH_ACCEPT
          }
      });

      let result = await response.json();

      return(result);
    }

    static async v5getUsersFollow(offset=0) {
      let userInfo = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
      let { user_id } = JSON.parse(userInfo);
      const response = await fetch(`${TWITCH_BASE_URL}/users/${user_id}/follows/channels?limit=100&offset=${offset}`, {
          method: 'GET',
          headers: {
            "client-id": CLIENT_ID,
            "accept": TWITCH_ACCEPT
          }
      });

      let result = await response.json();
      console.log(result);
      return(result);
    }

    static async v5getTopClips({channel_name, period='month', cursor=''}) {
      let userInfo = await AsyncStorage.getItem('TWITCH:USER_INFO:key');
      let { user_id } = JSON.parse(userInfo);
      const response = await fetch(`${TWITCH_BASE_URL}/clips/top?channel=${channel_name}&limit=25&period=${period}&cursor=${cursor}`, {
          method: 'GET',
          headers: {
            "client-id": CLIENT_ID,
            "accept": TWITCH_ACCEPT
          }
      });

      let result = await response.json();
      if (result.status === 400) {
        alert('Sorry Something Went Wrong :(');
      }
      return(result);
    }

    static async v5getChannelVideos({channel_id, sort='time ', offset=0}) {
      const response = await fetch(`${TWITCH_BASE_URL}/channels/${channel_id}/videos?limit=25&offset=${offset}`, {
          method: 'GET',
          headers: {
            "client-id": CLIENT_ID,
            "accept": TWITCH_ACCEPT
          }
      });

      let result = await response.json();

      return(result);
    }



    static async fetchLiveUsers(user_ids) {
      const params = user_ids.map((user_id) => `user_id=${user_id}` );

      const response = await fetch(`https://api.twitch.tv/helix/streams?${params.join('&')}&type%20=live&first=100`, {
        method: 'GET',
        headers: {
          "client-id": CLIENT_ID,
        }
      });

      let result = await response.json();

      return(result.data);
    }

    static async fetchVodcastUsers(user_ids) {
      const params = user_ids.map((user_id) => `user_id=${user_id}` );

      const response = await fetch(`https://api.twitch.tv/helix/streams?${params.join('&')}&type=vodcast&first=100`, {
        method: 'GET',
        headers: {
          "client-id": CLIENT_ID,
        }
      });

      let result = await response.json();

      return(result.data);
    }

    static async getUsersFollow(user_id) {
        const response = await fetch(`https://api.twitch.tv/helix/users/follows?from_id=${user_id}&first=100`, {
            method: 'GET',
            headers: {
              "client-id": CLIENT_ID,
            }
        });

        let result = await response.json();

        const followed = result.data.map((item) => {
            return item.to_id;
        });

        return(followed);
    }

    static async currentUserInfo() {
        let token = await AsyncStorage.getItem('TWITCH:ACCESS_TOKEN:key');
        const response = await fetch(`https://api.twitch.tv/helix/users`, {
          method: 'GET',
          headers: {
            "client-id":CLIENT_ID,
            "Authorization": `Bearer ${token}`,
          }
        });

        let result = await response.json();

        return result.data;
    }
}
