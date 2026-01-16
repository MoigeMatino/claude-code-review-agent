import "dotenv/config";
import { Command } from "commander";
import { version } from "./index.js";

const program = new Command();

program
  .name("code-review-agent")
  .description("A reusable code review agent powered by Claude.")
  .version(version);

program
  .command("ping")
  .description("Quick sanity check that the CLI runs.")
  .action(() => {
    console.log("pong");
  });

program.parseAsync(process.argv);
