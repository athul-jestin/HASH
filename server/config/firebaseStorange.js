// firebase storage in nodejs server using firebase-admin
import { getStorage } from "firebase-admin/storage";
import { initializeApp, cert } from "firebase-admin/app";
import dotenv from "dotenv";

dotenv.config();

initializeApp({
  credential: cert({
    type: "service_account",
    project_id: "hash-c9458",
    private_key_id: "eaab3e317c33ee0eada2a7eb83c560737887177a",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4X6Z9xO9AIpA/\nFMhgjiaS8xtJ0l4izUwtEoPb/8vUEKKxgwvvWBv0f+fMLFy5eG21r+b9wboEHhSM\nwlRKovlrmfr6tUMAdiSg+kNnOtIBQJnlw0R2OVti2+yBjSjoBDrGjwW4b8Pg96Vz\n+8sg6df3lSmnG6jnPNhXH9npPwCc/YxQnVZZmvBiV1ISIxXWFaDGD/Tl39zXU2wE\n4jEO2ymNqX0H9rBM99sBMsvi81m/+zkOu0nu+eT/0Iqs2VWoJCldVKFjqzC90IR8\n/inq4jQCulHCNPGB5H8/WIqbedLZBoM/iIyCHm6TXlIk9Ru7yLkpXXGmW8E6V9L4\nMvc5Udb7AgMBAAECggEAQ/hbOBWAgDvdwqumPVZaaSU/g6UOuDTIJvui6dlw6sKh\nP+DIZxmr4KTArxgRrPx1MZxiA13Gdlsih0vi6EsRuXXgPUnSpBpp4YCxlZ5tKjIH\nKlmk5RK7GoRqOc5w7KwWgPncCYUGiOqzL8F9PqqGyErQur7rMyhOtzvSSXdFAhqj\nij9AteLkfOdHYBc8jIJotsTgw4sd+sJ+EqCmiIeDsZpLSPus2PvMjBkHImYfCKqy\nbDdO8v08aYQZhAfZXWXN2ORYkdXgat8ROAtrhRZ3ghzZJ14057KSekHR1lYJ3e04\nq2WwSGHKasEtJH06zmLCzWJXteOnEZlZbRmj6SDG5QKBgQD2WugeVP/LnIEqkq0c\ng/iONZmDhe+DWRRB03vRN7vgPZpLuNS8E2SpyjnlIr+G4g8Ifjc85mtLLhmPiD/+\nStDYkViE9mPsvwaa30QTvurkSYXKmwaTEdZ5tTG5XxM3bFH0d39Br+BO/oGgLcON\nD4s2xoO0ibnBaEh0kOKiGgwKJwKBgQC/l4jYEkzODFwCFz1CJKRg7HhrK/e6tKgQ\nqT3NI7PxdNOxa4pYfyPjZRmurbXFed0sq+Xy+aWS2DBNfKVyta/5LZH1FSzAkUq0\nIfH5N/dIroP6T7C8n/bFx/xRCR5QqTYzo+qsfMP4w2Xb5uzRthVDsyY6lb6M1mUD\nsCdqq9L1DQKBgQC7C5SXixPYJVDQ4SK8ttqeJsYS3TtYL+c4f3jQBhAIlt0yxvgG\ngHb6j0db2QEwSSz+1s3b2Fr4bt0LZHip+2YMOHbMJUMDOpqqNgA7OcagY85IYWIh\ngfak29UQGMa/WufyxFQDrKSTdZs34edKj9W0Vg8joTo/RY1Vq7fXOg2QGwKBgQC4\n1r48DzOwGjZuAfOkq2s24wyuAKYop3/5Sv4HumkxCs/tPF4lUMvT50bmwko6sX5T\nSag4SOeXiyDWsOmBiI20bWWCOCKLyeBzdshW8sqMgWlshZNx9zYBzBW+LHjlwso6\n+eo+7MO4bPMJO3nAPNW5Ec5Q+QT0JSchbsIoZIrKxQKBgCElbKCPPOfJg3/SZhsA\nyFPYsosK/bflcDnm7U8bZLs03yD0jtPLE9/zb66I5Zq/hQlOwARYxdkRsCKlKzRN\nZZf8SlUeWeEiGC172PFj19W7PakqsgD9OpEIi6P2850nBOX7BJRixIw4LPPTixkI\nzROQ8V9xdqcKwpubJXJZKf1G\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-2qved@hash-c9458.iam.gserviceaccount.com",
    client_id: "116833963062437019479",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2qved%40hash-c9458.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  }),
  storageBucket: "hash-c9458.appspot.com",
});

const storage = getStorage().bucket();

export default storage;
