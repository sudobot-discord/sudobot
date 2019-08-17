import { KlasaGuild } from 'klasa';

// TODO: provider research
// TODO: soundcloud api http://api.soundcloud.com/

export interface MusicMetadata {
  name: string;
  source: 'youtube' | 'soundcloud';
  url: string;
}

export class GuildQueue extends Array<MusicMetadata> {
  private _pos: number = 0;
  private _loop: boolean = false;
  private autoplay: boolean = false;

  get current(): MusicMetadata {
    return this[this._pos];
  }

  public reset(): void {
    this.splice(0, this.length);
    this._pos = 0;
  }

  public add(url: string, provider?: string) {}

  private hasPrev() {}

  public prev() {}

  private hasNext() {}

  public next() {}

  public loop() {
    this._loop = !this._loop;
  }

  public shuffle() {}
}
