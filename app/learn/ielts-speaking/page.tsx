import { ScenarioPage, scenarioMetadata } from "@/components/site/ScenarioPage";
import { scenarios } from "@/lib/scenarios";

const scenario = scenarios[2];
export const metadata = scenarioMetadata(scenario);
export default function Page() {
  return <ScenarioPage scenario={scenario} />;
}
