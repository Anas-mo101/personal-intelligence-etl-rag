import loader from "./loaders"
import { McpOrchestratorService } from "./services/LlmServices/McpOrchestratorService";
import { showBanner } from "./utils/banner";

import { prompt }  from "inquirer"
import ora  from "ora"
import chalk  from "chalk"

import * as Extractor from "./workers/ExtractorWorker";
import * as Ingestor from "./workers/IngestWorker";

(async () => {
    if(process.env.WORKER === "true"){
        await loader.initWorker();

        if(process.env.EXTRACTOR_WORKER === "true"){
            Extractor.initExtractor();
        } else {
            Ingestor.initInjestor();
        }

        return;
    }


    await showBanner();

    while (true) {
        const {command} = await prompt([
            {
                name: 'command',
                type: 'input',
                message: chalk.green('Query >'),
            },
        ]);

        // Exit condition
        if (['exit', 'quit', 'q'].includes(command.toLowerCase())) {
            console.log(chalk.yellow("Goodbye!"));
            process.exit(0);
        }

        const spinner = ora('Thinking...').start();
        
        try {
            const response = await McpOrchestratorService(command);
            spinner.stop();
            
            console.log(chalk.white.bold("\nAssistant:"));
            console.log(chalk.cyan(response));
            console.log(chalk.gray("\n" + "─".repeat(40) + "\n"));
        } catch (error) {
            spinner.fail("Error during orchestration");
            console.error(error);
        }
    }
})();