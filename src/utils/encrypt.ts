import forge from 'node-forge';

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwAzW5QPHM6tU7i2z/u57\nHoXKD73jjq1IPU/nfOcFeVHK0ErZ6fwIHlyEa9gFPXcIqouHDcxJpUGG1xiiotbS\nOocVwNvJitfMrfxj826c+rrOCZ6mr+MpG4G8R6N389twjQOAcLfbuIgxbvAfHCog\njqpTVXGZ9zTuQUbGg0hfzli+OXW+prDoVW/gzJtsmuwFIQ4n1vBs3k8MyLRqqc6x\nze5mn8SMg5H8lXkkC44YQvAVLHmWv49z2nWKdhfCrWmJUiFURFyuk+7Xvsz1yDML\nDTGKPa4sygnXbJjXeiFvPSsST3AYYWWVghfZpn11Mce9AIrecr1TvP8zleIx3/wH\nvRssbqqPydqW/KG9TSIqmuuuEWVWV0MWYWLiQsMuQrnwQh9OW49c5j1rBTtrrINJ\n3qgeFJIAXP9OV6kcQ32w9c4LojXbWhK5hTQLYWR3VvOL6VdxMA9e47pPhFzvrB7f\nycryT4wwfxkqIVwUhY1o1bbhrtwryrELt34EfxXxeHJsjibt5IE5RU58FxWJIAkA\ninsEYtb9UXRvJIizfwqB4qjKJY9DbQFbqMQOZiAyfRyjwPmgONCY/Vh4tgby8tFX\nC96RmlSeLx/fwuDNraJBNVWvEWpVEjBxmo7LVHaNwgay5/AblkXX5nxpftsZQK3e\nVLiJ2N4SNSoby11CoFBuwA0CAwEAAQ==\n-----END PUBLIC KEY-----`;

const publicKey = forge.pki.publicKeyFromPem(PUBLIC_KEY);

export const encryptStr = (str: string) => {
  return window.btoa(publicKey.encrypt(str));
};

export const encryptObj = (obj: { [key: string]: string }) => {
  const result = {};
  Object.entries(obj).forEach(([x, y]) => {
    result[x] = encryptStr(y);
  });
  return result;
};
