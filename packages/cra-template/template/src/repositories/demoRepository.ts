export default class DemoRepository {
  fetchData(success = true, timeout = 500) {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve("Hello world from repository!");
        } else {
          reject({ message: "Error" });
        }
      }, timeout);
    });
  }
}
