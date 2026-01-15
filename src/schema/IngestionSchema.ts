import { z } from "zod";
import { SOURCE_TYPES } from "../types";

export const IngestionSchema = z.object({
  entities: z.array(
    z.object({
      id: z.string().describe("A unique, normalized identifier for the entity (e.g., 'john-doe', 'london-uk'). Use kebab-case."),
      type: z.enum(["Person", "Organization", "Location", "Event"]).describe("The primary category of the entity."),
      properties: z.record(z.string(), z.any()).describe("Key-value pairs for entity details. For 'Person', include 'title' or 'role'. For 'Event', include 'date' and 'duration'.")
    })
  ).describe("A list of all distinct real-world objects, people, or places identified in the text."),

  relationships: z.array(
    z.object({
      from: z.string().describe("The 'id' of the source entity (the subject)."),
      to: z.string().describe("The 'id' of the target entity (the object)."),
      type: z.string().describe("The verb or connection type in UPPER_SNAKE_CASE (e.g., 'WORKS_AT', 'PARTICIPATED_IN', 'REPORTS_TO')."),
      evidence: z.string().describe("The verbatim snippet from the source text that justifies this relationship. This is crucial for auditability.")
    })
  ).describe("The directed links between entities, defining how they interact or relate to one another."),

  facts: z.array(
    z.object({
      name: z.string().describe("The specific attribute being captured (e.g., 'Date of Birth', 'Citizenship', 'Security Clearance')."),
      value: z.string().describe("The actual value found in the text for this attribute."),
    })
  ).describe("Discrete, high-value metadata about the primary targeted individual."),

  channels: z.array(
    z.object({
      sourceType: z.enum(SOURCE_TYPES).describe("The medium through which the data was received."),
      value: z.string().describe("The specific identifier for the channel (e.g., an email address, phone number, or social media handle)."),
      isBlob: z.boolean().describe("Set to true if this channel refers to an unstructured file or binary object rather than a text-based handle."),
    })
  ).describe("External communication paths or data origins associated with the entities."),
});