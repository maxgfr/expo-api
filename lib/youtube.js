import { AsyncStorage } from 'react-native';
import { WebBrowser, Expo } from 'expo';

const GOOGLE_ANDROID_ID = process.env.GOOGLE_ANDROID_ID;
const GOOGLE_IOS_ID    =  process.env.GOOGLE_IOS_ID;
const YOUTUBE_BASE_URL="https://api.twitch.tv/kraken/";

export default class Youtube {

    static myInstance = null;

    /**
    * @returns {Youtube}
    */
    static getInstance() {
        if (Youtube.myInstance == null) {
            Youtube.myInstance = new Youtube();
        }
        return this.myInstance;
    }

    constructor(){
        this.access_token = null;
    }

    getInfo() {
        console.log('ACCESS TOKEN : ', this.access_token);
    }

    async loginWithGoogle(callback) {
        console.log('Login with Youtube');
        try {
            const result = await Expo.Google.logInAsync({
                androidClientId: GOOGLE_ANDROID_ID,
                iosClientId: GOOGLE_IOS_ID,
                scopes: ["https://www.googleapis.com/auth/youtube"]
            })
            if (result.type === "success") {
                console.log('Youtube login - SUCCESS');
                console.log(result);
                // Build Firebase credential with the Youtube access token.
                const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
                console.log(credential);
                callback(credential);
            } else {
                console.log("Youtube login - ERROR");
                console.log(result);
            }
        } catch (e) {
            console.log("Error: ", e)
        }
    }

}
