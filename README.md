dbpedia-parse
=============

Simple demo for parsing and import DBPedia data into Neo4j graph database.

## Install modules

npm install

## Import DBPedia data into Neo4j database

Download neo4j and run it first. Then import .ttl files by running:

    node readTTl.js -f article_categories_zh.ttl
    
The javascript script readTTl.js will parse .ttl file and import into neo4j database. Although all relationships will be imported into the database. But netdb.js and web client only considers and extracts 'subject' relationship. It would be easy to add other relationships.

## Run demp web client to explore the imported DBPedia data

    node app.js  # localhost:8088
    


    
    
    
