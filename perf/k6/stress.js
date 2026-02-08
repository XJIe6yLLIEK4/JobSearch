import {sleep} from "k6";
import {config} from "./lib/config.js";
import {makeVacancyPayload} from "./lib/data.js";
import {createVacancy, deleteVacancy, getVacancyById} from "./lib/api.js";

export const options = {
    tags: {testid: "stress"},
    scenarios: {
        spike: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                {duration: "30s", target: 20},
                {duration: "30s", target: 50},
                {duration: "30s", target: 100},
                {duration: "30s", target: 150},
                {duration: "30s", target: 0},
            ],
        },
    },
    thresholds: {
        http_req_failed: ["rate<0.03"],
        checks: ["rate>0.99"],
        "http_req_duration{endpoint:getVacancyById}": ["p(95)<600"],
    },
};

export function setup() {
    const ids = [];
    for (let i = 0; i < config.seed_count; i++) {
        const created = createVacancy(makeVacancyPayload()).json();
        ids.push(created.id);
    }
    return {ids};
}

export default function (data) {
    const ids = data.ids;
    const id = ids[Math.floor(Math.random() * ids.length)];
    getVacancyById(id);
    sleep(0.05);
}

export function teardown(data) {
    for (const id of data.ids) {
        deleteVacancy(id)
    }
}
