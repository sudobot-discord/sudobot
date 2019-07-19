import { Task } from 'klasa';
import * as fetch from 'node-fetch';

export default class extends Task {
  async run() {
    this._getToken();
  }

  async init() {
    this._getToken();
  }

  async _getToken(this: any) {
    try {
      this.client._spotifyToken = await fetch(
        'https://accounts.spotify.com/api/token',
        {
          method: 'POST',
          body: 'grant_type=client_credentials',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
        .then(response => response.json())
        .then(response => response.access_token);
    } catch (error) {
      this.client.emit('wtf', error);
    }
  }
}
