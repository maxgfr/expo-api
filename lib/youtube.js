import { AsyncStorage } from 'react-native';

const YOUTUBE_KEY = process.env.YOUTUBE_KEY;
const GOOGLE_ANDROID_ID = process.env.GOOGLE_ANDROID_ID;
const GOOGLE_IOS_ID    =  process.env.GOOGLE_IOS_ID;
const YOUTUBE_BASE_URL="https://www.googleapis.com/youtube/v3";
const YOUTUBE_PART_CHANNELS = "snippet%2CcontentDetails%2Cstatistics";
const YOUTUBE_PART_PLAYLIST = "snippet%2CcontentDetails";
const YOUTUBE_MAX_RESULT = "1";

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
                this.access_token = result.accessToken;
                var myPlaylistItem = await this.myPlaylistItemsList(result.accessToken);
                console.log(myPlaylistItem);
                var uploadIDplaylist = myPlaylistItem.items[0].contentDetails.relatedPlaylists.uploads;
                console.log('ID Playlist Upload : ', uploadIDplaylist);
                var listVideoByPlaylist = await this.myVideoslList(result.accessToken, uploadIDplaylist);
                //console.log(listVideoByPlaylist);
                callback(listVideoByPlaylist);
            } else {
                console.log("Youtube login - ERROR");
                console.log(result);
            }
        } catch (e) {
            console.log("Error: ", e)
        }
    }

    async myVideoslList(token, id_playlist) {
        const response = await fetch(`${YOUTUBE_BASE_URL}/playlistItems/?playlistId=${id_playlist}&maxResults=${YOUTUBE_MAX_RESULT}&part=${YOUTUBE_PART_PLAYLIST}&key=${YOUTUBE_KEY}`, {
            method: 'GET'
        });

        let result = await response.json();

        /*

                String nextToken = "";

                       // Call the API one or more times to retrieve all items in the
                       // list. As long as the API response returns a nextPageToken,
                       // there are still more items to retrieve.
                       do {
                           playlistItemRequest.setPageToken(nextToken);
                           PlaylistItemListResponse playlistItemResult = playlistItemRequest.execute();

                           playlistItemList.addAll(playlistItemResult.getItems());

                           nextToken = playlistItemResult.getNextPageToken();
                       } while (nextToken != null);
*/

        return result;
    }

    async myPlaylistItemsList(token) {
        const response = await fetch(`${YOUTUBE_BASE_URL}/channels/?mine=true&part=${YOUTUBE_PART_CHANNELS}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        let result = await response.json();

        return result;
    }

}
