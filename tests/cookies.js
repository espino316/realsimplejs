describe("RS.Cookies", () => {
    beforeEach(() => {
      document.cookie = ""; // Clear all cookies before each test
    });
  
    describe("set()", () => {
      test("should set a cookie with the given name and value", () => {
        RS.Cookies.set("mycookie", "myvalue");
        expect(document.cookie).toContain("mycookie=myvalue");
      });
  
      test("should set a cookie that expires in one hour by default", () => {
        RS.Cookies.set("mycookie", "myvalue");
        const cookie = document.cookie.match(/mycookie=([^;]+)/);
        const expires = cookie[1].split(";")[1];
        const expirationDate = new Date(expires);
        const expectedExpirationDate = new Date(Date.now() + 60 * 60 * 1000);
        expect(expirationDate.getTime()).toBeGreaterThan(expectedExpirationDate.getTime() - 1000); // Account for some wiggle room due to timing issues
        expect(expirationDate.getTime()).toBeLessThanOrEqual(expectedExpirationDate.getTime());
      });
  
      test("should set a cookie that expires after the specified number of days", () => {
        RS.Cookies.set("mycookie", "myvalue", 3);
        const cookie = document.cookie.match(/mycookie=([^;]+)/);
        const expires = cookie[1].split(";")[1];
        const expirationDate = new Date(expires);
        const expectedExpirationDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        expect(expirationDate.getTime()).toBeGreaterThan(expectedExpirationDate.getTime() - 1000); // Account for some wiggle room due to timing issues
        expect(expirationDate.getTime()).toBeLessThanOrEqual(expectedExpirationDate.getTime());
      });
    });
  
    describe("get()", () => {
      test("should return null if the cookie with the given name does not exist", () => {
        expect(RS.Cookies.get("mycookie")).toBeNull();
      });
  
      test("should return the value of the cookie with the given name", () => {
        RS.Cookies.set("mycookie", "myvalue");
        expect(RS.Cookies.get("mycookie")).toEqual({ name: "mycookie", value: "myvalue" });
      });
  
      test("should return an array of all cookies if no name is specified", () => {
        RS.Cookies.set("mycookie1", "myvalue1");
        RS.Cookies.set("mycookie2", "myvalue2");
        const cookies = RS.Cookies.get();
        expect(cookies).toContainEqual({ name: "mycookie1", value: "myvalue1" });
        expect(cookies).toContainEqual({ name: "mycookie2", value: "myvalue2" });
      });
    });
  
    describe("delete()", () => {
      test("should do nothing if the cookie with the given name does not exist", () => {
        RS.Cookies.delete("mycookie");
        expect(document.cookie).toBe("");
      });
  
      test("should delete the cookie with the given name", () => {
        RS.Cookies.set("mycookie", "myvalue");
        RS.Cookies.delete("mycookie");
        expect(document.cookie).toBe("");
      });
  
      test("should delete all cookies if no name is specified", () => {
        RS.Cookies.set("mycookie1", "myvalue1");
        RS.Cookies.set("mycookie2", "myvalue2");
        RS.Cookies.delete();
        expect(document.cookie).toBe("");
      });
    });
  });
  