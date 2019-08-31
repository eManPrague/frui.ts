const cleanupRegex = /\/+$/g;

// TODO is this class really useful? Can we remove it?
export class UrlBuilder {
  url: string;

  constructor(baseUrl: string, ...otherSegments: any[]) {
    this.url = baseUrl.replace(cleanupRegex, "");
    otherSegments.forEach(x => {
      this.url += "/" + x;
    });
  }

  all(path: string) {
    return this.appendUrl(path);
  }

  one(path: string, id?: any) {
    return id !== undefined ? this.appendUrl(path, id) : this.appendUrl(path);
  }

  protected appendUrl(...segments: any[]) {
    return new UrlBuilder(this.url, ...segments);
  }
}
