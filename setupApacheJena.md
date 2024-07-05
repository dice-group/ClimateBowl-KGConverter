# Installation and Setup of Apache Jena for Triple Store

This guide will help you set up Apache Jena and Jena-Fuseki to create and manage a triple store.

## Prerequisites

Ensure you have `wget` and `tar` installed on your system. If not, install them using your package manager.

## Step-by-Step Installation

### 1. Create a Directory for Fuseki

First, create a directory for Fuseki and navigate into it:

```bash
mkdir Fuseki && cd Fuseki
```

### 2. Download Apache Jena and Jena-Fuseki

Download the required binaries for Apache Jena and Jena-Fuseki:

```bash
# Download Apache Jena
wget https://archive.apache.org/dist/jena/binaries/apache-jena-4.7.0.tar.gz

# Download Jena-Fuseki
wget https://archive.apache.org/dist/jena/binaries/apache-jena-fuseki-4.7.0.tar.gz
```

### 3. Unzip the Files

Extract the downloaded files:

```bash
# Unzip Jena-Fuseki
tar -xzf apache-jena-fuseki-4.7.0.tar.gz

# Unzip Apache Jena
tar -xzf apache-jena-4.7.0.tar.gz
```

### 4. Create a Directory for the Triple Store

Create a directory to store the triple store data:

```bash
mkdir -p apache-jena-fuseki-4.7.0/databases/climatebowl/
```

### 5. Load the RDF Data

Load your RDF data into the triple store. Replace `Converter/generatedRDF/knowledgeGraph.ttl` with the path to your RDF file:

```bash
apache-jena-4.7.0/bin/tdb2.tdbloader --loader=parallel --loc apache-jena-fuseki-4.7.0/databases/climatebowl/ ../Converter/generatedRDF/knowledgeGraph.ttl
```

```
# Sample output
# 13:08:43 INFO  loader          :: Loader = LoaderParallel
# 13:08:43 INFO  loader          :: Start: KGs/climatebowl/climatebowl.owl
# 13:08:43 INFO  loader          :: Finished: Converter/generatedRDF/knowledgeGraph.ttl: 2,032 tuples in 0.63s (Avg: 3,215)
# 13:08:44 INFO  loader          :: Finish - index SPO
# 13:08:44 INFO  loader          :: Finish - index OSP
# 13:08:44 INFO  loader          :: Finish - index POS
# 13:08:44 INFO  loader          :: Time = 1.004 seconds : Triples = 2,032 : Rate = 2,024 /s
```

### 6. Launch the Triple Store

Start the Fuseki server to serve your triple store:

```bash
cd apache-jena-fuseki-4.7.0
java -Xmx4G -jar fuseki-server.jar --tdb2 --loc=databases/climatebowl /climatebowl
```

```bash
// for running in background
nohup java -Xmx4G -jar fuseki-server.jar --tdb2 --loc=databases/climatebowl /climatebowl > fuseki.log &
```

## Notes

- Make sure to adjust the paths and file names according to your setup.
- The `java -Xmx4G` option allocates 4 GB of memory to the Java process. Adjust this according to your available resources.

By following these steps, you will have set up a triple store using Apache Jena and Jena-Fuseki, and loaded your RDF data into it.
