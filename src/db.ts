import { MongoClient, Db } from 'mongodb';

class MongoDB {
    private DBNAME: string = process.env.MONGODB_DBNAME || '35mm';
    private MONGO_URL: string =
        process.env.MONGODB_URL || 'mongodb://localhost:27017';
    public db: Db | null = null;
    public options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    async connect(): Promise<Db> {
        const client: MongoClient = await MongoClient.connect(
            this.MONGO_URL,
            this.options
        );

        return client.db(this.DBNAME);
    }
}

export default new MongoDB();
