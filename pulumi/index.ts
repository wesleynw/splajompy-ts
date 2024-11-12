import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

const stack = pulumi.getStack();

const project = new digitalocean.Project("splajompy", {
  name: "splajompy",
  purpose: "Web Application",
  environment: "Development",
});

const postgres = new digitalocean.DatabaseCluster(
  `splajompy-${stack}-cluster`,
  {
    engine: "pg",
    version: "16",
    region: digitalocean.Region.NYC3,
    size: digitalocean.DatabaseSlug.DB_1VPCU1GB,
    tags: ["splajompy"],
    nodeCount: 1,
    projectId: project.id,
  }
);

const appuser = new digitalocean.DatabaseUser(`splajompy-${stack}-user`, {
  clusterId: postgres.id,
  name: "appuser",
});

const db = new digitalocean.DatabaseDb(`splajompy-${stack}-db`, {
  clusterId: postgres.id,
  name: `splajompy-${stack}`,
});

const pool = new digitalocean.DatabaseConnectionPool(
  `splajompy-${stack}-pool`,
  {
    clusterId: postgres.id,
    name: "pool-01",
    mode: "transaction",
    size: 20,
    dbName: `splajompy-${stack}-db`,
    user: "appuser",
  }
);

postgres.uri.apply((uri) => {
  console.log(`Database URI: ${uri}`);
});
pool.uri.apply((uri) => {
  console.log(`Connection Pool URI: ${uri}`);
});
