import { MongoClient, Db, MongoError } from 'mongodb';

type ClientDb = Db | Record<string, unknown>;

class MongoDB {
    static URL: string = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    static DBNAME: string = process.env.MONGODB_DBNAME || '35mm';

    client: MongoClient;
    db: ClientDb;

    constructor() {
        this.client = new MongoClient(MongoDB.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        this.db = {};
    }

    public async init(): Promise<void | MongoError> {
        this.client.connect((error: MongoError, client: MongoClient) => {
            if (error) throw error;
            this.client = client;
        });
    }

    public getDb(name = MongoDB.DBNAME): Db {
        return this.client.db(name);
    }

    public close(): void {
        this.client.close();
    }
}

export default new MongoDB();
