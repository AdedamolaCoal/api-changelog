import merge from "lodash.merge";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
const stage = process.env.STAGE || "local";
let envConfig;

if (stage === "production") {
	envConfig = require("./prod").default;
} else if (stage === "test") {
	envConfig = require("./test").default;
} else {
	envConfig = require("./local").default;
}

// this merges all our config files with the environment
export default merge(
	{
		stage,
		env: process.env.NODE_ENV,
		port: 3000,
		secrets: {
			jwt: process.env.JWT_SECRET,
			dbUrl: process.env.DATABASE_URL,
		},
	},
	envConfig
);
