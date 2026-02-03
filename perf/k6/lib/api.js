import http from "k6/http";
import { check } from "k6";
import { config } from "./config.js";

const JSON_HEADERS = { "Content-Type": "application/json" };

function url(path) {
    const base = config.base_url.replace(/\/$/, "");
    return `${base}${path}`;
}


export function createVacancy(payload) {
    const res = http.post(url("/vacancy"), JSON.stringify(payload), {
        headers: JSON_HEADERS,
        timeout: config.timeout,
        tags: { endpoint: "createVacancy" },
    });

    check(res, {
        "POST /vacancy status is 201": (r) => r.status === 201,
    });

    return res;
}

export function getVacancyById(id) {
    const res = http.get(url(`/vacancy/${id}`), {
        timeout: config.timeout,
        tags: { endpoint: "getVacancyById" },
    });

    check(res, {
        "GET /vacancy/{id} status is 200": (r) => r.status === 200,
    });

    return res;
}

export function listVacancies() {
    const res = http.get(url("/vacancy"), {
        timeout: config.timeout,
        tags: { endpoint: "listVacancies" },
    });

    check(res, {
        "GET /vacancy status is 200": (r) => r.status === 200,
    });

    return res;
}

export function updateVacancy(id, payload) {
    const res = http.put(url(`/vacancy/${id}`), JSON.stringify(payload), {
        headers: JSON_HEADERS,
        timeout: config.timeout,
        tags: { endpoint: "updateVacancy" },
    });

    check(res, {
        "PUT /vacancy/{id} status is 200": (r) => r.status === 200,
    });

    return res;
}

export function deleteVacancy(id) {
    const res = http.del(url(`/vacancy/${id}`), null, {
        timeout: config.timeout,
        tags: { endpoint: "deleteVacancy" },
    });

    check(res, {
        "DELETE /vacancy/{id} status is 200": (r) => r.status === 200,
    });

    return res;
}
