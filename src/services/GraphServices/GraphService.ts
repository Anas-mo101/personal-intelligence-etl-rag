import neo4j from 'neo4j-driver';

const GraphDriver = neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic("neo4j", "password")
);

export {
    GraphDriver
};