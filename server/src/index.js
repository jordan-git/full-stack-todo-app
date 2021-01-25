import dotenv from 'dotenv';

dotenv.config();

import App from './app.js';

const app = new App();

const port = Number(process.env.SERVER_PORT) || 4000;

app.express.listen(port, () => console.log(`Listening on port ${port}`));

export default app;
