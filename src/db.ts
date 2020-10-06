import { MongoClient, Db } from 'mongodb';

type MongoInstance = MongoClient | null;

class MongoDB {
    DBNAME: string;
    MONGO_URL: string;
    client: MongoInstance = null;

    constructor(dbName: string, mongoUrl: string) {
        this.DBNAME = dbName;
        this.MONGO_URL = mongoUrl;
    }

    public async connect(): Promise<Db> {
        const client: MongoClient = await MongoClient.connect(this.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.client = client;
        return client.db(this.DBNAME);
    }

    public clear(): void {
        if (this.client) this.client.close();
    }

    public async drop(): Promise<void> {
        if (this.client) {
            await this.client.db(this.DBNAME).dropDatabase();
        }
    }
}

export default MongoDB;
