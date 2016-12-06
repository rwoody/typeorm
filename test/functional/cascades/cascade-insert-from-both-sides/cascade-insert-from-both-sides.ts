import "reflect-metadata";
import {setupTestingConnections, closeConnections, reloadDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src/connection/Connection";
import {Post} from "./entity/Post";
import {PostDetails} from "./entity/PostDetails";

describe.skip("cascades > should insert by cascades from both sides (#57)", () => {

    let connections: Connection[];
    before(async () => connections = await setupTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchemaOnConnection: true
    }));
    beforeEach(() => reloadDatabases(connections));
    after(() => closeConnections(connections));

    it("should insert by cascades from owner side", () => Promise.all(connections.map(async connection => {

        // first create details but don't save them because they will be saved by cascades
        const details = new PostDetails();
        details.keyword = "post-1";

        // then create and save a post with details
        const post1 = new Post();
        post1.title = "Hello Post #1";
        post1.details = details;
        await connection.entityManager.persist(post1);

        // now check
        const posts = await connection.entityManager.find(Post, {
            alias: "post",
            innerJoinAndSelect: {
                details: "post.details"
            }
        });

        posts.should.be.eql([{
            key: 1,
            title: "Hello Post #1",
            details: {
                keyword: "post-1"
            }
        }]);

    })));

});