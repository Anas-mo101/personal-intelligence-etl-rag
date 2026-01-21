import { GraphDriver } from "./GraphService";

interface GraphEntity {
    id: string;
    type: "Person" | "Organization" | "Location" | "Event";
    properties: Record<string, any>;
};

interface GraphRelationships {
    from: string;
    to: string;
    type: string;
    evidence: string;
};

export const StoreToGraphService = async (
    personId: string,
    entities: GraphEntity[],
    relationships: GraphRelationships[],
    embedding: number[],
    raw: string
) => {
    const session = GraphDriver.session();
    try {
        await session.run(`
            MERGE (c:Chunk {textHash: apoc.util.sha1([$text])})
            SET c.text = $text, c.embedding = $embedding
        `, {
            text: raw,
            embedding
        });

        // B. Upsert Entities
        for (const ent of entities) {
            await session.run(`
                MERGE (e:Entity {id: $id})
                SET e:${ent.type}, e += $props
                WITH e
                MATCH (c:Chunk {textHash: apoc.util.sha1([$text])})
                MERGE (c)-[:MENTIONS]->(e)
            `, { id: ent.id, props: ent.properties, text: raw });
        }

        // C. Upsert Relationships
        for (const rel of relationships) {
            await session.run(`
                MATCH (a {id: $from}), (b {id: $to})
                MERGE (a)-[r:${rel.type}]->(b)
                SET r.evidence = $evidence
            `, { from: rel.from, to: rel.to, evidence: rel.evidence });
        }
    } finally {
        await session.close();
    }
}