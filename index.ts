import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

let tasks: Task[] = [];

const AUTH_USERNAME = 'admin';
const AUTH_PASSWORD = 'password';

const authenticate = (req: Request, res: Response, next: Function) => {
    const { username, password } = req.headers;
    if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
        next();
    } else {
        res.status(401).json({ message: 'Non autorisé' });
    }
};

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.post('/todos', authenticate, (req: Request, res: Response) => {
    const { title } = req.body;
    const newTask: Task = {
        id: tasks.length + 1,
        title,
        completed: false,
    };
    tasks.push(newTask); 
    res.status(201).json(newTask); 
});

app.get('/todos', authenticate, (req: Request, res: Response) => {
    res.json(tasks);
});

app.get('/todos/:id', authenticate, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ message: 'Tâche non trouvée' });
    }
});

app.put('/todos/:id', authenticate, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.title = title !== undefined ? title : task.title;
        task.completed = completed !== undefined ? completed : task.completed;
        res.json(task);
    } else {
        res.status(404).json({ message: 'Tâche non trouvée' });
    }
});

app.delete('/todos/:id', authenticate, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== id);
    res.status(204).send();
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
    });
}

export { app };