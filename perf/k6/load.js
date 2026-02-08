import { sleep } from "k6";
import exec from "k6/execution";
import { config } from "./lib/config.js";
import { makeVacancyPayload } from "./lib/data.js";
import { createVacancy, getVacancyById, listVacancies, deleteVacancy } from "./lib/api.js";

export const options = {
    tags: {testid: "load"},
    scenarios: {
        read_heavy: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                { duration: "30s", target: 10 },
                { duration: "2m", target: 30 },
                { duration: "30s", target: 0 },
            ],
            gracefulRampDown: "10s",
        },
    },

    thresholds: {
        http_req_failed: ["rate<0.01"],
        checks: ["rate>0.99"],

        "http_req_duration{endpoint:getVacancyById}": ["p(95)<250"],
        "http_req_duration{endpoint:listVacancies}": ["p(95)<600"],
    },
};

export function setup() {
    const ids = [];
    for (let i = 0; i < config.seed_count; i++) {
        const created = createVacancy(makeVacancyPayload()).json();
        ids.push(created.id);
    }
    return { ids };
}

export default function (data) {
    const ids = data.ids;
    const id = ids[Math.floor(Math.random() * ids.length)];

    const p = Math.random();

    if (p < 0.8) {
        getVacancyById(id);
    } else {
        listVacancies();
    }

    sleep(0.2);

    if (exec.vu.idInTest === 1 && exec.scenario.iterationInInstance % 100 === 0) {
        console.log("iteration", exec.scenario.iterationInInstance);
    }
}

export function teardown(data) {
    for (const id of data.ids) {
        deleteVacancy(id)
    }
}
