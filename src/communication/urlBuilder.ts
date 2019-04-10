const cleanupRegex = /\/+$/g;

export class UrlBuilder {
  public url: string;

  constructor(baseUrl: string, ...otherSegments: any[]) {
    this.url = baseUrl.replace(cleanupRegex, "");
    otherSegments.forEach(x => {
      this.url += "/" + x;
    });
  }

  public all(path: string) {
    return this.appendUrl(path);
  }

  public one(path: string, id?: any) {
    return id !== undefined ? this.appendUrl(path, id) : this.appendUrl(path);
  }

  protected appendUrl(...segments: any[]) {
    return new UrlBuilder(this.url, ...segments);
  }
}
