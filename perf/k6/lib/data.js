import { randomIntBetween, randomString } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export function makeVacancyPayload() {
    const company = `Company-${randomString(8)}`;
    const vacancy = `Vacancy-${randomString(10)}`;
    const description = `Desc-${randomString(randomIntBetween(30, 200))}`;

    return {
        companyName: company,
        vacancyName: vacancy,
        description: description,
    }
}