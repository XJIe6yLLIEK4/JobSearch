import http from "k6/http";
import { sleep, group, check, fail } from "k6";
import { config } from "./lib/config.js";
import { makeVacancyPayload } from "./lib/data.js";
import { createVacancy, getVacancyById, listVacancies, updateVacancy, deleteVacancy } from "./lib/api.js";

export const options = {
    vus: 1,
    duration: "30s",
    thresholds: {
        http_req_failed: ["rate<0.01"],
        checks: ["rate>0.99"],
        "http_req_duration{endpoint:getVacancyById}": ["p(95)<300"],
        "http_req_duration{endpoint:createVacancy}": ["p(95)<600"],
    },
};

export function setup() {
    const healthUrl = `${config.base_url}/actuator/health`;

    const res = http.get(healthUrl, {
        timeout: config.timeout,
        tags: { endpoint: "health" },
    });

    const ok = check(res, {
        "health status is 200": (r) => r.status === 200,
        "health body status is UP": (r) => {
            try {
                return r.json("status") === "UP";
            } catch (e) {
                return false;
            }
        },
    });

    if (!ok) {
        fail(
            `Health-check failed: GET ${healthUrl} -> status=${res.status}, body=${res.body}`
        );
    }

    return { base_url: config.base_url };
}

export default function () {
    group("CRUD happy-path", () => {
        const payload = makeVacancyPayload();

        const created = createVacancy(payload).json();
        const id = created.id;

        getVacancyById(id);

        const upd = Object.assign({}, payload, {
            description: payload.description + " updated",
        });

        updateVacancy(id, upd);

        listVacancies();

        deleteVacancy(id);
    });

    sleep(1);
}
