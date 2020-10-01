import { MongoClient, Db, MongoError } from 'mongodb';

class MongoDB {
    static DBNAME: string = process.env.MONGODB_DBNAME || '';
    static MONGO_URL: string = process.env.MONGODB_URL || '';

    client: MongoClient;

    constructor() {
        this.client = new MongoClient(MongoDB.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    public async init(): Promise<void | MongoError> {
        try {
            await this.client.connect();
        } catch (error) {
            return error;
        }
    }

    public getDb(name = MongoDB.DBNAME): Db {
        return this.client.db(name);
    }

    public close(): void {
        this.client.close();
    }
}

export default new MongoDB();
