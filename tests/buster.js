var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "browser", // or "node"
    sources: [
        "src/**/*.js"
    ],
    tests: [
        "tests/*-test.js"
    ]
}
