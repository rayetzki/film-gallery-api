import express, { Request, Response } from 'express';
import morgan from 'morgan';

const app = express();
const PORT = 3000;

app.use(morgan(':method :url :response-time'));
app.use('/:id', (req: Request, res: Response) => {
    res.send(req.params.id);
});

app.listen(PORT, () => `Listening on port ${PORT}`);
