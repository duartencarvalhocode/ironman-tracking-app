export default {
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    extensionsToTreatAsEsm: [".ts"],
    testEnvironment: "node",
};